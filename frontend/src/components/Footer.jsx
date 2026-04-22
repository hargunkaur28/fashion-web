import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 className="footer-brand">VOGUE<span>VILLA</span></h3>
            <p className="footer-desc">
              Your ultimate destination for trendy, comfortable, and affordable fashion. Experience the joy of dressing up!
            </p>
            <div className="social-links mt-3">
              <a href="#" className="social-link">f</a>
              <a href="#" className="social-link">𝕏</a>
              <a href="#" className="social-link">📷</a>
              <a href="#" className="social-link">▶</a>
            </div>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-heading">Online Shopping</h4>
            <ul className="footer-links">
              <li><Link to="/category/men">Men</Link></li>
              <li><Link to="/category/women">Women</Link></li>
              <li><Link to="/category/kids">Kids</Link></li>
              <li><Link to="/category/home">Home & Living</Link></li>
              <li><Link to="/offers">Offers</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Customer Policies</h4>
            <ul className="footer-links">
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/t-and-c">T&C</Link></li>
              <li><Link to="/terms-of-use">Terms of Use</Link></li>
              <li><Link to="/track-order">Track Orders</Link></li>
              <li><Link to="/shipping">Shipping</Link></li>
              <li><Link to="/cancellation">Cancellation</Link></li>
              <li><Link to="/returns">Returns</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Contact Info</h4>
            <ul className="footer-contact">
              <li>
                <MapPin size={18} />
                <span>123 Fashion Street, Tech City, 10001</span>
              </li>
              <li>
                <Phone size={18} />
                <span>+1 234 567 8900</span>
              </li>
              <li>
                <Mail size={18} />
                <span>support@voguevilla.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} VogueVilla. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
