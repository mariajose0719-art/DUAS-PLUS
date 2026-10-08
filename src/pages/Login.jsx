import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  Mic, MicOff, User, Lock, Eye, EyeOff, ArrowRight, Keyboard,
  ShieldCheck, AlertCircle, Check, Fingerprint, RefreshCw,
  Mail, KeyRound, Target, MousePointerClick, ArrowLeft
} from 'lucide-react';

const PUNTOS_DISPONIBLES = [
  { id: 1, x: 25, y: 25 },
  { id: 2, x: 75, y: 25 },
  { id: 3, x: 25, y: 75 },
  { id: 4, x: 75, y: 75 },
  { id: 5, x: 50, y: 50 },
];

function Login() {
  const navigate = useNavigate();
  const { modoOscuro } = useTheme();
  
  const [metodo, setMetodo] = useState('voz');
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  
  // Modo Voz
  const [estadoVoz, setEstadoVoz] = useState('listo');
  const [nivelAudio, setNivelAudio] = useState(0);
  const [progresoVoz, setProgresoVoz] = useState(0);
  
  // Modo Visual
  const [puntosSeleccionados, setPuntosSeleccionados] = useState([]);
  const [patronGuardado, setPatronGuardado] = useState(null);
  const [modoRegistroVisual, setModoRegistroVisual] = useState(true);
  
  // Modo Código
  const [emailOTP, setEmailOTP] = useState('');
  const [codigoGenerado, setCodigoGenerado] = useState('');
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [pasoOTP, setPasoOTP] = useState(1);
  
  // Modo Clásico
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('aprendiz');
  const [mostrarContraseña, setMostrarContraseña] = useState(false);

  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const intervalRef = useRef(null);
  const vozSostenidaRef = useRef(0);

  // ===== FUNCIÓN HABLAR =====
  const hablar = (texto) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) { resolve(); return; }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'es-ES';
      utterance.rate = 1;
      let resuelto = false;
      const terminar = () => {
        if (!resuelto) { resuelto = true; resolve(); }
      };
      utterance.onend = terminar;
      utterance.onerror = terminar;
      setTimeout(terminar, 6000);
      window.speechSynthesis.speak(utterance);
    });
  };

  // ===== DETENER MICRÓFONO =====
  const detenerMicrofono = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch(e) {}
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setNivelAudio(0);
    setProgresoVoz(0);
  };

  useEffect(() => {
    return () => {
      detenerMicrofono();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // ===== MODO VOZ =====
  const iniciarModoVoz = async () => {
    setMensajeError('');
    setMensajeExito('');
    setEstadoVoz('hablando');
    setProgresoVoz(0);
    vozSostenidaRef.current = 0;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.3;
      analyserRef.current = analyser;
      source.connect(analyser);

      await hablar('Por favor, di claramente: Mi voz es mi llave.');
      await new Promise(r => setTimeout(r, 300));

      setEstadoVoz('escuchando');
      empezarAEscuchar();
    } catch (error) {
      console.error('Error:', error);
      setMensajeError('No se pudo acceder al micrófono. Verifica los permisos.');
      setEstadoVoz('listo');
    }
  };

  const empezarAEscuchar = () => {
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    let contadorTotal = 0;

    intervalRef.current = setInterval(() => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);
      const parteVoz = dataArray.slice(0, Math.floor(dataArray.length / 4));
      const promedio = parteVoz.reduce((a, b) => a + b, 0) / parteVoz.length;
      setNivelAudio(promedio);

      if (promedio > 25) {
        vozSostenidaRef.current += 0.1;
      } else {
        vozSostenidaRef.current = Math.max(0, vozSostenidaRef.current - 0.05);
      }

      setProgresoVoz(Math.min((vozSostenidaRef.current / 1.5) * 100, 100));
      contadorTotal += 0.1;

      if (vozSostenidaRef.current >= 1.5) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        verificarVozExitosa();
        return;
      }

      if (contadorTotal >= 8) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        verificarVozFallida();
      }
    }, 100);
  };

  const verificarVozExitosa = async () => {
    setEstadoVoz('verificando');
    detenerMicrofono();
    setMensajeExito('Voz detectada. Verificando huella vocal...');
    await hablar('Voz detectada.');
    await new Promise(r => setTimeout(r, 500));
    setMensajeExito('¡Huella vocal reconocida! Acceso concedido.');
    await hablar('Huella vocal reconocida. Acceso concedido. Bienvenido a DUAS Plus.');
    setTimeout(() => navigate('/aprendiz'), 2000);
  };

  const verificarVozFallida = async () => {
    detenerMicrofono();
    setEstadoVoz('listo');
    setMensajeError('No se detectó tu voz. Di la frase más fuerte y claro.');
    await hablar('No se detectó tu voz. Intenta de nuevo.');
  };

  const detenerEscucha = () => {
    detenerMicrofono();
    setEstadoVoz('listo');
    setMensajeError('');
  };

  // ===== MODO VISUAL =====
  const registrarToque = (puntoId) => {
    setPuntosSeleccionados(prev => {
      const existente = prev.find(p => p.id === puntoId);
      if (existente) {
        if (existente.toques >= 3) return prev.filter(p => p.id !== puntoId);
        return prev.map(p => p.id === puntoId ? { ...p, toques: p.toques + 1 } : p);
      } else {
        if (prev.length >= 3) return prev;
        return [...prev, { id: puntoId, toques: 1 }];
      }
    });
  };

  const confirmarPatron = () => {
    if (puntosSeleccionados.length < 3) {
      setMensajeError('Selecciona al menos 3 puntos.');
      return;
    }
    if (modoRegistroVisual) {
      setPatronGuardado([...puntosSeleccionados]);
      setMensajeExito('¡Patrón registrado!');
      setModoRegistroVisual(false);
      setTimeout(() => { setPuntosSeleccionados([]); setMensajeExito(''); }, 3000);
    } else {
      if (!patronGuardado) { setMensajeError('No hay patrón guardado.'); return; }
      const coincide = JSON.stringify(puntosSeleccionados) === JSON.stringify(patronGuardado);
      if (coincide) {
        setMensajeExito('¡Patrón reconocido!');
        setTimeout(() => navigate('/aprendiz'), 1500);
      } else {
        setMensajeError('Patrón incorrecto.');
        setPuntosSeleccionados([]);
      }
    }
  };

  // ===== MODO CÓDIGO =====
  const generarCodigoOTP = () => {
    if (!emailOTP || !emailOTP.includes('@')) { setMensajeError('Correo inválido.'); return; }
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    setCodigoGenerado(codigo);
    setPasoOTP(2);
    setMensajeError('');
  };

  const verificarOTP = () => {
    if (codigoIngresado === codigoGenerado) {
      setMensajeExito('¡Código correcto!');
      setTimeout(() => navigate('/aprendiz'), 1500);
    } else {
      setMensajeError('Código incorrecto.');
    }
  };

  // ===== MODO CLÁSICO =====
  const handleSubmitClasico = (e) => {
    e.preventDefault();
    if (!email || !password) { setMensajeError('Completa todos los campos.'); return; }
    setTimeout(() => navigate(`/${rol}`), 1000);
  };

  // ===== ESTILOS =====
  const isDark = modoOscuro;
  const textColor = isDark ? '#edf2f0' : '#1a1a1a';
  const textMuted = isDark ? '#a8b3b0' : '#555';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';

  return (
    <div style={{
      display: 'flex', minHeight: '100vh', background: isDark ? '#080c0a' : '#f0f2f5',
      color: textColor, alignItems: 'center', justifyContent: 'center', padding: '24px',
      fontFamily: 'var(--fuente, Inter, sans-serif)', position: 'relative', overflow: 'hidden'
    }}>
      
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `radial-gradient(circle at 50% 50%, rgba(46, 154, 110, ${isDark ? 0.15 : 0.05}) 0%, transparent 60%)`
      }} />

      {/* Botón volver a bienvenida */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'fixed', top: '24px', left: '24px', zIndex: 10,
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'var(--color-fondo-card)', border: `1px solid ${borderColor}`,
          borderRadius: '10px', color: textMuted, cursor: 'pointer',
          padding: '8px 14px', fontFamily: 'var(--fuente)', fontSize: '13px',
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = textColor; e.currentTarget.style.transform = 'translateX(-4px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = textMuted; e.currentTarget.style.transform = 'translateX(0)'; }}
      >
        <ArrowLeft size={16} /> Volver
      </button>

      {/* Contenedor principal */}
      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: '660px',
        background: cardBg, backdropFilter: 'blur(24px)', borderRadius: '24px',
        padding: '40px 36px', border: `1px solid ${borderColor}`,
        boxShadow: isDark ? '0 30px 80px rgba(0,0,0,0.6)' : '0 30px 80px rgba(0,0,0,0.1)',
        animation: 'fadeInUp 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.2) forwards'
      }}>

        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <ShieldCheck size={28} color="#2e9a6e" strokeWidth={2} />
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, letterSpacing: '-1px', color: textColor }}>
              Acceso a DUAS+
            </h1>
          </div>
          <p style={{ color: textMuted, fontSize: '13px', margin: 0 }}>
            Elige tu método. Nos adaptamos a ti.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', 
          marginBottom: '22px', background: inputBg,
          padding: '6px', borderRadius: '14px', border: `1px solid ${borderColor}`
        }}>
          {[
            { key: 'voz', label: 'Voz', icon: Mic },
            { key: 'visual', label: 'Visual', icon: Target },
            { key: 'codigo', label: 'Código', icon: Mail },
            { key: 'clasico', label: 'Clásico', icon: Keyboard },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setMetodo(key); setMensajeError(''); setMensajeExito(''); detenerEscucha(); }}
              style={{
                padding: '10px 4px', borderRadius: '10px', border: 'none',
                background: metodo === key ? '#2e9a6e' : 'transparent',
                color: metodo === key ? '#fff' : textMuted,
                fontWeight: 600, fontSize: '12px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                transition: 'all 0.3s'
              }}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {/* ===== MODO VOZ ===== */}
        {metodo === 'voz' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px', animation: 'fadeIn 0.5s' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: textColor, marginBottom: '4px' }}>
                Autenticación por Huella Vocal
              </h2>
              <p style={{ color: textMuted, fontSize: '13px', margin: 0 }}>
                Di: <strong style={{ color: '#2e9a6e' }}>"Mi voz es mi llave"</strong>
              </p>
            </div>

            <button
              onClick={estadoVoz === 'listo' ? iniciarModoVoz : detenerEscucha}
              disabled={estadoVoz === 'hablando' || estadoVoz === 'verificando'}
              style={{
                width: '120px', height: '120px', borderRadius: '50%',
                background: (estadoVoz === 'escuchando') ? 'rgba(231, 76, 60, 0.1)' : 'linear-gradient(145deg, #1a7a4a, #2e9a6e)',
                border: (estadoVoz === 'escuchando') ? '4px solid #e74c3c' : '4px solid transparent',
                cursor: (estadoVoz === 'hablando' || estadoVoz === 'verificando') ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: (estadoVoz === 'escuchando') ? '0 0 60px rgba(231, 76, 60, 0.4)' : '0 20px 60px rgba(46,154,110,0.3)',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                animation: (estadoVoz === 'escuchando') ? 'pulseMic 1.5s infinite' : 'none',
                position: 'relative',
                opacity: (estadoVoz === 'hablando' || estadoVoz === 'verificando') ? 0.7 : 1
              }}
            >
              {(estadoVoz === 'escuchando') ? <MicOff size={52} color="#e74c3c" /> : <Mic size={52} color="#fff" />}
              
              {estadoVoz === 'escuchando' && nivelAudio > 15 && (
                <div style={{
                  position: 'absolute', inset: -10,
                  borderRadius: '50%',
                  border: `3px solid rgba(46, 154, 110, ${Math.min(nivelAudio / 60, 0.9)})`,
                  transition: 'all 0.1s'
                }} />
              )}
            </button>

            <div style={{ textAlign: 'center', minHeight: '50px' }}>
              {estadoVoz === 'hablando' && (
                <p style={{ color: '#f39c12', fontWeight: 600, fontSize: '14px', margin: 0 }}>
                  Escucha las instrucciones...
                </p>
              )}
              {estadoVoz === 'escuchando' && (
                <p style={{ color: '#e74c3c', fontWeight: 600, fontSize: '14px', margin: 0 }}>
                  🎤 Habla ahora
                </p>
              )}
              {estadoVoz === 'verificando' && (
                <p style={{ color: '#2e9a6e', fontWeight: 600, fontSize: '14px', margin: 0 }}>
                  Verificando huella vocal...
                </p>
              )}
              {estadoVoz === 'listo' && !mensajeExito && !mensajeError && (
                <p style={{ color: textMuted, fontSize: '13px', margin: 0 }}>
                  Presiona el micrófono para comenzar
                </p>
              )}
            </div>

            {estadoVoz === 'escuchando' && (
              <div style={{
                width: '100%', maxWidth: '280px',
                background: 'rgba(255,255,255,0.05)', borderRadius: '8px',
                padding: '10px', border: `1px solid ${borderColor}`
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '11px', color: textMuted, marginBottom: '6px'
                }}>
                  <span>Detección de voz</span>
                  <span>{Math.round(progresoVoz)}%</span>
                </div>
                <div style={{
                  height: '8px', background: 'rgba(255,255,255,0.1)',
                  borderRadius: '4px', overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${progresoVoz}%`,
                    background: progresoVoz > 60 
                      ? 'linear-gradient(90deg, #2e9a6e, #1a7a4a)' 
                      : 'linear-gradient(90deg, #f39c12, #e67e22)',
                    transition: 'width 0.1s, background 0.3s'
                  }} />
                </div>
              </div>
            )}

            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px',
              background: inputBg, borderRadius: '10px', border: `1px solid ${borderColor}`
            }}>
              <Fingerprint size={14} color="#2e9a6e" />
              <span style={{ fontSize: '11px', color: textMuted }}>
                Tu voz es única, como tu huella
              </span>
            </div>
          </div>
        )}

        {/* ===== MODO VISUAL ===== */}
        {metodo === 'visual' && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <div style={{
              padding: '12px 16px', background: inputBg, borderRadius: '12px',
              border: `1px solid ${borderColor}`, marginBottom: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Target size={16} color="#2e9a6e" />
                <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: textColor }}>
                  {modoRegistroVisual ? 'Crea tu patrón visual' : 'Ingresa tu patrón visual'}
                </h2>
              </div>
              <p style={{ color: textMuted, fontSize: '12px', margin: 0 }}>
                {modoRegistroVisual 
                  ? 'Toca 3 puntos sobre la imagen. Puedes dar 1, 2 o 3 toques a cada uno.'
                  : 'Toca los mismos puntos con los mismos toques.'}
              </p>
            </div>

            {/* IMAGEN DEL PATRÓN VISUAL — Aquí va contrasena-senas.png como fondo */}
            <div style={{
              position: 'relative', width: '100%', aspectRatio: '16/10',
              borderRadius: '14px', overflow: 'hidden',
              border: `2px solid ${borderColor}`,
              background: 'linear-gradient(135deg, #1a7a4a 0%, #0a4a2a 100%)'
            }}>
              {/* Imagen del avatar haciendo la seña de contraseña */}
              <img
                src="/contrasena-senas.png"
                alt="Avatar haciendo la seña de contraseña"
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  padding: '8px'
                }}
              />

              {/* Puntos interactivos sobre la imagen */}
              {PUNTOS_DISPONIBLES.map((punto) => {
                const seleccionado = puntosSeleccionados.find(p => p.id === punto.id);
                const toques = seleccionado ? seleccionado.toques : 0;
                return (
                  <button
                    key={punto.id}
                    onClick={() => registrarToque(punto.id)}
                    disabled={puntosSeleccionados.length >= 3 && !seleccionado}
                    style={{
                      position: 'absolute',
                      left: `${punto.x}%`, top: `${punto.y}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '46px', height: '46px', borderRadius: '50%',
                      background: seleccionado ? 'rgba(46, 154, 110, 0.95)' : 'rgba(255,255,255,0.2)',
                      border: `3px solid ${seleccionado ? '#fff' : 'rgba(255,255,255,0.6)'}`,
                      cursor: (puntosSeleccionados.length >= 3 && !seleccionado) ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '15px', fontWeight: 800,
                      transition: 'all 0.2s',
                      boxShadow: seleccionado ? '0 0 25px rgba(46,154,110,0.9)' : '0 0 15px rgba(0,0,0,0.6)',
                      opacity: (puntosSeleccionados.length >= 3 && !seleccionado) ? 0.3 : 1,
                      backdropFilter: 'blur(6px)'
                    }}
                  >
                    {toques > 0 ? `×${toques}` : ''}
                  </button>
                );
              })}
            </div>

            {/* Indicadores del patrón */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '14px', flexWrap: 'wrap' }}>
              {[0, 1, 2].map((i) => {
                const p = puntosSeleccionados[i];
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', borderRadius: '10px',
                    background: p ? 'rgba(46,154,110,0.15)' : inputBg,
                    border: `1.5px solid ${p ? '#2e9a6e' : borderColor}`,
                    fontSize: '12px', color: p ? '#2e9a6e' : textMuted, fontWeight: 600
                  }}>
                    <MousePointerClick size={14} />
                    {p ? `Punto ${p.id} × ${p.toques}` : `Punto ${i + 1}: vacío`}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <button
                onClick={() => setPuntosSeleccionados([])}
                style={{
                  flex: 1, padding: '10px', borderRadius: '10px',
                  background: 'transparent', border: `1px solid ${borderColor}`,
                  color: textMuted, fontSize: '12px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                <RefreshCw size={12} /> Reiniciar
              </button>
              <button
                onClick={confirmarPatron}
                disabled={puntosSeleccionados.length < 3}
                style={{
                  flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                  background: puntosSeleccionados.length >= 3 ? 'linear-gradient(145deg, #1a7a4a, #2e9a6e)' : 'rgba(255,255,255,0.05)',
                  color: '#fff', fontSize: '13px', fontWeight: 700,
                  cursor: puntosSeleccionados.length >= 3 ? 'pointer' : 'not-allowed',
                  opacity: puntosSeleccionados.length >= 3 ? 1 : 0.5
                }}
              >
                {modoRegistroVisual ? 'Registrar patrón' : 'Ingresar con patrón'}
              </button>
            </div>
          </div>
        )}

        {/* ===== MODO CÓDIGO ===== */}
        {metodo === 'codigo' && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <div style={{ padding: '12px 16px', background: inputBg, borderRadius: '12px', border: `1px solid ${borderColor}`, marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Mail size={16} color="#2e9a6e" />
                <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: textColor }}>Acceso con código por correo</h2>
              </div>
              <p style={{ color: textMuted, fontSize: '12px', margin: 0 }}>Te enviamos un código de 6 dígitos.</p>
            </div>

            {pasoOTP === 1 ? (
              <>
                <input
                  type="email" value={emailOTP} onChange={(e) => setEmailOTP(e.target.value)}
                  placeholder="ejemplo@sena.edu.co"
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: '12px',
                    border: `1px solid ${borderColor}`, background: inputBg, color: textColor,
                    fontSize: '15px', outline: 'none', boxSizing: 'border-box', marginBottom: '16px'
                  }}
                />
                <button onClick={generarCodigoOTP} style={{
                  width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                  background: 'linear-gradient(145deg, #1a7a4a, #2e9a6e)', color: '#fff',
                  fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}>
                  <Mail size={18} /> Enviar código
                </button>
              </>
            ) : (
              <>
                <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(46,154,110,0.1)', border: '1px dashed rgba(46,154,110,0.4)', marginBottom: '16px', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: textMuted, margin: 0 }}>DEMO: Tu código es</p>
                  <p style={{ fontSize: '22px', fontWeight: 800, color: '#2e9a6e', margin: 0, letterSpacing: '4px', fontFamily: 'monospace' }}>{codigoGenerado}</p>
                </div>
                <input
                  type="text" value={codigoIngresado}
                  onChange={(e) => setCodigoIngresado(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000" maxLength={6}
                  style={{
                    width: '100%', padding: '16px', borderRadius: '12px',
                    border: `2px solid ${borderColor}`, background: inputBg, color: textColor,
                    fontSize: '22px', outline: 'none', boxSizing: 'border-box', marginBottom: '16px',
                    textAlign: 'center', letterSpacing: '8px', fontFamily: 'monospace', fontWeight: 700
                  }}
                />
                <button onClick={verificarOTP} style={{
                  width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                  background: 'linear-gradient(145deg, #1a7a4a, #2e9a6e)', color: '#fff',
                  fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}>
                  <KeyRound size={18} /> Verificar y entrar
                </button>
              </>
            )}
          </div>
        )}

        {/* ===== MODO CLÁSICO ===== */}
        {metodo === 'clasico' && (
          <form onSubmit={handleSubmitClasico} style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeIn 0.5s' }}>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo"
              style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: inputBg, color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ position: 'relative' }}>
              <input
                type={mostrarContraseña ? 'text' : 'password'}
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: inputBg, color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
              <button type="button" onClick={() => setMostrarContraseña(!mostrarContraseña)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: textMuted, cursor: 'pointer' }}>
                {mostrarContraseña ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <select value={rol} onChange={(e) => setRol(e.target.value)} style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: inputBg, color: textColor, fontSize: '14px', outline: 'none', cursor: 'pointer' }}>
              <option value="aprendiz">Aprendiz</option>
              <option value="instructor">Instructor</option>
              <option value="administrador">Administrador</option>
            </select>
            <button type="submit" style={{
              padding: '15px', borderRadius: '14px', border: 'none',
              background: 'linear-gradient(145deg, #1a7a4a, #2e9a6e)', color: '#fff',
              fontSize: '15px', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 8px 32px rgba(46,154,110,0.3)'
            }}>
              Ingresar <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* Mensajes */}
        {mensajeError && (
          <div style={{
            marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 16px', background: 'rgba(231,76,60,0.1)',
            border: '2px solid rgba(231,76,60,0.3)', borderRadius: '12px',
            color: '#e74c3c', fontSize: '13px', fontWeight: 500, animation: 'shake 0.5s'
          }}>
            <AlertCircle size={18} /> {mensajeError}
          </div>
        )}

        {mensajeExito && (
          <div style={{
            marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 16px', background: 'rgba(46,154,110,0.1)',
            border: '2px solid rgba(46,154,110,0.3)', borderRadius: '12px',
            color: '#2e9a6e', fontSize: '13px', fontWeight: 600, animation: 'fadeIn 0.5s'
          }}>
            <Check size={18} /> {mensajeExito}
          </div>
        )}

        <div style={{
          marginTop: '22px', paddingTop: '14px', borderTop: `1px solid ${borderColor}`,
          display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap'
        }}>
          <span style={{ color: textMuted, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} /> Multimodal y seguro
          </span>
        </div>

      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulseMic {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}

export default Login;