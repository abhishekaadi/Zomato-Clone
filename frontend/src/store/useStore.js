import { create } from 'zustand';

export const useStore = create((set) => ({
    user: null, // { _id, name, email, token }
    cart: [],
    restaurants: [],

    // Auth
    setUser: (user) => set({ user }),
    logout: () => set({ user: null, cart: [] }),

    // Cart
    addToCart: (item) => set((state) => {
        const existing = state.cart.find(i => i._id === item._id);
        if (existing) {
            return {
                cart: state.cart.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i)
            };
        }
        return { cart: [...state.cart, { ...item, quantity: 1 }] };
    }),
    removeFromCart: (itemId) => set((state) => ({
        cart: state.cart.filter(i => i._id !== itemId)
    })),
    updateQuantity: (itemId, qty) => set((state) => ({
        cart: state.cart.map(i => i._id === itemId ? { ...i, quantity: qty } : i)
    })),
    clearCart: () => set({ cart: [] }),

    // Restaurants
    setRestaurants: (restaurants) => set({ restaurants }),
}));
