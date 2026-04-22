import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';

function AdminRedirect() {
  useEffect(() => {
    window.location.href = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174';
  }, []);
  return <div style={{ padding: '5rem', textAlign: 'center', minHeight: '60vh', marginTop: '80px' }}>Redirecting to Admin Dashboard...</div>;
}

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="app-container">
      <Navbar />
      <main className={!isHome ? 'pt-navbar' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/category/:gender" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<Orders />} />
          <Route path="/admin" element={<AdminRedirect />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
