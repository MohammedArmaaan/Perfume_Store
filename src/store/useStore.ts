import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../api/client';
import { CartItem, Product, User } from '../types';

interface AppState {
  user: User | null;
  token: string | null;
  cart: CartItem[];
  isLoading: boolean;
  
  // Auth Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  
  // Cart Actions
  fetchCart: () => Promise<void>;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      cart: [],
      isLoading: false,

      setUser: (user) => set({ user }),
      
      setToken: (token) => {
        set({ token });
        if (token) {
          localStorage.setItem('auth_token', token);
        } else {
          localStorage.removeItem('auth_token');
        }
      },
      
      logout: () => {
        set({ user: null, token: null, cart: [] });
        localStorage.removeItem('auth_token');
      },

      fetchCart: async () => {
        const { token } = get();
        if (!token) return; // Only fetch if logged in
        
        try {
          set({ isLoading: true });
          const response = await apiClient.get('/cart');
          set({ cart: response.data.data });
        } catch (error) {
          console.error('Failed to fetch cart', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addToCart: async (product, quantity) => {
        const { token, cart } = get();
        
        if (token) {
          // Logged in: Sync with DB
          try {
            set({ isLoading: true });
            await apiClient.post('/cart', { product_id: product.id, quantity });
            // Refresh cart
            await get().fetchCart();
          } catch (error) {
            console.error('Failed to add to cart', error);
          } finally {
            set({ isLoading: false });
          }
        } else {
          // Guest: Local state only
          const existingItem = cart.find(item => item.product.id === product.id);
          if (existingItem) {
            set({
              cart: cart.map(item => 
                item.product.id === product.id 
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            });
          } else {
            set({
              cart: [...cart, { id: Date.now(), product, quantity }]
            });
          }
        }
      },

      updateQuantity: async (itemId, quantity) => {
        const { token, cart } = get();
        
        if (token) {
          try {
            set({ isLoading: true });
            await apiClient.put(`/cart/${itemId}`, { quantity });
            await get().fetchCart();
          } catch (error) {
            console.error('Failed to update quantity', error);
          } finally {
            set({ isLoading: false });
          }
        } else {
          set({
            cart: cart.map(item => 
              item.id === itemId ? { ...item, quantity } : item
            )
          });
        }
      },

      removeFromCart: async (itemId) => {
        const { token, cart } = get();
        
        if (token) {
          try {
            set({ isLoading: true });
            await apiClient.delete(`/cart/${itemId}`);
            await get().fetchCart();
          } catch (error) {
            console.error('Failed to remove from cart', error);
          } finally {
            set({ isLoading: false });
          }
        } else {
          set({
            cart: cart.filter(item => item.id !== itemId)
          });
        }
      },
      
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'perfume-store-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        cart: state.token ? [] : state.cart // Only persist guest cart
      }),
    }
  )
);
