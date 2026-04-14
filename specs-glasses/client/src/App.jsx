import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Wishlist from './pages/Wishlist';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import ProductForm from './pages/admin/ProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import useAuthStore from './store/authStore';
import useWishlistStore from './store/wishlistStore';

export default function App() {
  const { user } = useAuthStore();
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const clearWishlist = useWishlistStore((s) => s.clear);

  useEffect(() => {
    if (user) fetchWishlist();
    else clearWishlist();
  }, [user]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: '12px', fontSize: '14px', fontFamily: 'Inter, sans-serif' },
          success: { iconTheme: { primary: '#111827', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main layout */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/products" element={<Layout><Products /></Layout>} />
        <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />
        <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
        <Route path="/orders" element={<Layout><Orders /></Layout>} />
        <Route path="/orders/:id" element={<Layout><OrderDetail /></Layout>} />
        <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />

        {/* Admin */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<ProductForm />} />
        <Route path="/admin/products/:id/edit" element={<ProductForm />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
      </Routes>
    </BrowserRouter>
  );
}
