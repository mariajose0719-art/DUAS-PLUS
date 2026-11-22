import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

function ThemeToggle({ variant = 'button' }) {
  const { modoOscuro, setModoOscuro } = useTheme();

  const toggle = () => setModoOscuro(!modoOscuro);

  if (variant === 'button') {
    return (
      <button
        onClick={toggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 18px',
          background: modoOscuro ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
          border: '1px solid ' + (modoOscuro ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
          borderRadius: '12px',
          color: modoOscuro ? '#edf2f0' : '#1a1a1a',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          transition: 'all 0.3s ease',
          minWidth: '150px',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = modoOscuro ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = modoOscuro ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
        }}
      >
        {modoOscuro ? (
          <>
            <Sun size={18} strokeWidth={1.5} />
            Modo claro
          </>
        ) : (
          <>
            <Moon size={18} strokeWidth={1.5} />
            Modo oscuro
          </>
        )}
      </button>
    );
  }

  // Versión icono
  return (
    <button
      onClick={toggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: modoOscuro ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
        border: '1px solid ' + (modoOscuro ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
        color: modoOscuro ? '#edf2f0' : '#1a1a1a',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = modoOscuro ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = modoOscuro ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
      }}
    >
      {modoOscuro ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
    </button>
  );
}

export default ThemeToggle;