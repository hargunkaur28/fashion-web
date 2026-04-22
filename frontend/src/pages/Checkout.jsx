import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Package, MapPin, CreditCard, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './Cart.css';
import './Checkout.css';

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
      <div className="container py-5 text-center fade-in">
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
    <div className="container mt-4 mb-5 fade-in">
      <h1 className="cart-title mb-4">Checkout</h1>

      <div className="cart-layout">
        <div className="checkout-main">
          {/* Progress Steps */}
          <div className="checkout-steps mb-5">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">{step > 1 ? <Check size={18}/> : <MapPin size={18} />}</div>
              <div className="step-label">Shipping</div>
            </div>
            <div className="step-connector"></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">{step > 2 ? <Check size={18}/> : <CreditCard size={18} />}</div>
              <div className="step-label">Payment</div>
            </div>
            <div className="step-connector"></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number"><Check size={18} /></div>
              <div className="step-label">Confirm</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="checkout-content">
            {step === 1 && (
              <div className="checkout-card reveal active">
                <h2>
                  <MapPin size={24} />
                  Shipping Details
                </h2>

                <div className="form-group mb-4">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="form-label">Flat, House no., Building, Company, Apartment *</label>
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    value={shipping.line1}
                    onChange={(e) => setShipping({ ...shipping, line1: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="form-label">Area, Street, Sector, Village</label>
                  <input
                    type="text"
                    placeholder="Address Line 2 (Optional)"
                    value={shipping.line2}
                    onChange={(e) => setShipping({ ...shipping, line2: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      placeholder="State"
                      value={shipping.state}
                      onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group mb-5">
                  <label className="form-label">Pincode *</label>
                  <input
                    type="text"
                    placeholder="6-digit Pincode"
                    value={shipping.pincode}
                    onChange={(e) => setShipping({ ...shipping, pincode: e.target.value })}
                    className="form-input"
                  />
                </div>

                <button
                  onClick={() => validateShipping() && setStep(2)}
                  className="btn btn-primary w-100 py-3"
                >
                  Proceed to Payment <ArrowRight size={18} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-card reveal active">
                <h2>
                  <CreditCard size={24} />
                  Payment Method
                </h2>

                <div className="payment-options mb-5">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Online Payment (Razorpay / UPI / Cards)</span>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Cash on Delivery (Pay at your doorstep)</span>
                  </label>
                </div>

                <div className="coupon-section">
                  <h3 className="mb-3 font-heading" style={{ fontSize: '1.2rem' }}>Apply Coupon Code</h3>
                  <div className="coupon-input d-flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. SAVE10"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                      className="form-input flex-1"
                    />
                    <button onClick={applyCoupon} className="btn btn-outline" style={{ padding: '0 1.5rem' }}>
                      Apply
                    </button>
                  </div>
                  <div className="mt-3">
                    <span className="badge featured" style={{ cursor: 'pointer' }} onClick={() => setCoupon('SAVE10')}>SAVE10</span>
                    <span className="badge trending ms-2" style={{ cursor: 'pointer' }} onClick={() => setCoupon('SAVE20')}>SAVE20</span>
                  </div>
                </div>

                <div className="d-flex gap-3 mt-5">
                  <button onClick={() => setStep(1)} className="btn btn-outline flex-1">
                    Back
                  </button>
                  <button onClick={() => setStep(3)} className="btn btn-primary flex-1">
                    Review Summary <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="checkout-card reveal active">
                <h2>
                  <Check size={24} />
                  Review & Confirm
                </h2>

                <div className="mb-4">
                  <h3 className="mb-3 font-heading" style={{ fontSize: '1.1rem' }}>Shipping to:</h3>
                  <div className="address-summary">
                    <p><strong>{shipping.fullName}</strong></p>
                    <p>{shipping.line1}, {shipping.line2}</p>
                    <p>{shipping.city}, {shipping.state} - {shipping.pincode}</p>
                    <p className="mt-2">📱 {shipping.phone}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="mb-3 font-heading" style={{ fontSize: '1.1rem' }}>Payment via:</h3>
                  <div className="payment-option" style={{ cursor: 'default' }}>
                    <CreditCard size={18} className="text-primary" />
                    <span>{paymentMethod === 'razorpay' ? 'Secure Online Payment' : 'Cash on Delivery'}</span>
                  </div>
                </div>

                <div className="d-flex gap-3 mt-5">
                  <button onClick={() => setStep(2)} className="btn btn-outline flex-1">
                    Back to Payment
                  </button>
                  <button
                    onClick={createOrder}
                    disabled={loading}
                    className="btn btn-primary flex-1"
                  >
                    {loading ? 'Processing...' : 'Complete Purchase'} <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="cart-summary">
          <div className="card summary-card reveal active">
            <h3 className="summary-title mb-4">Order Summary</h3>

            <div className="summary-items-list mb-4">
              {cart.items.map(item => (
                <div key={item._id} className="summary-item d-flex justify-between mb-2" style={{ fontSize: '0.85rem' }}>
                  <span className="text-muted">
                    {item.product.name} ({item.variantSize}) x {item.quantity}
                  </span>
                  <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="summary-details">
              <div className="summary-row">
                <span className="text-muted">Subtotal</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>

              {discount > 0 && (
                <div className="summary-row text-success">
                  <span>Discount Applied</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="summary-row">
                <span className="text-muted">Shipping Fee</span>
                <span className={shipping_charge === 0 ? 'text-success' : ''}>
                  {shipping_charge === 0 ? 'FREE' : formatPrice(shipping_charge)}
                </span>
              </div>

              <div className="divider my-4"></div>

              <div className="summary-row total-row" style={{ fontSize: '1.25rem' }}>
                <span>Total Amount</span>
                <span className="text-primary">{formatPrice(finalAmount)}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-light rounded text-center" style={{ fontSize: '0.75rem', color: '#888', background: '#fcfaf9' }}>
              🛡️ Secure 256-bit SSL encrypted checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
