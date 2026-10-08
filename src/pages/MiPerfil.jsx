import { useNavigate } from 'react-router-dom';
import { UserCircle, Mail, MapPin, Calendar, Edit3, ArrowLeft } from 'lucide-react';

function MiPerfil() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0e0c',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 90% 70% at 15% 25%, rgba(26, 122, 74, 0.20) 0%, transparent 60%),
          radial-gradient(ellipse 70% 60% at 85% 75%, rgba(26, 122, 74, 0.15) 0%, transparent 55%),
          #080c0a
        `,
      }}>
        <div style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(180px)',
          opacity: 0.25,
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
          opacity: 0.20,
          width: '500px',
          height: '500px',
          background: 'rgba(26, 122, 74, 0.10)',
          bottom: '-150px',
          left: '-100px'
        }}></div>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '32px 40px',
        maxWidth: '900px',
        margin: '0 auto',
        color: '#edf2f0',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
          animation: 'fadeInDown 0.5s ease-out forwards'
        }}>
          <button
            onClick={() => navigate('/aprendiz')}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '8px 14px',
              color: '#a8b3b0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.color = '#edf2f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.color = '#a8b3b0';
            }}
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
            Volver
          </button>
          <UserCircle size={28} strokeWidth={1.5} color="#2e9a6e" />
          <h1 style={{ fontSize: '26px', fontWeight: '700', margin: 0 }}>Mi perfil</h1>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          animation: 'fadeInUp 0.5s ease-out 0.1s forwards',
          opacity: 0
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a7a4a, #2e9a6e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              fontWeight: '700',
              color: '#ffffff',
              boxShadow: '0 8px 32px rgba(46,154,110,0.3)'
            }}>
              M
            </div>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>María González</h2>
              <p style={{ color: '#a8b3b0', margin: '4px 0' }}>Aprendiz · Programa de Tecnología</p>
              <p style={{ color: '#6a7a75', fontSize: '14px' }}>ID: SENA-2024-001</p>
            </div>
            <button style={{
              marginLeft: 'auto',
              padding: '8px 20px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              color: '#edf2f0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
              <Edit3 size={16} strokeWidth={1.5} />
              Editar
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}>
            <div style={{
              padding: '16px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.04)'
            }}>
              <div style={{ color: '#6a7a75', fontSize: '13px', marginBottom: '4px' }}>
                <Mail size={16} strokeWidth={1.5} style={{ display: 'inline', marginRight: '8px' }} />
                Correo electrónico
              </div>
              <div style={{ fontSize: '16px' }}>maria.gonzalez@sena.edu.co</div>
            </div>
            <div style={{
              padding: '16px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.04)'
            }}>
              <div style={{ color: '#6a7a75', fontSize: '13px', marginBottom: '4px' }}>
                <Calendar size={16} strokeWidth={1.5} style={{ display: 'inline', marginRight: '8px' }} />
                Fecha de nacimiento
              </div>
              <div style={{ fontSize: '16px' }}>15 de marzo de 1998</div>
            </div>
            <div style={{
              padding: '16px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.04)'
            }}>
              <div style={{ color: '#6a7a75', fontSize: '13px', marginBottom: '4px' }}>
                <MapPin size={16} strokeWidth={1.5} style={{ display: 'inline', marginRight: '8px' }} />
                Centro de formación
              </div>
              <div style={{ fontSize: '16px' }}>SENA - Centro de Tecnología</div>
            </div>
            <div style={{
              padding: '16px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.04)'
            }}>
              <div style={{ color: '#6a7a75', fontSize: '13px', marginBottom: '4px' }}>
                <UserCircle size={16} strokeWidth={1.5} style={{ display: 'inline', marginRight: '8px' }} />
                Perfil de accesibilidad
              </div>
              <div style={{ fontSize: '16px' }}>Sin necesidades especiales</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default MiPerfil;