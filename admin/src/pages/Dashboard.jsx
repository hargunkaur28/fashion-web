import { useState, useEffect } from 'react';
import { ShoppingCart, LayoutDashboard, Package, Users } from 'lucide-react';
import api from '../utils/api';
import './admin-pages.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(res => setStats(res.data)).catch(console.error);
  }, []);

  if (!stats) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading dashboard...</div>;

  return (
    <div>
      <h1 className="admin-page-title">Dashboard Overview</h1>
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon"><ShoppingCart size={24}/></div>
          <div className="kpi-info"><h3>Total Orders</h3><p>{stats.totalOrders}</p></div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{backgroundColor: '#e8f5e9', color: '#2e7d32'}}><LayoutDashboard size={24}/></div>
          <div className="kpi-info"><h3>Total Revenue</h3><p>₹{stats.totalRevenue.toLocaleString()}</p></div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{backgroundColor: '#e3f2fd', color: '#1565c0'}}><Package size={24}/></div>
          <div className="kpi-info"><h3>Products</h3><p>{stats.totalProducts}</p></div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{backgroundColor: '#fff3e0', color: '#ef6c00'}}><Users size={24}/></div>
          <div className="kpi-info"><h3>Customers</h3><p>{stats.totalUsers}</p></div>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem'}}>
        <div style={{ background: 'white', padding: '1.5rem', border: '1px solid #e0d5ce', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600}}>Recent Orders</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length === 0 ? (
                <tr><td colSpan="3" className="no-data">No orders yet</td></tr>
              ) : (
                stats.recentOrders.map(o => (
                  <tr key={o._id}>
                    <td>{o.orderNumber || o._id.substring(0, 8)}</td>
                    <td>₹{o.totalAmount}</td>
                    <td><span style={{padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', background: '#e3f2fd', color: '#1565c0', fontWeight: 600}}>{o.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div style={{ background: 'white', padding: '1.5rem', border: '1px solid #e0d5ce', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600}}>Low Stock Alerts</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Low Stock</th>
              </tr>
            </thead>
            <tbody>
              {stats.lowStockProducts.length === 0 ? (
                <tr><td colSpan="2" className="no-data">All stock levels good!</td></tr>
              ) : (
                stats.lowStockProducts.map(p => (
                  <tr key={p._id}>
                    <td>{p.name.substring(0, 25)}</td>
                    <td style={{color: '#f44336', fontWeight: 700}}>{p.variants.filter(v => v.stock <= 5).length} variants</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
