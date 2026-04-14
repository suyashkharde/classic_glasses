import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-700 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Shopping Cart ({items.length} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4">
              <img
                src={item.images?.[0] || 'https://placehold.co/100x100/f5f5f5/999?text=Glasses'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl bg-gray-50 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-xs text-gray-400 capitalize mt-0.5">{item.category}</p>
                  </div>
                  <button onClick={() => { removeItem(item._id); toast.success('Removed from cart'); }}
                    className="text-gray-300 hover:text-red-400 transition-colors ml-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-50 text-sm">−</button>
                    <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-50 text-sm">+</button>
                  </div>
                  <span className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => { clearCart(); toast.success('Cart cleared'); }}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors">
            Clear cart
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm mb-4">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-gray-600">
                  <span className="truncate mr-2">{item.name} × {item.quantity}</span>
                  <span className="flex-shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Shipping calculated at checkout</p>
            </div>
            <Link to="/checkout"
              className="block w-full bg-gray-900 text-white text-center py-3 rounded-full font-medium hover:bg-gray-700 transition-colors">
              Proceed to Checkout
            </Link>
            <Link to="/products" className="block text-center text-sm text-gray-500 hover:text-gray-900 mt-3 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
