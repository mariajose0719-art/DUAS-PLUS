import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  FileText, 
  Calendar, 
  BookOpen, 
  Move 
} from 'lucide-react';

function ChatLAIA({ nombre = 'María' }) {
  const { modoOscuro } = useTheme();
  
  // Posición del botón (se guarda en localStorage)
  const [posicion, setPosicion] = useState(() => {
    const saved = localStorage.getItem('laia-position');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { x: window.innerWidth - 420, y: window.innerHeight - 300 };
      }
    }
    return { x: window.innerWidth - 420, y: window.innerHeight - 300 };
  });

  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([
    { 
      de: 'laia', 
      texto: `¡Hola ${nombre}! Soy LAIA, tu asistente personal. ¿En qué puedo ayudarte hoy?`,
      esBienvenida: true
    }
  ]);
  const [input, setInput] = useState('');
  const [mostrandoOpciones, setMostrandoOpciones] = useState(true);

  // Ref para el contenedor del botón (para arrastre)
  const contenedorRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);

  // Guardar posición en localStorage
  useEffect(() => {
    localStorage.setItem('laia-position', JSON.stringify(posicion));
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
    const ancho = abierto ? 420 : 64;
    const alto = abierto ? 600 : 64;
    newX = Math.max(0, Math.min(window.innerWidth - ancho, newX));
    newY = Math.max(0, Math.min(window.innerHeight - alto, newY));
    setPosicion({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Manejar clic en el botón
  const handleClick = () => {
    if (hasDragged.current) {
      hasDragged.current = false;
      return;
    }
    setAbierto(!abierto);
  };

  // Limpiar eventos al desmontar
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Opciones rápidas
  const opcionesRapidas = [
    { 
      id: 'resumen', 
      label: 'Resumen de la clase', 
      icon: FileText,
      color: '#2e9a6e',
      respuesta: `📚 **Resumen de la clase de hoy**\n\nVimos los fundamentos de programación, específicamente:\n- Estructuras condicionales (if/else)\n- Ciclos (for, while)\n- Funciones básicas\n\n¿Quieres que profundice en algún tema?`
    },
    { 
      id: 'taller', 
      label: 'Próximo taller', 
      icon: Calendar,
      color: '#f39c12',
      respuesta: `📅 **Próximo taller**\n\nEl Taller 2 de Accesibilidad Digital se entrega mañana. Recuerda incluir:\n- Análisis de contraste\n- Etiquetas ARIA\n- Navegación por teclado\n\n¿Necesitas ayuda con algún punto?`
    },
    { 
      id: 'recomendacion', 
      label: 'Recomendación de estudio', 
      icon: BookOpen,
      color: '#3498db',
      respuesta: `💡 **Recomendación personalizada**\n\nBasado en tu progreso, te sugiero repasar:\n1. Funciones en JavaScript (tienes 65% de avance)\n2. Diseño de interfaces accesibles\n\n¿Quieres que te prepare un resumen?`
    }
  ];

  const enviarMensaje = (texto) => {
    if (!texto.trim()) return;
    setMensajes(prev => [...prev, { de: 'usuario', texto }]);
    setMostrandoOpciones(false);
    setInput('');
    setTimeout(() => {
      let respuesta = '';
      const lower = texto.toLowerCase();
      if (lower.includes('hola') || lower.includes('buenos días')) {
        respuesta = `¡Hola ${nombre}! Me alegra verte por aquí. ¿Cómo puedo ayudarte hoy?`;
      } else if (lower.includes('resumen') || lower.includes('clase')) {
        respuesta = `📚 **Resumen de la clase de hoy**\n\nVimos los fundamentos de programación, específicamente:\n- Estructuras condicionales (if/else)\n- Ciclos (for, while)\n- Funciones básicas\n\n¿Quieres que profundice en algún tema?`;
      } else if (lower.includes('taller') || lower.includes('entrega')) {
        respuesta = `📅 **Próximo taller**\n\nEl Taller 2 de Accesibilidad Digital se entrega mañana. Recuerda incluir:\n- Análisis de contraste\n- Etiquetas ARIA\n- Navegación por teclado\n\n¿Necesitas ayuda con algún punto?`;
      } else if (lower.includes('recomendación') || lower.includes('estudiar')) {
        respuesta = `💡 **Recomendación personalizada**\n\nBasado en tu progreso, te sugiero repasar:\n1. Funciones en JavaScript (tienes 65% de avance)\n2. Diseño de interfaces accesibles\n\n¿Quieres que te prepare un resumen?`;
      } else {
        respuesta = `Entendido. Estoy procesando tu solicitud. ¿Necesitas algo más, ${nombre}?`;
      }
      setMensajes(prev => [...prev, { de: 'laia', texto: respuesta }]);
      setMostrandoOpciones(true);
    }, 1000);
  };

  const handleOpcionRapida = (opcion) => {
    setMensajes(prev => [...prev, { de: 'usuario', texto: opcion.label }]);
    setMostrandoOpciones(false);
    setTimeout(() => {
      setMensajes(prev => [...prev, { de: 'laia', texto: opcion.respuesta }]);
      setMostrandoOpciones(true);
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    enviarMensaje(input);
  };

  // Estilos dinámicos
  const bgColor = modoOscuro ? 'rgba(20,24,22,0.95)' : 'rgba(255,255,255,0.95)';
  const textColor = modoOscuro ? '#edf2f0' : '#1a1a1a';
  const borderColor = modoOscuro ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const shadow = modoOscuro ? '0 30px 80px rgba(0,0,0,0.6)' : '0 30px 80px rgba(0,0,0,0.15)';
  const inputBg = modoOscuro ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  const inputBorder = modoOscuro ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const msgBgLaia = modoOscuro ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  return (
    <div
      ref={contenedorRef}
      style={{
        position: 'fixed',
        left: posicion.x,
        top: posicion.y,
        zIndex: 999,
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
          width: '64px',
          height: '64px',
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
        {abierto ? (
          <X size={28} strokeWidth={2} />
        ) : (
          <MessageCircle size={28} strokeWidth={2} />
        )}
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

      {/* Menú del chat (aparece justo debajo del botón) */}
      {abierto && (
        <div style={{
          marginTop: '12px',
          width: '420px',
          maxHeight: '500px',
          background: bgColor,
          backdropFilter: 'blur(24px)',
          borderRadius: '24px',
          border: `1px solid ${borderColor}`,
          boxShadow: shadow,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: textColor,
          fontFamily: 'var(--fuente, Inter, sans-serif)',
          transition: 'background 0.3s, color 0.3s, border 0.3s',
          animation: 'slideUpChat 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 18px',
            borderBottom: `1px solid ${borderColor}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: modoOscuro ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary), #2e9a6e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={20} strokeWidth={1.5} color="#ffffff" />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{
                fontSize: 'calc(var(--tamano-fuente) * 0.9375)',
                fontWeight: '600',
                margin: 0,
                color: textColor
              }}>
                LAIA
              </h4>
              <p style={{
                fontSize: 'calc(var(--tamano-fuente) * 0.75)',
                color: modoOscuro ? '#6a7a75' : '#888',
                margin: 0
              }}>
                Asistente personal · En línea
              </p>
            </div>
            <Sparkles size={16} strokeWidth={1.5} color="var(--color-primary)" style={{ animation: 'pulseGlow 2s ease-in-out infinite' }} />
          </div>

          {/* Mensajes */}
          <div style={{
            flex: 1,
            padding: '14px 18px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxHeight: '320px'
          }}>
            {mensajes.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.de === 'laia' ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                animation: 'fadeInUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}>
                <div style={{
                  padding: '8px 12px',
                  borderRadius: msg.de === 'laia' ? '14px 14px 14px 4px' : '14px 14px 4px 14px',
                  background: msg.de === 'laia' 
                    ? msgBgLaia
                    : 'linear-gradient(135deg, var(--color-primary), #2e9a6e)',
                  color: msg.de === 'laia' ? textColor : '#ffffff',
                  fontSize: 'calc(var(--tamano-fuente) * 0.8125)',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  boxShadow: msg.de === 'laia' ? 'none' : '0 4px 16px rgba(46,154,110,0.2)'
                }}>
                  {msg.texto}
                </div>
              </div>
            ))}

            {mostrandoOpciones && mensajes.length > 1 && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                marginTop: '6px',
                alignSelf: 'flex-start'
              }}>
                {opcionesRapidas.map((opcion) => (
                  <button
                    key={opcion.id}
                    onClick={() => handleOpcionRapida(opcion)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 12px',
                      background: modoOscuro ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '20px',
                      color: modoOscuro ? '#a8b3b0' : '#555',
                      fontFamily: 'var(--fuente)',
                      fontSize: 'calc(var(--tamano-fuente) * 0.6875)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = modoOscuro ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
                      e.currentTarget.style.color = textColor;
                      e.currentTarget.style.transform = 'scale(1.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = modoOscuro ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
                      e.currentTarget.style.color = modoOscuro ? '#a8b3b0' : '#555';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <opcion.icon size={12} strokeWidth={1.5} color={opcion.color} />
                    {opcion.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} style={{
            padding: '10px 14px',
            borderTop: `1px solid ${borderColor}`,
            display: 'flex',
            gap: '8px',
            background: modoOscuro ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje..."
              style={{
                flex: 1,
                padding: '8px 12px',
                background: inputBg,
                border: `1px solid ${inputBorder}`,
                borderRadius: '10px',
                color: textColor,
                fontFamily: 'var(--fuente)',
                fontSize: 'var(--tamano-fuente)',
                outline: 'none',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(46,154,110,0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = inputBorder;
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <button
              type="submit"
              style={{
                padding: '8px 14px',
                background: 'linear-gradient(135deg, var(--color-primary), #2e9a6e)',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(46,154,110,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Send size={16} strokeWidth={2} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes slideUpChat {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }
      `}</style>
    </div>
  );
}

export default ChatLAIA;