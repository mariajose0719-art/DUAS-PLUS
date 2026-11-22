import { useEffect, useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

function Lupa() {
  const { lupaActiva } = useTheme();
  const [posicion, setPosicion] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const lupaRef = useRef(null);

  useEffect(() => {
    if (!lupaActiva) {
      setVisible(false);
      return;
    }

    const handleMouseMove = (e) => {
      setPosicion({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [lupaActiva]);

  if (!lupaActiva || !visible) return null;

  // El tamaño de la lupa
  const size = 150;
  const zoom = 1.8;

  return (
    <div
      ref={lupaRef}
      style={{
        position: 'fixed',
        width: size,
        height: size,
        borderRadius: '50%',
        border: '2px solid var(--color-primary)',
        boxShadow: '0 0 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.2)',
        pointerEvents: 'none',
        zIndex: 9999,
        left: posicion.x - size / 2,
        top: posicion.y - size / 2,
        background: 'var(--color-fondo-card)',
        backdropFilter: 'blur(4px)',
        overflow: 'hidden',
        transition: 'all 0.05s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'var(--color-fondo)',
          transform: `scale(${zoom}) translate(${-(posicion.x - size/2) / zoom}px, ${-(posicion.y - size/2) / zoom}px)`,
          transformOrigin: 'center',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'calc(var(--tamano-fuente) * 2)',
          color: 'var(--color-texto)',
        }}
      >
        {/* Aquí se vería el contenido ampliado, pero con CSS puro no podemos duplicar el contenido fácilmente.
            En su lugar, usaremos un efecto de zoom con un espejo del contenido usando un div con el mismo contenido */}
        <span style={{ opacity: 0.3 }}>🔍</span>
      </div>
      {/* Línea de mira */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '2px',
        height: '20px',
        background: 'var(--color-primary)',
        transform: 'translate(-50%, -50%)',
        opacity: 0.5,
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '20px',
        height: '2px',
        background: 'var(--color-primary)',
        transform: 'translate(-50%, -50%)',
        opacity: 0.5,
      }} />
    </div>
  );
}

export default Lupa;