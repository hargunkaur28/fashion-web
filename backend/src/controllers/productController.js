const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @GET /api/v1/products
const getProducts = asyncHandler(async (req, res) => {
  const { gender, subGender, type, brand, minPrice, maxPrice, size, color, search, sort, page = 1, limit = 20, featured, trending } = req.query;

  const query = { isActive: true };

  if (gender && gender !== 'all') query.gender = gender;
  if (subGender) query.subGender = subGender;
  if (type) query.type = { $in: type.split(',') };
  if (brand) query.brand = { $in: brand.split(',') };
  if (featured === 'true') query.isFeatured = true;
  if (trending === 'true') query.isTrending = true;
  if (search) {
    const searchTerms = search.split(' ').filter(term => term.trim());
    if (searchTerms.length > 0) {
      query.$and = searchTerms.map(term => ({
        $or: [
          { name: new RegExp(term, 'i') },
          { description: new RegExp(term, 'i') },
          { brand: new RegExp(term, 'i') },
          { type: new RegExp(term, 'i') },
          { tags: new RegExp(term, 'i') }
        ]
      }));
    }
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (size) query['variants.size'] = { $in: size.split(',') };
  if (color) query['variants.color'] = { $in: color.split(',') };

  const sortOptions = {
    newest: { createdAt: -1 },
    priceLow: { price: 1 },
    priceHigh: { price: -1 },
    rating: { rating: -1 },
    popular: { numReviews: -1 },
  };
  const sortBy = sortOptions[sort] || { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);
  const products = await Product.find(query).sort(sortBy).skip(skip).limit(Number(limit));

  res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), products });
});

// @GET /api/v1/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, product });
});

// @GET /api/v1/products/slug/:slug
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('reviews.user', 'name avatar');
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, product });
});

// @POST /api/v1/products (admin)
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// @PUT /api/v1/products/:id (admin)
const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  Object.assign(product, req.body);
  product.slug = null; // reset slug to regenerate
  const updated = await product.save();
  res.json({ success: true, product: updated });
});

// @DELETE /api/v1/products/:id (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, message: 'Product deleted' });
});

// @POST /api/v1/products/:id/reviews
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment, photos } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  // User can only review if they have a delivered order containing this product
  const hasBought = await Order.findOne({
    user: req.user._id,
    status: 'delivered',
    'items.product': product._id
  });

  if (!hasBought) {
    res.status(403);
    throw new Error('You can only review products after they have been delivered to you.');
  }

  const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) { res.status(400); throw new Error('You have already reviewed this product.'); }

  product.reviews.push({ 
    user: req.user._id, 
    name: req.user.name, 
    rating: Number(rating), 
    comment,
    photos: photos || []
  });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ success: true, message: 'Review added successfully' });
});

// @PUT /api/v1/products/:id/wishlist
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = req.user;
  const productId = req.params.id;
  const idx = user.wishlist.indexOf(productId);
  if (idx === -1) {
    user.wishlist.push(productId);
  } else {
    user.wishlist.splice(idx, 1);
  }
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
});

// @GET /api/v1/products/wishlist/details
const getWishlistProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ _id: { $in: req.user.wishlist } });
  res.json({ success: true, products });
});

module.exports = { 
  getProducts, 
  getProductById, 
  getProductBySlug, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  addReview, 
  toggleWishlist,
  getWishlistProducts
};
