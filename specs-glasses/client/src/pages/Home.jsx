import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ui/ProductCard';
import SkeletonCard from '../components/ui/SkeletonCard';

const categories = [
  { label: 'Men', value: 'men', emoji: '🕶️', desc: 'Bold frames for him' },
  { label: 'Women', value: 'women', emoji: '👓', desc: 'Elegant styles for her' },
  { label: 'Sunglasses', value: 'sunglasses', emoji: '😎', desc: 'UV protection, all day' },
  { label: 'Computer Glasses', value: 'computer-glasses', emoji: '💻', desc: 'Blue light blocking' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?featured=true&limit=8')
      .then(({ data }) => setFeatured(data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-4">New Collection 2025</p>
            <h1 className="text-5xl md:text-6xl font-light leading-tight mb-6">
              See the world<br />
              <span className="font-semibold">in style.</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Premium eyewear crafted for every face. From classic frames to modern sunglasses — find your perfect pair.
            </p>
            <div className="flex gap-4">
              <Link
                to="/products"
                className="bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </Link>
              <Link
                to="/products?category=sunglasses"
                className="border border-white/30 text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-colors"
              >
                Sunglasses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              to={`/products?category=${cat.value}`}
              className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-center"
            >
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <h3 className="font-medium text-gray-900 mb-1">{cat.label}</h3>
              <p className="text-xs text-gray-500">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
            : featured.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
        {!loading && featured.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No featured products yet.</p>
            <Link to="/products" className="text-sm text-gray-900 underline mt-2 inline-block">Browse all products</Link>
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="bg-blue-50 border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Free shipping on orders over ₹999</h2>
          <p className="text-gray-500 text-sm">Use code <span className="font-medium text-blue-600">FIRST10</span> for 10% off your first order</p>
        </div>
      </section>
    </div>
  );
}
