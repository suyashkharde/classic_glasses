import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ui/ProductCard';
import SkeletonCard from '../components/ui/SkeletonCard';

const CATEGORIES = ['men', 'women', 'sunglasses', 'computer-glasses', 'lenses', 'frames'];
const FRAME_TYPES = ['full-rim', 'half-rim', 'rimless'];
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const frameType = searchParams.get('frameType') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = Number(searchParams.get('page') || 1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (frameType) params.set('frameType', frameType);
      if (sort) params.set('sort', sort);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      params.set('page', page);
      params.set('limit', 12);
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, frameType, sort, minPrice, maxPrice, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setFilter = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const clearFilters = () => setSearchParams({});

  const Filters = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
        <div className="space-y-2">
          <button onClick={() => setFilter('category', '')} className={`block text-sm w-full text-left px-3 py-1.5 rounded-lg transition-colors ${!category ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>All</button>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setFilter('category', c)} className={`block text-sm w-full text-left px-3 py-1.5 rounded-lg capitalize transition-colors ${category === c ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
              {c.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Frame Type</h3>
        <div className="space-y-2">
          {FRAME_TYPES.map((f) => (
            <button key={f} onClick={() => setFilter('frameType', frameType === f ? '' : f)} className={`block text-sm w-full text-left px-3 py-1.5 rounded-lg capitalize transition-colors ${frameType === f ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setFilter('minPrice', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
          <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setFilter('maxPrice', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
        </div>
      </div>
      <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-900 underline">Clear all filters</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {category ? category.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'All Products'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{total} products</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="md:hidden flex items-center gap-2 text-sm border border-gray-200 px-3 py-2 rounded-lg" onClick={() => setSidebarOpen(true)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
            Filters
          </button>
          <select value={sort} onChange={(e) => setFilter('sort', e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400 bg-white">
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-52 flex-shrink-0">
          <Filters />
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="bg-black/40 flex-1" onClick={() => setSidebarOpen(false)} />
            <div className="bg-white w-72 p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold">Filters</h2>
                <button onClick={() => setSidebarOpen(false)}>✕</button>
              </div>
              <Filters />
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {loading
              ? [...Array(12)].map((_, i) => <SkeletonCard key={i} />)
              : products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>

          {!loading && products.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-lg font-medium text-gray-600">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {[...Array(pages)].map((_, i) => (
                <button key={i} onClick={() => setFilter('page', i + 1)}
                  className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${page === i + 1 ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
