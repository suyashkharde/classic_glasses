import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import Spinner from '../components/ui/Spinner';

const STATUS_COLORS = {
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/orders/my')
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-xl font-medium text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-400 mb-6">Your orders will appear here once you make a purchase.</p>
          <Link to="/products" className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`}
              className="block bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-300 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 3).map((item, i) => (
                    <img key={i} src={item.image || 'https://placehold.co/40x40/f5f5f5/999?text=G'}
                      alt={item.name} className="w-10 h-10 rounded-lg border-2 border-white object-cover bg-gray-50" />
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-10 h-10 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <span className="font-semibold text-gray-900">₹{order.totalPrice.toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
