import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Package, MapPin, CreditCard, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './Cart.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart, totalAmount } = useCart();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirm
  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState('');

  const shipping_charge = totalAmount > 1000 ? 0 : 99;
  const finalAmount = totalAmount - discount + shipping_charge;

  const validateShipping = () => {
    if (!shipping.fullName || !shipping.phone || !shipping.line1 || !shipping.city || !shipping.state || !shipping.pincode) {
      toast.error('Please fill all shipping details');
      return false;
    }
    if (!/^[0-9]{10}$/.test(shipping.phone)) {
      toast.error('Enter a valid 10-digit phone number');
      return false;
    }
    if (!/^[0-9]{6}$/.test(shipping.pincode)) {
      toast.error('Enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const applyCoupon = () => {
    // Simple coupon validation - in production, validate from backend
    if (coupon === 'SAVE10') {
      setDiscount(Math.round(totalAmount * 0.1));
      toast.success('Coupon applied! 10% discount');
    } else if (coupon === 'SAVE20') {
      setDiscount(Math.round(totalAmount * 0.2));
      toast.success('Coupon applied! 20% discount');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const createOrder = async () => {
    if (!validateShipping()) return;

    setLoading(true);
    try {
      const orderData = {
        items: cart.items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          thumbnail: item.product.thumbnail,
          variantSize: item.variantSize,
          variantColor: item.variantColor,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: shipping,
        paymentMethod,
        subtotal: totalAmount,
        discount,
        shippingCharge: shipping_charge,
        totalAmount: finalAmount,
      };

      const { data } = await api.post('/orders', orderData);

      if (paymentMethod === 'razorpay') {
        // In production, integrate actual Razorpay payment gateway
        toast.success('Order created! Proceeding to payment...');
        setTimeout(() => {
          clearCart();
          navigate(`/orders/${data.order._id}`);
        }, 1500);
      } else {
        toast.success('Order placed successfully! 🎉');
        clearCart();
        navigate('/orders');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="empty-cart-icon mb-4">📦</div>
        <h2>Your cart is empty</h2>
        <p className="text-muted mt-2 mb-4">Add items before proceeding to checkout</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <h1 className="cart-title mb-4">Checkout</h1>

      <div className="cart-layout">
        {/* Progress Steps */}
        <div className="checkout-steps mb-5">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number"><MapPin size={18} /></div>
            <div className="step-label">Shipping</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number"><CreditCard size={18} /></div>
            <div className="step-label">Payment</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number"><Check size={18} /></div>
            <div className="step-label">Confirm</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="cart-items">
          {step === 1 && (
            <div className="card p-4">
              <h2 className="mb-4">
                <MapPin size={24} className="me-2" />
                Shipping Address
              </h2>

              <div className="form-group mb-3">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={shipping.fullName}
                  onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group mb-3">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={shipping.phone}
                  onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group mb-3">
                <label>Address Line 1 *</label>
                <input
                  type="text"
                  placeholder="House no, Building Name"
                  value={shipping.line1}
                  onChange={(e) => setShipping({ ...shipping, line1: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group mb-3">
                <label>Address Line 2</label>
                <input
                  type="text"
                  placeholder="Road name, Area, Colony (Optional)"
                  value={shipping.line2}
                  onChange={(e) => setShipping({ ...shipping, line2: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row mb-3">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    placeholder="Mumbai"
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    placeholder="Maharashtra"
                    value={shipping.state}
                    onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group mb-4">
                <label>Pincode *</label>
                <input
                  type="text"
                  placeholder="400001"
                  value={shipping.pincode}
                  onChange={(e) => setShipping({ ...shipping, pincode: e.target.value })}
                  className="form-input"
                />
              </div>

              <button
                onClick={() => validateShipping() && setStep(2)}
                className="btn btn-primary w-100"
              >
                Continue to Payment <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="card p-4">
              <h2 className="mb-4">
                <CreditCard size={24} className="me-2" />
                Payment Method
              </h2>

              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Razorpay (Credit/Debit Card, UPI, Netbanking)</span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>

              <h3 className="mt-5 mb-3">Promo Code</h3>
              <div className="coupon-input d-flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code (e.g., SAVE10)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  className="form-input flex-1"
                />
                <button onClick={applyCoupon} className="btn btn-outline">
                  Apply
                </button>
              </div>
              <small className="text-muted d-block mt-2">Try: SAVE10 (10% off) or SAVE20 (20% off)</small>

              <div className="d-flex gap-3 mt-5">
                <button onClick={() => setStep(1)} className="btn btn-outline flex-1">
                  Back
                </button>
                <button onClick={() => setStep(3)} className="btn btn-primary flex-1">
                  Review Order <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card p-4">
              <h2 className="mb-4">
                <Check size={24} className="me-2" />
                Order Summary
              </h2>

              <h3 className="mt-4 mb-3">Shipping Address</h3>
              <div className="address-summary">
                <p><strong>{shipping.fullName}</strong></p>
                <p>{shipping.line1}, {shipping.line2}</p>
                <p>{shipping.city}, {shipping.state} {shipping.pincode}</p>
                <p>📞 {shipping.phone}</p>
              </div>

              <h3 className="mt-4 mb-3">Payment Method</h3>
              <p>{paymentMethod === 'razorpay' ? 'Online Payment (Razorpay)' : 'Cash on Delivery'}</p>

              <div className="d-flex gap-3 mt-5">
                <button onClick={() => setStep(2)} className="btn btn-outline flex-1">
                  Back
                </button>
                <button
                  onClick={createOrder}
                  disabled={loading}
                  className="btn btn-primary flex-1"
                >
                  {loading ? 'Processing...' : 'Place Order'} <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="cart-summary">
          <div className="card summary-card">
            <h3 className="summary-title mb-3">Order Summary</h3>

            <div className="summary-section mb-3">
              <h4 className="summary-subtitle">Items ({cart.items.length})</h4>
              {cart.items.map(item => (
                <div key={item._id} className="summary-item text-muted">
                  <span>
                    {item.product.name.substring(0, 20)}... x {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="divider my-3"></div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>

            {discount > 0 && (
              <div className="summary-row text-success">
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Shipping</span>
              <span className={shipping_charge === 0 ? 'text-success' : ''}>
                {shipping_charge === 0 ? 'FREE' : formatPrice(shipping_charge)}
              </span>
            </div>

            <div className="divider my-3"></div>

            <div className="summary-row total-row">
              <span>Total Amount</span>
              <span>{formatPrice(finalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          margin: 2rem 0;
          flex-wrap: wrap;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .step.active {
          opacity: 1;
          color: #2563eb;
        }

        .step-number {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 2px solid currentColor;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .step.active .step-number {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        .step-label {
          font-size: 0.85rem;
          font-weight: 500;
        }

        .step-connector {
          width: 60px;
          height: 2px;
          background: #e5e7eb;
          margin: 25px 0;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .payment-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .payment-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .payment-option:hover {
          border-color: #2563eb;
          background: rgba(37, 99, 235, 0.05);
        }

        .payment-option input[type="radio"] {
          cursor: pointer;
        }

        .payment-option input[type="radio"]:checked {
          accent-color: #2563eb;
        }

        .coupon-input {
          display: flex;
          gap: 0.5rem;
        }

        .address-summary {
          background: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          line-height: 1.8;
        }

        .address-summary p {
          margin: 0.25rem 0;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .checkout-steps {
            gap: 1rem;
          }

          .step-connector {
            width: 30px;
            margin: 15px 0;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Checkout;
