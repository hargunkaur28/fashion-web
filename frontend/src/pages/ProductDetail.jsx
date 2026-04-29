import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Truck, RotateCcw, Star } from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/formatPrice';
import './ProductDetail.css';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(slug);
        const url = isMongoId ? `/products/${slug}` : `/products/slug/${slug}`;
        const { data } = await api.get(url);
        setProduct(data.product);
        if (data.product.variants?.length > 0) {
          const firstInStock = data.product.variants.find(v => v.stock > 0) || data.product.variants[0];
          setSelectedSize(firstInStock.size);
          setSelectedColor(firstInStock.color);
        }
      } catch (err) {
        console.error('Failed to fetch product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <div className="container py-5 text-center">Loading product details...</div>;
  if (!product) return <div className="container py-5 text-center">Product not found.</div>;

  const uniqueSizes = [...new Set(product.variants.map(v => v.size))];
  const uniqueColors = [...new Set(product.variants.map(v => v.color))];
  const currentVariant = product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
  const isOutOfStock = !currentVariant || currentVariant.stock === 0;

  const handleAddToCart = () => {
    if (currentVariant && !isOutOfStock) {
      addToCart(product._id, selectedSize, selectedColor, 1);
    }
  };

  const wishlisted = isWishlisted(product._id);

  return (
    <div className="container mt-4 mb-5">
      {/* Breadcrumbs */}
      <div className="breadcrumbs mb-4">
        <Link to="/">Home</Link> / 
        <Link to={`/category/${product.gender}`}> {product.gender} </Link> / 
        <span className="text-muted"> {product.name}</span>
      </div>

      <div className="product-detail-grid">
        {/* Images */}
        <div className="product-gallery">
          <div className="thumbnail-list">
            {product.images.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt={`${product.name} ${idx}`} 
                className={`thumbnail ${activeImage === idx ? 'active' : ''}`}
                onClick={() => setActiveImage(idx)}
              />
            ))}
          </div>
          <div className="main-image-wrap">
            <img src={product.images?.[activeImage] || 'https://via.placeholder.com/400?text=No+Image'} alt={product.name} className="main-image" />
          </div>
        </div>

        {/* Info */}
        <div className="product-info-panel">
          <h1 className="detail-brand">{product.brand}</h1>
          <h2 className="detail-title">{product.name}</h2>
          
          <div className="detail-price-row mt-3">
            <span className="detail-price">{formatPrice(product.price)}</span>
            {product.discount > 0 && (
              <>
                <span className="detail-original-price">{formatPrice(product.originalPrice)}</span>
                <span className="detail-discount">{product.discount}% OFF</span>
              </>
            )}
          </div>
          <p className="taxes-text text-muted">Inclusive of all taxes</p>

          <div className="divider my-4"></div>

          {/* Size Selector */}
          <div className="selector-group">
            <div className="d-flex justify-between mb-2">
              <span className="font-weight-bold">Select Size</span>
              <button className="text-primary btn-link">Size Chart</button>
            </div>
            <div className="size-options">
              {uniqueSizes.map(size => {
                const hasStock = product.variants.some(v => v.size === size && v.stock > 0);
                return (
                  <button 
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''} ${!hasStock ? 'disabled' : ''}`}
                    onClick={() => hasStock && setSelectedSize(size)}
                    disabled={!hasStock}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selector */}
          <div className="selector-group mt-4">
            <div className="mb-2"><span className="font-weight-bold">Select Color:</span> {selectedColor}</div>
            <div className="color-options">
              {uniqueColors.map(color => {
                const hex = product.variants.find(v => v.color === color)?.colorHex || '#ccc';
                return (
                  <button
                    key={color}
                    className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: hex }}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  />
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="action-buttons mt-5">
            <button 
              className="btn btn-primary add-to-bag-btn" 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingBag size={20} />
              {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO BAG'}
            </button>
            
            <button 
              className={`btn btn-outline wishlist-action-btn ${wishlisted ? 'wishlisted' : ''}`}
              onClick={() => toggle(product._id)}
            >
              <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
              WISHLIST
            </button>
          </div>

          {/* Delivery & Services */}
          <div className="services-box mt-5">
            <div className="service-item">
              <Truck size={24} className="text-muted" />
              <div>
                <p className="font-weight-bold">Free Delivery</p>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>For orders above ₹1,000</p>
              </div>
            </div>
            <div className="service-item mt-3">
              <RotateCcw size={24} className="text-muted" />
              <div>
                <p className="font-weight-bold">14 Days Return Policy</p>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>No questions asked</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="product-description mt-5">
            <h3>Product Details</h3>
            <p>{product.description}</p>
            <ul className="details-list mt-3 text-muted">
              <li>Premium quality fabric</li>
              <li>Machine wash safe</li>
              <li>Style: {product.type}</li>
              <li>Brand: {product.brand}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="product-reviews-section">
        <h3 className="reviews-title">Customer Reviews ({product.numReviews})</h3>
        
        {product.reviews && product.reviews.length === 0 ? (
          <p className="text-muted text-center py-4">No reviews yet. Only customers who have received this item can leave a review.</p>
        ) : (
          <div className="reviews-list">
            {product.reviews?.map((review) => (
              <div key={review._id} className="review-item">
                <div className="d-flex align-center justify-between mb-2">
                  <div className="font-weight-bold" style={{ fontWeight: '600' }}>{review.name} <span className="text-success small ms-2">✓ Verified Purchase</span></div>
                  <div className="text-muted small">
                    {new Date(review.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}
                  </div>
                </div>
                <div className="d-flex mb-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      size={14} 
                      fill={star <= review.rating ? "#f59e0b" : "none"}
                      color={star <= review.rating ? "#f59e0b" : "#d1d5db"} 
                    />
                  ))}
                </div>
                {review.comment && <p className="mb-3 text-muted">{review.comment}</p>}
                
                {review.photos && review.photos.length > 0 && (
                  <div className="d-flex gap-2 flex-wrap mt-2">
                    {review.photos.map((photo, i) => (
                      <a href={photo} target="_blank" rel="noreferrer" key={i}>
                        <img 
                          src={photo} 
                          alt="Review attachment" 
                          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }} 
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
