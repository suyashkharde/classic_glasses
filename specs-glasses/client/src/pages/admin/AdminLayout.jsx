import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: '📊' },
  { label: 'Products', path: '/admin/products', icon: '👓' },
  { label: 'Orders', path: '/admin/orders', icon: '📦' },
  { label: 'Add Product', path: '/admin/products/new', icon: '➕' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">👓</span>
            <span className="font-semibold text-gray-900">Visio Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${location.pathname === item.path ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2">{user.name}</p>
          <button onClick={() => { logout(); navigate('/'); }}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
