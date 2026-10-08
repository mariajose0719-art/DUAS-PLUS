// src/components/AccessibilityBar.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { ZoomIn, Type, Contrast, Mic, EyeOff, Palette } from 'lucide-react';

function AccessibilityBar() {
  const { herramientas, setHerramientas, configuracionFinal } = useTheme();

  const toggleHerramienta = (key) => {
    setHerramientas(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const setFiltro = (filtro) => {
    setHerramientas(prev => ({
      ...prev,
      filtro: filtro
    }));
  };

  const ajustarZoom = (delta) => {
    setHerramientas(prev => ({
      ...prev,
      zoom: Math.min(2, Math.max(0.8, prev.zoom + delta))
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--color-fondo-card)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--color-borde)',
      borderRadius: '50px',
      padding: '12px 24px',
      boxShadow: 'var(--sombra)',
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      zIndex: 1000,
      transition: 'all 0.3s ease'
    }}>
      {/* Lupa */}
      <button onClick={() => toggleHerramienta('lupaActiva')} style={{ background: 'transparent', border: 'none', color: 'var(--color-texto)', cursor: 'pointer' }}>
        <ZoomIn size={20} strokeWidth={1.5} color={herramientas.lupaActiva ? 'var(--color-primary)' : 'inherit'} />
      </button>
      {/* Zoom + / - */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button onClick={() => ajustarZoom(-0.1)} style={{ background: 'transparent', border: 'none', color: 'var(--color-texto)', cursor: 'pointer' }}>-</button>
        <span style={{ fontSize: '14px', color: 'var(--color-texto)' }}>{Math.round(herramientas.zoom * 100)}%</span>
        <button onClick={() => ajustarZoom(0.1)} style={{ background: 'transparent', border: 'none', color: 'var(--color-texto)', cursor: 'pointer' }}>+</button>
      </div>
      {/* Lector de texto */}
      <button onClick={() => toggleHerramienta('lectorActivo')} style={{ background: 'transparent', border: 'none', color: 'var(--color-texto)', cursor: 'pointer' }}>
        <Mic size={20} strokeWidth={1.5} color={herramientas.lectorActivo ? 'var(--color-primary)' : 'inherit'} />
      </button>
      {/* Filtros de daltonismo */}
      <div style={{ position: 'relative', display: 'flex', gap: '8px' }}>
        <button onClick={() => setFiltro('protanopia')} style={{ background: 'transparent', border: 'none', color: 'var(--color-texto)', cursor: 'pointer' }}>
          <Palette size={20} strokeWidth={1.5} color={herramientas.filtro === 'protanopia' ? 'var(--color-primary)' : 'inherit'} />
        </button>
        {/* Añadir más botones para deuteranopia, tritanopia, etc. */}
      </div>
      {/* Alto contraste */}
      <button onClick={() => toggleHerramienta('altoContraste')} style={{ background: 'transparent', border: 'none', color: 'var(--color-texto)', cursor: 'pointer' }}>
        <Contrast size={20} strokeWidth={1.5} color={herramientas.altoContraste ? 'var(--color-primary)' : 'inherit'} />
      </button>
    </div>
  );
}

export default AccessibilityBar;