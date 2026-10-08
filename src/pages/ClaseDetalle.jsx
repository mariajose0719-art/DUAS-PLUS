import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  Clock, 
  Award, 
  Download,
  Sparkles
} from 'lucide-react';

function ClaseDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { modoOscuro } = useTheme();

  const clasesData = {
    '1': {
      id: 1,
      titulo: 'Fundamentos de Programación',
      instructor: 'Carlos Rodríguez',
      descripcion: 'Aprende los conceptos básicos de programación: variables, condicionales, ciclos y funciones.',
      color: '#2e9a6e',
      progreso: 78,
      lecciones: [
        { titulo: 'Variables y tipos de datos', completado: true, duracion: '15 min' },
        { titulo: 'Estructuras condicionales', completado: true, duracion: '20 min' },
        { titulo: 'Ciclos (for, while)', completado: false, duracion: '25 min' },
        { titulo: 'Funciones básicas', completado: false, duracion: '30 min' },
      ],
      recursos: [
        { nombre: 'Guía de programación.pdf', tipo: 'PDF' },
        { nombre: 'Ejercicios prácticos.zip', tipo: 'ZIP' },
      ],
      actividades: [
        { titulo: 'Taller 1: Variables', estado: 'entregado', fecha: '15/06/2024' },
        { titulo: 'Taller 2: Condicionales', estado: 'pendiente', fecha: '22/06/2024' },
      ]
    },
    '2': {
      id: 2,
      titulo: 'Diseño Universal para el Aprendizaje',
      instructor: 'María Fernández',
      descripcion: 'Metodologías inclusivas para crear experiencias de aprendizaje accesibles.',
      color: '#3498db',
      progreso: 45,
      lecciones: [
        { titulo: 'Principios del DUA', completado: true, duracion: '20 min' },
        { titulo: 'Accesibilidad en el diseño', completado: false, duracion: '25 min' },
        { titulo: 'Herramientas de evaluación', completado: false, duracion: '30 min' },
      ],
      recursos: [
        { nombre: 'Guía DUA.pdf', tipo: 'PDF' },
      ],
      actividades: [
        { titulo: 'Análisis de accesibilidad', estado: 'pendiente', fecha: '20/06/2024' },
      ]
    },
    '3': {
      id: 3,
      titulo: 'Accesibilidad Digital',
      instructor: 'Ana Martínez',
      descripcion: 'Pautas WCAG y herramientas para crear contenido digital accesible.',
      color: '#f39c12',
      progreso: 92,
      lecciones: [
        { titulo: 'Introducción a WCAG', completado: true, duracion: '15 min' },
        { titulo: 'Contraste y color', completado: true, duracion: '20 min' },
        { titulo: 'Etiquetas ARIA', completado: true, duracion: '25 min' },
        { titulo: 'Navegación por teclado', completado: false, duracion: '20 min' },
      ],
      recursos: [
        { nombre: 'Checklist WCAG.pdf', tipo: 'PDF' },
        { nombre: 'Herramientas de testing.zip', tipo: 'ZIP' },
      ],
      actividades: [
        { titulo: 'Evaluación de accesibilidad', estado: 'calificado', fecha: '10/06/2024', nota: '4.5' },
      ]
    },
    '4': {
      id: 4,
      titulo: 'Inglés Técnico',
      instructor: 'Laura Sánchez',
      descripcion: 'Vocabulario y comprensión de textos técnicos en inglés.',
      color: '#9b59b6',
      progreso: 60,
      lecciones: [
        { titulo: 'Vocabulario básico', completado: true, duracion: '20 min' },
        { titulo: 'Lectura de textos', completado: false, duracion: '30 min' },
      ],
      recursos: [
        { nombre: 'Glosario inglés-español.pdf', tipo: 'PDF' },
      ],
      actividades: [
        { titulo: 'Traducción de texto', estado: 'pendiente', fecha: '25/06/2024' },
      ]
    },
    '5': {
      id: 5,
      titulo: 'Seguridad en el Trabajo',
      instructor: 'Pedro Ramírez',
      descripcion: 'Normas de seguridad y prevención de riesgos laborales.',
      color: '#e74c3c',
      progreso: 30,
      lecciones: [
        { titulo: 'Normas básicas', completado: true, duracion: '15 min' },
        { titulo: 'Equipos de protección', completado: false, duracion: '25 min' },
        { titulo: 'Señalización', completado: false, duracion: '20 min' },
      ],
      recursos: [
        { nombre: 'Manual de seguridad.pdf', tipo: 'PDF' },
      ],
      actividades: [
        { titulo: 'Evaluación de riesgos', estado: 'pendiente', fecha: '28/06/2024' },
      ]
    }
  };

  const clase = clasesData[id];

  if (!clase) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--color-fondo)',
        color: 'var(--color-texto)',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '40px',
        fontFamily: 'var(--fuente)'
      }}>
        <h1 style={{ fontSize: 'calc(var(--tamano-fuente) * 2)' }}>Clase no encontrada</h1>
        <button 
          onClick={() => navigate('/aprendiz/clases')} 
          style={{
            padding: '12px 28px',
            background: 'linear-gradient(135deg, var(--color-primary), #2e9a6e)',
            border: 'none',
            borderRadius: '14px',
            color: '#fff',
            cursor: 'pointer',
            marginTop: '16px',
            fontFamily: 'var(--fuente)',
            fontSize: 'var(--tamano-fuente)',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Volver a mis clases
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--color-fondo)',
      color: 'var(--color-texto)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.3s ease, color 0.3s ease',
      padding: '32px 40px'
    }}>
      {/* Fondo dinámico */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: modoOscuro 
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
            `,
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
        }}></div>
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
        }}></div>
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
        }}></div>
      </div>

      {/* Contenido */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Botón volver */}
        <button
          onClick={() => navigate('/aprendiz/clases')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--color-fondo-card)',
            border: '1px solid var(--color-borde)',
            borderRadius: '14px',
            color: 'var(--color-texto)',
            cursor: 'pointer',
            padding: '10px 20px',
            fontFamily: 'var(--fuente)',
            fontSize: 'var(--tamano-fuente)',
            fontWeight: '500',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            marginBottom: '24px',
            boxShadow: 'var(--sombra)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = modoOscuro ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-fondo-card)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <ArrowLeft size={18} strokeWidth={2} />
          Volver a mis clases
        </button>

        {/* Header de la clase */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '8px'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: `linear-gradient(135deg, ${clase.color}, ${clase.color}dd)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'calc(var(--tamano-fuente) * 1.5)',
                fontWeight: '700',
                color: '#ffffff',
                boxShadow: `0 8px 24px ${clase.color}44`
              }}>
                {clase.titulo.charAt(0)}
              </div>
              <div>
                <h1 style={{
                  fontSize: 'calc(var(--tamano-fuente) * 1.75)',
                  fontWeight: '700',
                  margin: 0,
                  color: 'var(--color-texto)',
                  letterSpacing: '-0.5px'
                }}>
                  {clase.titulo}
                </h1>
                <p style={{
                  fontSize: 'calc(var(--tamano-fuente) * 0.9375)',
                  color: modoOscuro ? '#a8b3b0' : '#555',
                  margin: 0
                }}>
                  {clase.instructor} · {clase.progreso}% completado
                </p>
              </div>
            </div>
            <p style={{
              fontSize: 'calc(var(--tamano-fuente) * 1.0625)',
              color: modoOscuro ? '#a8b3b0' : '#555',
              maxWidth: '600px',
              marginTop: '8px',
              lineHeight: '1.6'
            }}>
              {clase.descripcion}
            </p>
          </div>
          <div style={{
            padding: '8px 20px',
            background: `rgba(46, 154, 110, 0.15)`,
            borderRadius: '100px',
            border: `1px solid rgba(46, 154, 110, 0.2)`,
            alignSelf: 'center'
          }}>
            <span style={{ 
              color: '#2e9a6e', 
              fontWeight: '600', 
              fontSize: 'calc(var(--tamano-fuente) * 0.875)' 
            }}>
              {clase.progreso}% completado
            </span>
          </div>
        </div>

        {/* Grid de contenido */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '32px'
        }}>
          {/* Columna izquierda: Lecciones */}
          <div>
            <h2 style={{
              fontSize: 'calc(var(--tamano-fuente) * 1.25)',
              fontWeight: '600',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--color-texto)'
            }}>
              <BookOpen size={22} strokeWidth={1.5} color="var(--color-primary)" />
              Lecciones
            </h2>
            <div style={{
              background: 'var(--color-fondo-card)',
              backdropFilter: 'blur(16px)',
              borderRadius: '20px',
              border: '1px solid var(--color-borde)',
              boxShadow: 'var(--sombra)',
              overflow: 'hidden'
            }}>
              {clase.lecciones.map((leccion, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderBottom: index < clase.lecciones.length - 1 ? `1px solid var(--color-borde)` : 'none',
                  transition: 'background 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = modoOscuro ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ marginRight: '16px' }}>
                    {leccion.completado ? (
                      <CheckCircle size={22} strokeWidth={1.5} color="#2e9a6e" />
                    ) : (
                      <Clock size={22} strokeWidth={1.5} color="#6a7a75" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{
                      fontSize: 'calc(var(--tamano-fuente) * 0.9375)',
                      fontWeight: leccion.completado ? '400' : '500',
                      color: leccion.completado ? modoOscuro ? '#a8b3b0' : '#888' : 'var(--color-texto)',
                      textDecoration: leccion.completado ? 'line-through' : 'none'
                    }}>
                      {leccion.titulo}
                    </span>
                  </div>
                  <span style={{
                    color: '#6a7a75',
                    fontSize: 'calc(var(--tamano-fuente) * 0.8125)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Clock size={14} strokeWidth={1.5} />
                    {leccion.duracion}
                  </span>
                </div>
              ))}
            </div>

            {/* Recursos */}
            <div style={{ marginTop: '32px' }}>
              <h2 style={{
                fontSize: 'calc(var(--tamano-fuente) * 1.25)',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--color-texto)'
              }}>
                <FileText size={22} strokeWidth={1.5} color="var(--color-primary)" />
                Recursos
              </h2>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                {clase.recursos.map((recurso, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 20px',
                    background: 'var(--color-fondo-card)',
                    borderRadius: '14px',
                    border: '1px solid var(--color-borde)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: 'var(--sombra)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = modoOscuro ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--color-fondo-card)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  >
                    <Download size={18} strokeWidth={1.5} color="var(--color-primary)" />
                    <span style={{ fontSize: 'calc(var(--tamano-fuente) * 0.875)', color: 'var(--color-texto)' }}>
                      {recurso.nombre}
                    </span>
                    <span style={{
                      fontSize: 'calc(var(--tamano-fuente) * 0.75)',
                      padding: '2px 10px',
                      background: 'rgba(255,255,255,0.06)',
                      borderRadius: '100px',
                      color: '#6a7a75'
                    }}>
                      {recurso.tipo}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha: Actividades */}
          <div>
            <h2 style={{
              fontSize: 'calc(var(--tamano-fuente) * 1.25)',
              fontWeight: '600',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--color-texto)'
            }}>
              <Award size={22} strokeWidth={1.5} color="var(--color-primary)" />
              Actividades
            </h2>
            <div style={{
              background: 'var(--color-fondo-card)',
              backdropFilter: 'blur(16px)',
              borderRadius: '20px',
              border: '1px solid var(--color-borde)',
              boxShadow: 'var(--sombra)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              {clase.actividades.map((actividad, index) => {
                const estadoColor = 
                  actividad.estado === 'entregado' ? '#2e9a6e' :
                  actividad.estado === 'calificado' ? '#3498db' :
                  '#f39c12';
                const estadoBg = 
                  actividad.estado === 'entregado' ? 'rgba(46,154,110,0.15)' :
                  actividad.estado === 'calificado' ? 'rgba(52,152,219,0.15)' :
                  'rgba(243,156,18,0.15)';
                const estadoLabel = 
                  actividad.estado === 'entregado' ? '✅ Entregado' :
                  actividad.estado === 'calificado' ? '⭐ Calificado' :
                  '⏳ Pendiente';

                return (
                  <div key={index} style={{
                    padding: '16px',
                    background: 'var(--color-fondo-card)',
                    borderRadius: '14px',
                    border: `1px solid var(--color-borde)`,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = modoOscuro ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-fondo-card)'}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontSize: 'calc(var(--tamano-fuente) * 0.9375)',
                        fontWeight: '500',
                        color: 'var(--color-texto)'
                      }}>
                        {actividad.titulo}
                      </span>
                      <span style={{
                        fontSize: 'calc(var(--tamano-fuente) * 0.75)',
                        padding: '4px 14px',
                        borderRadius: '100px',
                        background: estadoBg,
                        color: estadoColor,
                        fontWeight: '500'
                      }}>
                        {estadoLabel}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '8px',
                      fontSize: 'calc(var(--tamano-fuente) * 0.8125)',
                      color: '#6a7a75'
                    }}>
                      <span>Fecha: {actividad.fecha}</span>
                      {actividad.nota && <span>Nota: {actividad.nota}/5</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progreso general */}
            <div style={{
              marginTop: '24px',
              padding: '20px',
              background: 'var(--color-fondo-card)',
              backdropFilter: 'blur(16px)',
              borderRadius: '20px',
              border: '1px solid var(--color-borde)',
              boxShadow: 'var(--sombra)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ 
                  fontSize: 'calc(var(--tamano-fuente) * 0.875)', 
                  color: modoOscuro ? '#a8b3b0' : '#555' 
                }}>
                  Progreso general
                </span>
                <span style={{
                  fontSize: 'calc(var(--tamano-fuente) * 1.125)',
                  fontWeight: '700',
                  color: clase.color
                }}>
                  {clase.progreso}%
                </span>
              </div>
              <div style={{
                height: '8px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '100px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${clase.progreso}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${clase.color}, ${clase.color}dd)`,
                  borderRadius: '100px',
                  boxShadow: `0 0 20px ${clase.color}44`,
                  transition: 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClaseDetalle;