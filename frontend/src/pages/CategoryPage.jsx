import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import './CategoryPage.css';

const CategoryPage = () => {
  const { gender } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = gender !== 'all' ? `gender=${gender}&` : '';
        const { data } = await api.get(`/products?${query}sort=${sort}&limit=50`);
        setProducts(data.products);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [gender, sort]);

  const genderTitle = gender === 'men' ? "Men's Fashion" 
                    : gender === 'women' ? "Women's Fashion" 
                    : gender === 'kids' ? "Kids' Fashion" 
                    : "All Styles";

  return (
    <div className="container mt-4 mb-5">
      <div className="category-header d-flex justify-between align-center mb-4">
        <h1 className="category-title">{genderTitle}</h1>
        <div className="sort-control">
          <label className="text-muted mr-2">Sort by:</label>
          <select className="form-input" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">New Arrivals</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="popular">Popularity</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>

      <div className="category-layout">
        {/* Sidebar Filters (Simplified for now) */}
        <aside className="filters-sidebar">
          <div className="filter-group">
            <h3 className="filter-title">Categories</h3>
            <ul className="filter-list">
              <li><label><input type="checkbox"/> Shirts</label></li>
              <li><label><input type="checkbox"/> T-Shirts</label></li>
              <li><label><input type="checkbox"/> Jeans</label></li>
              <li><label><input type="checkbox"/> Dresses</label></li>
              <li><label><input type="checkbox"/> Accessories</label></li>
            </ul>
          </div>
          <div className="filter-group">
            <h3 className="filter-title">Price Range</h3>
            <ul className="filter-list">
              <li><label><input type="radio" name="price"/> Under ₹1,000</label></li>
              <li><label><input type="radio" name="price"/> ₹1,000 - ₹2,500</label></li>
              <li><label><input type="radio" name="price"/> Over ₹2,500</label></li>
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="products-container">
          {loading ? (
            <div className="text-center py-5 w-100">Loading styles...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-5 w-100">
              <p className="text-muted mb-3">No products found in this category.</p>
              <Link to="/" className="btn btn-primary">Back to Home</Link>
            </div>
          ) : (
            <div className="grid-cols-3">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
