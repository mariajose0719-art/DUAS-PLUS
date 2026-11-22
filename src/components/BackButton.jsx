import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

function BackButton({ to = '/aprendiz', label = 'Volver al menú' }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        color: '#a8b3b0',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        marginBottom: '20px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
        e.currentTarget.style.color = '#edf2f0';
        e.currentTarget.style.transform = 'translateX(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.color = '#a8b3b0';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      <ArrowLeft size={18} strokeWidth={1.5} />
      {label}
    </button>
  );
}

export default BackButton;