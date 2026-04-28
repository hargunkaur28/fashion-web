const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @POST /api/v1/orders
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, subtotal, discount, shippingCharge, totalAmount, paymentId } = req.body;

  if (!items || items.length === 0) { res.status(400); throw new Error('No items in order'); }

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentId ? 'paid' : 'pending',
    paymentId,
    subtotal,
    discount,
    shippingCharge,
    totalAmount,
    statusHistory: [{ status: 'pending', note: 'Order placed' }],
  });

  // Clear cart after order
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(201).json({ success: true, order });
});

// @GET /api/v1/orders/my
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @GET /api/v1/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  res.json({ success: true, order });
});

// ---- ADMIN ----

// @GET /api/v1/orders (admin)
const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = status ? { status } : {};
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json({ success: true, total, orders });
});

// @PUT /api/v1/orders/:id/status (admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.status = status;
  order.statusHistory.push({ status, note });
  if (status === 'delivered') order.paymentStatus = 'paid';
  await order.save();
  res.json({ success: true, order });
});

// @GET /api/v1/orders/stats (admin)
const getOrderStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);
  const statusCounts = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  const last7Days = await Order.aggregate([
    { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
    { $sort: { _id: 1 } },
  ]);
  res.json({
    success: true,
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
    statusCounts,
    last7Days,
  });
});

// @POST /api/v1/orders/track
const trackOrder = asyncHandler(async (req, res) => {
  const { orderId, email } = req.body;
  if (!orderId || !email) { res.status(400); throw new Error('Order ID and Email are required'); }
  
  // Clean the order ID (remove spaces, leading #, and force uppercase)
  const cleanOrderId = orderId.replace(/^#/, '').trim().toUpperCase();
  
  // Try to find the order by orderNumber and populate user
  const order = await Order.findOne({ orderNumber: cleanOrderId }).populate('user', 'email name');
  if (!order) { res.status(404); throw new Error('Order not found with that ID'); }

  // Verify email matches
  if (order.user.email.toLowerCase() !== email.toLowerCase()) {
    res.status(403); throw new Error('Email does not match our records for this order');
  }

  res.json({ success: true, order });
});

// @PUT /api/v1/orders/:id/return
const returnOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  
  // Verify order belongs to user
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized to return this order');
  }

  // Only delivered orders can be returned
  if (order.status !== 'delivered') {
    res.status(400); throw new Error('Only delivered orders can be returned');
  }

  order.status = 'return_requested';
  order.statusHistory.push({ status: 'return_requested', note: 'Return requested by customer pending admin approval' });
  await order.save();

  res.json({ success: true, order });
});

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, getOrderStats, trackOrder, returnOrder };
