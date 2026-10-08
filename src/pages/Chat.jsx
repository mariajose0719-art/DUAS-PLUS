import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, Sparkles, ArrowLeft, MessageCircle } from 'lucide-react';

function Chat() {
  const navigate = useNavigate();
  const [mensajes, setMensajes] = useState([
    { de: 'laia', texto: '¡Hola! Soy LAIA, tu asistente personal. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [esperando, setEsperando] = useState(false);

  const enviarMensaje = () => {
    if (!input.trim() || esperando) return;
    const textoUsuario = input;
    setMensajes(prev => [...prev, { de: 'usuario', texto: textoUsuario }]);
    setInput('');
    setEsperando(true);

    setTimeout(() => {
      let respuesta = '';
      const lower = textoUsuario.toLowerCase();
      if (lower.includes('hola')) {
        respuesta = '¡Hola! ¿Cómo estás? ¿Necesitas ayuda con alguna clase?';
      } else if (lower.includes('resumen') || lower.includes('clase')) {
        respuesta = 'Claro, puedo darte un resumen de la clase de hoy. Vimos estructuras condicionales y ciclos. ¿Quieres que profundice?';
      } else if (lower.includes('taller') || lower.includes('entrega')) {
        respuesta = 'El próximo taller es sobre Accesibilidad Digital, se entrega mañana. Recuerda revisar los ejemplos.';
      } else if (lower.includes('gracias')) {
        respuesta = '¡De nada! Estoy aquí para ayudarte.';
      } else {
        respuesta = 'Entendido. ¿Puedo ayudarte con algo más?';
      }
      setMensajes(prev => [...prev, { de: 'laia', texto: respuesta }]);
      setEsperando(false);
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0e0c',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Fondo difuminado */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 90% 70% at 15% 25%, rgba(26, 122, 74, 0.20) 0%, transparent 60%),
          radial-gradient(ellipse 70% 60% at 85% 75%, rgba(26, 122, 74, 0.15) 0%, transparent 55%),
          #080c0a
        `,
      }}>
        <div style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(180px)',
          opacity: 0.25,
          width: '600px',
          height: '600px',
          background: 'rgba(26, 122, 74, 0.15)',
          top: '-200px',
          right: '-150px'
        }}></div>
        <div style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(200px)',
          opacity: 0.20,
          width: '500px',
          height: '500px',
          background: 'rgba(26, 122, 74, 0.10)',
          bottom: '-150px',
          left: '-100px'
        }}></div>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '32px 40px',
        maxWidth: '900px',
        margin: '0 auto',
        color: '#edf2f0',
        fontFamily: 'Inter, sans-serif',
        height: 'calc(100vh - 80px)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header con botón Volver */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
          animation: 'fadeInDown 0.5s ease-out forwards'
        }}>
          <button
            onClick={() => navigate('/aprendiz')}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '8px 14px',
              color: '#a8b3b0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.color = '#edf2f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.color = '#a8b3b0';
            }}
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
            Volver
          </button>
          <Bot size={28} strokeWidth={1.5} color="#2e9a6e" />
          <h1 style={{ fontSize: '26px', fontWeight: '700', margin: 0 }}>Chat con LAIA</h1>
          <span style={{
            fontSize: '13px',
            color: '#6a7a75',
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={16} strokeWidth={1.5} color="#2e9a6e" />
            En línea
          </span>
        </div>

        {/* Área de chat */}
        <div style={{
          flex: 1,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeInUp 0.5s ease-out 0.1s forwards',
          opacity: 0
        }}>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            paddingRight: '8px',
            marginBottom: '16px'
          }}>
            {mensajes.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.de === 'laia' ? 'flex-start' : 'flex-end',
                maxWidth: '80%',
                animation: 'fadeInUp 0.3s ease-out forwards'
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: msg.de === 'laia' ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                  background: msg.de === 'laia' ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #1a7a4a, #2e9a6e)',
                  color: '#edf2f0',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  boxShadow: msg.de === 'laia' ? 'none' : '0 4px 16px rgba(46,154,110,0.2)'
                }}>
                  {msg.texto}
                </div>
              </div>
            ))}
            {esperando && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '10px 16px',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '16px',
                color: '#6a7a75',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#2e9a6e',
                  animation: 'pulseDot 1s ease-in-out infinite'
                }}></span>
                LAIA está escribiendo...
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{
            display: 'flex',
            gap: '12px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '16px'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
              placeholder="Escribe tu mensaje..."
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                color: '#edf2f0',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'Inter, sans-serif',
                transition: 'border-color 0.25s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#2e9a6e'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
            />
            <button
              onClick={enviarMensaje}
              disabled={esperando}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #1a7a4a, #2e9a6e)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: '500',
                transition: 'all 0.25s ease',
                opacity: esperando ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!esperando) {
                  e.currentTarget.style.transform = 'scale(1.04)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(26, 122, 74, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Send size={18} strokeWidth={2} />
              Enviar
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

export default Chat;