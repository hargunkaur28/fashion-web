import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import ProductCard from '../components/ProductCard';
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
      <div className="container py-5 text-center fade-in reveal active" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="empty-wishlist-icon mb-4" style={{ background: '#fff0f3', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
          <Heart size={48} strokeWidth={1} color="#e91e63" fill="#fff0f3" />
        </div>
        <h2 className="font-heading mb-3">Your Wishlist is Empty</h2>
        <p className="text-muted mb-4" style={{ maxWidth: '500px' }}>Add items that you like to your wishlist to review them later and buy them.</p>
        <Link to="/category/all" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
          BROWSE COLLECTIONS
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5 fade-in">
      <div className="section-header mb-5 d-flex justify-between align-center">
        <div>
          <h1 className="font-heading mb-2">My Wishlist</h1>
          <p className="text-muted">{products.length} Items</p>
        </div>
        <button onClick={() => navigate(-1)} className="btn btn-outline-primary btn-sm d-flex align-center gap-2" style={{ background: 'none', border: '1px solid', cursor: 'pointer' }}>
          <ArrowLeft size={18} /> BACK
        </button>
      </div>

      <div className="grid-cols-4 mt-4">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
