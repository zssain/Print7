'use client';

import React, { useState, useEffect } from 'react';
import {
  RotateCcw, RotateCw, ZoomIn, ZoomOut,
  Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight,
  Trash2, Copy, Download, Maximize
} from 'lucide-react';
import { Button } from './ui/Button';

interface ToolBarProps {
  canvas: any;
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
}

export const ToolBar: React.FC<ToolBarProps> = ({
  canvas,
  onUndo,
  onRedo,
  onSave,
}) => {
  const [zoom, setZoom] = useState(100);
  const [activeObject, setActiveObject] = useState<any>(null);

  useEffect(() => {
    if (!canvas) return;
    const updateSelection = () => setActiveObject(canvas.getActiveObject());
    canvas.on('selection:created', updateSelection);
    canvas.on('selection:updated', updateSelection);
    canvas.on('selection:cleared', () => setActiveObject(null));
    return () => {
      canvas.off('selection:created', updateSelection);
      canvas.off('selection:updated', updateSelection);
      canvas.off('selection:cleared');
    };
  }, [canvas]);

  const handleZoomIn = () => {
    if (!canvas) return;
    const newZoom = Math.min(canvas.getZoom() * 1.15, 3);
    canvas.setZoom(newZoom);
    canvas.renderAll();
    setZoom(Math.round(newZoom * 100));
  };

  const handleZoomOut = () => {
    if (!canvas) return;
    const newZoom = Math.max(canvas.getZoom() / 1.15, 0.2);
    canvas.setZoom(newZoom);
    canvas.renderAll();
    setZoom(Math.round(newZoom * 100));
  };

  const handleFitToScreen = () => {
    if (!canvas) return;
    canvas.setZoom(1);
    canvas.renderAll();
    setZoom(100);
  };

  const handleBold = () => {
    if (!canvas || !activeObject) return;
    if (activeObject.type?.includes('text')) {
      activeObject.set({ fontWeight: activeObject.fontWeight === 'bold' ? 'normal' : 'bold' });
      canvas.renderAll();
    }
  };

  const handleItalic = () => {
    if (!canvas || !activeObject) return;
    if (activeObject.type?.includes('text')) {
      activeObject.set({ fontStyle: activeObject.fontStyle === 'italic' ? 'normal' : 'italic' });
      canvas.renderAll();
    }
  };

  const handleUnderline = () => {
    if (!canvas || !activeObject) return;
    if (activeObject.type?.includes('text')) {
      activeObject.set({ underline: !activeObject.underline });
      canvas.renderAll();
    }
  };

  const handleAlign = (alignment: 'left' | 'center' | 'right') => {
    if (!canvas || !activeObject) return;
    if (activeObject.type?.includes('text')) {
      activeObject.set({ textAlign: alignment });
      canvas.renderAll();
    }
  };

  const handleDelete = () => {
    if (!canvas || !activeObject) return;
    canvas.remove(activeObject);
    canvas.renderAll();
    setActiveObject(null);
  };

  const handleDuplicate = () => {
    if (!canvas || !activeObject) return;
    activeObject.clone((cloned: any) => {
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
    });
  };

  const handleExport = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
    const link = document.createElement('a');
    link.download = 'print7-design.png';
    link.href = dataURL;
    link.click();
  };

  const isTextSelected = activeObject?.type?.includes('text');

  return (
    <div className="flex items-center gap-1 bg-white border-b border-gray-200 px-4 py-2 overflow-x-auto shrink-0">
      {/* Undo/Redo */}
      <div className="flex gap-1 border-r border-gray-200 pr-2 mr-1">
        <Button variant="ghost" size="sm" onClick={onUndo} title="Undo (Ctrl+Z)">
          <RotateCcw size={16} />
        </Button>
        <Button variant="ghost" size="sm" onClick={onRedo} title="Redo (Ctrl+Y)">
          <RotateCw size={16} />
        </Button>
      </div>

      {/* Zoom */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-1">
        <Button variant="ghost" size="sm" onClick={handleZoomOut} title="Zoom Out">
          <ZoomOut size={16} />
        </Button>
        <span className="text-xs font-mono text-gray-600 w-10 text-center">{zoom}%</span>
        <Button variant="ghost" size="sm" onClick={handleZoomIn} title="Zoom In">
          <ZoomIn size={16} />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleFitToScreen} title="Fit to Screen">
          <Maximize size={16} />
        </Button>
      </div>

      {/* Text Formatting (only when text is selected) */}
      {isTextSelected && (
        <div className="flex gap-1 border-r border-gray-200 pr-2 mr-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBold}
            title="Bold"
            className={activeObject?.fontWeight === 'bold' ? 'bg-blue-100 text-print7-primary' : ''}
          >
            <Bold size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleItalic}
            title="Italic"
            className={activeObject?.fontStyle === 'italic' ? 'bg-blue-100 text-print7-primary' : ''}
          >
            <Italic size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUnderline}
            title="Underline"
            className={activeObject?.underline ? 'bg-blue-100 text-print7-primary' : ''}
          >
            <Underline size={16} />
          </Button>
        </div>
      )}

      {/* Alignment (only when text is selected) */}
      {isTextSelected && (
        <div className="flex gap-1 border-r border-gray-200 pr-2 mr-1">
          <Button variant="ghost" size="sm" onClick={() => handleAlign('left')} title="Align Left">
            <AlignLeft size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleAlign('center')} title="Align Center">
            <AlignCenter size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleAlign('right')} title="Align Right">
            <AlignRight size={16} />
          </Button>
        </div>
      )}

      {/* Object actions (when any object is selected) */}
      {activeObject && (
        <div className="flex gap-1 border-r border-gray-200 pr-2 mr-1">
          <Button variant="ghost" size="sm" onClick={handleDuplicate} title="Duplicate">
            <Copy size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} title="Delete" className="hover:text-red-500">
            <Trash2 size={16} />
          </Button>
        </div>
      )}

      {/* Right side actions */}
      <div className="flex gap-2 ml-auto">
        <Button variant="ghost" size="sm" onClick={handleExport} title="Export as PNG">
          <Download size={16} className="mr-1" />
          Export
        </Button>
        <Button variant="secondary" size="sm" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
};
