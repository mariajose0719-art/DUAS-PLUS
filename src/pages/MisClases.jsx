import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';
import CursoCard from '../components/aprendiz/CursoCard';

function MisClases() {
  const navigate = useNavigate();
  const { modoOscuro } = useTheme();

  const clases = [
    { 
      id: 1,
      titulo: 'Fundamentos de Programación',
      instructor: 'Carlos Rodríguez',
      progreso: 78,
      color: '#2e9a6e',
      descripcion: 'Algoritmos y lógica de programación'
    },
    { 
      id: 2,
      titulo: 'Diseño Universal para el Aprendizaje',
      instructor: 'María Fernández',
      progreso: 45,
      color: '#3498db',
      descripcion: 'Metodologías inclusivas'
    },
    { 
      id: 3,
      titulo: 'Accesibilidad Digital',
      instructor: 'Ana Martínez',
      progreso: 92,
      color: '#f39c12',
      descripcion: 'Pautas WCAG y herramientas'
    },
    { 
      id: 4,
      titulo: 'Inglés Técnico',
      instructor: 'Laura Sánchez',
      progreso: 60,
      color: '#9b59b6',
      descripcion: 'Vocabulario y comprensión de textos técnicos'
    },
    { 
      id: 5,
      titulo: 'Seguridad en el Trabajo',
      instructor: 'Pedro Ramírez',
      progreso: 30,
      color: '#e74c3c',
      descripcion: 'Normas de seguridad y prevención de riesgos'
    }
  ];

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

      {/* Contenido principal */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Encabezado con botón volver */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/aprendiz')}
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
            Volver al dashboard
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BookOpen size={28} strokeWidth={1.5} color="var(--color-primary)" />
            <h1 style={{
              fontSize: 'calc(var(--tamano-fuente) * 1.75)',
              fontWeight: '700',
              margin: 0,
              color: 'var(--color-texto)',
              letterSpacing: '-0.5px'
            }}>
              Mis clases
            </h1>
          </div>

          <span style={{
            marginLeft: 'auto',
            fontSize: 'calc(var(--tamano-fuente) * 0.875)',
            color: modoOscuro ? '#6a7a75' : '#888',
            background: 'var(--color-fondo-card)',
            padding: '4px 16px',
            borderRadius: '100px',
            border: '1px solid var(--color-borde)'
          }}>
            {clases.length} clases
          </span>
        </div>

        <p style={{
          fontSize: 'calc(var(--tamano-fuente) * 1.0625)',
          color: modoOscuro ? '#a8b3b0' : '#555',
          marginBottom: '32px',
          letterSpacing: '-0.2px'
        }}>
          Todas tus clases con su progreso y estado actual.
        </p>

        {/* Grid de clases */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {clases.map((clase) => (
            <CursoCard
              key={clase.id}
              id={clase.id}
              titulo={clase.titulo}
              instructor={clase.instructor}
              progreso={clase.progreso}
              color={clase.color}
              descripcion={clase.descripcion}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MisClases;