import { useTheme, PERFIL_CONFIG } from '../context/ThemeContext';
import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

function ProfileSelector({ variant = 'dropdown' }) {
  const { perfil, setPerfil, perfilConfig, modoOscuro } = useTheme();
  const [abierto, setAbierto] = useState(false);

  const handleSelect = (key) => {
    setPerfil(key);
    setAbierto(false);
  };

  const isModoOscuro = modoOscuro;
  const IconComponent = perfilConfig.icon;

  if (variant === 'compact') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 16px',
        background: 'var(--color-fondo-card)',
        borderRadius: '100px',
        border: '1px solid var(--color-borde)',
        fontSize: 'calc(var(--tamano-fuente) * 0.8125)',
        color: 'var(--color-texto)',
        cursor: 'default'
      }}>
        <IconComponent size={18} strokeWidth={1.5} color="var(--color-primary)" />
        <span>{perfilConfig.label}</span>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      <button
        onClick={() => setAbierto(!abierto)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 18px',
          background: 'var(--color-fondo-card)',
          border: '1px solid var(--color-borde)',
          borderRadius: '14px',
          color: 'var(--color-texto)',
          cursor: 'pointer',
          fontFamily: 'var(--fuente)',
          fontSize: 'var(--tamano-fuente)',
          transition: 'all 0.3s ease',
          width: '100%',
          justifyContent: 'space-between'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = isModoOscuro ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--color-fondo-card)';
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconComponent size={20} strokeWidth={1.5} color="var(--color-primary)" />
          <span>{perfilConfig.label}</span>
        </span>
        <ChevronDown size={18} strokeWidth={1.5} />
      </button>

      {abierto && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          right: 0,
          background: isModoOscuro ? 'rgba(20,24,22,0.98)' : 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid var(--color-borde)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          padding: '8px',
          zIndex: 100,
          maxHeight: '280px',
          overflowY: 'auto',
          animation: 'slideDown 0.2s ease'
        }}>
          {Object.entries(PERFIL_CONFIG).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <div
                key={key}
                onClick={() => handleSelect(key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: perfil === key 
                    ? (isModoOscuro ? 'rgba(46,154,110,0.20)' : 'rgba(46,154,110,0.10)') 
                    : 'transparent',
                  color: perfil === key 
                    ? 'var(--color-texto)' 
                    : (isModoOscuro ? '#a8b3b0' : '#555'),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isModoOscuro ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
                }}
                onMouseLeave={(e) => {
                  if (perfil !== key) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={20} strokeWidth={1.5} color="var(--color-primary)" />
                  <span style={{ 
                    fontSize: 'var(--tamano-fuente)',
                    fontWeight: perfil === key ? '600' : '400'
                  }}>
                    {config.label}
                  </span>
                </span>
                {perfil === key && <Check size={18} strokeWidth={2} color="var(--color-primary)" />}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default ProfileSelector;