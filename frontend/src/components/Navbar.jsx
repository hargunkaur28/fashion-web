import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { isAuth, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [hasBackground, setHasBackground] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasBackground(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // On non-home pages, always show the solid navbar
  const showBackground = !isHome || hasBackground;

  return (
    <>
      <header className={`navbar-header ${showBackground ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          <div className="navbar-left">
            <button
              className="btn-icon mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="brand-logo">
              VOGUE<span>VILLA</span>
            </Link>
            <nav className="desktop-nav">
              <Link to="/category/men" className="nav-link">Men</Link>
              <Link to="/category/women" className="nav-link">Women</Link>
              <Link to="/category/kids" className="nav-link">Kids</Link>
            </nav>
          </div>

          <div className="navbar-center search-container">
            <Search className="search-icon" size={18} />
            <input type="text" placeholder="Search for products, brands and more" className="search-input" />
          </div>

          <div className="navbar-right">
            <div className="nav-actions">
              {isAuth ? (
                <div className="profile-dropdown-wrapper">
                  <button className="nav-action-item">
                    <User size={20} />
                    <span>Profile</span>
                  </button>
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <p className="font-heading">Hello {user?.name}</p>
                      <p className="text-muted">{user?.email}</p>
                    </div>
                    <Link to="/orders" className="dropdown-item">Orders</Link>
                    <button onClick={() => { logout(); navigate('/'); }} className="dropdown-item">Logout</button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="nav-action-item">
                  <User size={20} />
                  <span>Login</span>
                </Link>
              )}

              <Link to="/wishlist" className="nav-action-item">
                <Heart size={20} />
                <span>Wishlist</span>
              </Link>

              <Link to="/cart" className="nav-action-item cart-action">
                <ShoppingBag size={20} />
                <span>Cart</span>
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-panel show">
          <nav className="mobile-nav">
            <Link
              to="/category/men"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Men
            </Link>
            <Link
              to="/category/women"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Women
            </Link>
            <Link
              to="/category/kids"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kids
            </Link>
          </nav>
          <div className="mobile-menu-divider"></div>
          <div className="mobile-menu-actions">
            {isAuth ? (
              <>
                <Link
                  to="/orders"
                  className="mobile-menu-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                    setMobileMenuOpen(false);
                  }}
                  className="mobile-menu-item"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="mobile-menu-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
            <Link
              to="/wishlist"
              className="mobile-menu-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              Wishlist
            </Link>
            <Link
              to="/cart"
              className="mobile-menu-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cart {totalItems > 0 && `(${totalItems})`}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
