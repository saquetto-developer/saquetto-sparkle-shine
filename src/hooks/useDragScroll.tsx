import { useRef, useEffect, useState } from 'react';

interface DragScrollOptions {
  direction?: 'horizontal' | 'vertical' | 'both';
  smooth?: boolean;
}

export function useDragScroll(options: DragScrollOptions = {}) {
  const { direction = 'horizontal', smooth = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setStartX(e.pageX - element.offsetLeft);
      setStartY(e.pageY - element.offsetTop);
      setScrollLeft(element.scrollLeft);
      setScrollTop(element.scrollTop);
      setVelocity({ x: 0, y: 0 });
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const x = e.pageX - element.offsetLeft;
      const y = e.pageY - element.offsetTop;
      
      if (direction === 'horizontal' || direction === 'both') {
        const walkX = (x - startX) * 2;
        element.scrollLeft = scrollLeft - walkX;
        setVelocity(prev => ({ ...prev, x: walkX }));
      }
      
      if (direction === 'vertical' || direction === 'both') {
        const walkY = (y - startY) * 2;
        element.scrollTop = scrollTop - walkY;
        setVelocity(prev => ({ ...prev, y: walkY }));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      
      // Momentum scrolling
      if (smooth && (Math.abs(velocity.x) > 1 || Math.abs(velocity.y) > 1)) {
        const currentVelocity = { ...velocity };
        
        const momentum = () => {
          const friction = 0.95;
          currentVelocity.x *= friction;
          currentVelocity.y *= friction;
          
          if (direction === 'horizontal' || direction === 'both') {
            element.scrollLeft -= currentVelocity.x;
          }
          
          if (direction === 'vertical' || direction === 'both') {
            element.scrollTop -= currentVelocity.y;
          }
          
          if (Math.abs(currentVelocity.x) > 0.5 || Math.abs(currentVelocity.y) > 0.5) {
            animationRef.current = requestAnimationFrame(momentum);
          }
        };
        
        animationRef.current = requestAnimationFrame(momentum);
      }
    };

    const handleMouseLeave = () => {
      setIsDragging(false);
    };

    element.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('mouseleave', handleMouseLeave);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging, startX, startY, scrollLeft, scrollTop, velocity, direction, smooth]);

  return {
    ref,
    isDragging,
    className: isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
  };
}
