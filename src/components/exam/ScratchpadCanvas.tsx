import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Eraser, Trash2, X } from 'lucide-react';

interface ScratchpadCanvasProps {
  isActive: boolean;
  onClose: () => void;
}

export const ScratchpadCanvas: React.FC<ScratchpadCanvasProps> = ({ isActive, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState<string>('#34d399'); // emerald-400

  useEffect(() => {
    if (isActive && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isActive]);

  if (!isActive) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (tool === 'pen') {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.globalCompositeOperation = 'source-over';
    } else {
      ctx.lineWidth = 20;
      ctx.globalCompositeOperation = 'destination-out';
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="absolute inset-0 z-30 pointer-events-auto flex flex-col justify-between">
      {/* Floating Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 p-2 rounded-2xl shadow-2xl flex items-center space-x-3 z-40 backdrop-blur-md">
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setTool('pen')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
              tool === 'pen' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Pencil className="w-4 h-4" />
            <span>Pen</span>
          </button>

          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
              tool === 'eraser' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eraser className="w-4 h-4" />
            <span>Eraser</span>
          </button>
        </div>

        {/* Color Palette */}
        {tool === 'pen' && (
          <div className="flex items-center space-x-1.5 border-l border-slate-800 pl-3">
            {['#34d399', '#2dd4bf', '#f59e0b', '#ef4444', '#ffffff'].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-5 h-5 rounded-full border border-slate-700 ${color === c ? 'scale-125 border-white' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}

        <div className="flex items-center space-x-2 border-l border-slate-800 pl-3">
          <button
            onClick={clearCanvas}
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            title="Clear Scratchpad"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* HTML5 Canvas Surface */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full h-full cursor-crosshair bg-slate-950/20"
      />
    </div>
  );
};
