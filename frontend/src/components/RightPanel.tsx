'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Copy, ArrowUp, ArrowDown, Lock, Unlock, Eye, EyeOff, Layers } from 'lucide-react';
import { Button } from './ui/Button';

interface RightPanelProps {
  canvas: any;
}

export const RightPanel: React.FC<RightPanelProps> = ({ canvas }) => {
  const [activeObject, setActiveObject] = useState<any>(null);
  const [fillColor, setFillColor] = useState('#000000');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [fontSize, setFontSize] = useState(20);
  const [objects, setObjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'properties' | 'layers'>('properties');

  useEffect(() => {
    if (!canvas) return;

    const updateSelection = () => {
      const active = canvas.getActiveObject();
      setActiveObject(active || null);
      if (active) {
        setFillColor((active.fill as string) || '#000000');
        setStrokeColor((active.stroke as string) || '#000000');
        setStrokeWidth(active.strokeWidth || 0);
        setOpacity(active.opacity ?? 1);
        if (active.fontSize) setFontSize(active.fontSize);
      }
    };

    const updateLayers = () => {
      setObjects([...canvas.getObjects()].reverse());
    };

    canvas.on('selection:created', updateSelection);
    canvas.on('selection:updated', updateSelection);
    canvas.on('selection:cleared', () => setActiveObject(null));
    canvas.on('object:added', updateLayers);
    canvas.on('object:removed', updateLayers);
    canvas.on('object:modified', updateLayers);

    // Initial layer list
    updateLayers();

    return () => {
      canvas.off('selection:created', updateSelection);
      canvas.off('selection:updated', updateSelection);
      canvas.off('selection:cleared');
      canvas.off('object:added', updateLayers);
      canvas.off('object:removed', updateLayers);
      canvas.off('object:modified', updateLayers);
    };
  }, [canvas]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setFillColor(color);
    if (activeObject) {
      activeObject.set({ fill: color });
      canvas?.renderAll();
    }
  };

  const handleStrokeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setStrokeColor(color);
    if (activeObject) {
      activeObject.set({ stroke: color });
      canvas?.renderAll();
    }
  };

  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value);
    setStrokeWidth(width);
    if (activeObject) {
      activeObject.set({ strokeWidth: width });
      canvas?.renderAll();
    }
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const op = parseFloat(e.target.value);
    setOpacity(op);
    if (activeObject) {
      activeObject.set({ opacity: op });
      canvas?.renderAll();
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value);
    setFontSize(size);
    if (activeObject && activeObject.type?.includes('text')) {
      activeObject.set({ fontSize: size });
      canvas?.renderAll();
    }
  };

  const handleDelete = () => {
    if (activeObject && canvas) {
      canvas.remove(activeObject);
      canvas.renderAll();
      setActiveObject(null);
    }
  };

  const handleDuplicate = () => {
    if (activeObject && canvas) {
      activeObject.clone((cloned: any) => {
        cloned.set({
          left: (cloned.left || 0) + 20,
          top: (cloned.top || 0) + 20,
        });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.renderAll();
      });
    }
  };

  const bringForward = () => {
    if (activeObject && canvas) {
      canvas.bringForward(activeObject);
      canvas.renderAll();
    }
  };

  const sendBackward = () => {
    if (activeObject && canvas) {
      canvas.sendBackwards(activeObject);
      canvas.renderAll();
    }
  };

  const toggleLock = () => {
    if (activeObject && canvas) {
      const isLocked = activeObject.lockMovementX;
      activeObject.set({
        lockMovementX: !isLocked,
        lockMovementY: !isLocked,
        lockRotation: !isLocked,
        lockScalingX: !isLocked,
        lockScalingY: !isLocked,
        hasControls: isLocked,
        selectable: true,
      });
      canvas.renderAll();
      setActiveObject({ ...activeObject });
    }
  };

  const getObjectLabel = (obj: any) => {
    if (obj.type === 'i-text' || obj.type === 'text') {
      return `Text: "${(obj.text || '').substring(0, 15)}${(obj.text || '').length > 15 ? '...' : ''}"`;
    }
    if (obj.type === 'rect') return 'Rectangle';
    if (obj.type === 'circle') return 'Circle';
    if (obj.type === 'triangle') return 'Triangle';
    if (obj.type === 'ellipse') return 'Ellipse';
    if (obj.type === 'polygon') return 'Polygon';
    if (obj.type === 'line') return 'Line';
    if (obj.type === 'image') return 'Image';
    return obj.type || 'Object';
  };

  const isTextObject = activeObject?.type?.includes('text');

  return (
    <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 shrink-0">
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'properties'
              ? 'border-print7-primary text-print7-primary'
              : 'border-transparent text-gray-500'
          }`}
        >
          Properties
        </button>
        <button
          onClick={() => setActiveTab('layers')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'layers'
              ? 'border-print7-primary text-print7-primary'
              : 'border-transparent text-gray-500'
          }`}
        >
          <span className="flex items-center justify-center gap-1">
            <Layers size={14} />
            Layers ({objects.length})
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <>
            {activeObject ? (
              <div className="space-y-5">
                <div className="text-xs text-gray-500 uppercase font-semibold tracking-wide">
                  {getObjectLabel(activeObject)}
                </div>

                {/* Fill Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Fill Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={typeof fillColor === 'string' ? fillColor : '#000000'}
                      onChange={handleColorChange}
                      className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200"
                    />
                    <span className="text-xs text-gray-500 font-mono">{fillColor}</span>
                  </div>
                </div>

                {/* Stroke */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Border / Stroke</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={typeof strokeColor === 'string' ? strokeColor : '#000000'}
                      onChange={handleStrokeColorChange}
                      className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200"
                    />
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={strokeWidth}
                      onChange={handleStrokeWidthChange}
                      className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm"
                    />
                    <span className="text-xs text-gray-500">px</span>
                  </div>
                </div>

                {/* Font Size (text only) */}
                {isTextObject && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Font Size</label>
                    <input
                      type="range"
                      min="8"
                      max="120"
                      value={fontSize}
                      onChange={handleFontSizeChange}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-600">{fontSize}px</span>
                  </div>
                )}

                {/* Opacity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={opacity}
                    onChange={handleOpacityChange}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{Math.round(opacity * 100)}%</span>
                </div>

                {/* Layer Order */}
                <div className="border-t border-gray-200 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Layer Order</label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={bringForward} title="Bring Forward">
                      <ArrowUp size={14} className="mr-1" /> Forward
                    </Button>
                    <Button variant="outline" size="sm" onClick={sendBackward} title="Send Backward">
                      <ArrowDown size={14} className="mr-1" /> Back
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={handleDuplicate}>
                      <Copy size={14} className="mr-1" /> Duplicate
                    </Button>
                    <Button variant="outline" size="sm" onClick={toggleLock} title={activeObject.lockMovementX ? "Unlock" : "Lock"}>
                      {activeObject.lockMovementX ? <Lock size={14} /> : <Unlock size={14} />}
                    </Button>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full" onClick={handleDelete}>
                    <Trash2 size={14} className="mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12 text-gray-400">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Layers size={24} />
                </div>
                <p className="text-sm font-medium">No element selected</p>
                <p className="text-xs mt-1">Click on an element on the canvas to edit its properties</p>
              </div>
            )}
          </>
        )}

        {/* Layers Tab */}
        {activeTab === 'layers' && (
          <div className="space-y-1">
            {objects.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p className="text-sm">No layers yet</p>
                <p className="text-xs mt-1">Add elements to see them here</p>
              </div>
            ) : (
              objects.map((obj, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (canvas) {
                      canvas.setActiveObject(obj);
                      canvas.renderAll();
                    }
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                    activeObject === obj
                      ? 'bg-blue-50 border border-print7-primary text-print7-primary'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded border border-gray-300 shrink-0"
                    style={{ backgroundColor: typeof obj.fill === 'string' ? obj.fill : '#ccc' }}
                  />
                  <span className="truncate flex-1">{getObjectLabel(obj)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      obj.set({ visible: !obj.visible });
                      canvas?.renderAll();
                      setObjects([...objects]);
                    }}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    {obj.visible !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
