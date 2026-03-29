'use client';

import React, { useState, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DesignCanvas } from '@/components/DesignCanvas';
import { ToolBar } from '@/components/ToolBar';
import { LeftPanel } from '@/components/LeftPanel';
import { RightPanel } from '@/components/RightPanel';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';
import { useDesignStore } from '@/store/designStore';
import { products } from '@/data/products';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

function StudioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get('productId');

  const product = productId ? products.find(p => p.id === productId) : null;
  const canvas = useRef<any>(null);
  const [canvasState, setCanvasState] = useState<any>(null);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const addItem = useCartStore(state => state.addItem);
  const createDesign = useDesignStore(state => state.createDesign);
  const updateDesignCanvas = useDesignStore(state => state.updateDesignCanvas);

  const handleCanvasChange = useCallback((newCanvas: any) => {
    canvas.current = newCanvas;
    setCanvasState(newCanvas);

    // Save state for undo
    if (newCanvas) {
      try {
        const json = JSON.stringify(newCanvas.toJSON());
        setUndoStack(prev => [...prev.slice(-20), json]);
        setRedoStack([]);
      } catch {}
    }
  }, []);

  const saveDesign = async () => {
    if (!canvas.current) return;

    setIsSaving(true);
    try {
      const canvasData = JSON.stringify(canvas.current.toJSON());
      const name = product ? `${product.name} Design` : 'Untitled Design';
      const design = createDesign(product?.id || 'general', name);
      updateDesignCanvas(design.id, canvasData);
      toast.success('Design saved successfully!');
    } catch {
      toast.error('Failed to save design');
    } finally {
      setIsSaving(false);
    }
  };

  const addToCart = async () => {
    if (!canvas.current) {
      toast.error('Please create a design first');
      return;
    }
    if (!product) {
      toast.error('Please select a product first to add to cart');
      return;
    }

    try {
      const canvasData = JSON.stringify(canvas.current.toJSON());
      const design = createDesign(product.id, `${product.name} Design`);
      updateDesignCanvas(design.id, canvasData);

      addItem(product, {
        size: product.sizes?.[0] || '',
        color: product.colors?.[0] || '',
        material: product.material || '',
        quantity: 1,
      }, design.id);

      toast.success('Design added to cart!');
      setTimeout(() => router.push('/cart'), 1000);
    } catch {
      toast.error('Failed to add design to cart');
    }
  };

  const handleUndo = () => {
    if (!canvas.current || undoStack.length < 2) return;
    const currentState = undoStack[undoStack.length - 1];
    const previousState = undoStack[undoStack.length - 2];

    setRedoStack(prev => [...prev, currentState]);
    setUndoStack(prev => prev.slice(0, -1));

    try {
      canvas.current.loadFromJSON(JSON.parse(previousState), () => {
        canvas.current.renderAll();
      });
    } catch {}
  };

  const handleRedo = () => {
    if (!canvas.current || redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];

    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, nextState]);

    try {
      canvas.current.loadFromJSON(JSON.parse(nextState), () => {
        canvas.current.renderAll();
      });
    } catch {}
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(product ? `/products/${product.category}/${product.id}` : '/products')}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-xl font-bold text-print7-dark">
              {product ? `${product.name}` : 'Print7'} — Design Studio
            </h1>
            <p className="text-xs text-gray-500">
              {product
                ? `Designing for: ${product.name} · ${product.sizes?.[0] || 'Standard'}`
                : 'Create a custom design from scratch'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push('/products')}>
            Cancel
          </Button>
          <Button variant="secondary" size="sm" onClick={saveDesign} isLoading={isSaving}>
            Save Design
          </Button>
          <Button variant="primary" size="sm" onClick={addToCart} disabled={!product}>
            {product ? 'Add to Cart' : 'Select Product First'}
          </Button>
        </div>
      </div>

      {/* Product Selection Banner (if no product) */}
      {!product && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-sm text-blue-700 flex items-center justify-between shrink-0">
          <span>You&apos;re designing freely. To add to cart, start from a product page.</span>
          <Button variant="ghost" size="sm" onClick={() => router.push('/products')} className="text-blue-700 hover:text-blue-900">
            Browse Products →
          </Button>
        </div>
      )}

      {/* Toolbar */}
      <ToolBar
        canvas={canvasState}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={saveDesign}
      />

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel canvas={canvasState} />

        <div className="flex-1 overflow-auto bg-gray-100">
          <DesignCanvas
            onCanvasChange={handleCanvasChange}
            width={800}
            height={600}
          />
        </div>

        <RightPanel canvas={canvasState} />
      </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-print7-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Design Studio...</p>
        </div>
      </div>
    }>
      <StudioContent />
    </Suspense>
  );
}
