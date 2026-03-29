import { create } from 'zustand';
import { User } from '@/types';

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => {
    set({ user });
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  login: async (email: string, _password: string) => {
    set({ loading: true, error: null });
    try {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
      };
      get().setUser(mockUser);
      localStorage.setItem('authToken', `token_${Date.now()}`);
    } catch (error) {
      set({ error: 'Login failed' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    get().setUser(null);
    localStorage.removeItem('authToken');
    set({ error: null });
  },

  register: async (name: string, email: string, _password: string) => {
    set({ loading: true, error: null });
    try {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
      };
      get().setUser(mockUser);
      localStorage.setItem('authToken', `token_${Date.now()}`);
    } catch (error) {
      set({ error: 'Registration failed' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  isAuthenticated: () => {
    return get().user !== null;
  },
}));
