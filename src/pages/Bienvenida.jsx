import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, LogIn, Accessibility } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function Bienvenida() {
  const navigate = useNavigate();
  const { modoOscuro } = useTheme();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouse = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMouse({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const isDark = modoOscuro;

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100vh',
        background: isDark
          ? 'radial-gradient(circle at 70% 45%, #08331e 0%, #031c10 50%, #010a05 100%)'
          : 'radial-gradient(circle at 70% 45%, #e6f7ef 0%, #cdeedd 55%, #b7e2cd 100%)',
        fontFamily: 'var(--fuente, "Inter", sans-serif)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.5s ease',
      }}
    >
      {/* ===== FONDO CON ILUMINACIÓN DRAMÁTICA ESMERALDA ===== */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(circle at ${50 + mouse.x * 30}% ${40 + mouse.y * 20}%, 
            rgba(0, 255, 135, ${isDark ? 0.18 : 0.10}) 0%, 
            transparent 55%
          ),
          radial-gradient(circle at ${80 - mouse.x * 20}% ${60 - mouse.y * 20}%, 
            rgba(57, 169, 0, ${isDark ? 0.20 : 0.08}) 0%, 
            transparent 50%
          )
        `,
        transition: 'background 0.1s ease-out',
      }} />

      {/* ===== ORBE DE LUZ PRINCIPAL ESMERALDA ===== */}
      <div style={{
        position: 'fixed',
        width: '900px',
        height: '900px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 255, 135, 0.15), transparent 70%)',
        filter: 'blur(100px)',
        top: '50%',
        left: '50%',
        transform: `translate(calc(-50% + ${mouse.x * 100}px), calc(-50% + ${mouse.y * 70}px))`,
        transition: 'transform 0.15s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: isDark ? 1 : 0.4,
      }} />

      {/* ===== SEGUNDO ORBE DE CONTRASTE ===== */}
      <div style={{
        position: 'fixed',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(57, 169, 0, 0.2), transparent 70%)',
        filter: 'blur(80px)',
        top: '30%',
        left: '70%',
        transform: `translate(${mouse.x * -40}px, ${mouse.y * -30}px)`,
        transition: 'transform 0.2s',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: isDark ? 0.7 : 0.2,
      }} />

      {/* ===== CONTENEDOR PRINCIPAL ===== */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1240px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        alignItems: 'center',
        animation: 'fadeSlideUp 1s cubic-bezier(0.2, 0.9, 0.3, 1.2) forwards',
        opacity: 0,
        transform: 'translateY(30px)',
      }}>

        {/* ===== COLUMNA IZQUIERDA: TEXTO PRINCIPAL ===== */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          textAlign: 'left',
          background: isDark ? 'rgba(4, 28, 16, 0.65)' : 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(25px)',
          padding: '44px 40px',
          borderRadius: '32px',
          border: `1.5px solid ${isDark ? 'rgba(0, 255, 135, 0.3)' : 'rgba(57, 169, 0, 0.3)'}`,
          boxShadow: isDark ? '0 25px 50px rgba(0, 0, 0, 0.6)' : '0 20px 40px rgba(2, 31, 15, 0.08)',
        }}>
          {/* ETIQUETA TÉCNICA */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontFamily: 'monospace',
            fontSize: 'clamp(12px, 0.8vw, 14px)',
            color: isDark ? '#b0e4c5' : '#1a5233',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}>
            <span style={{ color: isDark ? '#00FF87' : '#39A900' }}>//</span> SISTEMA DE ACCESIBILIDAD UNIVERSAL
            <span style={{ color: isDark ? '#00FF87' : '#39A900' }}>v1.0</span>
          </div>

          {/* TÍTULO PRINCIPAL DUAS+ */}
          <h1 style={{
            fontSize: 'clamp(64px, 8.5vw, 110px)',
            fontWeight: 900,
            letterSpacing: '-3px',
            margin: 0,
            lineHeight: 0.85,
            background: isDark
              ? 'linear-gradient(135deg, #FFFFFF 20%, #00FF87 60%, #39A900 100%)'
              : 'linear-gradient(135deg, #021F0F 15%, #39A900 65%, #187300 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: isDark ? 'drop-shadow(0 4px 20px rgba(0, 255, 135, 0.45))' : 'drop-shadow(0 4px 15px rgba(57, 169, 0, 0.25))',
            transform: `translate(${mouse.x * -6}px, ${mouse.y * -4}px)`,
            transition: 'transform 0.15s',
          }}>
            DUAS+
          </h1>

          {/* SUBTÍTULO */}
          <p style={{
            fontSize: 'clamp(20px, 1.5vw, 28px)',
            fontWeight: 800,
            color: isDark ? '#ffffff' : '#021f0f',
            letterSpacing: '-0.5px',
            margin: 0,
            maxWidth: '520px',
            lineHeight: 1.3,
          }}>
            Diseño Universal para el Aprendizaje
          </p>

          {/* DESCRIPCIÓN */}
          <p style={{
            fontSize: 'clamp(15px, 1vw, 17px)',
            color: isDark ? '#b0e4c5' : '#1a5233',
            lineHeight: 1.7,
            maxWidth: '480px',
            margin: 0,
          }}>
            Plataforma inteligente que se adapta automáticamente a las necesidades de cada persona.
          </p>

          {/* BOTONES */}
          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            marginTop: '12px',
          }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '18px 38px',
                background: isDark
                  ? 'linear-gradient(135deg, #00FF87 0%, #39A900 100%)'
                  : 'linear-gradient(135deg, #39A900 0%, #021F0F 100%)',
                border: 'none',
                borderRadius: '16px',
                color: isDark ? '#011409' : '#ffffff',
                cursor: 'pointer',
                fontFamily: 'var(--fuente)',
                fontSize: 'clamp(15px, 1vw, 17px)',
                fontWeight: 800,
                boxShadow: isDark
                  ? '0 10px 30px rgba(0, 255, 135, 0.35)'
                  : '0 10px 25px rgba(57, 169, 0, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                letterSpacing: '0.5px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                e.currentTarget.style.boxShadow = isDark
                  ? '0 15px 45px rgba(0, 255, 135, 0.55)'
                  : '0 15px 35px rgba(57, 169, 0, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = isDark
                  ? '0 10px 30px rgba(0, 255, 135, 0.35)'
                  : '0 10px 25px rgba(57, 169, 0, 0.3)';
              }}
            >
              <LogIn size={20} strokeWidth={2.5} />
              <span>Iniciar sesión</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>

            <button
              onClick={() => alert('Accesibilidad rápida')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '18px 32px',
                background: 'transparent',
                border: `2px solid ${isDark ? 'rgba(0, 255, 135, 0.4)' : 'rgba(57, 169, 0, 0.4)'}`,
                borderRadius: '16px',
                color: isDark ? '#ffffff' : '#021f0f',
                cursor: 'pointer',
                fontFamily: 'var(--fuente)',
                fontSize: 'clamp(15px, 1vw, 17px)',
                fontWeight: 700,
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                letterSpacing: '0.3px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04) translateY(-2px)';
                e.currentTarget.style.borderColor = isDark ? '#00FF87' : '#39A900';
                e.currentTarget.style.background = isDark ? 'rgba(0, 255, 135, 0.12)' : 'rgba(57, 169, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.borderColor = isDark ? 'rgba(0, 255, 135, 0.4)' : 'rgba(57, 169, 0, 0.4)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Accessibility size={20} strokeWidth={2.5} />
              <span>Accesibilidad</span>
            </button>
          </div>
        </div>

        {/* ===== COLUMNA DERECHA: ESCENARIO LIBRE SIN CAJA (MÁS PROTAGONISMO Y MÁS ELEVADO) ===== */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          position: 'relative',
        }}>
          {/* CONTENEDOR COMPACTO Y CUADRADO DEL ESCENARIO */}
          <div style={{
            width: '100%',
            maxWidth: '440px',
            aspectRatio: '1 / 1.1',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            perspective: '1000px',
          }}>
            {/* TEXTO DE FONDO EN MARCA DE AGUA */}
            <div style={{
              position: 'absolute',
              top: '0px',
              fontSize: 'clamp(80px, 11vw, 140px)',
              fontWeight: 900,
              letterSpacing: '-6px',
              color: isDark ? 'rgba(0, 255, 135, 0.05)' : 'rgba(57, 169, 0, 0.06)',
              fontFamily: 'monospace',
              transform: `translate(${mouse.x * -20}px, ${mouse.y * -15}px)`,
              transition: 'transform 0.15s',
              userSelect: 'none',
              pointerEvents: 'none',
            }}>
              DUAS+
            </div>

            {/* HAZ DE LUZ VERTICAL */}
            <div style={{
              position: 'absolute',
              bottom: '40px',
              width: '260px',
              height: '420px',
              background: isDark
                ? 'linear-gradient(to top, rgba(0, 255, 135, 0.4) 0%, rgba(57, 169, 0, 0.12) 60%, transparent 100%)'
                : 'linear-gradient(to top, rgba(57, 169, 0, 0.28) 0%, rgba(57, 169, 0, 0.06) 60%, transparent 100%)',
              clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
              pointerEvents: 'none',
              zIndex: 1,
            }} />

            {/* AVATAR LAIA (laia_p.png) - MÁS GRANDE Y ELEVADO */}
            <div style={{
              position: 'relative',
              zIndex: 4,
              height: '100%',
              maxHeight: '520px',
              width: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: '30px',
              animation: 'floatAvatar 4s ease-in-out infinite alternate',
              transform: `translate(${mouse.x * 12}px, ${mouse.y * 8}px)`,
              transition: 'transform 0.1s ease-out',
            }}>
              <img
                src="laia_p.png"
                alt="LAIA SENA Avatar"
                style={{
                  height: '115%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: isDark
                    ? 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 25px rgba(0, 255, 135, 0.35))'
                    : 'drop-shadow(0 20px 30px rgba(2, 31, 15, 0.25))',
                }}
              />
            </div>

            {/* AROS Y PEDESTAL DE LUZ INTERACTIVOS */}
            <div style={{
              position: 'absolute',
              bottom: '0px',
              width: '360px',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              pointerEvents: 'none',
            }}>
              {/* Disco Reflector Central */}
              <div style={{
                position: 'absolute',
                width: '220px',
                height: '75px',
                borderRadius: '50%',
                background: isDark
                  ? 'radial-gradient(ellipse at center, #00FF87 0%, #39A900 55%, transparent 85%)'
                  : 'radial-gradient(ellipse at center, #39A900 0%, #187300 55%, transparent 85%)',
                transform: 'rotateX(75deg)',
                opacity: isDark ? 0.85 : 0.6,
                boxShadow: isDark ? '0 0 60px #00FF87' : '0 0 40px #39A900',
              }} />

              {/* Aro Externo Trazo Neón Giratorio */}
              <div style={{
                position: 'absolute',
                width: '350px',
                height: '115px',
                borderRadius: '50%',
                border: `3px dashed ${isDark ? '#00FF87' : '#39A900'}`,
                transform: 'rotateX(75deg)',
                boxShadow: isDark ? '0 0 40px rgba(0, 255, 135, 0.5)' : '0 0 25px rgba(57, 169, 0, 0.3)',
                animation: 'rotateRingClockwise 15s linear infinite',
              }} />

              {/* Aro Intermedio Verde Esmeralda */}
              <div style={{
                position: 'absolute',
                width: '280px',
                height: '95px',
                borderRadius: '50%',
                border: `4px solid ${isDark ? '#39A900' : '#187300'}`,
                transform: 'rotateX(75deg)',
                boxShadow: isDark ? '0 0 35px #39A900' : '0 0 20px #187300',
                animation: 'rotateRingCounter 11s linear infinite',
              }} />

              {/* Aro Interno Blanco Brillante */}
              <div style={{
                position: 'absolute',
                width: '200px',
                height: '65px',
                borderRadius: '50%',
                border: '2px solid #FFFFFF',
                transform: 'rotateX(75deg)',
                boxShadow: '0 0 30px #FFFFFF',
              }} />
            </div>
          </div>

          {/* ETIQUETA TÉCNICA ABAJO */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontFamily: 'monospace',
            fontSize: 'clamp(11px, 0.7vw, 13px)',
            color: isDark ? '#b0e4c5' : '#1a5233',
            letterSpacing: '1px',
            fontWeight: 600,
          }}>
            <span style={{ color: isDark ? '#00FF87' : '#39A900' }}>●</span>
            <span>SISTEMA ACTIVO</span>
            <span style={{ color: isDark ? '#00FF87' : '#39A900' }}>●</span>
            <span>LAIA SENA AI v1.0.0</span>
          </div>
        </div>
      </div>

      {/* ===== FOOTER SIMÉTRICO ===== */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        fontFamily: 'monospace',
        fontSize: 'clamp(10px, 0.7vw, 12px)',
        color: isDark ? 'rgba(176, 228, 197, 0.5)' : 'rgba(26, 82, 51, 0.5)',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        fontWeight: 600,
      }}>
        <span>Desarrollado para el SENA</span>
        <span style={{ color: isDark ? '#00FF87' : '#39A900' }}>✦</span>
        <span>Accesibilidad Universal</span>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes rotateRingClockwise {
          0% { transform: rotateX(75deg) rotate(0deg); }
          100% { transform: rotateX(75deg) rotate(360deg); }
        }
        @keyframes rotateRingCounter {
          0% { transform: rotateX(75deg) rotate(360deg); }
          100% { transform: rotateX(75deg) rotate(0deg); }
        }
        @keyframes floatAvatar {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-16px); }
        }
      `}</style>
    </div>
  );
}

export default Bienvenida;