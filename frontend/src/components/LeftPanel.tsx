'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Type, Shapes, Image, Layout, Upload, Square, Circle, Minus, Triangle, Star } from 'lucide-react';
import { Button } from './ui/Button';
import { templates } from '@/data/templates';

interface LeftPanelProps {
  canvas: any;
  onAddText?: () => void;
  onAddShape?: (shape: string) => void;
  onAddImage?: () => void;
  onAddTemplate?: (template: any) => void;
}

const FONT_OPTIONS = [
  'Inter', 'Arial', 'Georgia', 'Courier New', 'Times New Roman',
  'Verdana', 'Trebuchet MS', 'Impact', 'Comic Sans MS',
];

const TEXT_PRESETS = [
  { label: 'Heading', fontSize: 36, fontWeight: 'bold' },
  { label: 'Subheading', fontSize: 24, fontWeight: '600' },
  { label: 'Body Text', fontSize: 16, fontWeight: 'normal' },
  { label: 'Caption', fontSize: 12, fontWeight: 'normal' },
];

const SHAPE_COLORS = ['#0066CC', '#FF6600', '#1A1A2E', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899'];

export const LeftPanel: React.FC<LeftPanelProps> = ({
  canvas,
  onAddText,
  onAddShape,
  onAddImage,
  onAddTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'text' | 'shapes' | 'images' | 'backgrounds'>('templates');
  const [selectedColor, setSelectedColor] = useState('#0066CC');
  const fabricRef = useRef<any>(null);

  useEffect(() => {
    import('fabric').then((mod) => {
      fabricRef.current = mod.fabric || mod.default || mod;
    });
  }, []);

  const getFabric = () => fabricRef.current;

  const handleAddText = (preset?: typeof TEXT_PRESETS[0]) => {
    const fabric = getFabric();
    if (!canvas || !fabric) return;
    const text = new fabric.IText(preset ? preset.label : 'New Text', {
      left: 100 + Math.random() * 100,
      top: 100 + Math.random() * 100,
      fontSize: preset?.fontSize || 20,
      fontWeight: preset?.fontWeight || 'normal',
      fill: '#1A1A2E',
      fontFamily: 'Inter, sans-serif',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    onAddText?.();
  };

  const handleAddShape = (shape: string) => {
    const fabric = getFabric();
    if (!canvas || !fabric) return;

    let obj: any;
    const baseProps = {
      left: 150 + Math.random() * 100,
      top: 150 + Math.random() * 100,
      fill: selectedColor,
    };

    switch (shape) {
      case 'rect':
        obj = new fabric.Rect({ ...baseProps, width: 120, height: 80, rx: 4, ry: 4 });
        break;
      case 'square':
        obj = new fabric.Rect({ ...baseProps, width: 100, height: 100 });
        break;
      case 'circle':
        obj = new fabric.Circle({ ...baseProps, radius: 50 });
        break;
      case 'triangle':
        obj = new fabric.Triangle({ ...baseProps, width: 100, height: 100 });
        break;
      case 'line':
        obj = new fabric.Line([50, 50, 250, 50], {
          left: baseProps.left,
          top: baseProps.top,
          stroke: selectedColor,
          strokeWidth: 3,
        });
        break;
      case 'ellipse':
        obj = new fabric.Ellipse({ ...baseProps, rx: 80, ry: 50 });
        break;
      case 'polygon':
        // Star shape
        const points = [];
        const outerRadius = 50;
        const innerRadius = 25;
        for (let i = 0; i < 10; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (Math.PI / 5) * i - Math.PI / 2;
          points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
        }
        obj = new fabric.Polygon(points, { ...baseProps });
        break;
      default:
        obj = new fabric.Rect({ ...baseProps, width: 100, height: 100 });
    }

    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.renderAll();
    onAddShape?.(shape);
  };

  const handleAddImage = () => {
    const fabric = getFabric();
    if (!fabric) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file && canvas) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          fabric.Image.fromURL(event.target.result, (img: any) => {
            // Scale image to fit canvas
            const maxWidth = 300;
            const maxHeight = 300;
            const scale = Math.min(maxWidth / (img.width || 1), maxHeight / (img.height || 1), 1);
            img.scale(scale);
            img.set({ left: 100, top: 100 });
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
            onAddImage?.();
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSetBackground = (color: string) => {
    if (!canvas) return;
    canvas.setBackgroundColor(color, () => {
      canvas.renderAll();
    });
  };

  const tabs = [
    { id: 'templates' as const, icon: Layout, label: 'Templates' },
    { id: 'text' as const, icon: Type, label: 'Text' },
    { id: 'shapes' as const, icon: Shapes, label: 'Shapes' },
    { id: 'images' as const, icon: Image, label: 'Images' },
  ];

  return (
    <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-print7-primary text-print7-primary bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-print7-dark">Design Templates</h3>
            <p className="text-xs text-gray-500">Click a template to apply it to your canvas</p>
            <div className="grid grid-cols-2 gap-3">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => onAddTemplate?.(template)}
                  className="relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-print7-primary transition-all group aspect-[4/3]"
                >
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600 px-2 text-center">{template.name}</span>
                  </div>
                  <div className="absolute inset-0 bg-print7-primary/0 group-hover:bg-print7-primary/20 transition-all flex items-center justify-center">
                    <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-print7-primary px-2 py-1 rounded">
                      Use
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text Tab */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-print7-dark">Add Text</h3>

            <div className="space-y-2">
              {TEXT_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleAddText(preset)}
                  className="w-full text-left p-3 rounded-lg border-2 border-gray-200 hover:border-print7-primary hover:bg-blue-50 transition-all"
                >
                  <span style={{ fontSize: Math.min(preset.fontSize, 22), fontWeight: preset.fontWeight as any }}>
                    {preset.label}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">{preset.fontSize}px</span>
                </button>
              ))}
            </div>

            <div className="border-t pt-4">
              <Button variant="primary" size="md" className="w-full" onClick={() => handleAddText()}>
                <Type size={16} className="mr-2" />
                Add Custom Text
              </Button>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Font Family</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {FONT_OPTIONS.map(font => (
                  <button
                    key={font}
                    onClick={() => {
                      if (!canvas) return;
                      const active = canvas.getActiveObject();
                      if (active && active.type?.includes('text')) {
                        active.set({ fontFamily: font });
                        canvas.renderAll();
                      }
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm transition-colors"
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Shapes Tab */}
        {activeTab === 'shapes' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-print7-dark">Add Shapes</h3>

            {/* Color picker */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Shape Color</h4>
              <div className="flex flex-wrap gap-2">
                {SHAPE_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      selectedColor === color ? 'border-gray-800 scale-110 ring-2 ring-offset-1 ring-gray-400' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'rect', icon: Square, label: 'Rectangle' },
                { id: 'square', icon: Square, label: 'Square' },
                { id: 'circle', icon: Circle, label: 'Circle' },
                { id: 'triangle', icon: Triangle, label: 'Triangle' },
                { id: 'ellipse', icon: Circle, label: 'Ellipse' },
                { id: 'line', icon: Minus, label: 'Line' },
                { id: 'polygon', icon: Star, label: 'Star' },
              ].map(shape => (
                <button
                  key={shape.id}
                  onClick={() => handleAddShape(shape.id)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-gray-200 hover:border-print7-primary hover:bg-blue-50 transition-all"
                >
                  <shape.icon size={24} style={{ color: selectedColor }} />
                  <span className="text-xs text-gray-600">{shape.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-print7-dark">Images</h3>

            <Button variant="primary" size="md" className="w-full" onClick={handleAddImage}>
              <Upload size={16} className="mr-2" />
              Upload Image
            </Button>

            <p className="text-xs text-gray-500">
              Supports JPG, PNG, SVG, and GIF formats. Max 10MB.
            </p>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Background Color</h4>
              <div className="grid grid-cols-4 gap-2">
                {['#ffffff', '#f5f5f5', '#1A1A2E', '#0066CC', '#FF6600', '#10B981', '#F59E0B', '#EF4444',
                  '#fef3c7', '#dbeafe', '#ede9fe', '#fce7f3'].map(color => (
                  <button
                    key={color}
                    onClick={() => handleSetBackground(color)}
                    className="w-full aspect-square rounded-lg border-2 border-gray-300 hover:border-print7-primary transition-all hover:scale-105"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
