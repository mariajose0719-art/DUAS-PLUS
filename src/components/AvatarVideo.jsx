import { useState, useRef, useEffect } from 'react';
import { useAvatar } from '../context/AvatarContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Move, X, Sparkles, Play, Pause, 
  Maximize2, Minimize2, Gauge, Power
} from 'lucide-react';

function AvatarVideo() {
  const { 
    activo, toggleActivo, 
    textoActual, version, 
    reproducirTexto, detener 
  } = useAvatar();
  const { modoOscuro } = useTheme();
  const videoRef = useRef(null);
  const contenedorRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);

  const [reproduciendo, setReproduciendo] = useState(false);
  const [velocidad, setVelocidad] = useState(1);
  const [grande, setGrande] = useState(false);

  const ancho = grande ? 440 : 300;

  const [posicion, setPosicion] = useState(() => {
    const saved = localStorage.getItem('avatar-position');
    if (saved) {
      try { return JSON.parse(saved); } catch { }
    }
    return { x: window.innerWidth - 340, y: window.innerHeight - 480 };
  });

  useEffect(() => {
    localStorage.setItem('avatar-position', JSON.stringify(posicion));
  }, [posicion]);

  // ===== LISTENER DE SELECCIÓN DE TEXTO =====
  // Solo funciona si LAIA está activa
  useEffect(() => {
    if (!activo) return;

    const handleSelection = () => {
      setTimeout(() => {
        const seleccion = window.getSelection().toString().trim();
        if (seleccion) {
          reproducirTexto(seleccion);
        }
      }, 100);
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, [activo, reproducirTexto]);

  // ===== REPRODUCIR CUANDO LLEGA UN TEXTO =====
  useEffect(() => {
    if (textoActual && videoRef.current && activo) {
      const video = videoRef.current;
      video.currentTime = 0;
      video.play()
        .then(() => setReproduciendo(true))
        .catch(err => console.log('Autoplay bloqueado:', err));
    }
  }, [textoActual, version, activo]);

  // Cambiar velocidad
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = velocidad;
  }, [velocidad]);

  // ===== ARRASTRE =====
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const rect = contenedorRef.current?.getBoundingClientRect();
    if (!rect) return;
    isDragging.current = true;
    hasDragged.current = false;
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    hasDragged.current = true;
    let newX = e.clientX - offset.current.x;
    let newY = e.clientY - offset.current.y;
    newX = Math.max(0, Math.min(window.innerWidth - ancho, newX));
    newY = Math.max(0, Math.min(window.innerHeight - 100, newY));
    setPosicion({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [ancho]);

  // Click en el botón pequeño
  const handleClickBoton = () => {
    if (hasDragged.current) {
      hasDragged.current = false;
      return;
    }
    toggleActivo();
    if (activo && videoRef.current) {
      videoRef.current.pause();
      setReproduciendo(false);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (reproduciendo) {
      videoRef.current.pause();
      setReproduciendo(false);
    } else {
      videoRef.current.play()
        .then(() => setReproduciendo(true))
        .catch(err => console.log('Error:', err));
    }
  };

  const cambiarVelocidad = (v) => setVelocidad(v);
  const toggleTamano = () => setGrande(!grande);

  const isDark = modoOscuro;
  const textColor = isDark ? '#edf2f0' : '#1a1a1a';
  const textMuted = isDark ? '#a8b3b0' : '#555';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const cardBg = isDark ? 'rgba(20,24,22,0.95)' : 'rgba(255,255,255,0.95)';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';

  return (
    <div
      ref={contenedorRef}
      style={{
        position: 'fixed',
        left: posicion.x,
        top: posicion.y,
        zIndex: 1002,
        userSelect: 'none',
      }}
    >
      {/* ===== BOTÓN PEQUEÑO (cuando LAIA está apagada) ===== */}
      {!activo && (
        <div
          onMouseDown={handleMouseDown}
          onClick={handleClickBoton}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px 10px 12px',
            background: 'linear-gradient(145deg, #1a7a4a, #2e9a6e)',
            borderRadius: '100px',
            cursor: 'grab',
            color: '#fff',
            boxShadow: '0 8px 32px rgba(46,154,110,0.5)',
            position: 'relative',
            border: '2px solid rgba(255,255,255,0.1)'
          }}
        >
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Power size={18} strokeWidth={2} color="#fff" />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap' }}>
            Activar LAIA
          </span>
          <div style={{
            position: 'absolute', bottom: '-4px', right: '-4px',
            background: 'rgba(255,255,255,0.2)', borderRadius: '50%',
            padding: '2px', display: 'flex', pointerEvents: 'none'
          }}>
            <Move size={12} strokeWidth={1.5} color="rgba(255,255,255,0.7)" />
          </div>
        </div>
      )}

      {/* ===== PANEL DESPLEGADO (cuando LAIA está activa) ===== */}
      {activo && (
        <div style={{ width: `${ancho}px`, animation: 'slideInPanel 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <div
            onMouseDown={handleMouseDown}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px',
              background: 'linear-gradient(145deg, #1a7a4a, #2e9a6e)',
              borderRadius: '16px 16px 0 0',
              cursor: 'grab', color: '#fff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={14} strokeWidth={2} />
              <span style={{ fontSize: '12px', fontWeight: 700 }}>LAIA · Activa</span>
              {reproduciendo && (
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#fff', boxShadow: '0 0 8px #fff',
                  animation: 'pulse 1s infinite'
                }} />
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={(e) => { e.stopPropagation(); toggleTamano(); }}
                style={{
                  background: 'transparent', border: 'none', color: '#fff',
                  cursor: 'pointer', padding: '2px', display: 'flex', opacity: 0.85
                }}
                title={grande ? 'Reducir' : 'Agrandar'}
              >
                {grande ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  detener(); 
                  toggleActivo(); 
                }}
                style={{
                  background: 'transparent', border: 'none', color: '#fff',
                  cursor: 'pointer', padding: '2px', display: 'flex', opacity: 0.85
                }}
                title="Desactivar LAIA"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderTop: 'none',
            borderRadius: '0 0 16px 16px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '100%', aspectRatio: '1',
              background: '#2a2a2a', position: 'relative', overflow: 'hidden'
            }}>
              <video
                ref={videoRef}
                src="/videos/hola-como-estas.mp4"
                playsInline
                muted
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center', display: 'block'
                }}
                onEnded={() => setReproduciendo(false)}
              />
            </div>

            <div style={{
              display: 'flex', gap: '8px', padding: '12px 14px', alignItems: 'center'
            }}>
              <button
                onClick={togglePlay}
                style={{
                  width: '42px', height: '42px', borderRadius: '10px',
                  border: `1px solid ${borderColor}`, background: inputBg,
                  color: textColor, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                {reproduciendo ? <Pause size={18} /> : <Play size={18} />}
              </button>

              <div style={{
                flex: 1, display: 'flex', gap: '4px',
                background: inputBg, padding: '4px',
                borderRadius: '10px', border: `1px solid ${borderColor}`
              }}>
                {[1, 1.2, 2].map(v => (
                  <button
                    key={v}
                    onClick={() => cambiarVelocidad(v)}
                    style={{
                      flex: 1, padding: '8px 4px', borderRadius: '8px', border: 'none',
                      background: velocidad === v ? '#2e9a6e' : 'transparent',
                      color: velocidad === v ? '#fff' : textMuted,
                      fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px'
                    }}
                  >
                    <Gauge size={11} /> {v}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        @keyframes slideInPanel {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

export default AvatarVideo;