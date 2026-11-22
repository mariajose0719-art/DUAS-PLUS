// src/components/instructor/MetricCard.jsx
function MetricCard({ icon: Icon, titulo, valor, color = '#2e9a6e' }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 48px rgba(0,0,0,0.3)';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
    }}
    >
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        background: `linear-gradient(135deg, ${color}33, ${color}11)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon size={24} strokeWidth={1.5} color={color} />
      </div>
      <div>
        <div style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#edf2f0',
          lineHeight: '1.2'
        }}>
          {valor}
        </div>
        <div style={{
          fontSize: '14px',
          color: '#a8b3b0'
        }}>
          {titulo}
        </div>
      </div>
    </div>
  );
}

export default MetricCard;