import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../api/axios';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/all')
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/orders/${id}/status`, { orderStatus: status });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, orderStatus: data.orderStatus } : o)));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Orders</h1>
      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Order ID</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Customer</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Total</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Payment</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{order.user?.name}</p>
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900">₹{order.totalPrice.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <select value={order.orderStatus} onChange={(e) => updateStatus(order._id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[order.orderStatus]}`}>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <div className="text-center py-12 text-gray-400">No orders yet.</div>}
        </div>
      )}
    </AdminLayout>
  );
}
