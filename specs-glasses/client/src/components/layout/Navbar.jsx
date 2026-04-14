import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">👓</span>
            <span className="font-semibold text-xl tracking-tight text-gray-900">Visio</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/products" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Shop</Link>
            <Link to="/products?category=men" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Men</Link>
            <Link to="/products?category=women" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Women</Link>
            <Link to="/products?category=sunglasses" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Sunglasses</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Admin</Link>
                )}
                <Link to="/orders" className="text-sm text-gray-600 hover:text-gray-900">Orders</Link>
                <Link to="/wishlist" className="text-sm text-gray-600 hover:text-gray-900">Wishlist</Link>
                <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900">Logout</button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">Login</Link>
                <Link to="/register" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors">Sign up</Link>
              </div>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 flex flex-col gap-3">
            <Link to="/products" className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Shop All</Link>
            <Link to="/products?category=men" className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Men</Link>
            <Link to="/products?category=women" className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Women</Link>
            <Link to="/products?category=sunglasses" className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Sunglasses</Link>
            {user ? (
              <>
                {user.role === 'admin' && <Link to="/admin" className="text-sm text-blue-600" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
                <Link to="/orders" className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>My Orders</Link>
                <Link to="/wishlist" className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Wishlist</Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-sm text-left text-gray-700">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Sign up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
