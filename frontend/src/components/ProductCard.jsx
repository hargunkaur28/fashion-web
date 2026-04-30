import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/formatPrice';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);

  const wishlisted = isWishlisted(product._id);
  const inStock = product.variants.some(v => v.stock > 0);
  const firstVariant = product.variants.find(v => v.stock > 0) || product.variants[0];

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (inStock && firstVariant) {
      addToCart(product._id, firstVariant.size, firstVariant.color, 1);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(product._id);
  };

  const NO_IMAGE_PLACEHOLDER = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22250%22%20height%3D%22250%22%20viewBox%3D%220%200%20250%20250%22%3E%3Crect%20fill%3D%22%23eaeaea%22%20width%3D%22250%22%20height%3D%22250%22%2F%3E%3Ctext%20fill%3D%22%23999%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20dy%3D%2210.5%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';

  const secondaryImage = product.images?.length > 1 ? product.images[1] : product.images?.[0] || NO_IMAGE_PLACEHOLDER;

  return (
    <Link to={`/product/${product.slug}`} className="product-card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}>
      <div className="product-img-wrapper">
        <img 
          src={isHovered ? secondaryImage : product.images?.[0] || NO_IMAGE_PLACEHOLDER} 
          alt={product.name} 
          className="product-img" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = NO_IMAGE_PLACEHOLDER;
          }}
        />
        
        {/* Badges */}
        <div className="product-badges">
          {product.isTrending && <span className="badge trending">Trending</span>}
          {product.isFeatured && <span className="badge featured">New</span>}
        </div>

        {/* Hover Actions */}
        <div className={`product-actions ${(isHovered || wishlisted) ? 'show' : ''}`}>
          <button className={`action-btn wishlist-btn ${wishlisted ? 'active' : ''}`} onClick={handleWishlist}>
            <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Add to Cart Overlay */}
        <div className={`add-to-cart-overlay ${isHovered ? 'show' : ''}`}>
          <button className="btn btn-primary w-100" onClick={handleAddToCart} disabled={!inStock}>
            <ShoppingCart size={18} />
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-brand">{product.brand}</h3>
        <p className="product-title">{product.name}</p>
        
        <div className="product-price-row">
          <span className="price">{formatPrice(product.price)}</span>
          {product.discount > 0 && (
            <>
              <span className="original-price">{formatPrice(product.originalPrice)}</span>
              <span className="discount">({product.discount}% OFF)</span>
            </>
          )}
        </div>
        
        {/* Quick Sizes */}
        <div className="product-sizes text-muted mt-1" style={{ fontSize: '0.8rem' }}>
          Sizes: {product.variants.map(v => v.size).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
