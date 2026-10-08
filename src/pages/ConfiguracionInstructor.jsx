import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Bell, 
  Shield, 
  Eye, 
  Smartphone,
  Mail,
  UserCog,
  Sparkles,
  ChevronRight
} from 'lucide-react';

function ConfiguracionInstructor() {
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState({
    correo: true,
    push: false,
    recordatorios: true
  });

  const [accesibilidad, setAccesibilidad] = useState({
    altoContraste: false,
    modoNoche: false,
    tamanoFuente: 'medium'
  });

  const toggleSwitch = (value, setter, key) => {
    setter(prev => ({ ...prev, [key]: !prev[key] }));
  };

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

      {/* ===== CONTENIDO ===== */}
      <div style={{
        flex: 1,
        padding: '32px 40px',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          maxWidth: '900px',
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
              onClick={() => navigate('/instructor')}
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
            <Settings size={28} strokeWidth={1.5} color="#2e9a6e" />
            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0, letterSpacing: '-0.5px', color: '#edf2f0' }}>
              Configuración
            </h1>
          </div>
          <p style={{ 
            color: '#a8b3b0', 
            fontSize: '15px', 
            marginBottom: '28px', 
            marginLeft: '52px',
            letterSpacing: '-0.2px'
          }}>
            Personaliza tu experiencia como instructor.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            animation: 'fadeInUp 0.6s ease-out 0.1s forwards',
            opacity: 0
          }}>
            {/* Notificaciones */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(16px)',
              borderRadius: '20px',
              padding: '24px 28px',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.3)'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#edf2f0'
              }}>
                <Bell size={20} strokeWidth={1.5} color="#2e9a6e" />
                Notificaciones
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)'
                }}>
                  <span style={{ fontSize: '15px', color: '#a8b3b0' }}>Notificaciones por correo</span>
                  <div
                    onClick={() => toggleSwitch(notificaciones, setNotificaciones, 'correo')}
                    style={{
                      width: '48px',
                      height: '26px',
                      borderRadius: '13px',
                      background: notificaciones.correo ? '#2e9a6e' : 'rgba(255,255,255,0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      boxShadow: notificaciones.correo ? '0 0 20px rgba(46,154,110,0.3)' : 'none'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#fff',
                      position: 'absolute',
                      top: '3px',
                      left: notificaciones.correo ? '25px' : '3px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}></div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)'
                }}>
                  <span style={{ fontSize: '15px', color: '#a8b3b0' }}>Notificaciones push</span>
                  <div
                    onClick={() => toggleSwitch(notificaciones, setNotificaciones, 'push')}
                    style={{
                      width: '48px',
                      height: '26px',
                      borderRadius: '13px',
                      background: notificaciones.push ? '#2e9a6e' : 'rgba(255,255,255,0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#fff',
                      position: 'absolute',
                      top: '3px',
                      left: notificaciones.push ? '25px' : '3px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}></div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0'
                }}>
                  <span style={{ fontSize: '15px', color: '#a8b3b0' }}>Recordatorios de clases</span>
                  <div
                    onClick={() => toggleSwitch(notificaciones, setNotificaciones, 'recordatorios')}
                    style={{
                      width: '48px',
                      height: '26px',
                      borderRadius: '13px',
                      background: notificaciones.recordatorios ? '#2e9a6e' : 'rgba(255,255,255,0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#fff',
                      position: 'absolute',
                      top: '3px',
                      left: notificaciones.recordatorios ? '25px' : '3px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accesibilidad */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(16px)',
              borderRadius: '20px',
              padding: '24px 28px',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.3)'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#edf2f0'
              }}>
                <Eye size={20} strokeWidth={1.5} color="#2e9a6e" />
                Accesibilidad
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)'
                }}>
                  <span style={{ fontSize: '15px', color: '#a8b3b0' }}>Alto contraste</span>
                  <div
                    onClick={() => toggleSwitch(accesibilidad, setAccesibilidad, 'altoContraste')}
                    style={{
                      width: '48px',
                      height: '26px',
                      borderRadius: '13px',
                      background: accesibilidad.altoContraste ? '#2e9a6e' : 'rgba(255,255,255,0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#fff',
                      position: 'absolute',
                      top: '3px',
                      left: accesibilidad.altoContraste ? '25px' : '3px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}></div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)'
                }}>
                  <span style={{ fontSize: '15px', color: '#a8b3b0' }}>Modo noche</span>
                  <div
                    onClick={() => toggleSwitch(accesibilidad, setAccesibilidad, 'modoNoche')}
                    style={{
                      width: '48px',
                      height: '26px',
                      borderRadius: '13px',
                      background: accesibilidad.modoNoche ? '#2e9a6e' : 'rgba(255,255,255,0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#fff',
                      position: 'absolute',
                      top: '3px',
                      left: accesibilidad.modoNoche ? '25px' : '3px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}></div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0'
                }}>
                  <span style={{ fontSize: '15px', color: '#a8b3b0' }}>Tamaño de fuente</span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {['small', 'medium', 'large'].map(t => (
                      <button
                        key={t}
                        onClick={() => setAccesibilidad({...accesibilidad, tamanoFuente: t})}
                        style={{
                          padding: '6px 16px',
                          borderRadius: '8px',
                          border: accesibilidad.tamanoFuente === t ? '2px solid #2e9a6e' : '1px solid rgba(255,255,255,0.06)',
                          background: accesibilidad.tamanoFuente === t ? 'rgba(46,154,110,0.15)' : 'rgba(255,255,255,0.04)',
                          color: accesibilidad.tamanoFuente === t ? '#edf2f0' : '#a8b3b0',
                          cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: t === 'small' ? '12px' : t === 'medium' ? '14px' : '16px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {t === 'small' ? 'A' : t === 'medium' ? 'A' : 'A'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Cuenta */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(16px)',
              borderRadius: '20px',
              padding: '24px 28px',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.3)'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#edf2f0'
              }}>
                <UserCog size={20} strokeWidth={1.5} color="#2e9a6e" />
                Cuenta
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#edf2f0'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#a8b3b0'}
                >
                  <span style={{ fontSize: '15px', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={18} strokeWidth={1.5} />
                    Cambiar correo
                  </span>
                  <ChevronRight size={18} strokeWidth={1.5} color="#6a7a75" />
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#edf2f0'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#a8b3b0'}
                >
                  <span style={{ fontSize: '15px', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={18} strokeWidth={1.5} />
                    Cambiar contraseña
                  </span>
                  <ChevronRight size={18} strokeWidth={1.5} color="#6a7a75" />
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#edf2f0'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#a8b3b0'}
                >
                  <span style={{ fontSize: '15px', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Smartphone size={18} strokeWidth={1.5} />
                    Dispositivos conectados
                  </span>
                  <ChevronRight size={18} strokeWidth={1.5} color="#6a7a75" />
                </div>
              </div>
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

export default ConfiguracionInstructor;