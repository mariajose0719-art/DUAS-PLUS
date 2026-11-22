import { useState, useRef, useEffect } from 'react';
import { useAccessibility, DALTONISMO } from '../context/AccessibilityContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Accessibility, 
  X, 
  ZoomIn, 
  ZoomOut, 
  Type, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff,
  Contrast,
  Moon,
  Sun,
  Palette,
  Mic,
  Move
} from 'lucide-react';

function AccessibilityToolbar() {
  const { modoOscuro } = useTheme();
  const {
    lupaActiva, setLupaActiva,
    zoom, setZoom,
    tamanoFuente, setTamanoFuente,
    lectorActivo, setLectorActivo,
    modoLecturaContinua, setModoLecturaContinua,
    modoDaltonismo, setModoDaltonismo,
    altoContraste, setAltoContraste,
    leerTexto,
    detenerLectura,
  } = useAccessibility();

  const [abierto, setAbierto] = useState(false);

  // Posición del botón (se guarda en localStorage)
  const [posicion, setPosicion] = useState(() => {
    const saved = localStorage.getItem('accessibility-position');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { x: window.innerWidth - 100, y: window.innerHeight - 200 };
      }
    }
    return { x: window.innerWidth - 100, y: window.innerHeight - 200 };
  });

  // Ref para arrastre
  const contenedorRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);

  // Guardar posición en localStorage
  useEffect(() => {
    localStorage.setItem('accessibility-position', JSON.stringify(posicion));
  }, [posicion]);

  // Manejadores de arrastre
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const rect = contenedorRef.current?.getBoundingClientRect();
    if (!rect) return;
    isDragging.current = true;
    hasDragged.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasDragged.current = true;
    }
    let newX = e.clientX - offset.current.x;
    let newY = e.clientY - offset.current.y;
    const ancho = abierto ? 340 : 56;
    const alto = abierto ? 520 : 56;
    newX = Math.max(0, Math.min(window.innerWidth - ancho, newX));
    newY = Math.max(0, Math.min(window.innerHeight - alto, newY));
    setPosicion({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Manejar clic
  const handleClick = () => {
    if (hasDragged.current) {
      hasDragged.current = false;
      return;
    }
    setAbierto(!abierto);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Funciones de herramientas
  const toggleLupa = () => {
    setLupaActiva(!lupaActiva);
    if (!lupaActiva) setZoom(1.2);
  };

  const cambiarZoom = (delta) => {
    const nuevoZoom = Math.min(Math.max(zoom + delta, 0.8), 2.0);
    setZoom(nuevoZoom);
  };

  const cambiarTamanioFuente = (delta) => {
    const nuevo = Math.min(Math.max(tamanoFuente + delta, 12), 28);
    setTamanoFuente(nuevo);
  };

  const toggleLector = () => {
    setLectorActivo(!lectorActivo);
    if (!lectorActivo) {
      leerTexto('Modo lector activado. Puedes seleccionar texto o activar la lectura continua.');
    } else {
      detenerLectura();
    }
  };

  const toggleModoLecturaContinua = () => {
    setModoLecturaContinua(!modoLecturaContinua);
    if (!modoLecturaContinua) {
      leerTexto('Modo de lectura continua activado. Pasa el cursor sobre cualquier texto para leerlo.');
    } else {
      detenerLectura();
    }
  };

  const toggleAltoContraste = () => {
    setAltoContraste(!altoContraste);
  };

  const cambiarDaltonismo = (tipo) => {
    setModoDaltonismo(modoDaltonismo === tipo ? DALTONISMO.NINGUNO : tipo);
  };

  const leerSeleccion = () => {
    const seleccion = window.getSelection().toString().trim();
    if (seleccion) {
      leerTexto(seleccion);
    } else {
      alert('Selecciona algún texto primero.');
    }
  };

  const opcionesDaltonismo = [
    { key: DALTONISMO.PROTANOPIA, label: 'Protanopía (rojo-verde)' },
    { key: DALTONISMO.DEUTERANOPIA, label: 'Deuteranopía (rojo-verde)' },
    { key: DALTONISMO.TRITANOPIA, label: 'Tritanopía (azul-amarillo)' },
    { key: DALTONISMO.MONOCROMATISMO, label: 'Monocromatismo' },
  ];

  // Estilos dinámicos
  const bgColor = modoOscuro ? 'var(--color-fondo-card)' : 'rgba(255,255,255,0.95)';
  const textColor = modoOscuro ? 'var(--color-texto)' : '#1a1a1a';
  const borderColor = modoOscuro ? 'var(--color-borde)' : 'rgba(0,0,0,0.08)';
  const shadow = modoOscuro ? 'var(--sombra)' : '0 20px 60px rgba(0,0,0,0.15)';

  return (
    <div
      ref={contenedorRef}
      style={{
        position: 'fixed',
        left: posicion.x,
        top: posicion.y,
        zIndex: 1001,
        userSelect: 'none',
        touchAction: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      {/* Botón flotante */}
      <div
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-primary), #2e9a6e)',
          border: 'none',
          boxShadow: '0 8px 32px rgba(46,154,110,0.4)',
          cursor: 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          transition: 'box-shadow 0.3s, transform 0.2s',
          position: 'relative',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(46,154,110,0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(46,154,110,0.4)';
        }}
      >
        {abierto ? <X size={28} strokeWidth={2} /> : <Accessibility size={28} strokeWidth={2} />}
        <div style={{
          position: 'absolute',
          bottom: '-4px',
          right: '-4px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '50%',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <Move size={14} strokeWidth={1.5} color="rgba(255,255,255,0.7)" />
        </div>
      </div>

      {/* Menú de accesibilidad (aparece justo debajo del botón) */}
      {abierto && (
        <div style={{
          marginTop: '12px',
          width: '340px',
          maxHeight: '480px',
          overflowY: 'auto',
          background: bgColor,
          backdropFilter: 'blur(16px)',
          borderRadius: '24px',
          padding: '18px 20px',
          border: `1px solid ${borderColor}`,
          boxShadow: shadow,
          color: textColor,
          fontFamily: 'var(--fuente)',
          transition: 'background 0.3s, color 0.3s, border 0.3s',
          animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <h3 style={{
            fontSize: 'calc(var(--tamano-fuente) * 1.0625)',
            fontWeight: '600',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: textColor
          }}>
            <Accessibility size={20} strokeWidth={1.5} color="var(--color-primary)" />
            Herramientas de accesibilidad
          </h3>

          {/* Lupa */}
          <div style={{ marginBottom: '10px' }}>
            <button
              onClick={toggleLupa}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 10px',
                background: lupaActiva ? 'rgba(46,154,110,0.15)' : 'transparent',
                border: `1px solid ${borderColor}`,
                borderRadius: '10px',
                width: '100%',
                color: textColor,
                cursor: 'pointer',
                fontFamily: 'var(--fuente)',
                fontSize: 'var(--tamano-fuente)',
                transition: 'all 0.2s'
              }}
            >
              <ZoomIn size={18} strokeWidth={1.5} color="var(--color-primary)" />
              <span style={{ flex: 1, textAlign: 'left' }}>Lupa {lupaActiva ? '(activada)' : ''}</span>
              {lupaActiva && (
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); cambiarZoom(-0.1); }}
                    style={{ background: 'transparent', border: 'none', color: textColor, cursor: 'pointer' }}
                  >
                    <ZoomOut size={14} strokeWidth={1.5} />
                  </button>
                  <span style={{ minWidth: '35px', textAlign: 'center', fontSize: 'calc(var(--tamano-fuente) * 0.8125)' }}>{Math.round(zoom * 100)}%</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); cambiarZoom(0.1); }}
                    style={{ background: 'transparent', border: 'none', color: textColor, cursor: 'pointer' }}
                  >
                    <ZoomIn size={14} strokeWidth={1.5} />
                  </button>
                </div>
              )}
            </button>
          </div>

          {/* Tamaño de fuente */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 10px',
              background: 'transparent',
              border: `1px solid ${borderColor}`,
              borderRadius: '10px',
            }}>
              <Type size={18} strokeWidth={1.5} color="var(--color-primary)" />
              <span style={{ flex: 1, fontSize: 'var(--tamano-fuente)' }}>Tamaño de letra</span>
              <button
                onClick={() => cambiarTamanioFuente(-2)}
                style={{ background: 'transparent', border: 'none', color: textColor, cursor: 'pointer', padding: '2px 6px' }}
              >
                A-
              </button>
              <span style={{ minWidth: '35px', textAlign: 'center', fontSize: 'calc(var(--tamano-fuente) * 0.8125)' }}>{tamanoFuente}px</span>
              <button
                onClick={() => cambiarTamanioFuente(2)}
                style={{ background: 'transparent', border: 'none', color: textColor, cursor: 'pointer', padding: '2px 6px' }}
              >
                A+
              </button>
            </div>
          </div>

          {/* Lector de voz */}
          <div style={{ marginBottom: '10px' }}>
            <button
              onClick={toggleLector}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 10px',
                background: lectorActivo ? 'rgba(46,154,110,0.15)' : 'transparent',
                border: `1px solid ${borderColor}`,
                borderRadius: '10px',
                width: '100%',
                color: textColor,
                cursor: 'pointer',
                fontFamily: 'var(--fuente)',
                fontSize: 'var(--tamano-fuente)',
                transition: 'all 0.2s'
              }}
            >
              <Volume2 size={18} strokeWidth={1.5} color="var(--color-primary)" />
              <span style={{ flex: 1, textAlign: 'left' }}>Lector de voz {lectorActivo ? '(activo)' : ''}</span>
            </button>
            {lectorActivo && (
              <div style={{ marginTop: '4px', paddingLeft: '12px' }}>
                <button
                  onClick={toggleModoLecturaContinua}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 10px',
                    background: modoLecturaContinua ? 'rgba(46,154,110,0.15)' : 'transparent',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '8px',
                    color: textColor,
                    cursor: 'pointer',
                    fontFamily: 'var(--fuente)',
                    fontSize: 'calc(var(--tamano-fuente) * 0.8125)',
                    width: '100%',
                    transition: 'all 0.2s'
                  }}
                >
                  <Mic size={14} strokeWidth={1.5} color="var(--color-primary)" />
                  <span>Lectura continua (hover)</span>
                  <span style={{ marginLeft: 'auto' }}>{modoLecturaContinua ? '✅' : '❌'}</span>
                </button>
                <button
                  onClick={leerSeleccion}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 10px',
                    background: 'transparent',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '8px',
                    color: textColor,
                    cursor: 'pointer',
                    fontFamily: 'var(--fuente)',
                    fontSize: 'calc(var(--tamano-fuente) * 0.8125)',
                    width: '100%',
                    marginTop: '4px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Volume2 size={14} strokeWidth={1.5} color="var(--color-primary)" />
                  <span>Leer texto seleccionado</span>
                </button>
              </div>
            )}
          </div>

          {/* Alto contraste */}
          <div style={{ marginBottom: '10px' }}>
            <button
              onClick={toggleAltoContraste}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 10px',
                background: altoContraste ? 'rgba(46,154,110,0.15)' : 'transparent',
                border: `1px solid ${borderColor}`,
                borderRadius: '10px',
                width: '100%',
                color: textColor,
                cursor: 'pointer',
                fontFamily: 'var(--fuente)',
                fontSize: 'var(--tamano-fuente)',
                transition: 'all 0.2s'
              }}
            >
              <Contrast size={18} strokeWidth={1.5} color="var(--color-primary)" />
              <span style={{ flex: 1, textAlign: 'left' }}>Alto contraste {altoContraste ? '(activado)' : ''}</span>
            </button>
          </div>

          {/* Daltonismo */}
          <div style={{ marginBottom: '0' }}>
            <div style={{
              padding: '6px 10px',
              background: 'transparent',
              border: `1px solid ${borderColor}`,
              borderRadius: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <Palette size={18} strokeWidth={1.5} color="var(--color-primary)" />
                <span style={{ flex: 1, fontSize: 'var(--tamano-fuente)' }}>Modo daltonismo</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {opcionesDaltonismo.map((op) => (
                  <button
                    key={op.key}
                    onClick={() => cambiarDaltonismo(op.key)}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '100px',
                      border: modoDaltonismo === op.key ? '2px solid var(--color-primary)' : `1px solid ${borderColor}`,
                      background: modoDaltonismo === op.key ? 'rgba(46,154,110,0.15)' : 'transparent',
                      color: textColor,
                      cursor: 'pointer',
                      fontSize: 'calc(var(--tamano-fuente) * 0.6875)',
                      fontFamily: 'var(--fuente)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {op.label}
                  </button>
                ))}
                <button
                  onClick={() => setModoDaltonismo(DALTONISMO.NINGUNO)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '100px',
                    border: modoDaltonismo === DALTONISMO.NINGUNO ? '2px solid var(--color-primary)' : `1px solid ${borderColor}`,
                    background: modoDaltonismo === DALTONISMO.NINGUNO ? 'rgba(46,154,110,0.15)' : 'transparent',
                    color: textColor,
                    cursor: 'pointer',
                    fontSize: 'calc(var(--tamano-fuente) * 0.6875)',
                    fontFamily: 'var(--fuente)',
                    transition: 'all 0.2s'
                  }}
                >
                  Normal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

export default AccessibilityToolbar;