import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award,
  Calendar,
  Sparkles
} from 'lucide-react';

function EstadisticasAdmin() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState({ resumen: null, distribucion: [], mensual: [] });
  const [error, setError] = useState('');
  useEffect(() => {
    fetch('/api/admin/estadisticas', { credentials: 'include' })
      .then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.mensaje || 'No se pudieron cargar las estadísticas.'); return d; })
      .then(setDatos)
      .catch((e) => setError(e.message));
  }, []);

  const stats = [
    { label: 'Total aprendices activos', value: datos.resumen?.aprendices ?? '—', icon: Users, color: '#2e9a6e', change: 'Base de datos' },
    { label: 'Instructores activos', value: datos.resumen?.instructores ?? '—', icon: BookOpen, color: '#3498db', change: 'Base de datos' },
    { label: 'Programas activos', value: datos.resumen?.programas ?? '—', icon: Award, color: '#f39c12', change: 'Base de datos' },
    { label: 'Cursos activos', value: datos.resumen?.clases ?? '—', icon: TrendingUp, color: '#9b59b6', change: 'Base de datos' },
  ];
  const colores = ['#2e9a6e', '#3498db', '#f39c12', '#9b59b6', '#e74c3c', '#1abc9c'];
  const totalAprendices = Number(datos.resumen?.aprendices || 0);
  const distribucionProgramas = datos.distribucion.map((item, i) => ({ label: item.label, cantidad: Number(item.value), value: totalAprendices ? Math.round(100 * Number(item.value) / totalAprendices) : 0, color: colores[i % colores.length] }));
  const actividadMensual = datos.mensual.map((item) => ({ mes: item.mes, valor: Number(item.valor) }));
  const maxValor = Math.max(1, ...actividadMensual.map((m) => m.valor));

  return (
    <div style={{
      display: 'flex',
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
          radial-gradient(ellipse 80% 60% at 15% 20%, rgba(26, 122, 74, 0.18) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 85% 80%, rgba(26, 122, 74, 0.12) 0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 50% 50%, rgba(26, 122, 74, 0.06) 0%, transparent 50%),
          #080c0a
        `,
      }}>
        <div style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(140px)',
          opacity: 0.20,
          width: '500px',
          height: '500px',
          background: 'rgba(46, 154, 110, 0.12)',
          top: '-150px',
          right: '-100px'
        }} />
        <div style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(160px)',
          opacity: 0.15,
          width: '400px',
          height: '400px',
          background: 'rgba(46, 154, 110, 0.08)',
          bottom: '-120px',
          left: '-80px'
        }} />
        <div style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.10,
          width: '300px',
          height: '300px',
          background: 'rgba(46, 154, 110, 0.06)',
          top: '40%',
          left: '60%'
        }} />
      </div>

      <div style={{
        flex: 1,
        padding: '32px 40px',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '8px',
            flexWrap: 'wrap',
            animation: 'fadeInDown 0.6s ease-out forwards'
          }}>
            <button
              onClick={() => navigate('/administrador')}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                color: '#a8b3b0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                padding: '8px 16px',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = '#edf2f0';
                e.currentTarget.style.borderColor = 'rgba(46,154,110,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.color = '#a8b3b0';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
              Volver
            </button>
            <BarChart3 size={28} strokeWidth={1.5} color="#2e9a6e" />
            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0, letterSpacing: '-0.5px', color: '#edf2f0' }}>
              Estadísticas globales
            </h1>
            <span style={{
              fontSize: '14px',
              color: '#6a7a75',
              marginLeft: 'auto',
              background: 'rgba(255,255,255,0.04)',
              padding: '4px 16px',
              borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              Datos generales
            </span>
          </div>
          <p style={{ 
            color: '#a8b3b0', 
            fontSize: '15px', 
            marginBottom: '28px', 
            marginLeft: '52px',
            letterSpacing: '-0.2px'
          }}>
            Visión completa del estado de la plataforma.
          </p>
          {error && <p role="alert" style={{ background: '#512923', color: '#ffd0c8', padding: 14, borderRadius: 10 }}>{error}</p>}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '18px',
            marginBottom: '32px',
            animation: 'fadeInUp 0.6s ease-out 0.1s forwards',
            opacity: 0
          }}>
            {stats.map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
                borderRadius: '18px',
                padding: '22px',
                border: '1px solid rgba(255,255,255,0.06)',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <stat.icon size={24} strokeWidth={1.5} color={stat.color} style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#edf2f0' }}>{stat.value}</div>
                <div style={{ fontSize: '14px', color: '#a8b3b0' }}>{stat.label}</div>
                <div style={{ fontSize: '12px', color: stat.color, marginTop: '4px' }}>{stat.change}</div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            animation: 'fadeInUp 0.6s ease-out 0.15s forwards',
            opacity: 0
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(16px)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.3)'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '20px',
                color: '#edf2f0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Users size={20} strokeWidth={1.5} color="#2e9a6e" />
                Distribución por programa
              </h2>
              {distribucionProgramas.map((item, index) => (
                <div key={index} style={{ marginBottom: '14px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '14px',
                    marginBottom: '4px'
                  }}>
                    <span style={{ color: '#a8b3b0' }}>{item.label} · {item.cantidad} aprendices</span>
                    <span style={{ color: item.color, fontWeight: '600' }}>{item.value}%</span>
                  </div>
                  <div style={{
                    height: '6px',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '100px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${item.value}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                      borderRadius: '100px',
                      boxShadow: `0 0 12px ${item.color}44`
                    }}></div>
                  </div>
                </div>
              ))}
              {!distribucionProgramas.length && <p style={{ color: '#a8b3b0' }}>No hay aprendices inscritos en programas activos.</p>}
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(16px)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.3)'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '20px',
                color: '#edf2f0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Calendar size={20} strokeWidth={1.5} color="#2e9a6e" />
                Actividad mensual
              </h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '120px', gap: '12px' }}>
                {actividadMensual.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1
                  }}>
                    <div style={{
                      width: '100%',
                      height: `${(item.valor / maxValor) * 100}%`,
                      minHeight: '20px',
                      background: `linear-gradient(180deg, #2e9a6e, #1a7a4a)`,
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 1s ease'
                    }}></div>
                    <span style={{ fontSize: '12px', color: '#6a7a75', marginTop: '4px' }}>{item.mes}</span>
                    <span style={{ fontSize: '10px', color: '#a8b3b0' }}>{item.valor}</span>
                  </div>
                ))}
              </div>
              {!actividadMensual.length && <p style={{ color: '#a8b3b0' }}>Todavía no hay inscripciones en el período reciente.</p>}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default EstadisticasAdmin;
