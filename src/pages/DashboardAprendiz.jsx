import { useTheme, PERFILES } from '../context/ThemeContext';
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  Award, 
  FileCheck,
  BookOpen,
  Zap,
  TrendingUp,
  Sun,
  Moon,
  UserCog
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import CursoCard from '../components/aprendiz/CursoCard';
import AnilloProgreso from '../components/aprendiz/AnilloProgreso';
import Encuesta from '../components/aprendiz/Encuesta';
import ChatLAIA from '../components/aprendiz/ChatLAIA';
import ProfileSelector from '../components/ProfileSelector';
import ThemeToggle from '../components/ThemeToggle';

function DashboardAprendiz() {
  const { modoOscuro, perfil, perfilConfig } = useTheme();

  // ===== CLASES DESTACADAS (solo 2) =====
  const clasesDestacadas = [
    { 
      id: 3,
      titulo: 'Accesibilidad Digital',
      instructor: 'Ana Martínez',
      progreso: 92,
      color: '#f39c12',
      descripcion: 'Pautas WCAG y herramientas'
    },
    { 
      id: 1,
      titulo: 'Fundamentos de Programación',
      instructor: 'Carlos Rodríguez',
      progreso: 78,
      color: '#2e9a6e',
      descripcion: 'Algoritmos y lógica'
    }
  ];

  const claseActiva = clasesDestacadas[0];

  const opcionesEncuesta = [
    { titulo: 'Excelente', descripcion: 'Muy clara' },
    { titulo: 'Buena', descripcion: 'Entendí casi todo' },
    { titulo: 'Regular', descripcion: 'Necesito apoyo' },
    { titulo: 'Difícil', descripcion: 'No comprendí' }
  ];

  // Fondo dinámico refinado según modo oscuro/claro y perfil
  const fondoGradiente = modoOscuro 
    ? `
        radial-gradient(circle at 10% 15%, rgba(46, 154, 110, 0.18) 0%, transparent 45%),
        radial-gradient(circle at 90% 80%, rgba(26, 122, 74, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(20, 80, 50, 0.08) 0%, transparent 65%),
        #070a08
      `
    : `
        radial-gradient(circle at 10% 15%, rgba(46, 154, 110, 0.12) 0%, transparent 45%),
        radial-gradient(circle at 90% 80%, rgba(26, 122, 74, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(46, 154, 110, 0.04) 0%, transparent 60%),
        #f4f6f8
      `;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: modoOscuro ? '#070a08' : '#f4f6f8',
      color: modoOscuro ? '#f0f4f2' : '#1e293b',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.35s ease, color 0.35s ease',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* ===== FONDO CON ESFERAS DE LUZ SUAVES ===== */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: fondoGradiente,
        transition: 'background 0.35s ease'
      }}>
        <div style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(140px)',
          opacity: modoOscuro ? 0.35 : 0.22,
          width: '550px',
          height: '550px',
          background: 'linear-gradient(135deg, rgba(46, 154, 110, 0.4), rgba(26, 122, 74, 0.1))',
          top: '-180px',
          right: '-120px'
        }}></div>
        <div style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(160px)',
          opacity: modoOscuro ? 0.25 : 0.15,
          width: '450px',
          height: '450px',
          background: 'rgba(26, 122, 74, 0.25)',
          bottom: '-120px',
          left: '-80px'
        }}></div>
      </div>

      <Sidebar rol="aprendiz" />

      <div style={{
        flex: 1,
        padding: '32px 40px',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1,
        scrollBehavior: 'smooth'
      }}>
        <div style={{
          maxWidth: '1120px',
          margin: '0 auto'
        }}>
          {/* ===== ENCABEZADO CON PERFIL Y TEMA ===== */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '36px',
            flexWrap: 'wrap',
            gap: '16px',
            animation: 'fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}>
            <div>
              <h1 style={{
                fontSize: '30px',
                fontWeight: '800',
                color: modoOscuro ? '#ffffff' : '#0f172a',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                letterSpacing: '-0.02em'
              }}>
                Hola María
                <Sparkles size={24} strokeWidth={2} color="#2e9a6e" className="sparkle-icon" />
              </h1>
              <p style={{
                fontSize: '15px',
                fontWeight: '400',
                color: modoOscuro ? '#94a3b8' : '#64748b'
              }}>
                Estas son tus clases más activas de hoy.
              </p>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: modoOscuro ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(16px)',
              padding: '6px 12px',
              borderRadius: '16px',
              border: '1px solid ' + (modoOscuro ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)'),
              boxShadow: modoOscuro ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.03)'
            }}>
              {/* Selector de perfil (compacto) */}
              <ProfileSelector variant="compact" />
              <div style={{
                width: '1px',
                height: '20px',
                background: modoOscuro ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }}></div>
              {/* Toggle claro/oscuro */}
              <ThemeToggle variant="icon" />
            </div>
          </div>

          {/* ===== SECCIÓN 1: CLASES DESTACADAS ===== */}
          <div style={{
            marginBottom: '32px',
            animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards',
            opacity: 0
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <div style={{
                background: modoOscuro ? 'rgba(46, 154, 110, 0.15)' : 'rgba(46, 154, 110, 0.1)',
                padding: '8px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BookOpen size={18} strokeWidth={2} color="#2e9a6e" />
              </div>
              <h2 style={{
                fontSize: '19px',
                fontWeight: '700',
                color: modoOscuro ? '#f1f5f9' : '#0f172a',
                margin: 0,
                letterSpacing: '-0.01em'
              }}>
                Clases destacadas
              </h2>
              <span style={{
                fontSize: '13px',
                marginLeft: 'auto'
              }}>
                <a href="/aprendiz/clases" style={{
                  color: '#2e9a6e',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'opacity 0.2s ease'
                }}>
                  Ver todas →
                </a>
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {clasesDestacadas.map((clase, index) => (
                <div key={clase.id} style={{
                  animation: `fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + index * 0.1}s forwards`,
                  opacity: 0
                }}>
                  <CursoCard 
                    id={clase.id}
                    titulo={clase.titulo}
                    instructor={clase.instructor}
                    progreso={clase.progreso}
                    color={clase.color}
                    descripcion={clase.descripcion}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ===== SECCIÓN 2: ESTADO DE APRENDIZAJE ===== */}
          <div style={{
            marginBottom: '32px',
            animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
            opacity: 0
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <div style={{
                background: modoOscuro ? 'rgba(46, 154, 110, 0.15)' : 'rgba(46, 154, 110, 0.1)',
                padding: '8px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUp size={18} strokeWidth={2} color="#2e9a6e" />
              </div>
              <h2 style={{
                fontSize: '19px',
                fontWeight: '700',
                color: modoOscuro ? '#f1f5f9' : '#0f172a',
                margin: 0,
                letterSpacing: '-0.01em'
              }}>
                Mi estado de aprendizaje
              </h2>
            </div>

            <div style={{
              background: modoOscuro ? 'rgba(20, 26, 23, 0.65)' : 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '24px 28px',
              border: '1px solid ' + (modoOscuro ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'),
              boxShadow: modoOscuro 
                ? '0 20px 40px -15px rgba(0, 0, 0, 0.5)' 
                : '0 20px 40px -15px rgba(0, 0, 0, 0.05)'
            }}>
              {/* Barra de progreso general */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: modoOscuro ? '#cbd5e1' : '#475569'
                  }}>
                    Progreso general del programa
                  </span>
                  <span style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    color: '#2e9a6e',
                    letterSpacing: '-0.02em'
                  }}>
                    72%
                  </span>
                </div>
                <div style={{
                  height: '8px',
                  background: modoOscuro ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
                  borderRadius: '100px',
                  overflow: 'hidden',
                  padding: '2px'
                }}>
                  <div style={{
                    width: '72%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #1a7a4a, #2e9a6e, #36d399)',
                    borderRadius: '100px',
                    boxShadow: '0 0 12px rgba(46, 154, 110, 0.4)',
                    transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}></div>
                </div>
              </div>

              {/* Anillos */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '16px',
                justifyItems: 'center',
                padding: '12px 0'
              }}>
                <AnilloProgreso 
                  porcentaje={92}
                  tamaño={84}
                  color="#2e9a6e"
                  metrica="Comprensión"
                  valorTexto="Excelente"
                />
                <AnilloProgreso 
                  porcentaje={85}
                  tamaño={84}
                  color="#3498db"
                  metrica="Participación"
                  valorTexto="Alta"
                />
                <AnilloProgreso 
                  porcentaje={90}
                  tamaño={84}
                  color="#f39c12"
                  metrica="Entregas"
                  valorTexto="18/20"
                />
                <AnilloProgreso 
                  porcentaje={70}
                  tamaño={84}
                  color="#e74c3c"
                  metrica="Estudio"
                  valorTexto="5h 42m"
                />
              </div>

              {/* Última conexión */}
              <div style={{
                marginTop: '18px',
                padding: '10px 16px',
                background: modoOscuro ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.025)',
                borderRadius: '12px',
                border: '1px solid ' + (modoOscuro ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'),
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Clock size={15} strokeWidth={2} color="#2e9a6e" />
                <span style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: modoOscuro ? '#94a3b8' : '#64748b'
                }}>
                  Última conexión: <strong style={{ color: modoOscuro ? '#e2e8f0' : '#334155' }}>Hace 2 horas</strong>
                </span>
              </div>
            </div>
          </div>

          {/* ===== SECCIÓN 3: PRÓXIMAS ACTIVIDADES + ENCUESTA ===== */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px',
            animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards',
            opacity: 0
          }}>
            {/* Próximas actividades */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '16px'
              }}>
                <div style={{
                  background: modoOscuro ? 'rgba(46, 154, 110, 0.15)' : 'rgba(46, 154, 110, 0.1)',
                  padding: '8px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Calendar size={18} strokeWidth={2} color="#2e9a6e" />
                </div>
                <h2 style={{
                  fontSize: '17px',
                  fontWeight: '700',
                  color: modoOscuro ? '#f1f5f9' : '#0f172a',
                  margin: 0,
                  letterSpacing: '-0.01em'
                }}>
                  Próximas actividades
                </h2>
              </div>

              <div style={{
                background: modoOscuro ? 'rgba(20, 26, 23, 0.65)' : 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '18px 20px',
                border: '1px solid ' + (modoOscuro ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'),
                boxShadow: modoOscuro ? '0 15px 30px rgba(0,0,0,0.35)' : '0 15px 30px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {[
                  { icon: Calendar, color: '#2e9a6e', label: 'Clase en vivo', sub: 'Fundamentos', fecha: 'Hoy 9:00 AM' },
                  { icon: FileCheck, color: '#f39c12', label: 'Entrega Taller 2', sub: 'Accesibilidad', fecha: 'Mañana' },
                  { icon: Award, color: '#e74c3c', label: 'Evaluación', sub: 'Diseño Universal', fecha: 'Viernes' }
                ].map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: modoOscuro ? 'rgba(255, 255, 255, 0.025)' : 'rgba(0, 0, 0, 0.02)',
                    borderRadius: '14px',
                    border: '1px solid ' + (modoOscuro ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'),
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = modoOscuro ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = modoOscuro ? '0 6px 16px rgba(0,0,0,0.3)' : '0 6px 16px rgba(0,0,0,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = modoOscuro ? 'rgba(255, 255, 255, 0.025)' : 'rgba(0, 0, 0, 0.02)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        background: `${item.color}15`,
                        padding: '8px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <item.icon size={16} strokeWidth={2} color={item.color} />
                      </div>
                      <div>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: modoOscuro ? '#f1f5f9' : '#1e293b',
                          display: 'block',
                          lineHeight: '1.2'
                        }}>
                          {item.label}
                        </span>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '400',
                          color: modoOscuro ? '#94a3b8' : '#64748b',
                          display: 'block',
                          marginTop: '3px'
                        }}>
                          {item.sub}
                        </span>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: item.color,
                      background: `${item.color}12`,
                      padding: '4px 10px',
                      borderRadius: '8px',
                      border: `1px solid ${item.color}25`
                    }}>
                      {item.fecha}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Encuesta */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '16px'
              }}>
                <div style={{
                  background: modoOscuro ? 'rgba(46, 154, 110, 0.15)' : 'rgba(46, 154, 110, 0.1)',
                  padding: '8px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Zap size={18} strokeWidth={2} color="#2e9a6e" />
                </div>
                <h2 style={{
                  fontSize: '17px',
                  fontWeight: '700',
                  color: modoOscuro ? '#f1f5f9' : '#0f172a',
                  margin: 0,
                  letterSpacing: '-0.01em'
                }}>
                  Retroalimentación
                </h2>
              </div>
              <Encuesta 
                pregunta={`¿Cómo te sentiste en "${claseActiva.titulo}"?`}
                opciones={opcionesEncuesta}
                onEnviar={(respuesta) => console.log('Encuesta:', respuesta)}
              />
            </div>
          </div>
        </div>
      </div>

      <ChatLAIA nombre="María" />

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

export default DashboardAprendiz;