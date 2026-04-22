import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
          <h1 className="hero-title">DEFINE YOUR<br/>SIGNATURE LOOK</h1>
          <p className="hero-subtitle">Explore curated collections for the modern muse. Discover premium fashion pieces that match your unique style and elevate your everyday wardrobe with timeless elegance.</p>
          <Link to="/category/women" className="hero-btn">SHOP THE COLLECTION</Link>
        </div>
      </section>

      {/* Collections Strip */}
      <section className="collections-strip container mt-5 mb-5 reveal">
        <div className="collections-grid">
          <Link to="/category/women" className="collection-card">
            <div className="collection-image-wrap">
              <div className="collection-bg"></div>
              <img src="https://m.media-amazon.com/images/I/61MSZSuQemL._AC_UY1100_.jpg" alt="Summer Essentials" />
            </div>
            <h3 className="collection-title">Summer<br/>Essentials</h3>
          </Link>
          <Link to="/category/women" className="collection-card">
            <div className="collection-image-wrap">
              <div className="collection-bg"></div>
              <img src="https://imagescdn.allensolly.com/img/app/product/9/918059-11462738.jpg?auto=format&w=390" alt="Blazer Edit" />
            </div>
            <h3 className="collection-title">The<br/>Blazer Edit</h3>
          </Link>
          <Link to="/category/women" className="collection-card">
            <div className="collection-image-wrap">
              <div className="collection-bg"></div>
              <img src="https://cdn.shopify.com/s/files/1/0071/7406/2170/files/accessories-blog_1024x1024.jpg?v=1584702437" alt="Accessory Spotlight" />
            </div>
            <h3 className="collection-title">Accessory<br/>Spotlight</h3>
          </Link>
        </div>
      </section>

      {/* Categories Strip */}
      <section className="category-strip container mt-5 mb-5 reveal">
        <h2 className="section-title text-center mb-4">Shop by Category</h2>
        <div className="category-grid">
          <Link to="/category/men" className="category-card">
            <img src="https://blackberrys.com/cdn/shop/files/Casual_Dusty_Pink_Textured_Blazer_Ken-EJCC2311P3BS24FL-image3.jpg?v=1707372476&width=1600" alt="Men" />
            <div className="category-overlay">
              <h3>MEN</h3>
            </div>
          </Link>
          <Link to="/category/women" className="category-card">
            <img src="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/d/a/da20487MC8012_1.jpg?rnd=20200526195200&tr=w-512" alt="Women" />
            <div className="category-overlay">
              <h3>WOMEN</h3>
            </div>
          </Link>
          <Link to="/category/kids" className="category-card">
            <img src="https://img.tatacliq.com/images/i21//437Wx649H/MP000000024602375_437Wx649H_202412032148351.jpeg" alt="Kids" />
            <div className="category-overlay">
              <h3>KIDS</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Trending Now */}
      <section className="trending-section container mb-5 reveal">
        <div className="section-header d-flex justify-between align-center mb-4">
          <h2 className="section-title">Trending Now</h2>
          <Link to="/category/all" className="view-all-link">View All <ArrowRight size={16}/></Link>
        </div>
        {loading ? (
          <div className="text-center py-5">Loading...</div>
        ) : trending.length > 0 ? (
          <ProductCarousel products={trending} />
        ) : null}
      </section>

      {/* Promo Banner */}
      <section className="promo-banner mt-5 mb-5 reveal">
        <div className="container">
          <div className="promo-content">
            <h2>End of Season Sale</h2>
            <p>Get up to 60% off on premium brands. Limited time offer.</p>
            <Link to="/offers" className="btn btn-primary mt-3">Explore Offers</Link>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="featured-section container mb-5 reveal">
        <h2 className="section-title text-center mb-4">Featured Selection</h2>
        {loading ? (
          <div className="text-center py-5">Loading...</div>
        ) : featured.length > 0 ? (
          <ProductCarousel products={featured} />
        ) : null}
      </section>

      {/* Customer Reviews */}
      <section className="reviews-section container mb-5 reveal">
        <h2 className="section-title text-center mb-4">What Our Customers Say</h2>
        <div className="reviews-carousel-wrapper">
          <div className="reviews-carousel-track">
          {[
            { name: 'Priya Sharma', location: 'Mumbai', rating: 5, text: 'Absolutely love the quality! The fabric feels premium and the fit is perfect. VogueVilla is now my go-to for all things fashion.', item: 'Floral Wrap Dress', photo: 'https://i.pravatar.cc/150?img=47' },
            { name: 'Rahul Mehta', location: 'Delhi', rating: 5, text: 'Ordered a blazer and honestly exceeded my expectations. Fast delivery, great packaging, and the product looks exactly like the photos.', item: 'Slim Fit Blazer', photo: 'https://i.pravatar.cc/150?img=11' },
            { name: 'Ananya Iyer', location: 'Bangalore', rating: 4, text: 'Beautiful collection! Found so many outfits for my daughter. The kids section is amazing — great variety and super cute designs.', item: 'Kids Summer Set', photo: 'https://i.pravatar.cc/150?img=45' },
            { name: 'Karan Verma', location: 'Pune', rating: 5, text: 'The jeans fit like a dream. Ordered two pairs in different washes and both are fantastic. Will definitely shop here again!', item: 'Stretch Slim Jeans', photo: 'https://i.pravatar.cc/150?img=15' },
            { name: 'Sneha Kapoor', location: 'Chennai', rating: 5, text: 'Easy returns, great customer support, and the clothes are stunning. Got so many compliments wearing the ethnic fusion kurta!', item: 'Fusion Kurta Set', photo: 'https://i.pravatar.cc/150?img=49' },
            { name: 'Rohan Das', location: 'Kolkata', rating: 4, text: 'Really impressed with the range of sizes available. Finally found trendy clothes that actually fit well. Highly recommend!', item: 'Classic Polo Tee', photo: 'https://i.pravatar.cc/150?img=12' },
            { name: 'Meera Pillai', location: 'Hyderabad', rating: 5, text: 'I ordered 3 kurtas during the sale and all arrived in perfect condition. The colors are vibrant and true to the photos!', item: 'Ethnic Kurta', photo: 'https://i.pravatar.cc/150?img=44' },
            { name: 'Arjun Singh', location: 'Jaipur', rating: 5, text: 'Super impressed with the stitching quality. Wore the shirt to a wedding and got so many compliments. Totally worth it!', item: 'Printed Festive Shirt', photo: 'https://i.pravatar.cc/150?img=13' },
          ].concat([
            { name: 'Priya Sharma', location: 'Mumbai', rating: 5, text: 'Absolutely love the quality! The fabric feels premium and the fit is perfect. VogueVilla is now my go-to for all things fashion.', item: 'Floral Wrap Dress', photo: 'https://i.pravatar.cc/150?img=47' },
            { name: 'Rahul Mehta', location: 'Delhi', rating: 5, text: 'Ordered a blazer and honestly exceeded my expectations. Fast delivery, great packaging, and the product looks exactly like the photos.', item: 'Slim Fit Blazer', photo: 'https://i.pravatar.cc/150?img=11' },
            { name: 'Ananya Iyer', location: 'Bangalore', rating: 4, text: 'Beautiful collection! Found so many outfits for my daughter. The kids section is amazing — great variety and super cute designs.', item: 'Kids Summer Set', photo: 'https://i.pravatar.cc/150?img=45' },
            { name: 'Karan Verma', location: 'Pune', rating: 5, text: 'The jeans fit like a dream. Ordered two pairs in different washes and both are fantastic. Will definitely shop here again!', item: 'Stretch Slim Jeans', photo: 'https://i.pravatar.cc/150?img=15' },
            { name: 'Sneha Kapoor', location: 'Chennai', rating: 5, text: 'Easy returns, great customer support, and the clothes are stunning. Got so many compliments wearing the ethnic fusion kurta!', item: 'Fusion Kurta Set', photo: 'https://i.pravatar.cc/150?img=49' },
            { name: 'Rohan Das', location: 'Kolkata', rating: 4, text: 'Really impressed with the range of sizes available. Finally found trendy clothes that actually fit well. Highly recommend!', item: 'Classic Polo Tee', photo: 'https://i.pravatar.cc/150?img=12' },
            { name: 'Meera Pillai', location: 'Hyderabad', rating: 5, text: 'I ordered 3 kurtas during the sale and all arrived in perfect condition. The colors are vibrant and true to the photos!', item: 'Ethnic Kurta', photo: 'https://i.pravatar.cc/150?img=44' },
            { name: 'Arjun Singh', location: 'Jaipur', rating: 5, text: 'Super impressed with the stitching quality. Wore the shirt to a wedding and got so many compliments. Totally worth it!', item: 'Printed Festive Shirt', photo: 'https://i.pravatar.cc/150?img=13' },
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
