import { useState } from 'react';
import { Check, Send } from 'lucide-react';

function Encuesta({ pregunta, opciones, onEnviar }) {
  const [seleccionada, setSeleccionada] = useState(null);
  const [enviada, setEnviada] = useState(false);

  // Colores profesionales sin emojis
  const colores = ['#2e9a6e', '#3498db', '#f39c12', '#e74c3c'];

  const handleSeleccion = (index) => {
    setSeleccionada(index);
    setTimeout(() => {
      setEnviada(true);
      if (onEnviar) onEnviar(index);
    }, 800);
  };

  if (enviada) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '48px 32px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(16px)',
        borderRadius: '32px',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: 'fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 24px',
          borderRadius: '50%',
          border: '4px solid rgba(46, 154, 110, 0.2)',
          position: 'relative',
          animation: 'spinCheck 2s ease-out forwards'
        }}>
          <div style={{
            position: 'absolute',
            inset: '0',
            borderRadius: '50%',
            border: '4px solid #2e9a6e',
            borderTopColor: 'transparent',
            animation: 'spin 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
          }}></div>
          <div style={{
            position: 'absolute',
            inset: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            animation: 'fadeIn 0.6s 1s forwards'
          }}>
            <Check size={32} strokeWidth={2} color="#2e9a6e" />
          </div>
        </div>

        <h3 style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '24px',
          fontWeight: '700',
          color: '#edf2f0',
          marginBottom: '8px'
        }}>
          Encuesta enviada
        </h3>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '16px',
          color: '#a8b3b0',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          Tu opinión ayudará a que DUAS+ sea más accesible.
        </p>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spinCheck {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.5); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(16px)',
      borderRadius: '32px',
      padding: '40px 32px',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    }}>
      <h2 style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '22px',
        fontWeight: '600',
        color: '#edf2f0',
        marginBottom: '28px',
        textAlign: 'center'
      }}>
        {pregunta}
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        {opciones.map((opcion, index) => (
          <div
            key={index}
            onClick={() => handleSeleccion(index)}
            style={{
              padding: '24px 20px',
              background: seleccionada === index 
                ? `linear-gradient(135deg, ${colores[index]}44, ${colores[index]}22)`
                : 'rgba(255,255,255,0.04)',
              borderRadius: '20px',
              border: seleccionada === index
                ? `2px solid ${colores[index]}`
                : '1px solid rgba(255,255,255,0.06)',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: seleccionada === index
                ? `0 8px 40px ${colores[index]}44`
                : 'none',
              transform: seleccionada === index ? 'scale(1.04)' : 'scale(1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              if (seleccionada !== index) {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              }
            }}
            onMouseLeave={(e) => {
              if (seleccionada !== index) {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }
            }}
          >
            {seleccionada === index && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${colores[index]}, ${colores[index]}dd)`,
                animation: 'slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}></div>
            )}

            <h4 style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '18px',
              fontWeight: '600',
              color: seleccionada === index ? '#edf2f0' : '#a8b3b0',
              marginBottom: '4px',
              transition: 'color 0.3s'
            }}>
              {opcion.titulo}
            </h4>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: '#6a7a75',
              margin: 0
            }}>
              {opcion.descripcion}
            </p>

            <div style={{
              marginTop: '16px',
              height: '4px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '100px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(index + 1) * 25}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${colores[index]}66, ${colores[index]})`,
                borderRadius: '100px',
                transition: 'width 0.6s'
              }}></div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}

export default Encuesta;