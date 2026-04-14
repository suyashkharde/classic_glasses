import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import useWishlistStore from '../store/wishlistStore';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { user } = useAuthStore();
  const toggle = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.ids.includes(id));

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addItem(product, qty);
    toast.success(`${qty} item(s) added to cart`);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to review');
    setSubmitting(true);
    try {
      await api.post(`/products/${id}/reviews`, reviewForm);
      toast.success('Review submitted');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner size="lg" />;
  if (!product) return <div className="text-center py-20 text-gray-500">Product not found.</div>;

  const images = product.images?.length ? product.images : ['https://placehold.co/600x600/f5f5f5/999?text=Glasses'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8 flex gap-2">
        <Link to="/" className="hover:text-gray-700">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-gray-700">Products</Link>
        <span>/</span>
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4 group cursor-zoom-in">
            <img
              src={images[selectedImg]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${selectedImg === i ? 'border-gray-900' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">{product.category}</p>
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500">{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-semibold text-gray-900">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                <span className="bg-green-100 text-green-700 text-sm px-2 py-0.5 rounded-full font-medium">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Specs */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Frame Type</span>
              <span className="text-gray-900 capitalize">{product.frameType}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Stock</span>
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-500'}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Quantity + Cart */}
          {product.stock > 0 ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors">−</button>
                <span className="px-4 py-2 text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors">+</button>
              </div>
              <button onClick={handleAddToCart}
                className="flex-1 bg-gray-900 text-white py-3 rounded-full font-medium hover:bg-gray-700 transition-colors">
                Add to Cart
              </button>
              {/* Wishlist */}
              <button
                onClick={() => toggle(product._id, user)}
                title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`p-3 rounded-full border transition-all duration-200 hover:scale-110 ${
                  isWishlisted ? 'bg-red-50 border-red-200' : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <svg
                  className={`w-5 h-5 transition-colors duration-200 ${isWishlisted ? 'text-red-500' : 'text-gray-400'}`}
                  fill={isWishlisted ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth={isWishlisted ? 0 : 1.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          ) : (
            <button disabled className="w-full bg-gray-200 text-gray-400 py-3 rounded-full font-medium cursor-not-allowed">
              Out of Stock
            </button>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-4 mb-8">
            {product.reviews.map((r) => (
              <div key={r._id} className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-gray-900">{r.name}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Review Form */}
        {user && (
          <form onSubmit={handleReview} className="bg-gray-50 rounded-2xl p-6 max-w-lg">
            <h3 className="font-medium text-gray-900 mb-4">Write a Review</h3>
            <div className="mb-4">
              <label className="text-sm text-gray-600 mb-1 block">Rating</label>
              <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 bg-white">
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="text-sm text-gray-600 mb-1 block">Comment</label>
              <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                rows={3} required placeholder="Share your experience..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none" />
            </div>
            <button type="submit" disabled={submitting}
              className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
