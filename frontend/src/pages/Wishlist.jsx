import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import api from '../utils/api';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, toggle } = useWishlist();
  const { addToCart } = useCart();
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
      return;
    }

    const fetchWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/products/wishlist/details');
        setProducts(data.products);
      } catch (err) {
        console.error('Failed to fetch wishlist products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist, isAuth, navigate]);

  const handleRemove = (id) => {
    toggle(id);
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  const handleMoveToCart = (product) => {
    // We'll use the first available size/color for simplicity
    const size = product.variants?.[0]?.size || 'M';
    const color = product.variants?.[0]?.color || 'Default';
    
    addToCart(product, 1, size, color);
    handleRemove(product._id);
  };

  if (loading) {
    return <div className="container py-5 text-center fade-in">Loading wishlist...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="container py-5 text-center fade-in reveal active">
        <div className="empty-wishlist-icon mb-4">❤️</div>
        <h2 className="font-heading mb-3">Your Wishlist is Empty</h2>
        <p className="text-muted mb-4">Add items that you like to your wishlist to review them later and buy them.</p>
        <Link to="/category/all" className="btn btn-primary">
          BROWSE COLLECTIONS <ArrowRight size={18} className="ms-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5 fade-in">
      <div className="section-header mb-5">
        <h1 className="font-heading mb-2">My Wishlist</h1>
        <p className="text-muted">{products.length} Items</p>
      </div>

      <div className="wishlist-grid">
        {products.map(product => (
          <div key={product._id} className="wishlist-item card reveal active">
            <button className="remove-wishlist-btn" onClick={() => handleRemove(product._id)}>
              <Trash2 size={16} />
            </button>
            <Link to={`/product/${product.slug}`} className="wishlist-img-link">
              <img src={product.thumbnail} alt={product.name} />
            </Link>
            <div className="wishlist-details p-3">
              <h3 className="item-name mb-1">{product.name}</h3>
              <div className="item-price mb-3">{formatPrice(product.price)}</div>
              <button 
                onClick={() => handleMoveToCart(product)}
                className="btn btn-primary w-100 btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.6rem' }}
              >
                MOVE TO CART
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
