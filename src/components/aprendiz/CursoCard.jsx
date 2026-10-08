import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

function CursoCard({ id, titulo, instructor, progreso, color, descripcion }) {
  const navigate = useNavigate();
  const { modoOscuro } = useTheme();

  const handleContinuar = () => {
    navigate(`/aprendiz/clase/${id}`);
  };

  return (
    <div style={{
      position: 'relative',
      borderRadius: '24px',
      overflow: 'hidden',
      background: 'var(--color-fondo-card)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--color-borde)',
      boxShadow: 'var(--sombra)',
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
      e.currentTarget.style.boxShadow = modoOscuro ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.15)';
      e.currentTarget.style.borderColor = 'rgba(46,154,110,0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = 'var(--sombra)';
      e.currentTarget.style.borderColor = 'var(--color-borde)';
    }}
    >
      {/* Cabecera con color */}
      <div style={{
        padding: '20px 24px 16px',
        background: `linear-gradient(135deg, ${color}33, transparent)`,
        borderBottom: '1px solid var(--color-borde)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: `linear-gradient(135deg, ${color}, ${color}dd)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: '20px',
          fontWeight: '700',
          color: '#ffffff',
          boxShadow: `0 4px 16px ${color}44`
        }}>
          {titulo.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontFamily: 'var(--fuente)',
            fontSize: 'calc(var(--tamano-fuente) * 1.125)',
            fontWeight: '600',
            color: 'var(--color-texto)',
            marginBottom: '2px',
            letterSpacing: '-0.3px'
          }}>
            {titulo}
          </h3>
          <p style={{
            fontFamily: 'var(--fuente)',
            fontSize: 'calc(var(--tamano-fuente) * 0.8125)',
            color: modoOscuro ? '#a8b3b0' : '#555'
          }}>
            {instructor}
          </p>
        </div>
      </div>

      {/* Descripción */}
      {descripcion && (
        <div style={{ padding: '12px 24px 0' }}>
          <p style={{
            fontFamily: 'var(--fuente)',
            fontSize: 'calc(var(--tamano-fuente) * 0.875)',
            color: modoOscuro ? '#6a7a75' : '#888'
          }}>
            {descripcion}
          </p>
        </div>
      )}

      {/* Barra de progreso y botón */}
      <div style={{
        padding: '16px 24px 24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            flex: 1,
            height: '6px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '100px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progreso}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${color}, ${color}dd)`,
              borderRadius: '100px',
              boxShadow: `0 0 12px ${color}44`,
              transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}></div>
          </div>
          <span style={{
            fontFamily: 'var(--fuente)',
            fontSize: 'calc(var(--tamano-fuente) * 0.875)',
            fontWeight: '600',
            color: 'var(--color-texto)',
            minWidth: '44px'
          }}>
            {progreso}%
          </span>
        </div>

        <button
          onClick={handleContinuar}
          style={{
            marginTop: '16px',
            padding: '12px 24px',
            background: `linear-gradient(135deg, ${color}, ${color}dd)`,
            border: 'none',
            borderRadius: '14px',
            color: '#ffffff',
            fontFamily: 'var(--fuente)',
            fontSize: 'calc(var(--tamano-fuente) * 0.9375)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: `0 4px 20px ${color}44`,
            width: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)';
            e.currentTarget.style.boxShadow = `0 8px 32px ${color}66`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = `0 4px 20px ${color}44`;
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

export default CursoCard;