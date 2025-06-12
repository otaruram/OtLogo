import { useRef, useEffect, useState, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';
import { FiRotateCcw, FiTrash2 } from 'react-icons/fi';

interface CanvasProps {
    width?: number;
    height?: number;
    onCanvasChange: (dataUrl: string) => void;
}

const Canvas = ({ width = 512, height = 512, onCanvasChange }: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isDrawing = useRef(false);
    const [history, setHistory] = useState<ImageData[]>([]);

    const getContext = () => canvasRef.current?.getContext('2d', { willReadFrequently: true });

    const saveState = () => {
        const ctx = getContext();
        if (ctx && canvasRef.current) {
            const currentImageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
            setHistory(prev => [...prev.slice(prev.length > 20 ? 1 : 0), currentImageData]);
            onCanvasChange(canvasRef.current.toDataURL('image/png'));
        }
    };
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = getContext();
        if (canvas && ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);
            const initialImageData = ctx.getImageData(0, 0, width, height);
            setHistory([initialImageData]);
            onCanvasChange(canvas.toDataURL('image/png'));
        }
    }, [width, height]);
    
    const getCanvasPoint = (e: ReactMouseEvent<HTMLCanvasElement> | ReactTouchEvent<HTMLCanvasElement> | MouseEvent | TouchEvent): { x: number, y: number } | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        const touch = "touches" in e ? e.touches[0] : e;
        return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }

    const startDrawing = (e: ReactMouseEvent<HTMLCanvasElement> | ReactTouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const ctx = getContext();
        const point = getCanvasPoint(e);
        if (ctx && point) {
            isDrawing.current = true;
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
        }
    };

    const draw = (e: ReactMouseEvent<HTMLCanvasElement> | ReactTouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing.current) return;
        e.preventDefault();
        const ctx = getContext();
        const point = getCanvasPoint(e);
        if (ctx && point) {
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        if (!isDrawing.current) return;
        const ctx = getContext();
        if (ctx) {
            ctx.closePath();
            saveState();
        }
        isDrawing.current = false;
    };
    
    const handleUndo = () => {
        const ctx = getContext();
        if (ctx && history.length > 1) {
            const newHistory = history.slice(0, -1);
            setHistory(newHistory);
            ctx.putImageData(newHistory[newHistory.length - 1], 0, 0);
            onCanvasChange(canvasRef.current!.toDataURL('image/png'));
        }
    };

    const handleClear = () => {
        const ctx = getContext();
        if (ctx && history.length > 0) {
            const initialHistory = [history[0]];
            setHistory(initialHistory);
            ctx.putImageData(initialHistory[0], 0, 0);
            onCanvasChange(canvasRef.current!.toDataURL('image/png'));
        }
    };

    return (
      <div className="relative w-full h-full">
        <canvas 
            ref={canvasRef} 
            width={width} 
            height={height} 
            className="w-full h-auto border-2 border-black rounded-lg cursor-crosshair bg-white"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
        />
        <div className="absolute top-2 right-2 space-x-2">
            <button type="button" onClick={handleUndo} className="p-2 bg-white rounded-md border-2 border-brand-text"><FiRotateCcw/></button>
            <button type="button" onClick={handleClear} className="p-2 bg-white rounded-md border-2 border-brand-text"><FiTrash2/></button>
        </div>
      </div>
    );
};

export { Canvas }; 