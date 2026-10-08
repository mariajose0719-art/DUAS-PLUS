import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  Bot, 
  TrendingUp,
  Clock,
  Award,
  Sparkles,
  PlusCircle,
  Eye,
  ArrowRight,
  ChevronRight,
  UserPlus,
  FileText,
  Settings
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

function DashboardInstructor() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Aprendices', value: 24, icon: Users, color: '#2e9a6e', change: '+3 este mes', bg: 'rgba(46,154,110,0.12)' },
    { label: 'Fichas activas', value: 5, icon: BookOpen, color: '#3498db', change: '2 en curso', bg: 'rgba(52,152,219,0.12)' },
    { label: 'Clases impartidas', value: 12, icon: Calendar, color: '#f39c12', change: '4 este mes', bg: 'rgba(243,156,18,0.12)' },
    { label: 'Progreso promedio', value: '68%', icon: TrendingUp, color: '#9b59b6', change: '+5%', bg: 'rgba(155,89,182,0.12)' },
  ];

  const actividadesRecientes = [
    { titulo: 'Clase de Programación', fecha: 'Hoy 9:00 AM', estado: 'En vivo', color: '#2e9a6e' },
    { titulo: 'Corrección de Taller 2', fecha: 'Mañana', estado: 'Pendiente', color: '#f39c12' },
    { titulo: 'Reunión con equipo DUA', fecha: 'Viernes 10:00 AM', estado: 'Agendada', color: '#3498db' },
  ];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0a0e0c',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* ===== FONDO CON CAPAS Y GLOW ===== */}
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

      <Sidebar rol="instructor" />

      <div style={{
        flex: 1,
        padding: '36px 44px',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* ===== ENCABEZADO ===== */}
          <div style={{
            marginBottom: '48px',
            animation: 'fadeInDown 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '6px'
            }}>
              <h1 style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '34px',
                fontWeight: '700',
                color: '#edf2f0',
                margin: 0,
                letterSpacing: '-0.5px'
              }}>
                Panel del Instructor
              </h1>
              <Sparkles size={26} strokeWidth={1.5} color="#2e9a6e" style={{
                filter: 'drop-shadow(0 0 20px rgba(46,154,110,0.3))'
              }} />
            </div>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '17px',
              color: '#a8b3b0',
              margin: 0,
              letterSpacing: '-0.2px'
            }}>
              Resumen de tu actividad y herramientas principales.
            </p>
          </div>

          {/* ===== ESTADÍSTICAS ===== */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '48px',
            animation: 'fadeInUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s forwards',
            opacity: 0
          }}>
            {stats.map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '20px',
                padding: '24px 22px',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.5)`;
                e.currentTarget.style.borderColor = `rgba(46,154,110,0.15)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.boxShadow = '0 12px 48px rgba(0,0,0,0.3)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
              >
                {/* Glow interior sutil */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at 30% 20%, ${stat.color}08, transparent 70%)`,
                  pointerEvents: 'none'
                }} />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    background: stat.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <stat.icon size={22} strokeWidth={1.5} color={stat.color} />
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: stat.color,
                    fontWeight: '600',
                    background: 'rgba(255,255,255,0.04)',
                    padding: '4px 14px',
                    borderRadius: '100px',
                    letterSpacing: '0.2px'
                  }}>
                    {stat.change}
                  </span>
                </div>
                <div style={{
                  fontSize: '34px',
                  fontWeight: '700',
                  color: '#edf2f0',
                  marginBottom: '2px',
                  position: 'relative',
                  zIndex: 1,
                  letterSpacing: '-1px'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '15px',
                  color: '#a8b3b0',
                  fontWeight: '500',
                  position: 'relative',
                  zIndex: 1,
                  letterSpacing: '-0.2px'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* ===== EXPERIENCIA DUAS+ - SECCIÓN DESTACADA ===== */}
          <div style={{
            marginBottom: '48px',
            animation: 'fadeInUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s forwards',
            opacity: 0
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '24px',
              padding: '28px 36px',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.borderColor = 'rgba(46,154,110,0.15)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.boxShadow = '0 12px 48px rgba(0,0,0,0.3)';
            }}
            >
              {/* Glow de fondo */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 20% 50%, rgba(46,154,110,0.06), transparent 70%)',
                pointerEvents: 'none'
              }} />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, #1a7a4a, #2e9a6e)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(46,154,110,0.3)'
                }}>
                  <Eye size={28} strokeWidth={1.5} color="#ffffff" />
                </div>
                <div>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#edf2f0',
                    margin: 0,
                    letterSpacing: '-0.3px'
                  }}>
                    Experiencia DUAS+
                  </h2>
                  <p style={{
                    fontSize: '15px',
                    color: '#a8b3b0',
                    margin: '4px 0 0',
                    letterSpacing: '-0.2px'
                  }}>
                    Visualiza cómo se adapta la plataforma según el perfil de accesibilidad.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/instructor/experiencia')}
                style={{
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #1a7a4a, #2e9a6e)',
                  border: 'none',
                  borderRadius: '14px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: '0 8px 32px rgba(46,154,110,0.25)',
                  position: 'relative',
                  zIndex: 1
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.04)';
                  e.currentTarget.style.boxShadow = '0 12px 48px rgba(46,154,110,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(46,154,110,0.25)';
                }}
              >
                Explorar
                <ArrowRight size={18} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* ===== ACTIVIDADES RECIENTES Y ACCIONES ===== */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '28px',
            animation: 'fadeInUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards',
            opacity: 0
          }}>
            {/* Actividades recientes */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '18px'
              }}>
                <Clock size={22} strokeWidth={1.5} color="#2e9a6e" />
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#edf2f0',
                  margin: 0,
                  letterSpacing: '-0.3px'
                }}>
                  Actividades recientes
                </h2>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '20px',
                padding: '20px 24px',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 12px 48px rgba(0,0,0,0.3)'
              }}>
                {actividadesRecientes.map((act, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 0',
                    borderBottom: index < actividadesRecientes.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.paddingLeft = '8px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                  >
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#edf2f0',
                        letterSpacing: '-0.2px'
                      }}>
                        {act.titulo}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6a7a75',
                        marginTop: '2px',
                        letterSpacing: '-0.2px'
                      }}>
                        {act.fecha}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 16px',
                      borderRadius: '100px',
                      fontWeight: '500',
                      background: `${act.color}15`,
                      color: act.color,
                      border: `1px solid ${act.color}20`,
                      letterSpacing: '0.3px'
                    }}>
                      {act.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones rápidas */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '18px'
              }}>
                <Award size={22} strokeWidth={1.5} color="#2e9a6e" />
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#edf2f0',
                  margin: 0,
                  letterSpacing: '-0.3px'
                }}>
                  Acciones rápidas
                </h2>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '20px',
                padding: '20px 20px',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {[
                  { label: 'Crear nueva clase', icon: PlusCircle, path: '/instructor/clases', color: '#2e9a6e' },
                  { label: 'Gestionar aprendices', icon: Users, path: '/instructor/aprendices', color: '#3498db' },
                  { label: 'Usar IA asistente', icon: Bot, path: '/instructor/ia', color: '#9b59b6' },
                ].map((accion, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(accion.path)}
                    style={{
                      padding: '14px 18px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '14px',
                      color: '#edf2f0',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '15px',
                      fontWeight: '500',
                      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      letterSpacing: '-0.2px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.borderColor = `rgba(46,154,110,0.2)`;
                      e.currentTarget.style.transform = 'translateX(6px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: `${accion.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <accion.icon size={18} strokeWidth={1.5} color={accion.color} />
                      </div>
                      {accion.label}
                    </span>
                    <ChevronRight size={18} strokeWidth={1.5} color="#6a7a75" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

export default DashboardInstructor;