const router = require('express').Router();
const {
  createRazorpayOrder, verifyPayment, getMyOrders, getOrder,
  getAllOrders, updateOrderStatus, validateCoupon,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/create', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);
router.post('/coupon', protect, validateCoupon);
router.get('/my', protect, getMyOrders);
router.get('/all', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
