import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Package, MapPin, CalendarDays, DollarSign, ChevronDown, ArrowLeft } from 'lucide-react';
import api from '../utils/api';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';
import './Cart.css';

const Orders = () => {
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/my');
      setOrders(data.orders);

      if (orderId) {
        const order = data.orders.find(o => o._id === orderId);
        setSelectedOrder(order);
        setExpandedOrderId(orderId);
      }
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      processing: '#8b5cf6',
      shipped: '#06b6d4',
      delivered: '#10b981',
      cancelled: '#ef4444',
      returned: '#6b7280',
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      confirmed: '✓',
      processing: '⚙️',
      shipped: '🚚',
      delivered: '📦',
      cancelled: '❌',
      returned: '↩️',
    };
    return icons[status] || '•';
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner mb-3"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="empty-cart-icon mb-4">📭</div>
        <h2>No Orders Yet</h2>
        <p className="text-muted mt-2 mb-4">You haven't placed any orders yet. Start shopping now!</p>
        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex align-center mb-4">
        <Link to="/" className="btn btn-outline me-3">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="cart-title m-0">My Orders</h1>
      </div>

      <div className="orders-container">
        {orders.map(order => (
          <div key={order._id} className="card mb-3 order-card">
            <div
              className="order-header p-3 cursor-pointer d-flex justify-between align-center"
              onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
            >
              <div className="order-header-left">
                <div className="order-number mb-2">
                  <strong>Order #{order.orderNumber || order._id.substring(0, 8).toUpperCase()}</strong>
                  <span
                    className="status-badge ms-2"
                    style={{ background: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}
                  >
                    {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="order-date text-muted">
                  <CalendarDays size={14} className="me-1" />
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>

              <div className="order-header-right text-right">
                <div className="order-total">
                  <strong>{formatPrice(order.totalAmount)}</strong>
                </div>
                <div className="order-items text-muted">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </div>
                <ChevronDown
                  size={20}
                  style={{
                    transform: expandedOrderId === order._id ? 'rotate(180deg)' : '',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </div>
            </div>

            {expandedOrderId === order._id && (
              <div className="order-details p-3 border-top">
                {/* Items */}
                <div className="mb-4">
                  <h4 className="mb-2">Items</h4>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item d-flex gap-3 mb-3 p-2 bg-light rounded">
                      {item.thumbnail && (
                        <img src={item.thumbnail} alt={item.name} className="order-item-img" />
                      )}
                      <div className="order-item-info flex-1">
                        <div className="d-flex justify-between">
                          <h5 className="m-0">{item.name}</h5>
                          <span className="text-muted">{formatPrice(item.price)}</span>
                        </div>
                        <div className="text-muted mt-1 small">
                          <span>Size: {item.variantSize}</span>
                          <span className="mx-2">|</span>
                          <span>Color: {item.variantColor}</span>
                          <span className="mx-2">|</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                <div className="mb-4">
                  <h4 className="mb-2">
                    <MapPin size={18} className="me-2" />
                    Shipping Address
                  </h4>
                  <div className="address-box p-2 bg-light rounded">
                    <p className="m-0 mb-1">
                      <strong>{order.shippingAddress.fullName}</strong>
                    </p>
                    <p className="m-0 text-muted small">
                      {order.shippingAddress.line1}, {order.shippingAddress.line2}
                    </p>
                    <p className="m-0 text-muted small">
                      {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.pincode}
                    </p>
                    <p className="m-0 text-muted small">📞 {order.shippingAddress.phone}</p>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="mb-4">
                  <h4 className="mb-3">Order Timeline</h4>
                  <div className="timeline">
                    {order.statusHistory?.map((history, idx) => (
                      <div key={idx} className="timeline-item">
                        <div className="timeline-marker" style={{ background: getStatusColor(history.status) }}></div>
                        <div className="timeline-content">
                          <span style={{ color: getStatusColor(history.status), fontWeight: 600 }}>
                            {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                          </span>
                          <div className="text-muted small">
                            {new Date(history.timestamp).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                          {history.note && <div className="text-muted small mt-1">{history.note}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="mb-4">
                  <h4 className="mb-2">Price Details</h4>
                  <div className="price-breakdown p-2 bg-light rounded">
                    <div className="d-flex justify-between mb-2">
                      <span className="text-muted">Subtotal ({order.items.length} items)</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="d-flex justify-between mb-2 text-success">
                        <span className="text-muted">Discount</span>
                        <span>-{formatPrice(order.discount)}</span>
                      </div>
                    )}
                    <div className="d-flex justify-between mb-2">
                      <span className="text-muted">Shipping</span>
                      <span>{order.shippingCharge === 0 ? 'FREE' : formatPrice(order.shippingCharge)}</span>
                    </div>
                    <div className="border-top my-2"></div>
                    <div className="d-flex justify-between">
                      <strong>Total</strong>
                      <strong>{formatPrice(order.totalAmount)}</strong>
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="mb-4">
                  <h4 className="mb-2">Payment Status</h4>
                  <div
                    className="payment-status p-2 rounded"
                    style={{
                      background: (order.paymentStatus === 'paid' ? '#10b981' : '#f59e0b') + '20',
                      color: order.paymentStatus === 'paid' ? '#10b981' : '#f59e0b',
                    }}
                  >
                    {order.paymentStatus === 'paid' ? '✓ Payment Received' : '⏳ Payment Pending'}
                  </div>
                </div>

                {/* Actions */}
                <div className="d-flex gap-2">
                  <button className="btn btn-outline flex-1">Need Help?</button>
                  <button className="btn btn-outline flex-1">Download Invoice</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .orders-container {
          max-width: 900px;
        }

        .order-card {
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .order-card:hover {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .order-header {
          cursor: pointer;
          user-select: none;
        }

        .order-header:hover {
          background: #f9fafb;
        }

        .order-header-left,
        .order-header-right {
          flex: 1;
        }

        .order-number {
          font-size: 0.95rem;
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .order-item-img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 0.5rem;
        }

        .timeline {
          position: relative;
          padding-left: 2rem;
        }

        .timeline-item {
          position: relative;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
        }

        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: -1.25rem;
          top: 2rem;
          width: 2px;
          height: calc(100% + 0.5rem);
          background: #e5e7eb;
        }

        .timeline-marker {
          position: absolute;
          left: -1.6rem;
          top: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 3px solid white;
        }

        .timeline-content {
          font-size: 0.9rem;
        }

        .spinner {
          display: inline-block;
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .d-flex {
          display: flex;
        }

        .justify-between {
          justify-content: space-between;
        }

        .align-center {
          align-items: center;
        }

        .gap-2 {
          gap: 0.5rem;
        }

        .gap-3 {
          gap: 1rem;
        }

        .mb-2 { margin-bottom: 0.5rem; }
        .mb-3 { margin-bottom: 1rem; }
        .mb-4 { margin-bottom: 1.5rem; }
        .ms-2 { margin-left: 0.5rem; }
        .me-1 { margin-right: 0.25rem; }
        .me-2 { margin-right: 0.5rem; }
        .me-3 { margin-right: 1rem; }
        .mx-2 { margin-left: 0.5rem; margin-right: 0.5rem; }
        .m-0 { margin: 0; }
        .my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }

        .text-muted {
          color: #6b7280;
        }

        .text-success {
          color: #10b981;
        }

        .text-right {
          text-align: right;
        }

        .bg-light {
          background: #f9fafb;
        }

        .rounded {
          border-radius: 0.5rem;
        }

        .border-top {
          border-top: 1px solid #e5e7eb;
        }

        .small {
          font-size: 0.875rem;
        }

        .flex-1 {
          flex: 1;
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .p-2 { padding: 0.5rem; }
        .p-3 { padding: 1rem; }

        @media (max-width: 768px) {
          .order-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .order-header-right {
            margin-top: 1rem;
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default Orders;
