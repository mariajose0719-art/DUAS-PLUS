import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Bot, 
  Settings,
  TrendingUp,
  Clock,
  Award,
  Sparkles,
  UserPlus,
  PlusCircle,
  ChevronRight,
  Eye
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

function DashboardAdministrador() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Instructores', value: 8, icon: Users, color: '#2e9a6e', change: '+2 este mes', bg: 'rgba(46,154,110,0.12)' },
    { label: 'Programas', value: 5, icon: BookOpen, color: '#3498db', change: '1 nuevo', bg: 'rgba(52,152,219,0.12)' },
    { label: 'Aprendices totales', value: 156, icon: TrendingUp, color: '#9b59b6', change: '+12%', bg: 'rgba(155,89,182,0.12)' },
    { label: 'Clases impartidas', value: 45, icon: BookOpen, color: '#f39c12', change: '+8 este mes', bg: 'rgba(243,156,18,0.12)' },
  ];

  const actividadesRecientes = [
    { titulo: 'Nuevo instructor registrado', fecha: 'Hace 2 horas', estado: 'Completado', color: '#2e9a6e' },
    { titulo: 'Programa "Redes" actualizado', fecha: 'Ayer', estado: 'Pendiente', color: '#f39c12' },
    { titulo: 'Nuevo aprendiz registrado', fecha: 'Hace 1 día', estado: 'Completado', color: '#2e9a6e' },
  ];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0a0e0c',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* ===== FONDO DUAS+ ===== */}
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

      <Sidebar rol="administrador" />

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
            animation: 'fadeInDown 0.6s ease-out forwards'
          }}>
            <h1 style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '34px',
              fontWeight: '700',
              color: '#edf2f0',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              Panel de Administración
              <Sparkles size={26} strokeWidth={1.5} color="#2e9a6e" />
            </h1>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '17px',
              color: '#a8b3b0'
            }}>
              Visión general de la plataforma y gestión del sistema.
            </p>
          </div>

          {/* ===== ESTADÍSTICAS ===== */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '48px',
            animation: 'fadeInUp 0.6s ease-out 0.1s forwards',
            opacity: 0
          }}>
            {stats.map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
                borderRadius: '20px',
                padding: '24px 22px',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
                e.currentTarget.style.borderColor = 'rgba(46,154,110,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.boxShadow = '0 12px 48px rgba(0,0,0,0.3)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
              >
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
                    borderRadius: '100px'
                  }}>
                    {stat.change}
                  </span>
                </div>
                <div style={{
                  fontSize: '34px',
                  fontWeight: '700',
                  color: '#edf2f0',
                  marginBottom: '2px',
                  letterSpacing: '-1px'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '15px',
                  color: '#a8b3b0',
                  fontWeight: '500'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* ===== ACCESOS RÁPIDOS ELIMINADOS (Instructores, Programas, Balizas, IA) ===== */}

          {/* ===== ACTIVIDADES RECIENTES Y ACCIONES ===== */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '28px',
            animation: 'fadeInUp 0.6s ease-out 0.15s forwards',
            opacity: 0
          }}>
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#edf2f0',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Clock size={22} strokeWidth={1.5} color="#2e9a6e" />
                Actividades recientes
              </h2>
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
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
                    borderBottom: index < actividadesRecientes.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.paddingLeft = '8px'}
                  onMouseLeave={(e) => e.currentTarget.style.paddingLeft = '0'}
                  >
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#edf2f0'
                      }}>
                        {act.titulo}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6a7a75',
                        marginTop: '2px'
                      }}>
                        {act.fecha}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 16px',
                      borderRadius: '100px',
                      fontWeight: '500',
                      background: act.estado === 'Completado' ? 'rgba(46,154,110,0.12)' :
                                 act.estado === 'Alerta' ? 'rgba(231,76,60,0.12)' :
                                 'rgba(243,156,18,0.12)',
                      color: act.estado === 'Completado' ? '#2e9a6e' :
                             act.estado === 'Alerta' ? '#e74c3c' :
                             '#f39c12',
                      border: `1px solid ${act.estado === 'Completado' ? 'rgba(46,154,110,0.15)' : act.estado === 'Alerta' ? 'rgba(231,76,60,0.15)' : 'rgba(243,156,18,0.15)'}`
                    }}>
                      {act.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#edf2f0',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Award size={22} strokeWidth={1.5} color="#2e9a6e" />
                Acciones rápidas
              </h2>
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
                borderRadius: '20px',
                padding: '20px 20px',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {[
                  { label: 'Registrar instructor', icon: UserPlus, path: '/administrador/instructores', color: '#2e9a6e' },
                  { label: 'Crear programa', icon: PlusCircle, path: '/administrador/programas', color: '#3498db' },
                  { label: 'Ver estadísticas', icon: BarChart3, path: '/administrador/estadisticas', color: '#f39c12' },
                  { label: 'Usar IA', icon: Bot, path: '/administrador/ia', color: '#9b59b6' },
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
                      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.borderColor = 'rgba(46,154,110,0.2)';
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

export default DashboardAdministrador;