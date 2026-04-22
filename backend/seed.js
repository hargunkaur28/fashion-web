require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ DB Connected');
};

const categories = [
  { name: "Men's Shirts", gender: 'men', description: 'Casual and formal shirts for men' },
  { name: "Men's T-Shirts", gender: 'men', description: 'Trendy tees for men' },
  { name: "Men's Jeans", gender: 'men', description: 'Denim collection for men' },
  { name: "Men's Lowers", gender: 'men', description: 'Track pants and lowers for men' },
  { name: "Women's Tops", gender: 'women', description: 'Stylish tops for women' },
  { name: "Women's Dresses", gender: 'women', description: 'Elegant dresses for women' },
  { name: "Women's Kurtis", gender: 'women', description: 'Ethnic kurtis for women' },
  { name: "Women's Jeans", gender: 'women', description: 'Trendy jeans for women' },
  { name: "Boys' T-Shirts", gender: 'kids', subGender: 'boys', description: 'Cool tees for boys' },
  { name: "Girls' Dresses", gender: 'kids', subGender: 'girls', description: 'Cute dresses for girls' },
];

const products = [
  // MEN
  {
    name: 'Classic Oxford Button-Down Shirt',
    description: 'A timeless oxford cotton shirt perfect for office and casual wear. Breathable fabric with a sharp collar.',
    brand: 'UrbanThread',
    gender: 'men', type: 'shirt',
    images: ['https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600'],
    originalPrice: 1499, discount: 20,
    variants: [
      { size: 'S', color: 'White', colorHex: '#ffffff', stock: 15 },
      { size: 'M', color: 'White', colorHex: '#ffffff', stock: 20 },
      { size: 'L', color: 'White', colorHex: '#ffffff', stock: 18 },
      { size: 'M', color: 'Blue', colorHex: '#3b82f6', stock: 12 },
      { size: 'L', color: 'Blue', colorHex: '#3b82f6', stock: 10 },
    ],
    tags: ['formal', 'office', 'cotton'], isFeatured: true,
  },
  {
    name: 'Slim Fit Graphic Tee',
    description: 'Super soft 100% cotton graphic tee with minimalist print. Perfect for everyday casual wear.',
    brand: 'TrendHub',
    gender: 'men', type: 'tshirt',
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600'],
    originalPrice: 699, discount: 30,
    variants: [
      { size: 'S', color: 'Black', colorHex: '#000000', stock: 25 },
      { size: 'M', color: 'Black', colorHex: '#000000', stock: 30 },
      { size: 'L', color: 'Black', colorHex: '#000000', stock: 22 },
      { size: 'XL', color: 'Black', colorHex: '#000000', stock: 18 },
      { size: 'M', color: 'Navy', colorHex: '#1e3a5f', stock: 14 },
    ],
    tags: ['casual', 'graphic', 'cotton'], isTrending: true,
  },
  {
    name: 'Slim Fit Stretch Jeans',
    description: 'Modern slim-fit jeans with 2% elastane for maximum comfort. Mid-rise waist with clean finish.',
    brand: 'DenimCo',
    gender: 'men', type: 'jeans',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600'],
    originalPrice: 1999, discount: 25,
    variants: [
      { size: '28', color: 'Dark Blue', colorHex: '#1a237e', stock: 10 },
      { size: '30', color: 'Dark Blue', colorHex: '#1a237e', stock: 15 },
      { size: '32', color: 'Dark Blue', colorHex: '#1a237e', stock: 20 },
      { size: '34', color: 'Dark Blue', colorHex: '#1a237e', stock: 12 },
      { size: '32', color: 'Light Blue', colorHex: '#90caf9', stock: 8 },
    ],
    tags: ['jeans', 'denim', 'slim-fit'], isFeatured: true,
  },
  {
    name: 'Jogger Track Pants',
    description: 'Ultra-comfortable jogger pants with elastic waistband and tapered fit. Great for gym and lounging.',
    brand: 'ActiveWear',
    gender: 'men', type: 'lowers',
    images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600'],
    originalPrice: 999, discount: 15,
    variants: [
      { size: 'S', color: 'Grey', colorHex: '#9e9e9e', stock: 20 },
      { size: 'M', color: 'Grey', colorHex: '#9e9e9e', stock: 25 },
      { size: 'L', color: 'Grey', colorHex: '#9e9e9e', stock: 18 },
      { size: 'M', color: 'Black', colorHex: '#000000', stock: 22 },
    ],
    tags: ['jogger', 'gym', 'casual'], isTrending: true,
  },
  {
    name: 'Linen Casual Shirt',
    description: 'Breathable linen shirt for summer. Perfect for beach days and casual outings.',
    brand: 'SummerVibes',
    gender: 'men', type: 'shirt',
    images: ['https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600'],
    originalPrice: 1299, discount: 10,
    variants: [
      { size: 'S', color: 'Beige', colorHex: '#d4a373', stock: 12 },
      { size: 'M', color: 'Beige', colorHex: '#d4a373', stock: 15 },
      { size: 'L', color: 'White', colorHex: '#ffffff', stock: 10 },
    ],
    tags: ['linen', 'summer', 'casual'], isFeatured: false,
  },
  // WOMEN
  {
    name: 'Floral Wrap Dress',
    description: 'Elegant floral wrap dress with a flattering A-line silhouette. Perfect for brunches and occasions.',
    brand: 'BloomStyle',
    gender: 'women', type: 'dress',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600'],
    originalPrice: 2499, discount: 35,
    variants: [
      { size: 'XS', color: 'Pink Floral', colorHex: '#f48fb1', stock: 8 },
      { size: 'S', color: 'Pink Floral', colorHex: '#f48fb1', stock: 12 },
      { size: 'M', color: 'Pink Floral', colorHex: '#f48fb1', stock: 10 },
    ],
    tags: ['dress', 'floral', 'elegant'], isFeatured: true, isTrending: true,
  },
  {
    name: 'Solid Crop Top',
    description: 'Minimalist cotton crop top with a relaxed fit. Pairs perfectly with high-waist jeans or skirts.',
    brand: 'TrendHub',
    gender: 'women', type: 'top',
    images: ['https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600'],
    originalPrice: 599, discount: 20,
    variants: [
      { size: 'XS', color: 'White', colorHex: '#ffffff', stock: 18 },
      { size: 'S', color: 'White', colorHex: '#ffffff', stock: 22 },
      { size: 'M', color: 'White', colorHex: '#ffffff', stock: 15 },
      { size: 'S', color: 'Black', colorHex: '#000000', stock: 20 },
    ],
    tags: ['crop-top', 'casual', 'minimal'], isTrending: true,
  },
  {
    name: 'Anarkali Kurta Set',
    description: 'Beautiful Anarkali style kurta with intricate embroidery. Comes with matching dupatta.',
    brand: 'EthnicHouse',
    gender: 'women', type: 'kurta',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'],
    originalPrice: 3499, discount: 20,
    variants: [
      { size: 'S', color: 'Maroon', colorHex: '#800000', stock: 6 },
      { size: 'M', color: 'Maroon', colorHex: '#800000', stock: 8 },
      { size: 'L', color: 'Maroon', colorHex: '#800000', stock: 5 },
      { size: 'M', color: 'Royal Blue', colorHex: '#1565c0', stock: 7 },
    ],
    tags: ['ethnic', 'kurta', 'occasion'], isFeatured: true,
  },
  {
    name: "Women's High-Rise Skinny Jeans",
    description: 'High-waist skinny jeans with stretch fabric. Flattering fit for all body types.',
    brand: 'DenimCo',
    gender: 'women', type: 'jeans',
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600'],
    originalPrice: 1799, discount: 30,
    variants: [
      { size: '26', color: 'Dark Indigo', colorHex: '#283593', stock: 12 },
      { size: '28', color: 'Dark Indigo', colorHex: '#283593', stock: 15 },
      { size: '30', color: 'Dark Indigo', colorHex: '#283593', stock: 10 },
    ],
    tags: ['jeans', 'skinny', 'high-rise'], isTrending: true,
  },
  // KIDS
  {
    name: "Boys' Dino Print T-Shirt",
    description: 'Fun and colourful dinosaur print tee for boys. Soft breathable cotton for all-day comfort.',
    brand: 'KiddoWear',
    gender: 'kids', subGender: 'boys', type: 'tshirt',
    images: ['https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600'],
    originalPrice: 499, discount: 15,
    variants: [
      { size: '2-3Y', color: 'Green', colorHex: '#43a047', stock: 20 },
      { size: '4-5Y', color: 'Green', colorHex: '#43a047', stock: 18 },
      { size: '6-7Y', color: 'Green', colorHex: '#43a047', stock: 15 },
    ],
    tags: ['kids', 'boys', 'fun'], isFeatured: true,
  },
  {
    name: "Girls' Princess Frock",
    description: 'Adorable layered tulle frock with satin ribbon. Perfect for birthday parties and celebrations.',
    brand: 'TinyStars',
    gender: 'kids', subGender: 'girls', type: 'dress',
    images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600'],
    originalPrice: 1299, discount: 25,
    variants: [
      { size: '3-4Y', color: 'Pink', colorHex: '#f48fb1', stock: 10 },
      { size: '5-6Y', color: 'Pink', colorHex: '#f48fb1', stock: 12 },
      { size: '7-8Y', color: 'Pink', colorHex: '#f48fb1', stock: 8 },
    ],
    tags: ['kids', 'girls', 'party'], isFeatured: true, isTrending: true,
  },
  {
    name: 'Men Oversized Hoodie',
    description: 'Premium GSM fleece oversized hoodie with kangaroo pocket. The ultimate cozy layer.',
    brand: 'UrbanThread',
    gender: 'men', type: 'hoodie',
    images: ['https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600'],
    originalPrice: 1899, discount: 20,
    variants: [
      { size: 'S', color: 'Olive', colorHex: '#827717', stock: 15 },
      { size: 'M', color: 'Olive', colorHex: '#827717', stock: 20 },
      { size: 'L', color: 'Olive', colorHex: '#827717', stock: 18 },
      { size: 'XL', color: 'Charcoal', colorHex: '#37474f', stock: 12 },
    ],
    tags: ['hoodie', 'winter', 'oversized'], isTrending: true,
  },
  {
    name: "Women's Palazzo Pants",
    description: 'Flowy wide-leg palazzo pants in breathable crepe fabric. Versatile for casual and semi-formal wear.',
    brand: 'BloomStyle',
    gender: 'women', type: 'lowers',
    images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600'],
    originalPrice: 1199, discount: 20,
    variants: [
      { size: 'S', color: 'Beige', colorHex: '#d4a373', stock: 14 },
      { size: 'M', color: 'Beige', colorHex: '#d4a373', stock: 16 },
      { size: 'L', color: 'Black', colorHex: '#000000', stock: 12 },
    ],
    tags: ['palazzo', 'casual', 'flowy'], isFeatured: true,
  },
  {
    name: "Boys' Cargo Shorts",
    description: 'Rugged cargo shorts with multiple pockets. Built for adventure-loving boys.',
    brand: 'KiddoWear',
    gender: 'kids', subGender: 'boys', type: 'shorts',
    images: ['https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600'],
    originalPrice: 699, discount: 10,
    variants: [
      { size: '4-5Y', color: 'Khaki', colorHex: '#c8b400', stock: 18 },
      { size: '6-7Y', color: 'Khaki', colorHex: '#c8b400', stock: 15 },
      { size: '8-9Y', color: 'Olive', colorHex: '#827717', stock: 12 },
    ],
    tags: ['kids', 'boys', 'shorts'], isTrending: false,
  },
  {
    name: "Women's Denim Jacket",
    description: 'Classic blue denim jacket with a relaxed fit. A wardrobe essential for any season.',
    brand: 'DenimCo',
    gender: 'women', type: 'jacket',
    images: ['https://images.unsplash.com/photo-1548624149-f9a7e5d8de18?w=600'],
    originalPrice: 2299, discount: 15,
    variants: [
      { size: 'XS', color: 'Light Blue', colorHex: '#90caf9', stock: 8 },
      { size: 'S', color: 'Light Blue', colorHex: '#90caf9', stock: 10 },
      { size: 'M', color: 'Light Blue', colorHex: '#90caf9', stock: 12 },
    ],
    tags: ['jacket', 'denim', 'layering'], isFeatured: false, isTrending: true,
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Create admin
    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@clothingweb.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@1234',
      role: 'admin',
    });
    console.log(`👤 Admin created: ${admin.email}`);

    // Create test user
    await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'User@1234',
      role: 'user',
    });
    console.log('👤 Test user created: user@test.com / User@1234');

    // Seed categories
    const createdCats = await Promise.all(categories.map(c => Category.create(c)));
    console.log(`📂 ${createdCats.length} categories seeded`);

    // Seed products
    const createdProducts = await Promise.all(products.map(p => Product.create({ ...p, slug: null })));
    console.log(`👕 ${createdProducts.length} products seeded`);

    console.log('\n✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Login:  admin@clothingweb.com / Admin@1234');
    console.log('User Login:   user@test.com / User@1234');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.stack);
    process.exit(1);
  }
};

seed();
