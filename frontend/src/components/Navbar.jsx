import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X, Bell, Package, LogOut, Baby } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { isAuth, user, logout } = useAuth();
  const { totalItems } = useCart();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [hasBackground, setHasBackground] = useState(!isHome);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isHome) {
      setHasBackground(true);
      return;
    }
    const handleScroll = () => {
      setHasBackground(window.scrollY > 600);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/category/all?search=${searchTerm.trim()}`);
      setSearchTerm('');
    }
  };

  return (
    <>
      <header className={`navbar-header ${hasBackground ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          <div className="navbar-left">
            <button 
              className="btn-icon mobile-menu" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="brand-logo">
              <img src="/dimple-logo.png" alt="Dimple - A Complete Family Store" className="brand-logo-img" />
              <div className="brand-text">
                <span className="brand-name">Dimple</span>
                <span className="brand-tagline">A Complete Family Store</span>
              </div>
            </Link>
            <nav className="desktop-nav">
              <Link to="/category/men" className="nav-link">Men</Link>
              <Link to="/category/women" className="nav-link">Women</Link>
              <Link to="/category/kids" className="nav-link">Kids</Link>
            </nav>
          </div>

          <div className="navbar-center search-container">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search for kurtas, sarees, shirts and more..." 
              className="search-input" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
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

              {isAuth && (
                <div className="profile-dropdown-wrapper">
                  <button className="nav-action-item cart-action">
                    <Bell size={20} />
                    <span>Notifs</span>
                    {unreadCount > 0 && <span className="cart-badge">{unreadCount}</span>}
                  </button>
                  <div className="profile-dropdown notification-dropdown">
                    <div className="dropdown-header d-flex justify-between align-center">
                      <p className="font-heading m-0">Notifications</p>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="btn-link" style={{ fontSize: '0.75rem' }}>Mark all read</button>
                      )}
                    </div>
                    <div className="notification-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-muted">No notifications</div>
                      ) : (
                        notifications.map(n => (
                          <div 
                            key={n._id} 
                            className={`notification-item ${!n.isRead ? 'unread' : ''}`}
                            style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}
                            onClick={() => {
                              markRead(n._id);
                              if (n.link) navigate(n.link);
                            }}
                          >
                            <p className="m-0" style={{ fontSize: '0.9rem', fontWeight: !n.isRead ? 700 : 500, color: '#111' }}>{n.title}</p>
                            <p className="m-0 text-muted" style={{ fontSize: '0.8rem', lineHeight: '1.4', marginTop: '2px' }}>{n.message}</p>
                            <p className="m-0 text-muted mt-1" style={{ fontSize: '0.7rem' }}>{new Date(n.createdAt).toLocaleDateString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
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
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'show' : ''}`} onClick={() => setMobileMenuOpen(false)} />
      <div className={`mobile-menu-panel ${mobileMenuOpen ? 'show' : ''}`}>
        <div className="mobile-menu-header">
          <img src="/dimple-logo.png" alt="Dimple" className="mobile-logo" />
          <span className="mobile-brand-name">Dimple</span>
        </div>
        <nav className="mobile-nav">
          <Link 
            to="/category/men" 
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <User size={20} /> Men
          </Link>
          <Link 
            to="/category/women" 
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <User size={20} /> Women
          </Link>
          <Link 
            to="/category/kids" 
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Baby size={20} /> Kids
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
                <Package size={20} /> My Orders
              </Link>
              <button 
                onClick={() => { 
                  logout(); 
                  navigate('/'); 
                  setMobileMenuOpen(false);
                }} 
                className="mobile-menu-item"
              >
                <LogOut size={20} /> Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="mobile-menu-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={20} /> Login / Sign Up
            </Link>
          )}
          <Link 
            to="/wishlist" 
            className="mobile-menu-item"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Heart size={20} /> Wishlist
          </Link>
          <Link 
            to="/cart" 
            className="mobile-menu-item"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShoppingBag size={20} /> Cart {totalItems > 0 && `(${totalItems})`}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
