// src/components/instructor/QuickAction.jsx
function QuickAction({ icon: Icon, label, color = '#2e9a6e', onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '20px 16px',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        color: '#edf2f0',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        fontFamily: 'Inter, sans-serif',
        flex: 1,
        minWidth: '100px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `rgba(46,154,110,0.1)`;
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 8px 32px ${color}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <Icon size={24} strokeWidth={1.5} color={color} />
      <span style={{ fontSize: '13px', fontWeight: '500', textAlign: 'center' }}>{label}</span>
    </button>
  );
}

export default QuickAction;