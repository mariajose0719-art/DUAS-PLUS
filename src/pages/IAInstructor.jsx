import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  ArrowLeft, 
  Bot, 
  Sparkles, 
  FileText, 
  Brain, 
  Lightbulb,
  MessageSquare,
  Zap
} from 'lucide-react';

function IAInstructor() {
  const navigate = useNavigate();
  const [analizando, setAnalizando] = useState(false);
  const [resultado, setResultado] = useState('');

  const handleAnalizar = () => {
    setAnalizando(true);
    setTimeout(() => {
      setResultado('📊 Análisis completo: Se detectaron 3 imágenes sin descripción y 2 secciones con contraste insuficiente. Recomendaciones generadas.');
      setAnalizando(false);
    }, 2000);
  };

  const herramientas = [
    { 
      icon: FileText, 
      label: 'Analizar guía', 
      desc: 'Detecta contenido poco accesible',
      color: '#2e9a6e',
      accion: handleAnalizar
    },
    { 
      icon: Brain, 
      label: 'Generar resumen', 
      desc: 'Crea resúmenes y mapas conceptuales',
      color: '#3498db',
      accion: () => setResultado('📝 Resumen generado: Tema principal con 5 conceptos clave y 3 ejemplos prácticos.')
    },
    { 
      icon: Lightbulb, 
      label: 'Recomendaciones', 
      desc: 'Sugerencias pedagógicas inclusivas',
      color: '#f39c12',
      accion: () => setResultado('💡 Recomendaciones: 1. Agregar descripciones a imágenes. 2. Aumentar contraste en diapositivas. 3. Incluir subtítulos en videos.')
    },
    { 
      icon: MessageSquare, 
      label: 'Generar preguntas', 
      desc: 'Crea preguntas frecuentes y flashcards',
      color: '#9b59b6',
      accion: () => setResultado('📚 Flashcards y FAQs generadas: 10 preguntas tipo test y 5 preguntas abiertas.')
    },
  ];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0a0e0c',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* ===== FONDO DUAS+ ===== */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 80% 60% at 15% 20%, rgba(26, 122, 74, 0.18) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 85% 80%, rgba(26, 122, 74, 0.12) 0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 50% 50%, rgba(26, 122, 74, 0.06) 0%, transparent 50%),
          #080c0a
        `,
      }}>
        <div style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(140px)',
          opacity: 0.20,
          width: '500px',
          height: '500px',
          background: 'rgba(46, 154, 110, 0.12)',
          top: '-150px',
          right: '-100px'
        }} />
        <div style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(160px)',
          opacity: 0.15,
          width: '400px',
          height: '400px',
          background: 'rgba(46, 154, 110, 0.08)',
          bottom: '-120px',
          left: '-80px'
        }} />
        <div style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.10,
          width: '300px',
          height: '300px',
          background: 'rgba(46, 154, 110, 0.06)',
          top: '40%',
          left: '60%'
        }} />
      </div>

      {/* ===== CONTENIDO ===== */}
      <div style={{
        flex: 1,
        padding: '32px 40px',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '8px',
            flexWrap: 'wrap',
            animation: 'fadeInDown 0.6s ease-out forwards'
          }}>
            <button
              onClick={() => navigate('/instructor')}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                color: '#a8b3b0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                padding: '8px 16px',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = '#edf2f0';
                e.currentTarget.style.borderColor = 'rgba(46,154,110,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.color = '#a8b3b0';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
              Volver
            </button>
            <Bot size={28} strokeWidth={1.5} color="#2e9a6e" />
            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0, letterSpacing: '-0.5px', color: '#edf2f0' }}>
              IA Asistente
            </h1>
            <span style={{
              fontSize: '14px',
              color: '#6a7a75',
              marginLeft: 'auto',
              background: 'rgba(255,255,255,0.04)',
              padding: '4px 16px',
              borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <Sparkles size={14} strokeWidth={1.5} color="#2e9a6e" style={{ marginRight: '6px' }} />
              Potenciado por IA
            </span>
          </div>
          <p style={{ 
            color: '#a8b3b0', 
            fontSize: '15px', 
            marginBottom: '28px', 
            marginLeft: '52px',
            letterSpacing: '-0.2px'
          }}>
            Analiza material educativo y genera contenido inclusivo.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '18px',
            marginBottom: '32px',
            animation: 'fadeInUp 0.6s ease-out 0.1s forwards',
            opacity: 0
          }}>
            {herramientas.map((item, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
                borderRadius: '18px',
                padding: '24px 20px',
                border: '1px solid rgba(255,255,255,0.06)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: '0 12px 48px rgba(0,0,0,0.3)'
              }}
              onClick={item.accion}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)';
                e.currentTarget.style.borderColor = `rgba(46,154,110,0.15)`;
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.boxShadow = '0 12px 48px rgba(0,0,0,0.3)';
              }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${item.color}22, ${item.color}11)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  border: `1px solid ${item.color}20`
                }}>
                  <item.icon size={28} strokeWidth={1.5} color={item.color} />
                </div>
                <h3 style={{
                  fontSize: '17px',
                  fontWeight: '600',
                  color: '#edf2f0',
                  margin: 0,
                  letterSpacing: '-0.3px'
                }}>
                  {item.label}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#6a7a75',
                  margin: '6px 0 0'
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(16px)',
            borderRadius: '20px',
            padding: '24px 28px',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
            minHeight: '140px',
            animation: 'fadeInUp 0.6s ease-out 0.15s forwards',
            opacity: 0
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <Zap size={20} strokeWidth={1.5} color="#2e9a6e" />
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: 0,
                color: '#edf2f0'
              }}>
                Resultados
              </h2>
              {analizando && (
                <span style={{
                  fontSize: '13px',
                  color: '#2e9a6e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: '2px solid #2e9a6e',
                    borderTopColor: 'transparent',
                    animation: 'spin 0.8s linear infinite'
                  }}></span>
                  Analizando...
                </span>
              )}
            </div>
            <div style={{
              color: resultado ? '#edf2f0' : '#6a7a75',
              fontSize: '15px',
              lineHeight: '1.7',
              minHeight: '60px'
            }}>
              {resultado || 'Selecciona una herramienta para generar contenido o análisis.'}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default IAInstructor;