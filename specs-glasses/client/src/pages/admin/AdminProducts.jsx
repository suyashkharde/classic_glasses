import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../../api/axios';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const CATEGORIES = ['', 'men', 'women', 'sunglasses', 'computer-glasses', 'lenses', 'frames'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // filters
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');
  const [stockFilter, setStockFilter] = useState('');

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 10 });
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (stockFilter === 'instock') params.set('minPrice', '0');
    api.get(`/products?${params}`)
      .then(({ data }) => {
        let results = data.products;
        if (stockFilter === 'instock') results = results.filter(p => p.stock > 0);
        if (stockFilter === 'outofstock') results = results.filter(p => p.stock === 0);
        setProducts(results);
        setPages(data.pages);
        setTotal(data.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search, category, stockFilter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleCategoryChange = (val) => {
    setCategory(val);
    setPage(1);
  };

  const handleStockChange = (val) => {
    setStockFilter(val);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setSearchInput('');
    setCategory('');
    setStockFilter('');
    setPage(1);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const hasFilters = search || category || stockFilter;

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">{total} total products</p>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          + Add Product
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-5">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[220px]">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Category filter */}
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-gray-400 bg-white text-gray-700 min-w-[150px]"
          >
            <option value="">All Categories</option>
            {CATEGORIES.filter(Boolean).map((c) => (
              <option key={c} value={c}>{c.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
            ))}
          </select>

          {/* Stock filter */}
          <select
            value={stockFilter}
            onChange={(e) => handleStockChange(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-gray-400 bg-white text-gray-700 min-w-[140px]"
          >
            <option value="">All Stock</option>
            <option value="instock">In Stock</option>
            <option value="outofstock">Out of Stock</option>
          </select>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-400 hover:text-gray-700 px-3 py-2 rounded-xl border border-gray-200 hover:border-gray-400 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Active filter tags */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            {search && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">
                Search: "{search}"
                <button onClick={() => { setSearch(''); setSearchInput(''); }} className="hover:text-red-500">✕</button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full capitalize">
                {category.replace('-', ' ')}
                <button onClick={() => setCategory('')} className="hover:text-red-500">✕</button>
              </span>
            )}
            {stockFilter && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">
                {stockFilter === 'instock' ? 'In Stock' : 'Out of Stock'}
                <button onClick={() => setStockFilter('')} className="hover:text-red-500">✕</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Product</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Category</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Price</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Stock</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Featured</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0] || 'https://placehold.co/40x40/f5f5f5/999?text=G'}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-50 flex-shrink-0"
                      />
                      <span className="font-medium text-gray-900 truncate max-w-[180px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500 capitalize">{p.category.replace('-', ' ')}</td>
                  <td className="px-5 py-3 text-gray-900 font-medium">₹{p.price.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {p.stock > 0 ? p.stock : 'Out'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {p.isFeatured
                      ? <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">Featured</span>
                      : <span className="text-xs text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/admin/products/${p._id}/edit`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-sm font-medium text-gray-500">No products found</p>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-blue-500 hover:underline mt-1">
                  Clear filters
                </button>
              )}
            </div>
          )}

          {pages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${page === i + 1 ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-600 hover:border-gray-400'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
