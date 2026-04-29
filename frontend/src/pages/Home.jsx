import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, Shirt, Crown } from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const ProductCarousel = ({ products }) => {
  const items = [...products, ...products]; // duplicate for seamless loop
  return (
    <div className="carousel-track-wrapper">
      <div className="carousel-track">
        {items.map((product, i) => (
          <div className="carousel-item" key={`${product._id}-${i}`}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featRes, trendRes] = await Promise.all([
          api.get('/products?featured=true&limit=4'),
          api.get('/products?trending=true&limit=8')
        ]);
        setFeatured(featRes.data.products);
        setTrending(trendRes.data.products);
      } catch (err) {
        console.error('Failed to fetch home data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();

    // Scroll reveal observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(reveal => observer.observe(reveal));

    return () => observer.disconnect();
  }, [loading]);

  return (
    <div className="home-page fade-in">
      {/* Hero Banner */}
      <section className="hero-section">
        <video autoPlay muted loop className="hero-video">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Fashion For Every Generation</span>
          </div>
          <h1 className="hero-title">YOUR STYLE,<br/>YOUR STORY</h1>
          <p className="hero-subtitle">Explore premium collections for the entire family — from festive ethnic wear to everyday comfort. Quality fashion at honest prices, only at Dimple.</p>
          <div className="hero-buttons">
            <Link to="/category/women" className="hero-btn hero-btn-primary">SHOP WOMEN</Link>
            <Link to="/category/men" className="hero-btn hero-btn-secondary">SHOP MEN</Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-strip">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <Crown size={22} />
              <span>Premium Quality</span>
            </div>
            <div className="trust-item">
              <Shirt size={22} />
              <span>Latest Trends</span>
            </div>
            <div className="trust-item">
              <Star size={22} />
              <span>Family Friendly</span>
            </div>
            <div className="trust-item">
              <Sparkles size={22} />
              <span>Best Prices</span>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Strip */}
      <section className="collections-strip container mt-5 mb-5 reveal">
        <div className="section-header-center">
          <h2 className="section-title text-center">Curated Collections</h2>
          <div className="ethnic-accent"></div>
          <p className="section-subtitle text-center">Handpicked styles for every occasion</p>
        </div>
        <div className="collections-grid">
          <Link to="/category/women" className="collection-card">
            <div className="collection-image-wrap">
              <div className="collection-bg"></div>
              <img src="https://m.media-amazon.com/images/I/61MSZSuQemL._AC_UY1100_.jpg" alt="Ethnic Wear" />
            </div>
            <h3 className="collection-title">Ethnic Collection</h3>
          </Link>
          <Link to="/category/women" className="collection-card">
            <div className="collection-image-wrap">
              <div className="collection-bg"></div>
              <img src="https://imagescdn.allensolly.com/img/app/product/9/918059-11462738.jpg?auto=format&w=390" alt="Indo Western" />
            </div>
            <h3 className="collection-title">Indo Western</h3>
          </Link>
          <Link to="/category/men" className="collection-card">
            <div className="collection-image-wrap">
              <div className="collection-bg"></div>
              <img src="https://blackberrys.com/cdn/shop/files/Casual_Dusty_Pink_Textured_Blazer_Ken-EJCC2311P3BS24FL-image3.jpg?v=1707372476&width=1600" alt="Party Wear" />
            </div>
            <h3 className="collection-title">Party Wear</h3>
          </Link>
        </div>
      </section>

      {/* Categories Strip */}
      <section className="category-strip container mt-5 mb-5 reveal">
        <div className="section-header-center">
          <h2 className="section-title text-center">Shop by Category</h2>
          <div className="ethnic-accent"></div>
        </div>
        <div className="category-grid">
          <Link to="/category/men" className="category-card">
            <img src="https://blackberrys.com/cdn/shop/files/Casual_Dusty_Pink_Textured_Blazer_Ken-EJCC2311P3BS24FL-image3.jpg?v=1707372476&width=1600" alt="Men" />
            <div className="category-overlay">
              <span className="category-label">MEN</span>
            </div>
          </Link>
          <Link to="/category/women" className="category-card">
            <img src="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/d/a/da20487MC8012_1.jpg?rnd=20200526195200&tr=w-512" alt="Women" />
            <div className="category-overlay">
              <span className="category-label">WOMEN</span>
            </div>
          </Link>
          <Link to="/category/kids" className="category-card">
            <img src="https://img.tatacliq.com/images/i21//437Wx649H/MP000000024602375_437Wx649H_202412032148351.jpeg" alt="Kids" />
            <div className="category-overlay">
              <span className="category-label">KIDS</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Trending Now */}
      <section className="trending-section container mb-5 reveal">
        <div className="section-header d-flex justify-between align-center mb-4">
          <div>
            <h2 className="section-title">Trending Now</h2>
            <div className="ethnic-accent" style={{margin: '0.75rem 0'}}></div>
          </div>
          <Link to="/category/all" className="view-all-link">View All <ArrowRight size={16}/></Link>
        </div>
        {loading ? (
          <div className="text-center py-5">
            <div className="loading-spinner"></div>
            <p className="text-muted mt-2">Loading fresh styles...</p>
          </div>
        ) : trending.length > 0 ? (
          <ProductCarousel products={trending} />
        ) : null}
      </section>

      {/* Promo Banner */}
      <section className="promo-banner mt-5 mb-5 reveal">
        <div className="container">
          <div className="promo-content">
            <span className="promo-badge">Limited Time</span>
            <h2>Festive Season Sale</h2>
            <p>Get up to 60% off on premium ethnic & party wear. Celebrate in style!</p>
            <Link to="/category/women" className="btn btn-accent mt-3">Shop the Sale</Link>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="featured-section container mb-5 reveal">
        <div className="section-header-center">
          <h2 className="section-title text-center">Featured Selection</h2>
          <div className="ethnic-accent"></div>
        </div>
        {loading ? (
          <div className="text-center py-5">Loading...</div>
        ) : featured.length > 0 ? (
          <ProductCarousel products={featured} />
        ) : null}
      </section>

      {/* Customer Reviews */}
      <section className="reviews-section container mb-5 reveal">
        <div className="section-header-center">
          <h2 className="section-title text-center">What Our Customers Say</h2>
          <div className="ethnic-accent"></div>
        </div>
        <div className="reviews-carousel-wrapper">
          <div className="reviews-carousel-track">
          {[
            { name: 'Priya Sharma', location: 'Kanpur', rating: 5, text: 'Absolutely love the quality! The fabric feels premium and the fit is perfect. Dimple is now my go-to for all family fashion needs.', item: 'Floral Kurta Set', photo: 'https://i.pravatar.cc/150?img=47' },
            { name: 'Rahul Mehta', location: 'Lucknow', rating: 5, text: 'Ordered a party wear shirt and honestly exceeded my expectations. Great quality and the product looks exactly like the photos.', item: 'Party Wear Shirt', photo: 'https://i.pravatar.cc/150?img=11' },
            { name: 'Ananya Iyer', location: 'Kanpur', rating: 4, text: 'Beautiful collection! Found so many outfits for my daughter. The kids section is amazing — great variety and super cute designs.', item: 'Kids Lehenga Set', photo: 'https://i.pravatar.cc/150?img=45' },
            { name: 'Karan Verma', location: 'Varanasi', rating: 5, text: 'The kurta fit like a dream. Ordered two in different colors and both are fantastic. Will definitely shop here again!', item: 'Cotton Kurta', photo: 'https://i.pravatar.cc/150?img=15' },
            { name: 'Sneha Kapoor', location: 'Kanpur', rating: 5, text: 'Got so many compliments wearing the Indo Western dress! Easy returns and great customer support. Love Dimple!', item: 'Indo Western Dress', photo: 'https://i.pravatar.cc/150?img=49' },
            { name: 'Rohan Das', location: 'Allahabad', rating: 4, text: 'Really impressed with the range of sizes available — including plus sizes. Finally found trendy clothes that actually fit well!', item: 'Plus Size Kurta', photo: 'https://i.pravatar.cc/150?img=12' },
            { name: 'Meera Pillai', location: 'Kanpur', rating: 5, text: 'Ordered 3 sarees during the sale and all arrived in perfect condition. The colors are vibrant and true to the photos!', item: 'Silk Saree', photo: 'https://i.pravatar.cc/150?img=44' },
            { name: 'Arjun Singh', location: 'Kanpur', rating: 5, text: 'Super impressed with the stitching quality. Wore the shirt to a wedding and got so many compliments. Totally worth it!', item: 'Wedding Sherwani', photo: 'https://i.pravatar.cc/150?img=13' },
          ].concat([
            { name: 'Priya Sharma', location: 'Kanpur', rating: 5, text: 'Absolutely love the quality! The fabric feels premium and the fit is perfect. Dimple is now my go-to for all family fashion needs.', item: 'Floral Kurta Set', photo: 'https://i.pravatar.cc/150?img=47' },
            { name: 'Rahul Mehta', location: 'Lucknow', rating: 5, text: 'Ordered a party wear shirt and honestly exceeded my expectations. Great quality and the product looks exactly like the photos.', item: 'Party Wear Shirt', photo: 'https://i.pravatar.cc/150?img=11' },
            { name: 'Ananya Iyer', location: 'Kanpur', rating: 4, text: 'Beautiful collection! Found so many outfits for my daughter. The kids section is amazing — great variety and super cute designs.', item: 'Kids Lehenga Set', photo: 'https://i.pravatar.cc/150?img=45' },
            { name: 'Karan Verma', location: 'Varanasi', rating: 5, text: 'The kurta fit like a dream. Ordered two in different colors and both are fantastic. Will definitely shop here again!', item: 'Cotton Kurta', photo: 'https://i.pravatar.cc/150?img=15' },
            { name: 'Sneha Kapoor', location: 'Kanpur', rating: 5, text: 'Got so many compliments wearing the Indo Western dress! Easy returns and great customer support. Love Dimple!', item: 'Indo Western Dress', photo: 'https://i.pravatar.cc/150?img=49' },
            { name: 'Rohan Das', location: 'Allahabad', rating: 4, text: 'Really impressed with the range of sizes available — including plus sizes. Finally found trendy clothes that actually fit well!', item: 'Plus Size Kurta', photo: 'https://i.pravatar.cc/150?img=12' },
            { name: 'Meera Pillai', location: 'Kanpur', rating: 5, text: 'Ordered 3 sarees during the sale and all arrived in perfect condition. The colors are vibrant and true to the photos!', item: 'Silk Saree', photo: 'https://i.pravatar.cc/150?img=44' },
            { name: 'Arjun Singh', location: 'Kanpur', rating: 5, text: 'Super impressed with the stitching quality. Wore the shirt to a wedding and got so many compliments. Totally worth it!', item: 'Wedding Sherwani', photo: 'https://i.pravatar.cc/150?img=13' },
          ]).map((review, i) => (
            <div className="review-card" key={i}>
              <div className="review-stars">
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
              <p className="review-text">"{review.text}"</p>
              <div className="review-item-tag">{review.item}</div>
              <div className="review-author">
                <img src={review.photo} alt={review.name} className="review-avatar-img" />
                <div>
                  <p className="review-name">{review.name}</p>
                  <p className="review-location">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
