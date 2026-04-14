import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/ui/Spinner';

const STATUS_STEPS = ['processing', 'shipped', 'delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner size="lg" />;
  if (!order) return <div className="text-center py-20 text-gray-500">Order not found.</div>;

  const stepIdx = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/orders" className="text-sm text-gray-500 hover:text-gray-900 mb-6 inline-block">← Back to Orders</Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Order Details</h1>
        <span className={`text-sm px-3 py-1 rounded-full font-medium ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {order.paymentStatus}
        </span>
      </div>

      {/* Progress */}
      {order.orderStatus !== 'cancelled' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100 z-0" />
            <div className="absolute top-4 left-0 h-0.5 bg-gray-900 z-0 transition-all" style={{ width: `${(stepIdx / (STATUS_STEPS.length - 1)) * 100}%` }} />
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors ${i <= stepIdx ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                  {i < stepIdx ? '✓' : i + 1}
                </div>
                <span className="text-xs text-gray-500 mt-2 capitalize">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Items</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <img src={item.image || 'https://placehold.co/60x60/f5f5f5/999?text=G'} alt={item.name}
                className="w-14 h-14 rounded-xl object-cover bg-gray-50" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-medium text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-semibold text-gray-900">
          <span>Total</span>
          <span>₹{order.totalPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="font-semibold text-gray-900 mb-3">Shipping Address</h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.address}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
          <p>{order.shippingAddress.phone}</p>
        </div>
      </div>
    </div>
  );
}
