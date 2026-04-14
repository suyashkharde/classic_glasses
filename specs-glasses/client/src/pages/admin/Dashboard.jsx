import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../api/axios';
import Spinner from '../../components/ui/Spinner';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/products?limit=1'),
      api.get('/orders/all'),
    ]).then(([prodRes, ordersRes]) => {
      const orders = ordersRes.data;
      const revenue = orders.filter((o) => o.paymentStatus === 'paid').reduce((s, o) => s + o.totalPrice, 0);
      setStats({
        totalProducts: prodRes.data.total,
        totalOrders: orders.length,
        revenue,
        pendingOrders: orders.filter((o) => o.orderStatus === 'processing').length,
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><Spinner /></AdminLayout>;

  const cards = [
    { label: 'Total Products', value: stats.totalProducts, icon: '👓', color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: 'bg-purple-50 text-purple-600' },
    { label: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: '💰', color: 'bg-green-50 text-green-600' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: '⏳', color: 'bg-yellow-50 text-yellow-600' },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 ${card.color}`}>
              {card.icon}
            </div>
            <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
