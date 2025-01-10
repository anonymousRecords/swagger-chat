'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/index';

interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DraggableWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  position: Position;
  onPositionChange?: (position: Position) => void;
  title?: string;
  minWidth?: number;
  minHeight?: number;
}

export function DraggableWindow({
  children,
  className,
  position,
  onPositionChange,
  title = 'Window',
  minWidth = 200,
  minHeight = 150,
  ...props
}: DraggableWindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);

  const windowRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const originalPos = useRef({ x: 0, y: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0 });
  const originalSize = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStartPos.current.x;
        const deltaY = e.clientY - dragStartPos.current.y;

        onPositionChange?.({
          ...position,
          x: originalPos.current.x + deltaX,
          y: originalPos.current.y + deltaY,
        });
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStartPos.current.x;
        const deltaY = e.clientY - resizeStartPos.current.y;

        let newWidth = originalSize.current.width;
        let newHeight = originalSize.current.height;
        let newX = originalPos.current.x;
        let newY = originalPos.current.y;

        // 우측 리사이즈
        if (resizeDirection?.includes('e')) {
          newWidth = Math.max(minWidth, originalSize.current.width + deltaX);
        }
        // 좌측 리사이즈
        if (resizeDirection?.includes('w')) {
          const adjustedWidth = Math.max(minWidth, originalSize.current.width - deltaX);
          if (adjustedWidth !== newWidth) {
            newX = originalPos.current.x + (originalSize.current.width - adjustedWidth);
            newWidth = adjustedWidth;
          }
        }
        // 하단 리사이즈
        if (resizeDirection?.includes('s')) {
          newHeight = Math.max(minHeight, originalSize.current.height + deltaY);
        }
        // 상단 리사이즈
        if (resizeDirection?.includes('n')) {
          const adjustedHeight = Math.max(minHeight, originalSize.current.height - deltaY);
          if (adjustedHeight !== newHeight) {
            newY = originalPos.current.y + (originalSize.current.height - adjustedHeight);
            newHeight = adjustedHeight;
          }
        }

        onPositionChange?.({
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);
      document.body.style.cursor = 'default';
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      // 리사이징 중일 때 커서 스타일 유지
      if (isResizing) {
        document.body.style.cursor = resizeDirection?.includes('n') && resizeDirection?.includes('w')
          ? 'nw-resize'
          : resizeDirection?.includes('n') && resizeDirection?.includes('e')
          ? 'ne-resize'
          : resizeDirection?.includes('s') && resizeDirection?.includes('w')
          ? 'sw-resize'
          : resizeDirection?.includes('s') && resizeDirection?.includes('e')
          ? 'se-resize'
          : resizeDirection?.includes('n')
          ? 'n-resize'
          : resizeDirection?.includes('s')
          ? 's-resize'
          : resizeDirection?.includes('w')
          ? 'w-resize'
          : 'e-resize';
      }
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isDragging, isResizing, resizeDirection, minWidth, minHeight, onPositionChange]);

  const startDragging = (e: React.MouseEvent) => {
    const headerElement = (e.target as HTMLElement).closest('.draggable-header');
    if (headerElement) {
      setIsDragging(true);
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      originalPos.current = { x: position.x, y: position.y };
    }
  };

  const startResizing = (direction: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    resizeStartPos.current = { x: e.clientX, y: e.clientY };
    originalSize.current = { width: position.width, height: position.height };
    originalPos.current = { x: position.x, y: position.y };
  };

  return (
    <div
      ref={windowRef}
      className={cn(
        'fixed bg-white shadow-lg rounded-lg overflow-hidden',
        'border border-gray-200',
        isDragging && 'cursor-grabbing',
        className
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: position.width,
        height: position.height,
        maxWidth: '100vw',
        boxSizing: 'border-box',
      }}
      {...props}
    >
      <div
        className="draggable-header h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4 cursor-grab"
        onMouseDown={startDragging}
      >
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      </div>

      <div className="p-4 h-[calc(100%-2.5rem)] overflow-auto">
        {children}
      </div>

      {/* Corner resize handles */}
      <div
        className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize hover:bg-gray-100/50 -translate-x-1/2 -translate-y-1/2"
        onMouseDown={startResizing('nw')}
      />
      <div
        className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize hover:bg-gray-100/50 translate-x-1/2 -translate-y-1/2"
        onMouseDown={startResizing('ne')}
      />
      <div
        className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize hover:bg-gray-100/50 -translate-x-1/2 translate-y-1/2"
        onMouseDown={startResizing('sw')}
      />
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize hover:bg-gray-100/50 translate-x-1/2 translate-y-1/2"
        onMouseDown={startResizing('se')}
      />

      {/* Edge resize handles */}
      <div
        className="absolute top-0 left-1/2 w-12 h-4 -translate-x-1/2 -translate-y-1/2 cursor-n-resize hover:bg-gray-100/50"
        onMouseDown={startResizing('n')}
      />
      <div
        className="absolute bottom-0 left-1/2 w-12 h-4 -translate-x-1/2 translate-y-1/2 cursor-s-resize hover:bg-gray-100/50"
        onMouseDown={startResizing('s')}
      />
      <div
        className="absolute left-0 top-1/2 w-4 h-12 -translate-x-1/2 -translate-y-1/2 cursor-w-resize hover:bg-gray-100/50"
        onMouseDown={startResizing('w')}
      />
      <div
        className="absolute right-0 top-1/2 w-4 h-12 translate-x-1/2 -translate-y-1/2 cursor-e-resize hover:bg-gray-100/50"
        onMouseDown={startResizing('e')}
      />
    </div>
  );
}