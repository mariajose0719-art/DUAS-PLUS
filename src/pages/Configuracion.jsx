import { useNavigate } from 'react-router-dom';
import { Settings, ArrowLeft, Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ProfileSelector from '../components/ProfileSelector';
import ThemeToggle from '../components/ThemeToggle';

function Configuracion() {
  const navigate = useNavigate();
  const { modoOscuro, perfilConfig } = useTheme();
  const Icon = perfilConfig.icon;

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
        maxWidth: '800px',
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
            onClick={() => navigate('/aprendiz')}
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
          <Settings size={28} strokeWidth={1.5} color="var(--color-primary)" />
          <h1 style={{
            fontSize: 'calc(var(--tamano-fuente) * 1.75)',
            fontWeight: '700',
            margin: 0,
            color: 'var(--color-texto)',
            letterSpacing: '-0.5px'
          }}>
            Configuración
          </h1>
          <span style={{
            fontSize: 'calc(var(--tamano-fuente) * 0.875)',
            color: modoOscuro ? '#6a7a75' : '#888',
            marginLeft: 'auto'
          }}>
            <Sparkles size={16} strokeWidth={1.5} color="var(--color-primary)" style={{ marginRight: '6px' }} />
            Personaliza tu experiencia
          </span>
        </div>
        <p style={{ 
          color: modoOscuro ? '#a8b3b0' : '#555', 
          fontSize: 'calc(var(--tamano-fuente) * 0.9375)', 
          marginBottom: '28px', 
          marginLeft: '52px',
          letterSpacing: '-0.2px'
        }}>
          Ajusta la plataforma a tus necesidades.
        </p>

        {/* Apariencia */}
        <div style={{
          background: 'var(--color-fondo-card)',
          backdropFilter: 'blur(16px)',
          borderRadius: '24px',
          padding: '28px 32px',
          border: '1px solid var(--color-borde)',
          boxShadow: 'var(--sombra)',
          marginBottom: '24px',
          transition: 'all 0.3s ease'
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
            {modoOscuro ? (
              <Moon size={22} strokeWidth={1.5} color="var(--color-primary)" />
            ) : (
              <Sun size={22} strokeWidth={1.5} color="var(--color-primary)" />
            )}
            Apariencia
          </h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center'
          }}>
            <ThemeToggle variant="button" />
            <span style={{
              fontSize: 'calc(var(--tamano-fuente) * 0.875)',
              color: modoOscuro ? '#a8b3b0' : '#555'
            }}>
              {modoOscuro ? 'Modo oscuro activo' : 'Modo claro activo'}
            </span>
          </div>
        </div>

        {/* Perfil de accesibilidad */}
        <div style={{
          background: 'var(--color-fondo-card)',
          backdropFilter: 'blur(16px)',
          borderRadius: '24px',
          padding: '28px 32px',
          border: '1px solid var(--color-borde)',
          boxShadow: 'var(--sombra)',
          marginBottom: '24px',
          transition: 'all 0.3s ease'
        }}>
          <h2 style={{
            fontSize: 'calc(var(--tamano-fuente) * 1.125)',
            fontWeight: '600',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--color-texto)'
          }}>
            <Icon size={24} strokeWidth={1.5} color="var(--color-primary)" />
            Perfil de accesibilidad
          </h2>
          <p style={{
            color: modoOscuro ? '#a8b3b0' : '#555',
            fontSize: 'calc(var(--tamano-fuente) * 0.875)',
            marginBottom: '16px'
          }}>
            {perfilConfig.descripcion}
          </p>
          <div style={{ marginBottom: '24px' }}>
            <ProfileSelector variant="dropdown" />
          </div>
          <div style={{
            padding: '12px 16px',
            background: modoOscuro ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            borderRadius: '10px',
            border: '1px solid var(--color-borde)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            fontSize: 'calc(var(--tamano-fuente) * 0.8125)',
            color: modoOscuro ? '#6a7a75' : '#888'
          }}>
            <span>Fuente: <strong style={{ color: 'var(--color-texto)' }}>{perfilConfig.fuente}</strong></span>
            <span>•</span>
            <span>Tamaño: <strong style={{ color: 'var(--color-texto)' }}>{perfilConfig.tamañoFuente}px</strong></span>
            <span>•</span>
            <span>Espaciado: <strong style={{ color: 'var(--color-texto)' }}>{perfilConfig.espaciado}</strong></span>
            <span>•</span>
            <span>Contraste: <strong style={{ color: 'var(--color-texto)' }}>{perfilConfig.contraste}</strong></span>
          </div>
        </div>
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

export default Configuracion;