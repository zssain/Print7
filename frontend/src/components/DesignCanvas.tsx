'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Spinner } from './ui/Spinner';

interface DesignCanvasProps {
  onCanvasChange?: (canvas: any) => void;
  initialData?: string;
  width?: number;
  height?: number;
}

export const DesignCanvas: React.FC<DesignCanvasProps> = ({
  onCanvasChange,
  initialData,
  width = 800,
  height = 600,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fabricLoaded, setFabricLoaded] = useState(false);
  const fabricModule = useRef<any>(null);

  // Dynamically load fabric.js only on client
  useEffect(() => {
    let cancelled = false;
    import('fabric').then((mod) => {
      if (!cancelled) {
        fabricModule.current = mod.fabric || mod.default || mod;
        setFabricLoaded(true);
      }
    }).catch((err) => {
      console.error('Failed to load fabric.js:', err);
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  // Initialize canvas once fabric is loaded
  useEffect(() => {
    if (!fabricLoaded || !canvasRef.current || !fabricModule.current) return;

    const fabric = fabricModule.current;

    // Avoid double-init
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
      fabricCanvasRef.current = null;
    }

    try {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        selection: true,
        preserveObjectStacking: true,
      });

      fabricCanvasRef.current = canvas;

      canvas.on('object:added', () => onCanvasChange?.(canvas));
      canvas.on('object:modified', () => onCanvasChange?.(canvas));
      canvas.on('object:removed', () => onCanvasChange?.(canvas));

      if (initialData) {
        try {
          const data = JSON.parse(initialData);
          canvas.loadFromJSON(data, () => {
            canvas.renderAll();
            setIsLoading(false);
            onCanvasChange?.(canvas);
          });
        } catch {
          setIsLoading(false);
        }
      } else {
        // Add default starter content
        const heading = new fabric.IText('Your Design Here', {
          left: width / 2 - 150,
          top: 80,
          fontSize: 36,
          fontWeight: 'bold',
          fill: '#1A1A2E',
          fontFamily: 'Inter, sans-serif',
        });

        const subtext = new fabric.IText('Click to edit text, add shapes & images', {
          left: width / 2 - 190,
          top: 140,
          fontSize: 18,
          fill: '#666666',
          fontFamily: 'Inter, sans-serif',
        });

        // Add a decorative rectangle
        const rect = new fabric.Rect({
          left: width / 2 - 200,
          top: 50,
          width: 400,
          height: 150,
          fill: 'transparent',
          stroke: '#0066CC',
          strokeWidth: 2,
          rx: 8,
          ry: 8,
        });

        // Logo placeholder circle
        const circle = new fabric.Circle({
          left: width / 2 - 30,
          top: 260,
          radius: 30,
          fill: '#0066CC',
        });

        const logoText = new fabric.IText('P7', {
          left: width / 2 - 17,
          top: 272,
          fontSize: 24,
          fontWeight: 'bold',
          fill: '#ffffff',
          fontFamily: 'Inter, sans-serif',
        });

        canvas.add(rect, heading, subtext, circle, logoText);
        canvas.renderAll();
        setIsLoading(false);
        onCanvasChange?.(canvas);
      }

      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    } catch (err) {
      console.error('Canvas init error:', err);
      setIsLoading(false);
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fabricLoaded, width, height]);

  return (
    <div className="flex justify-center items-center bg-gray-100 p-8 overflow-auto min-h-[400px] relative">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
          <Spinner />
          <p className="mt-4 text-gray-500 text-sm">Loading Design Studio...</p>
        </div>
      )}
      <div className="shadow-2xl rounded-lg overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};
