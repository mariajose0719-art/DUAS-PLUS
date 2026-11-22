import { useState, useEffect, useRef } from 'react';

export function useDraggable(initialPosition, storageKey) {
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : initialPosition;
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    // Solo arrastrar con click izquierdo
    if (e.button !== 0) return;
    const rect = dragRef.current?.getBoundingClientRect();
    if (!rect) return;
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;
    // Limitar dentro de la ventana (con márgenes)
    const maxX = window.innerWidth - 70;
    const maxY = window.innerHeight - 70;
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Guardar posición al soltar
      localStorage.setItem(storageKey, JSON.stringify(position));
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Guardar posición cuando cambie (excepto durante el arrastre, se guarda al soltar)
  useEffect(() => {
    if (!isDragging) {
      localStorage.setItem(storageKey, JSON.stringify(position));
    }
  }, [position, isDragging, storageKey]);

  return { position, dragRef, handleMouseDown, isDragging };
}