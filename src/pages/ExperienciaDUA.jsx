import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff,
  Contrast,
  Volume2,
  Moon,
  Sun,
  Type,
  Bot,
  Brain,
  Heart,
  Users,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function ExperienciaDUA() {
  const navigate = useNavigate();
  const { modoOscuro } = useTheme();
  const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);

  const perfiles = [
    { 
      id: 'visual', 
      label: 'Discapacidad visual', 
      icon: EyeOff, 
      color: '#2e9a6e',
      desc: 'Activa herramientas como lector de voz, lupa y alto contraste.'
    },
    { 
      id: 'baja-vision', 
      label: 'Baja visión', 
      icon: Eye, 
      color: '#3498db',
      desc: 'Aumenta el tamaño de fuente, contraste y activa lupa.'
    },
    { 
      id: 'daltonismo', 
      label: 'Daltonismo', 
      icon: Contrast, 
      color: '#f39c12',
      desc: 'Ajusta los colores para mejorar la distinción de tonos.'
    },
    { 
      id: 'auditiva', 
      label: 'Discapacidad auditiva', 
      icon: Volume2, 
      color: '#e74c3c',
      desc: 'Activa subtítulos, transcripción y avatar en señas.'
    },
    { 
      id: 'tdah', 
      label: 'TDAH', 
      icon: Brain, 
      color: '#9b59b6',
      desc: 'Divide actividades, añade recordatorios y modo calma.'
    },
    { 
      id: 'tea', 
      label: 'TEA', 
      icon: Sun, 
      color: '#1abc9c',
      desc: 'Activa modo no molestar, rutinas y pictogramas.'
    },
    { 
      id: 'dislexia', 
      label: 'Dislexia', 
      icon: Type, 
      color: '#e67e22',
      desc: 'Usa fuente OpenDyslexic, lectura palabra por palabra.'
    },
    { 
      id: 'cognitiva', 
      label: 'Discapacidad cognitiva', 
      icon: Bot, 
      color: '#2c3e50',
      desc: 'Explicaciones sencillas, ejemplos cotidianos.'
    },
    { 
      id: 'ansiedad', 
      label: 'Ansiedad', 
      icon: Heart, 
      color: '#8e44ad',
      desc: 'Modo calma, modo no molestar.'
    },
  ];

  const handleSeleccionar = (id) => {
    setPerfilSeleccionado(id === perfilSeleccionado ? null : id);
  };

  // Fondo dinámico
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
          <Eye size={28} strokeWidth={1.5} color="var(--color-primary)" />
          <h1 style={{
            fontSize: 'calc(var(--tamano-fuente) * 1.75)',
            fontWeight: '700',
            margin: 0,
            color: 'var(--color-texto)',
            letterSpacing: '-0.5px'
          }}>
            Experiencia DUAS+
          </h1>
          <span style={{
            fontSize: 'calc(var(--tamano-fuente) * 0.875)',
            color: modoOscuro ? '#6a7a75' : '#888',
            marginLeft: 'auto'
          }}>
            <Sparkles size={16} strokeWidth={1.5} color="var(--color-primary)" style={{ marginRight: '6px' }} />
            Visualiza adaptaciones por perfil
          </span>
        </div>
        <p style={{ 
          color: modoOscuro ? '#a8b3b0' : '#555', 
          fontSize: 'calc(var(--tamano-fuente) * 0.9375)', 
          marginBottom: '28px', 
          marginLeft: '52px',
          letterSpacing: '-0.2px'
        }}>
          Selecciona un perfil para ver cómo se adapta la plataforma.
        </p>

        {/* Grid de perfiles */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {perfiles.map((perfil) => (
            <div
              key={perfil.id}
              onClick={() => handleSeleccionar(perfil.id)}
              style={{
                background: 'var(--color-fondo-card)',
                backdropFilter: 'blur(16px)',
                borderRadius: '20px',
                padding: '24px',
                border: perfilSeleccionado === perfil.id 
                  ? `2px solid ${perfil.color}` 
                  : '1px solid var(--color-borde)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: perfilSeleccionado === perfil.id 
                  ? `0 8px 32px ${perfil.color}33` 
                  : 'var(--sombra)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (perfilSeleccionado !== perfil.id) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (perfilSeleccionado !== perfil.id) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--sombra)';
                }
              }}
            >
              {/* Efecto de glow en la esquina */}
              <div style={{
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${perfil.color}33, transparent 70%)`,
                opacity: 0.6,
                pointerEvents: 'none'
              }} />
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: `linear-gradient(135deg, ${perfil.color}, ${perfil.color}dd)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 16px ${perfil.color}44`
                }}>
                  <perfil.icon size={24} strokeWidth={1.5} color="#ffffff" />
                </div>
                <h3 style={{
                  fontSize: 'calc(var(--tamano-fuente) * 1.0625)',
                  fontWeight: '600',
                  margin: 0,
                  color: 'var(--color-texto)'
                }}>
                  {perfil.label}
                </h3>
              </div>
              <p style={{
                fontSize: 'calc(var(--tamano-fuente) * 0.875)',
                color: modoOscuro ? '#a8b3b0' : '#555',
                margin: 0,
                lineHeight: '1.6'
              }}>
                {perfil.desc}
              </p>
              {perfilSeleccionado === perfil.id && (
                <div style={{
                  marginTop: '14px',
                  paddingTop: '12px',
                  borderTop: `1px solid ${perfil.color}33`,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    fontSize: 'calc(var(--tamano-fuente) * 0.8125)',
                    color: perfil.color,
                    fontWeight: '600'
                  }}>
                    Perfil activo
                  </span>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: perfil.color,
                    boxShadow: `0 0 16px ${perfil.color}`
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sección de vista previa (cuando un perfil está seleccionado) */}
        {perfilSeleccionado && (
          <div style={{
            background: 'var(--color-fondo-card)',
            backdropFilter: 'blur(16px)',
            borderRadius: '24px',
            padding: '28px 32px',
            border: '1px solid var(--color-borde)',
            boxShadow: 'var(--sombra)',
            marginTop: '8px',
            animation: 'fadeIn 0.4s ease'
          }}>
            <h2 style={{
              fontSize: 'calc(var(--tamano-fuente) * 1.125)',
              fontWeight: '600',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--color-texto)'
            }}>
              <span>🔍</span>
              Vista previa del perfil seleccionado
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px'
            }}>
              <div>
                <p style={{
                  color: modoOscuro ? '#a8b3b0' : '#555',
                  fontSize: 'calc(var(--tamano-fuente) * 0.9375)',
                  marginBottom: '12px'
                }}>
                  <strong>Herramientas activadas:</strong>
                </p>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <li style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 14px',
                    background: 'var(--color-fondo-card)',
                    borderRadius: '10px',
                    border: '1px solid var(--color-borde)',
                    color: 'var(--color-texto)',
                    fontSize: 'calc(var(--tamano-fuente) * 0.875)'
                  }}>
                    <span style={{ color: 'var(--color-primary)' }}>✓</span> Lector de voz
                  </li>
                  <li style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 14px',
                    background: 'var(--color-fondo-card)',
                    borderRadius: '10px',
                    border: '1px solid var(--color-borde)',
                    color: 'var(--color-texto)',
                    fontSize: 'calc(var(--tamano-fuente) * 0.875)'
                  }}>
                    <span style={{ color: 'var(--color-primary)' }}>✓</span> Alto contraste
                  </li>
                  <li style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 14px',
                    background: 'var(--color-fondo-card)',
                    borderRadius: '10px',
                    border: '1px solid var(--color-borde)',
                    color: 'var(--color-texto)',
                    fontSize: 'calc(var(--tamano-fuente) * 0.875)'
                  }}>
                    <span style={{ color: 'var(--color-primary)' }}>✓</span> Lupa
                  </li>
                </ul>
              </div>
              <div>
                <p style={{
                  color: modoOscuro ? '#a8b3b0' : '#555',
                  fontSize: 'calc(var(--tamano-fuente) * 0.9375)',
                  marginBottom: '12px'
                }}>
                  <strong>Ejemplo de contenido adaptado:</strong>
                </p>
                <div style={{
                  padding: '16px',
                  background: 'var(--color-fondo-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--color-borde)',
                  color: 'var(--color-texto)',
                  fontSize: 'calc(var(--tamano-fuente) * 1.125)',
                  lineHeight: '1.8'
                }}>
                  <p style={{ margin: 0 }}>
                    Este es un ejemplo de cómo se vería el contenido con las herramientas activadas. 
                    Texto con mayor tamaño, contraste y espaciado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default ExperienciaDUA;