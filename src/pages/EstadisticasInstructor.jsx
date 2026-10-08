import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award,
  Calendar,
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function EstadisticasInstructor() {
  const navigate = useNavigate();
  const { modoOscuro } = useTheme();

  const datos = {
    totalAprendices: 24,
    clasesImpartidas: 12,
    promedioAsistencia: 87,
    promedioProgreso: 68,
    distribucionPerfiles: [
      { label: 'Sin necesidades', value: 8, color: '#2e9a6e' },
      { label: 'Dislexia', value: 4, color: '#e67e22' },
      { label: 'TDAH', value: 3, color: '#9b59b6' },
      { label: 'Baja visión', value: 3, color: '#3498db' },
      { label: 'Auditiva', value: 3, color: '#e74c3c' },
      { label: 'TEA', value: 3, color: '#1abc9c' },
    ],
    progresoClases: [
      { nombre: 'Programación', progreso: 78 },
      { nombre: 'DUA', progreso: 45 },
      { nombre: 'Accesibilidad', progreso: 92 },
      { nombre: 'Inglés', progreso: 60 },
      { nombre: 'Redes', progreso: 30 },
    ]
  };

  const maxProgreso = Math.max(...datos.progresoClases.map(c => c.progreso));

  const fondoGradiente = modoOscuro 
    ? `
        radial-gradient(ellipse 90% 70% at 15% 25%, rgba(26, 122, 74, 0.20) 0%, transparent 60%),
        radial-gradient(ellipse 70% 60% at 85% 75%, rgba(26, 122, 74, 0.15) 0%, transparent 55%),
        radial-gradient(ellipse 60% 50% at 50% 50%, rgba(26, 122, 74, 0.08) 0%, transparent 50%),
        #080c0a
      `
    : `
        radial-gradient(ellipse 90% 70% at 15% 25%, rgba(26, 122, 74, 0.12) 0%, transparent 60%),
        radial-gradient(ellipse 70% 60% at 85% 75%, rgba(26, 122, 74, 0.08) 0%, transparent 55%),
        radial-gradient(ellipse 60% 50% at 50% 50%, rgba(26, 122, 74, 0.04) 0%, transparent 50%),
        #f0f2f5
      `;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--color-fondo)',
      color: 'var(--color-texto)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.3s ease, color 0.3s ease',
      padding: '24px',
      justifyContent: 'center'
    }}>
      {/* Fondo */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: fondoGradiente,
        transition: 'background 0.3s ease'
      }}>
        <div style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(180px)',
          opacity: modoOscuro ? 0.25 : 0.15,
          width: '600px',
          height: '600px',
          background: 'rgba(26, 122, 74, 0.15)',
          top: '-200px',
          right: '-150px'
        }} />
        <div style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(200px)',
          opacity: modoOscuro ? 0.20 : 0.10,
          width: '500px',
          height: '500px',
          background: 'rgba(26, 122, 74, 0.10)',
          bottom: '-150px',
          left: '-100px'
        }} />
        <div style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(140px)',
          opacity: modoOscuro ? 0.15 : 0.08,
          width: '300px',
          height: '300px',
          background: 'rgba(26, 122, 74, 0.08)',
          top: '40%',
          left: '60%'
        }} />
      </div>

      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        {/* Encabezado */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/instructor')}
            style={{
              background: 'var(--color-fondo-card)',
              border: '1px solid var(--color-borde)',
              borderRadius: '12px',
              color: 'var(--color-texto)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: 'calc(var(--tamano-fuente) * 0.875)',
              fontFamily: 'var(--fuente)',
              padding: '8px 16px',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = modoOscuro ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-fondo-card)';
            }}
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
            Volver
          </button>
          <BarChart3 size={28} strokeWidth={1.5} color="var(--color-primary)" />
          <h1 style={{
            fontSize: 'calc(var(--tamano-fuente) * 1.75)',
            fontWeight: '700',
            margin: 0,
            color: 'var(--color-texto)',
            letterSpacing: '-0.5px'
          }}>
            Estadísticas
          </h1>
          <span style={{
            fontSize: 'calc(var(--tamano-fuente) * 0.875)',
            color: modoOscuro ? '#6a7a75' : '#888',
            marginLeft: 'auto',
            background: 'var(--color-fondo-card)',
            padding: '4px 16px',
            borderRadius: '100px',
            border: '1px solid var(--color-borde)'
          }}>
            <Sparkles size={14} strokeWidth={1.5} color="var(--color-primary)" style={{ marginRight: '6px' }} />
            Datos actualizados
          </span>
        </div>
        <p style={{ 
          color: modoOscuro ? '#a8b3b0' : '#555', 
          fontSize: 'calc(var(--tamano-fuente) * 0.9375)', 
          marginBottom: '28px', 
          marginLeft: '52px',
          letterSpacing: '-0.2px'
        }}>
          Métricas clave de tu actividad y progreso de los aprendices.
        </p>

        {/* Tarjetas de resumen */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '18px',
          marginBottom: '32px',
          animation: 'fadeInUp 0.5s ease-out 0.1s forwards',
          opacity: 0
        }}>
          <div style={{
            background: 'var(--color-fondo-card)',
            backdropFilter: 'blur(16px)',
            borderRadius: '18px',
            padding: '22px',
            border: '1px solid var(--color-borde)',
            boxShadow: 'var(--sombra)',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-fondo-card)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--sombra)';
          }}
          >
            <Users size={28} strokeWidth={1.5} color="var(--color-primary)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: 'calc(var(--tamano-fuente) * 2)', fontWeight: '700', color: 'var(--color-texto)' }}>{datos.totalAprendices}</div>
            <div style={{ fontSize: 'calc(var(--tamano-fuente) * 0.875)', color: modoOscuro ? '#a8b3b0' : '#555' }}>Aprendices</div>
          </div>
          <div style={{
            background: 'var(--color-fondo-card)',
            backdropFilter: 'blur(16px)',
            borderRadius: '18px',
            padding: '22px',
            border: '1px solid var(--color-borde)',
            boxShadow: 'var(--sombra)',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-fondo-card)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--sombra)';
          }}
          >
            <BookOpen size={28} strokeWidth={1.5} color="#3498db" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: 'calc(var(--tamano-fuente) * 2)', fontWeight: '700', color: 'var(--color-texto)' }}>{datos.clasesImpartidas}</div>
            <div style={{ fontSize: 'calc(var(--tamano-fuente) * 0.875)', color: modoOscuro ? '#a8b3b0' : '#555' }}>Clases impartidas</div>
          </div>
          <div style={{
            background: 'var(--color-fondo-card)',
            backdropFilter: 'blur(16px)',
            borderRadius: '18px',
            padding: '22px',
            border: '1px solid var(--color-borde)',
            boxShadow: 'var(--sombra)',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-fondo-card)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--sombra)';
          }}
          >
            <TrendingUp size={28} strokeWidth={1.5} color="#f39c12" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: 'calc(var(--tamano-fuente) * 2)', fontWeight: '700', color: 'var(--color-texto)' }}>{datos.promedioAsistencia}%</div>
            <div style={{ fontSize: 'calc(var(--tamano-fuente) * 0.875)', color: modoOscuro ? '#a8b3b0' : '#555' }}>Asistencia promedio</div>
          </div>
          <div style={{
            background: 'var(--color-fondo-card)',
            backdropFilter: 'blur(16px)',
            borderRadius: '18px',
            padding: '22px',
            border: '1px solid var(--color-borde)',
            boxShadow: 'var(--sombra)',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-fondo-card)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--sombra)';
          }}
          >
            <Award size={28} strokeWidth={1.5} color="#9b59b6" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: 'calc(var(--tamano-fuente) * 2)', fontWeight: '700', color: 'var(--color-texto)' }}>{datos.promedioProgreso}%</div>
            <div style={{ fontSize: 'calc(var(--tamano-fuente) * 0.875)', color: modoOscuro ? '#a8b3b0' : '#555' }}>Progreso promedio</div>
          </div>
        </div>

        {/* Distribución y progreso */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          animation: 'fadeInUp 0.5s ease-out 0.15s forwards',
          opacity: 0
        }}>
          <div style={{
            background: 'var(--color-fondo-card)',
            backdropFilter: 'blur(16px)',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid var(--color-borde)',
            boxShadow: 'var(--sombra)'
          }}>
            <h2 style={{
              fontSize: 'calc(var(--tamano-fuente) * 1.125)',
              fontWeight: '600',
              marginBottom: '20px',
              color: 'var(--color-texto)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Users size={20} strokeWidth={1.5} color="var(--color-primary)" />
              Distribución de perfiles
            </h2>
            {datos.distribucionPerfiles.map((item, index) => (
              <div key={index} style={{ marginBottom: '14px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 'calc(var(--tamano-fuente) * 0.875)',
                  marginBottom: '4px'
                }}>
                  <span style={{ color: modoOscuro ? '#a8b3b0' : '#555' }}>{item.label}</span>
                  <span style={{ color: item.color, fontWeight: '600' }}>{item.value}</span>
                </div>
                <div style={{
                  height: '6px',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '100px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(item.value / datos.totalAprendices) * 100}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                    borderRadius: '100px',
                    boxShadow: `0 0 12px ${item.color}44`,
                    transition: 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: 'var(--color-fondo-card)',
            backdropFilter: 'blur(16px)',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid var(--color-borde)',
            boxShadow: 'var(--sombra)'
          }}>
            <h2 style={{
              fontSize: 'calc(var(--tamano-fuente) * 1.125)',
              fontWeight: '600',
              marginBottom: '20px',
              color: 'var(--color-texto)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <TrendingUp size={20} strokeWidth={1.5} color="var(--color-primary)" />
              Progreso por clase
            </h2>
            {datos.progresoClases.map((clase, index) => (
              <div key={index} style={{ marginBottom: '14px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 'calc(var(--tamano-fuente) * 0.875)',
                  marginBottom: '4px'
                }}>
                  <span style={{ color: modoOscuro ? '#a8b3b0' : '#555' }}>{clase.nombre}</span>
                  <span style={{
                    color: clase.progreso > 70 ? 'var(--color-primary)' : clase.progreso > 40 ? '#f39c12' : '#e74c3c',
                    fontWeight: '600'
                  }}>
                    {clase.progreso}%
                  </span>
                </div>
                <div style={{
                  height: '6px',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '100px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(clase.progreso / maxProgreso) * 100}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${clase.progreso > 70 ? 'var(--color-primary)' : clase.progreso > 40 ? '#f39c12' : '#e74c3c'}, ${clase.progreso > 70 ? '#1a7a4a' : clase.progreso > 40 ? '#d68910' : '#c0392b'})`,
                    borderRadius: '100px',
                    transition: 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default EstadisticasInstructor;