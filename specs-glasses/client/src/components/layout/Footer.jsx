import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">👓</span>
              <span className="text-white font-semibold text-lg">Visio</span>
            </div>
            <p className="text-sm leading-relaxed">Premium eyewear for every style. Crafted with precision, designed for life.</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products?category=men" className="hover:text-white transition-colors">Men</Link></li>
              <li><Link to="/products?category=women" className="hover:text-white transition-colors">Women</Link></li>
              <li><Link to="/products?category=sunglasses" className="hover:text-white transition-colors">Sunglasses</Link></li>
              <li><Link to="/products?category=computer-glasses" className="hover:text-white transition-colors">Computer Glasses</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><span>support@visio.com</span></li>
              <li><span>+91 98765 43210</span></li>
              <li><span>Mon–Sat, 9am–6pm</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs">
          © {new Date().getFullYear()} Visio Eyewear. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
