import { useNavigate } from 'react-router-dom';
import { MessageSquare, Star, Calendar, User, ArrowLeft } from 'lucide-react';

function Retroalimentacion() {
  const navigate = useNavigate();
  const comentarios = [
    { clase: 'Fundamentos de Programación', fecha: '15/06/2024', instructor: 'Carlos Rodríguez', comentario: 'Excelente participación en clase. Sigue practicando los ejercicios.', nota: 4.5 },
    { clase: 'Diseño Universal', fecha: '10/06/2024', instructor: 'María Fernández', comentario: 'Buena comprensión de los conceptos, pero mejora en la aplicación práctica.', nota: 3.8 },
    { clase: 'Accesibilidad Digital', fecha: '05/06/2024', instructor: 'Ana Martínez', comentario: 'Muy buen trabajo en el taller. Has demostrado dominio del tema.', nota: 5.0 },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0e0c',
      position: 'relative',
      overflow: 'hidden'
    }}>
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
        maxWidth: '1100px',
        margin: '0 auto',
        color: '#edf2f0',
        fontFamily: 'Inter, sans-serif'
      }}>
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
          <MessageSquare size={28} strokeWidth={1.5} color="#2e9a6e" />
          <h1 style={{ fontSize: '26px', fontWeight: '700', margin: 0 }}>Retroalimentación</h1>
          <span style={{
            fontSize: '13px',
            color: '#6a7a75',
            marginLeft: 'auto'
          }}>
            {comentarios.length} comentarios
          </span>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          animation: 'fadeInUp 0.5s ease-out 0.1s forwards',
          opacity: 0
        }}>
          {comentarios.map((c, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              padding: '20px 24px',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '8px'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: 0,
                    color: '#edf2f0'
                  }}>{c.clase}</h3>
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '13px',
                    color: '#6a7a75',
                    marginTop: '4px'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={14} strokeWidth={1.5} /> {c.instructor}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} strokeWidth={1.5} /> {c.fecha}
                    </span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  background: 'rgba(46,154,110,0.15)',
                  color: '#2e9a6e',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  <Star size={14} strokeWidth={1.5} fill="#2e9a6e" />
                  {c.nota}/5
                </div>
              </div>
              <p style={{
                fontSize: '14px',
                color: '#a8b3b0',
                margin: 0,
                lineHeight: '1.6'
              }}>
                {c.comentario}
              </p>
            </div>
          ))}
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
      `}</style>
    </div>
  );
}

export default Retroalimentacion;