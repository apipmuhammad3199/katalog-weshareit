import { create } from 'zustand';

const useCartStore = create((set) => ({
  cart: {}, // { itemId: quantity }
  
  updateQuantity: (itemId, delta) =>
    set((state) => {
      const currentQuantity = state.cart[itemId] || 0;
      const newQuantity = currentQuantity + delta;
      
      const newCart = { ...state.cart };
      
      if (newQuantity <= 0) {
        delete newCart[itemId];
      } else {
        newCart[itemId] = newQuantity;
      }
      
      return { cart: newCart };
    }),

  clearCart: () => set({ cart: {} }),
}));

export default useCartStore;
