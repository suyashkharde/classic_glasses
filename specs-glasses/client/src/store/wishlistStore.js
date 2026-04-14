import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

const useWishlistStore = create((set, get) => ({
  ids: [], // array of product _id strings

  // Call once after login to load wishlist from server
  fetchWishlist: async () => {
    try {
      const { data } = await api.get('/auth/wishlist');
      set({ ids: data.wishlist.map((p) => (typeof p === 'string' ? p : p._id)) });
    } catch {
      // not logged in — ignore
    }
  },

  toggle: async (productId, user) => {
    if (!user) {
      toast.error('Please login to use wishlist');
      return;
    }
    const isWishlisted = get().ids.includes(productId);
    // Optimistic update
    set((s) => ({
      ids: isWishlisted
        ? s.ids.filter((id) => id !== productId)
        : [...s.ids, productId],
    }));
    try {
      await api.post(`/auth/wishlist/${productId}`);
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
    } catch {
      // Revert on failure
      set((s) => ({
        ids: isWishlisted
          ? [...s.ids, productId]
          : s.ids.filter((id) => id !== productId),
      }));
      toast.error('Failed to update wishlist');
    }
  },

  isWishlisted: (productId) => get().ids.includes(productId),

  clear: () => set({ ids: [] }),
}));

export default useWishlistStore;
