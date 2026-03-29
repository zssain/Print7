import { create } from 'zustand';
import { Design } from '@/types';
import { generateId } from '@/lib/utils';

interface DesignStore {
  designs: Design[];
  currentDesign: Design | null;
  createDesign: (productId: string, name: string) => Design;
  saveDesign: (design: Design) => void;
  loadDesign: (id: string) => Design | null;
  deleteDesign: (id: string) => void;
  updateDesignCanvas: (id: string, canvasData: string) => void;
  setCurrentDesign: (design: Design | null) => void;
  getUserDesigns: (userId: string) => Design[];
}

export const useDesignStore = create<DesignStore>((set, get) => ({
  designs: [],
  currentDesign: null,

  createDesign: (productId: string, name: string) => {
    const newDesign: Design = {
      id: generateId(),
      userId: 'current-user',
      name,
      thumbnail: '',
      canvasData: '{}',
      productId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set(state => ({
      designs: [...state.designs, newDesign],
      currentDesign: newDesign,
    }));

    return newDesign;
  },

  saveDesign: (design) => {
    set(state => ({
      designs: state.designs.some(d => d.id === design.id)
        ? state.designs.map(d => (d.id === design.id ? design : d))
        : [...state.designs, design],
      currentDesign: design,
    }));
  },

  loadDesign: (id: string) => {
    const design = get().designs.find(d => d.id === id);
    if (design) {
      set({ currentDesign: design });
    }
    return design || null;
  },

  deleteDesign: (id: string) => {
    set(state => ({
      designs: state.designs.filter(d => d.id !== id),
      currentDesign: state.currentDesign?.id === id ? null : state.currentDesign,
    }));
  },

  updateDesignCanvas: (id: string, canvasData: string) => {
    set(state => ({
      designs: state.designs.map(d =>
        d.id === id
          ? { ...d, canvasData, updatedAt: new Date() }
          : d
      ),
      currentDesign:
        state.currentDesign?.id === id
          ? { ...state.currentDesign, canvasData, updatedAt: new Date() }
          : state.currentDesign,
    }));
  },

  setCurrentDesign: (design) => {
    set({ currentDesign: design });
  },

  getUserDesigns: (userId: string) => {
    return get().designs.filter(d => d.userId === userId);
  },
}));
