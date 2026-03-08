import { create } from 'zustand';
import axios from 'axios';

export const useStore = create((set) => ({
    user: null, // { _id, name, email, token }
    cart: [],
    restaurants: [],

    // Auth Modal State
    isAuthModalOpen: false,
    authMode: 'login', // 'login' or 'signup'
    openAuthModal: (mode = 'login') => set({ isAuthModalOpen: true, authMode: mode }),
    closeAuthModal: () => set({ isAuthModalOpen: false }),

    // Auth Actions
    setUser: (user) => {
        if (user) localStorage.setItem('user', JSON.stringify(user));
        else localStorage.removeItem('user');
        set({ user });
    },
    logout: () => {
        localStorage.removeItem('user');
        set({ user: null, cart: [] });
    },
    login: async (email, password) => {
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(data));
            set({ user: data, isAuthModalOpen: false });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    },
    register: async (name, email, password) => {
        try {
            const { data } = await axios.post('/api/auth/register', { name, email, password });
            localStorage.setItem('user', JSON.stringify(data));
            set({ user: data, isAuthModalOpen: false });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    },

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
