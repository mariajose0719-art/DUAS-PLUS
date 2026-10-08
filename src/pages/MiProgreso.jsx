import { useNavigate } from 'react-router-dom';
import { TrendingUp, Award, Clock, BarChart3, ArrowLeft } from 'lucide-react';

function MiProgreso() {
  const navigate = useNavigate();
  const datosClases = [
    { nombre: 'Programación', progreso: 78, color: '#2e9a6e' },
    { nombre: 'DUA', progreso: 45, color: '#3498db' },
    { nombre: 'Accesibilidad', progreso: 92, color: '#f39c12' },
    { nombre: 'Inglés', progreso: 60, color: '#9b59b6' },
    { nombre: 'Seguridad', progreso: 30, color: '#e74c3c' },
  ];
  const promedio = Math.round(datosClases.reduce((acc, c) => acc + c.progreso, 0) / datosClases.length);

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
          <BarChart3 size={28} strokeWidth={1.5} color="#2e9a6e" />
          <h1 style={{ fontSize: '26px', fontWeight: '700', margin: 0 }}>Mi progreso</h1>
          <span style={{
            fontSize: '13px',
            color: '#6a7a75',
            marginLeft: 'auto'
          }}>
            Promedio: {promedio}%
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '28px',
          animation: 'fadeInUp 0.5s ease-out 0.1s forwards',
          opacity: 0
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.06)',
            textAlign: 'center',
            transition: 'all 0.25s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <Award size={24} strokeWidth={1.5} color="#2e9a6e" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#2e9a6e' }}>{promedio}%</div>
            <div style={{ fontSize: '13px', color: '#6a7a75' }}>Promedio general</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.06)',
            textAlign: 'center',
            transition: 'all 0.25s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <Clock size={24} strokeWidth={1.5} color="#f39c12" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#f39c12' }}>5h 42m</div>
            <div style={{ fontSize: '13px', color: '#6a7a75' }}>Tiempo de estudio esta semana</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.06)',
            textAlign: 'center',
            transition: 'all 0.25s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <TrendingUp size={24} strokeWidth={1.5} color="#3498db" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#3498db' }}>18/20</div>
            <div style={{ fontSize: '13px', color: '#6a7a75' }}>Actividades entregadas</div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          animation: 'fadeInUp 0.5s ease-out 0.2s forwards',
          opacity: 0
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <TrendingUp size={20} strokeWidth={1.5} color="#2e9a6e" />
            Progreso por clase
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {datosClases.map((clase, index) => (
              <div key={index}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                  marginBottom: '4px'
                }}>
                  <span style={{ color: '#edf2f0' }}>{clase.nombre}</span>
                  <span style={{ color: clase.color, fontWeight: '600' }}>{clase.progreso}%</span>
                </div>
                <div style={{
                  height: '8px',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '100px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${clase.progreso}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${clase.color}, ${clase.color}dd)`,
                    borderRadius: '100px',
                    boxShadow: `0 0 12px ${clase.color}44`,
                    transition: 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}></div>
                </div>
              </div>
            ))}
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
      `}</style>
    </div>
  );
}

export default MiProgreso;