import { create } from 'zustand';

const loadCart = () => {
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
};

const saveCart = (items) => localStorage.setItem('cart', JSON.stringify(items));

const useCartStore = create((set, get) => ({
  items: loadCart(),

  addItem: (product, quantity = 1) => {
    const items = get().items;
    const existing = items.find((i) => i._id === product._id);
    let updated;
    if (existing) {
      updated = items.map((i) =>
        i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i
      );
    } else {
      updated = [...items, { ...product, quantity }];
    }
    saveCart(updated);
    set({ items: updated });
  },

  removeItem: (id) => {
    const updated = get().items.filter((i) => i._id !== id);
    saveCart(updated);
    set({ items: updated });
  },

  updateQuantity: (id, quantity) => {
    if (quantity < 1) return;
    const updated = get().items.map((i) => (i._id === id ? { ...i, quantity } : i));
    saveCart(updated);
    set({ items: updated });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  get total() {
    return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  },

  get count() {
    return get().items.reduce((sum, i) => sum + i.quantity, 0);
  },
}));

export default useCartStore;
