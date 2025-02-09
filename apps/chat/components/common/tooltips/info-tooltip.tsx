'use client';

import { useState, useCallback, useRef } from 'react';
import { cn } from '@/lib';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface InfoTooltipProps {
  position?: 'top' | 'bottom' | 'left' | 'right';
  content: string;
  className?: string;
}

export function InfoTooltip({ position = 'bottom', content, className }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 767px)');

  const handleMouseEnter = useCallback(() => {
    // Only for desktop
    if (!isMobile) {
      setIsVisible(true);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Only for desktop
    if (!isMobile) {
      setIsVisible(false);
    }
  }, []);

  const handleClick = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible]);

  const tooltipPositions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
  };

  return (
    <div className="relative inline-block" ref={tooltipRef}>
      <div
        className={cn(
          'flex h-5 w-5 cursor-help items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-semibold text-gray-500 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700',
          isVisible && 'border-gray-400 bg-gray-50 text-gray-700',
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsVisible(!isVisible);
          }
        }}
      >
        i
      </div>
      {/* Tooltip */}
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 transform md:w-max md:max-w-sm',
            '-right-2 left-auto w-[280px] max-w-[calc(100vw-3rem)] md:left-1/2 md:right-auto md:-translate-x-1/2',
            'md:static md:absolute',
            {
              [tooltipPositions[position]]: true,
            }
          )}
        >
          <div className="rounded-lg bg-gray-900/95 px-4 py-2.5 text-sm text-white shadow-xl">
            <div className="whitespace-pre-wrap">{content}</div>
          </div>
        </div>
      )}
    </div>
  );
}
