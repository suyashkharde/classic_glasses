import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import api from '../api/axios';
import toast from 'react-hot-toast';

const INITIAL_ADDRESS = { fullName: '', address: '', city: '', state: '', pincode: '', phone: '' };

export default function Checkout() {
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [address, setAddress] = useState(INITIAL_ADDRESS);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const finalTotal = subtotal - discount;

  if (!user) {
    navigate('/login');
    return null;
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleCoupon = async () => {
    try {
      const { data } = await api.post('/orders/coupon', { code: coupon });
      const disc = Math.round((subtotal * data.discountPercent) / 100);
      setDiscount(disc);
      setCouponApplied(data.code);
      toast.success(`Coupon applied! ${data.discountPercent}% off`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    for (const key of Object.keys(INITIAL_ADDRESS)) {
      if (!address[key]) return toast.error('Please fill all address fields');
    }
    setLoading(true);
    try {
      const orderItems = items.map((i) => ({ product: i._id, quantity: i.quantity }));
      const { data } = await api.post('/orders/create', {
        items: orderItems,
        shippingAddress: address,
        couponCode: couponApplied,
      });

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Visio Eyewear',
        description: 'Order Payment',
        order_id: data.razorpayOrderId,
        handler: async (response) => {
          try {
            await api.post('/orders/verify', {
              orderId: data.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            clearCart();
            toast.success('Payment successful!');
            navigate(`/orders/${data.orderId}`);
          } catch {
            toast.error('Payment verification failed');
          }
        },
        prefill: { name: user.name, email: user.email, contact: address.phone },
        theme: { color: '#111827' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => toast.error('Payment failed. Please try again.'));
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handlePayment}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Address */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-semibold text-gray-900 mb-5">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
                  <input className={inputClass} placeholder="John Doe" value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">Address</label>
                  <input className={inputClass} placeholder="Street address, apartment, etc." value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">City</label>
                  <input className={inputClass} placeholder="Mumbai" value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">State</label>
                  <input className={inputClass} placeholder="Maharashtra" value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Pincode</label>
                  <input className={inputClass} placeholder="400001" value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Phone</label>
                  <input className={inputClass} placeholder="+91 98765 43210" value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24 space-y-4">
              <h2 className="font-semibold text-gray-900">Order Summary</h2>
              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between text-gray-600">
                    <span className="truncate mr-2">{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="border-t border-gray-100 pt-4">
                <label className="text-xs text-gray-500 mb-1 block">Coupon Code</label>
                <div className="flex gap-2">
                  <input className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                    placeholder="FIRST10" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                  <button type="button" onClick={handleCoupon}
                    className="bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-sm hover:bg-gray-200 transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({couponApplied})</span><span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span><span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 text-base pt-2 border-t border-gray-100">
                  <span>Total</span><span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-gray-900 text-white py-3 rounded-full font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                ) : (
                  <>Pay ₹{finalTotal.toLocaleString()} with Razorpay</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Load Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" />
    </div>
  );
}
