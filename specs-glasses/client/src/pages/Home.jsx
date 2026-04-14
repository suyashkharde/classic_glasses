import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ui/ProductCard';
import SkeletonCard from '../components/ui/SkeletonCard';

const categories = [
  {
    label: 'Men',
    value: 'men',
    desc: 'Bold frames for him',
    img: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400&q=80&fit=crop',
  },
  {
    label: 'Women',
    value: 'women',
    desc: 'Elegant styles for her',
    img: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80&fit=crop',
  },
  {
    label: 'Sunglasses',
    value: 'sunglasses',
    desc: 'UV protection, all day',
    img: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400&q=80&fit=crop',
  },
  {
    label: 'Computer Glasses',
    value: 'computer-glasses',
    desc: 'Blue light blocking',
    img: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=400&q=80&fit=crop',
  },
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
      <section className="relative overflow-hidden bg-gray-950 text-white">

        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1600&q=85&fit=crop"
            alt="Eyewear hero"
            className="w-full h-full object-cover object-center opacity-40"
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />
        </div>

        {/* Floating product images — decorative */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:flex items-center justify-center pointer-events-none">
          <div className="relative w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700&q=80&fit=crop"
              alt=""
              className="absolute right-16 top-1/2 -translate-y-1/2 w-64 h-64 object-cover rounded-3xl shadow-2xl opacity-90 rotate-3"
            />
            <img
              src="https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400&q=80&fit=crop"
              alt=""
              className="absolute right-56 top-12 w-36 h-36 object-cover rounded-2xl shadow-xl opacity-80 -rotate-6"
            />
            <img
              src="https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400&q=80&fit=crop"
              alt=""
              className="absolute right-6 bottom-12 w-32 h-32 object-cover rounded-2xl shadow-xl opacity-75 rotate-6"
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 lg:py-24">
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-blue-300 text-xs font-medium tracking-widest uppercase">New Collection 2026</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-4">
              See the world<br />
              <span className="font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                in style.
              </span>
            </h1>

            <p className="text-gray-300 text-base mb-7 leading-relaxed max-w-md">
              Premium eyewear crafted for every face. From classic frames to modern sunglasses — find your perfect pair.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                to="/products"
                className="bg-white text-gray-900 px-8 py-3.5 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Shop Now
              </Link>
              <Link
                to="/products?category=sunglasses"
                className="border border-white/30 text-white px-8 py-3.5 rounded-full font-medium hover:bg-white/10 backdrop-blur-sm transition-colors"
              >
                Sunglasses →
              </Link>
            </div>

            {/* Trust badges */}
            {/* <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free Shipping over ₹999
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                100% UV Protection
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Easy 30-day Returns
              </div>
            </div> */}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#fafafa"/>
          </svg>
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
              className="group relative overflow-hidden rounded-2xl aspect-square bg-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <img
                src={cat.img}
                alt={cat.label}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-semibold text-white text-base">{cat.label}</h3>
                <p className="text-gray-300 text-xs mt-0.5">{cat.desc}</p>
              </div>
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
