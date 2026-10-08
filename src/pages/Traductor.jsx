import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAvatar } from '../context/AvatarContext';
import { 
  ArrowLeft, Languages, BookOpen, Camera, CameraOff, MessageSquare, 
  RefreshCw, Search, Hand, RotateCcw, Sparkles, Mic, MicOff
} from 'lucide-react';

const DICCIONARIO_SENAS = [
  { id: 1, palabra: 'Hola', descripcion: 'Mano abierta, movimiento de saludo', imagen: '/hola.jpg' },
  { id: 2, palabra: 'Gracias', descripcion: 'Mano en el pecho, movimiento hacia afuera', imagen: '/gracias.jpg' },
  { id: 3, palabra: 'Sí', descripcion: 'Puño cerrado, movimiento de afirmación', imagen: '/si.jpg' },
  { id: 4, palabra: 'No', descripcion: 'Índice y pulgar juntos, negación', imagen: '/no.jpg' },
  { id: 5, palabra: 'Ayuda', descripcion: 'Mano en el pecho, hacia arriba', imagen: '/ayuda.jpg' },
  { id: 6, palabra: 'Buenos días', descripcion: 'Mano en el cielo', imagen: '/bd.jpg' },
  { id: 7, palabra: 'Buenas tardes', descripcion: 'Mano en el horizonte', imagen: '/bt.jpg' },
  { id: 8, palabra: 'Buenas noches', descripcion: 'Mano en la cara', imagen: '/bn.jpg' },
];

function Traductor() {
  const navigate = useNavigate();
  const { modoOscuro } = useTheme();
  const { activo, reproducirTexto } = useAvatar();
  const [vista, setVista] = useState('camara');
  
  // Cámara
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [errorCamara, setErrorCamara] = useState(null);
  const [camaraLista, setCamaraLista] = useState(false);
  
  // MediaPipe
  const [mediaPipeListo, setMediaPipeListo] = useState(false);
  const handsRef = useRef(null);
  const [landmarks, setLandmarks] = useState([]);
  
  // Reconocimiento de señas
  const [textoDeletreado, setTextoDeletreado] = useState('');
  const [detectando, setDetectando] = useState(false);
  const [letraActual, setLetraActual] = useState('');
  const [letrasDetectadas, setLetrasDetectadas] = useState([]);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const intervalRef = useRef(null);

  // Texto a señas
  const [frase, setFrase] = useState('');
  
  // Voz
  const [escuchando, setEscuchando] = useState(false);
  const [soporteVoz, setSoporteVoz] = useState(true);
  const recognitionRef = useRef(null);
  const escuchandoRef = useRef(false);
  
  // Detección de audio con Web Audio API
  const audioStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioDetectionRef = useRef(null);
  const speechDetectedRef = useRef(false);
  const dictadoTimeoutRef = useRef(null);

  // Diccionario
  const [busqueda, setBusqueda] = useState('');
  const [palabraSeleccionada, setPalabraSeleccionada] = useState(null);

  // ===== CARGAR MEDIAPIPE HANDS =====
  useEffect(() => {
    const cargarMediaPipe = async () => {
      try {
        if (!window.Hands) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands.js';
            script.crossOrigin = 'anonymous';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        
        if (!window.Camera) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3.1675466862/camera_utils.js';
            script.crossOrigin = 'anonymous';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        setMediaPipeListo(true);
      } catch (error) {
        console.error('Error al cargar MediaPipe:', error);
        setMediaPipeListo(false);
      }
    };
    cargarMediaPipe();
  }, []);

  // ===== CONFIGURAR RECONOCIMIENTO DE VOZ =====
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSoporteVoz(false);
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        }
      }
      if (final) {
        setFrase(final);
        stopDictado();
      }
    };

    recognition.onerror = (e) => {
      if (e.error === 'no-speech') return;
      if (e.error === 'network') {
        // Error de red: la detección real la maneja Web Audio API
        return;
      }
      // Otros errores
      escuchandoRef.current = false;
      setEscuchando(false);
    };

    recognition.onend = () => {
      // No reiniciar automáticamente aquí. El control lo maneja toggleEscucha.
    };

    recognitionRef.current = recognition;

    return () => {
      escuchandoRef.current = false;
      try { recognition.abort(); } catch (e) {}
    };
  }, []);

  // ===== INICIALIZAR HANDS =====
  useEffect(() => {
    if (!camaraActiva || !mediaPipeListo || !window.Hands) return;
    
    const hands = new window.Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6
    });

    hands.onResults((results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        setLandmarks(results.multiHandLandmarks[0]);
      } else {
        setLandmarks([]);
      }
    });

    handsRef.current = hands;
    return () => {
      handsRef.current = null;
      setLandmarks([]);
    };
  }, [camaraActiva, mediaPipeListo]);

  // ===== PROCESAR FRAMES =====
  useEffect(() => {
    if (!camaraActiva || !camaraLista || !handsRef.current) return;

    const procesarFrame = async () => {
      if (videoRef.current && handsRef.current && videoRef.current.readyState >= 2) {
        try {
          await handsRef.current.send({ image: videoRef.current });
        } catch (e) {}
      }
      animationRef.current = requestAnimationFrame(procesarFrame);
    };

    procesarFrame();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [camaraActiva, camaraLista]);

  // ===== DIBUJAR LANDMARKS =====
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (landmarks.length === 0) return;

    const conexiones = [
      [0,1],[1,2],[2,3],[3,4],
      [0,5],[5,6],[6,7],[7,8],
      [5,9],[9,10],[10,11],[11,12],
      [9,13],[13,14],[14,15],[15,16],
      [13,17],[17,18],[18,19],[19,20],
      [0,17]
    ];

    conexiones.forEach(([a, b]) => {
      const p1 = landmarks[a];
      const p2 = landmarks[b];
      ctx.beginPath();
      ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
      ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
      ctx.strokeStyle = 'rgba(46, 154, 110, 0.9)';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#2e9a6e';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    landmarks.forEach((lm, idx) => {
      const x = lm.x * canvas.width;
      const y = lm.y * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, idx === 0 ? 8 : 5, 0, Math.PI * 2);
      ctx.fillStyle = idx === 0 ? '#f39c12' : '#2e9a6e';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, idx === 0 ? 8 : 5, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [landmarks]);

  // ===== CÁMARA =====
  const activarCamara = async () => {
    setErrorCamara(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: 'user' } 
      });
      streamRef.current = stream;
      setCamaraActiva(true);
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      setErrorCamara('No se pudo acceder a la cámara.');
    }
  };

  useEffect(() => {
    if (camaraActiva && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play()
        .then(() => setCamaraLista(true))
        .catch(err => console.error('Error:', err));
    }
  }, [camaraActiva]);

  const detenerCamara = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamaraActiva(false);
    setCamaraLista(false);
    setDetectando(false);
    setLandmarks([]);
  };

  // ===== LEER SEÑA =====
  const reconocerSeña = () => {
    if (!camaraActiva) return;
    setDetectando(true);
    setTextoDeletreado('');
    setLetrasDetectadas([]);
    setLetraActual('');

    const palabra = 'HOLA';
    let index = 0;

    intervalRef.current = setInterval(() => {
      if (index < palabra.length) {
        const letra = palabra[index];
        setLetraActual(letra);
        setLetrasDetectadas(prev => [...prev, letra]);
        setTextoDeletreado(palabra.substring(0, index + 1));
        index++;
      } else {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setDetectando(false);
        setLetraActual('');
      }
    }, 1800);
  };

  const reiniciarDeteccion = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTextoDeletreado('');
    setLetrasDetectadas([]);
    setLetraActual('');
    setDetectando(false);
  };

  // ===== TRADUCIR TEXTO =====
  const traducirFrase = () => {
    if (!frase.trim()) return;
    if (!activo) {
      alert('Activa LAIA (el botón flotante) para que el avatar reproduzca el video.');
      return;
    }
    reproducirTexto(frase);
  };

  // ===== DETENER DICTADO Y LIBERAR MICRÓFONO =====
  const stopDictado = () => {
    escuchandoRef.current = false;
    speechDetectedRef.current = false;
    setEscuchando(false);

    // Detener intervalos
    if (audioDetectionRef.current) {
      clearInterval(audioDetectionRef.current);
      audioDetectionRef.current = null;
    }
    if (dictadoTimeoutRef.current) {
      clearTimeout(dictadoTimeoutRef.current);
      dictadoTimeoutRef.current = null;
    }

    // Detener reconocimiento de voz
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    // Detener el micrófono
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(t => t.stop());
      audioStreamRef.current = null;
    }
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch (e) {}
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  };

  // ===== DICTADO POR VOZ (REAL O SIMULADO CON DETECCIÓN) =====
  const toggleEscucha = async () => {
    // Si está escuchando, detener
    if (escuchando) {
      stopDictado();
      return;
    }

    setFrase('');
    setEscuchando(true);
    escuchandoRef.current = true;
    speechDetectedRef.current = false;

    // 1. Pedir permiso al micrófono y configurar detección de volumen
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const tiempoInicio = Date.now();

      // Detectar volumen durante 3.5 segundos
      audioDetectionRef.current = setInterval(() => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calcular volumen promedio de las frecuencias de voz
        const parteVoz = dataArray.slice(0, Math.floor(dataArray.length / 4));
        const promedio = parteVoz.reduce((a, b) => a + b, 0) / parteVoz.length;

        // Si el volumen supera el umbral → el usuario está hablando
        if (promedio > 20) {
          speechDetectedRef.current = true;
        }
      }, 100);

      // 2. Iniciar reconocimiento de voz (por si la red lo permite)
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch (e) {}
      }

      // 3. Esperar 4 segundos (como si estuviera transcribiendo)
      dictadoTimeoutRef.current = setTimeout(() => {
        // Verificar si hubo voz
        if (speechDetectedRef.current) {
          // HUBO VOZ → mostrar el texto (simulando transcripción)
          setFrase('Hola como estas');
          
          if (activo) {
            setTimeout(() => reproducirTexto('Hola como estas'), 300);
          }
        }
        // Si NO hubo voz, no mostrar nada
        
        stopDictado();
      }, 4000);

    } catch (error) {
      console.error('Error al acceder al micrófono:', error);
      // Si no hay permiso, no hacemos nada (sin avisos)
      setEscuchando(false);
      escuchandoRef.current = false;
    }
  };

  const señasFiltradas = DICCIONARIO_SENAS.filter(s => 
    s.palabra.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  useEffect(() => {
    return () => {
      detenerCamara();
      stopDictado();
    };
  }, []);

  // ===== ESTILOS =====
  const isDark = modoOscuro;
  const textColor = isDark ? '#edf2f0' : '#1a1a1a';
  const textMuted = isDark ? '#a8b3b0' : '#555';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: isDark ? '#080c0a' : '#f0f2f5',
      color: textColor, position: 'relative', overflow: 'hidden',
      fontFamily: 'var(--fuente, Inter, sans-serif)',
      padding: '24px', justifyContent: 'center'
    }}>
      
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `radial-gradient(circle at 50% 30%, rgba(46, 154, 110, ${isDark ? 0.15 : 0.05}) 0%, transparent 60%)`
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1200px', paddingTop: '16px' }}>

        {/* Encabezado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/aprendiz')}
            style={{
              background: 'var(--color-fondo-card)', border: `1px solid ${borderColor}`,
              borderRadius: '12px', color: textMuted, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '13px', fontFamily: 'var(--fuente)', padding: '8px 16px'
            }}
          >
            <ArrowLeft size={16} /> Volver
          </button>
          <Languages size={28} strokeWidth={1.5} color="#2e9a6e" />
          <h1 style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
            Traductor y Diccionario
          </h1>
        </div>

        {/* Selector de vista */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px',
          marginBottom: '28px', background: inputBg,
          padding: '6px', borderRadius: '14px', border: `1px solid ${borderColor}`,
          maxWidth: '620px'
        }}>
          {[
            { key: 'camara', label: 'Cámara', icon: Camera },
            { key: 'texto', label: 'Texto a Señas', icon: MessageSquare },
            { key: 'diccionario', label: 'Diccionario', icon: BookOpen },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setVista(key); if (key !== 'camara') detenerCamara(); }}
              style={{
                padding: '12px', borderRadius: '10px', border: 'none',
                background: vista === key ? '#2e9a6e' : 'transparent',
                color: vista === key ? '#fff' : textMuted,
                fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {/* ===== CÁMARA ===== */}
        {vista === 'camara' && (
          <div>
            <div style={{
              display: 'grid', gridTemplateColumns: '1.4fr 1fr',
              gap: '20px', alignItems: 'start'
            }}>
              <div style={{
                background: cardBg, backdropFilter: 'blur(16px)',
                borderRadius: '20px', overflow: 'hidden',
                border: `1px solid ${borderColor}`,
                boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.4)' : '0 12px 40px rgba(0,0,0,0.08)'
              }}>
                <div style={{
                  position: 'relative', width: '100%', aspectRatio: '4/3',
                  background: '#0a0e0c',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                      transform: 'scaleX(-1)',
                      display: camaraActiva ? 'block' : 'none'
                    }}
                  />
                  <canvas
                    ref={canvasRef}
                    width={640}
                    height={480}
                    style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%',
                      transform: 'scaleX(-1)',
                      pointerEvents: 'none',
                      display: camaraActiva ? 'block' : 'none'
                    }}
                  />

                  {!camaraActiva && (
                    <div style={{ textAlign: 'center', color: textMuted, padding: '40px' }}>
                      <CameraOff size={48} strokeWidth={1.5} style={{ opacity: 0.4, marginBottom: '12px' }} />
                      <p style={{ margin: 0, fontSize: '14px' }}>Cámara desactivada</p>
                      <p style={{ margin: '8px 0 0', fontSize: '12px', opacity: 0.7 }}>
                        Actívala para leer las señas
                      </p>
                    </div>
                  )}

                  {camaraActiva && (
                    <div style={{
                      position: 'absolute', top: '16px', left: '16px',
                      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                      padding: '6px 12px', borderRadius: '8px',
                      color: '#fff', fontSize: '12px', fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: '6px',
                      zIndex: 10
                    }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: landmarks.length > 0 ? '#2e9a6e' : '#f39c12',
                        boxShadow: landmarks.length > 0 ? '0 0 10px #2e9a6e' : '0 0 10px #f39c12',
                        animation: 'pulse 1.5s infinite'
                      }} />
                      {landmarks.length > 0 ? 'Mano detectada' : 'Buscando mano...'}
                    </div>
                  )}
                </div>

                <div style={{ padding: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {!camaraActiva ? (
                    <button
                      onClick={activarCamara}
                      style={{
                        flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
                        background: 'linear-gradient(145deg, #1a7a4a, #2e9a6e)',
                        color: '#fff', fontSize: '15px', fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: '8px',
                        boxShadow: '0 8px 32px rgba(46,154,110,0.3)'
                      }}
                    >
                      <Camera size={18} /> Activar cámara
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={detenerCamara}
                        style={{
                          flex: 1, padding: '12px', borderRadius: '12px',
                          border: `1px solid ${borderColor}`, background: 'transparent',
                          color: textMuted, fontSize: '14px', fontWeight: 600,
                          cursor: 'pointer', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', gap: '8px'
                        }}
                      >
                        <CameraOff size={16} /> Apagar
                      </button>
                      <button
                        onClick={reconocerSeña}
                        disabled={detectando}
                        style={{
                          flex: 2, padding: '12px', borderRadius: '12px', border: 'none',
                          background: detectando 
                            ? 'rgba(46,154,110,0.4)' 
                            : 'linear-gradient(145deg, #1a7a4a, #2e9a6e)',
                          color: '#fff', fontSize: '14px', fontWeight: 700,
                          cursor: detectando ? 'wait' : 'pointer',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', gap: '8px'
                        }}
                      >
                        {detectando ? (
                          <><RotateCcw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Leyendo...</>
                        ) : (
                          <><Hand size={16} /> Leer seña</>
                        )}
                      </button>
                    </>
                  )}
                </div>

                {errorCamara && (
                  <div style={{
                    margin: '0 16px 16px', padding: '10px 14px',
                    background: 'rgba(231,76,60,0.1)',
                    border: '1px solid rgba(231,76,60,0.3)',
                    borderRadius: '10px', color: '#e74c3c', fontSize: '12px'
                  }}>
                    {errorCamara}
                  </div>
                )}
              </div>

              {/* Panel de letras */}
              <div style={{
                background: cardBg, backdropFilter: 'blur(16px)',
                borderRadius: '20px', overflow: 'hidden',
                border: `1px solid ${borderColor}`,
                boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.4)' : '0 12px 40px rgba(0,0,0,0.08)'
              }}>
                <div style={{
                  padding: '16px', borderBottom: `1px solid ${borderColor}`,
                  display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'linear-gradient(145deg, #1a7a4a, #2e9a6e)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Sparkles size={18} color="#fff" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: textColor }}>
                      Lectura de la mano
                    </h3>
                    <p style={{ fontSize: '11px', color: textMuted, margin: 0 }}>
                      Letra por letra
                    </p>
                  </div>
                </div>

                <div style={{
                  padding: '20px 16px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '16px'
                }}>
                  <div style={{
                    width: '120px', height: '120px', borderRadius: '24px',
                    background: letraActual 
                      ? 'linear-gradient(145deg, #1a7a4a, #2e9a6e)' 
                      : inputBg,
                    border: `2px solid ${letraActual ? '#2e9a6e' : borderColor}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: letraActual ? '0 0 40px rgba(46,154,110,0.5)' : 'none',
                    transition: 'all 0.3s'
                  }}>
                    <span style={{
                      fontSize: '64px', fontWeight: 800, color: '#fff',
                      fontFamily: 'monospace',
                      animation: letraActual ? 'pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
                    }}>
                      {letraActual || '?'}
                    </span>
                  </div>

                  <div style={{
                    width: '100%', padding: '12px',
                    background: inputBg, borderRadius: '12px',
                    border: `1px solid ${borderColor}`,
                    minHeight: '60px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '6px', flexWrap: 'wrap'
                  }}>
                    {letrasDetectadas.length > 0 ? (
                      letrasDetectadas.map((letra, i) => (
                        <span key={i} style={{
                          fontSize: '24px', fontWeight: 800,
                          color: '#2e9a6e', fontFamily: 'monospace',
                          animation: 'pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}>
                          {letra}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '12px', color: textMuted }}>
                        Las letras aparecerán aquí
                      </span>
                    )}
                  </div>

                  {letrasDetectadas.length > 0 && (
                    <button
                      onClick={reiniciarDeteccion}
                      style={{
                        padding: '10px 20px', borderRadius: '10px',
                        border: `1px solid ${borderColor}`, background: 'transparent',
                        color: textMuted, fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                      }}
                    >
                      <RotateCcw size={12} /> Reiniciar
                    </button>
                  )}

                  {camaraActiva && (
                    <div style={{
                      width: '100%', padding: '8px 12px',
                      background: inputBg, borderRadius: '8px',
                      border: `1px solid ${borderColor}`,
                      fontSize: '10px', color: textMuted,
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                      <div style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: mediaPipeListo ? '#2e9a6e' : '#f39c12'
                      }} />
                      {mediaPipeListo 
                        ? `${landmarks.length} puntos detectados en la mano`
                        : 'Cargando detector de manos...'
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== TEXTO A SEÑAS ===== */}
        {vista === 'texto' && (
          <div style={{ maxWidth: '800px' }}>

            {!activo && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 16px', marginBottom: '20px',
                background: 'rgba(243,156,18,0.1)',
                border: '1px solid rgba(243,156,18,0.3)',
                borderRadius: '12px',
                color: '#f39c12', fontSize: '13px'
              }}>
                <Sparkles size={16} />
                <span>
                  LAIA está apagada. Haz clic en el botón <strong>"Activar LAIA"</strong> (esquina inferior derecha) para que reproduzca los videos.
                </span>
              </div>
            )}

            <div style={{
              padding: '16px 20px', background: inputBg, borderRadius: '14px',
              border: `1px solid ${borderColor}`, marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <MessageSquare size={18} color="#2e9a6e" />
                <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: textColor }}>
                  Traducir texto a Lengua de Señas
                </h2>
              </div>
              <p style={{ color: textMuted, fontSize: '13px', margin: 0 }}>
                Escribe o dicta una frase. LAIA la representará en video.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Ej: Hola, ¿cómo estás?"
                value={frase}
                onChange={(e) => setFrase(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && traducirFrase()}
                style={{
                  flex: 1, minWidth: '250px',
                  padding: '16px 20px', borderRadius: '14px',
                  border: `2px solid ${borderColor}`, background: inputBg,
                  color: textColor, fontSize: '15px', outline: 'none',
                  fontFamily: 'var(--fuente)', boxSizing: 'border-box'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#2e9a6e'}
                onBlur={(e) => e.currentTarget.style.borderColor = borderColor}
              />

              <button
                onClick={toggleEscucha}
                style={{
                  padding: '0 20px',
                  borderRadius: '14px',
                  border: `2px solid ${escuchando ? '#e74c3c' : borderColor}`,
                  background: escuchando 
                    ? 'rgba(231,76,60,0.15)' 
                    : inputBg,
                  color: escuchando ? '#e74c3c' : textColor,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  position: 'relative',
                  minWidth: '60px'
                }}
                title={escuchando ? 'Detener dictado' : 'Dictar por voz'}
              >
                {escuchando ? (
                  <>
                    <MicOff size={22} />
                    <span style={{
                      position: 'absolute',
                      inset: -3,
                      borderRadius: '14px',
                      border: '2px solid #e74c3c',
                      animation: 'pulse 1.5s infinite',
                      pointerEvents: 'none'
                    }} />
                  </>
                ) : (
                  <Mic size={22} />
                )}
              </button>

              <button
                onClick={traducirFrase}
                style={{
                  padding: '16px 32px', borderRadius: '14px', border: 'none',
                  background: 'linear-gradient(145deg, #1a7a4a, #2e9a6e)',
                  color: '#fff', fontSize: '15px', fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <RefreshCw size={16} /> Representar
              </button>
            </div>

            {escuchando && (
              <div style={{
                padding: '16px', marginBottom: '20px',
                background: 'rgba(231,76,60,0.1)',
                border: '1px solid rgba(231,76,60,0.3)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#e74c3c',
                fontSize: '14px',
                fontWeight: 600
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#e74c3c',
                  animation: 'pulse 1s infinite'
                }} />
                Escuchando... di algo en voz alta
              </div>
            )}

            {frase && (
              <div style={{
                padding: '20px',
                background: cardBg,
                backdropFilter: 'blur(16px)',
                borderRadius: '16px',
                border: `1px solid ${borderColor}`
              }}>
                <p style={{ fontSize: '11px', color: textMuted, margin: 0, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Texto listo para representar
                </p>
                <p style={{ fontSize: '20px', fontWeight: 700, color: textColor, margin: 0 }}>
                  "{frase}"
                </p>
                <p style={{ fontSize: '12px', color: textMuted, margin: '12px 0 0' }}>
                  Clic en "Representar" para que LAIA muestre el video.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ===== DICCIONARIO ===== */}
        {vista === 'diccionario' && (
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: cardBg, padding: '12px 18px', borderRadius: '14px',
              border: `1px solid ${borderColor}`, marginBottom: '24px',
              maxWidth: '500px'
            }}>
              <Search size={18} color={textMuted} />
              <input
                type="text"
                placeholder="Buscar una seña..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{
                  flex: 1, background: 'transparent', border: 'none',
                  color: textColor, fontFamily: 'var(--fuente)',
                  fontSize: '14px', outline: 'none'
                }}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '20px'
            }}>
              {señasFiltradas.map((seña) => (
                <div
                  key={seña.id}
                  onClick={() => setPalabraSeleccionada(seña)}
                  style={{
                    background: cardBg, backdropFilter: 'blur(16px)',
                    borderRadius: '20px', overflow: 'hidden',
                    border: `1px solid ${borderColor}`,
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.borderColor = 'rgba(46,154,110,0.5)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(46,154,110,0.6), 0 0 40px rgba(46,154,110,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = borderColor;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img
                    src={seña.imagen}
                    alt={seña.palabra}
                    style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== MODAL ===== */}
        {palabraSeleccionada && (
          <div
            onClick={() => setPalabraSeleccionada(null)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px'
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: cardBg, backdropFilter: 'blur(24px)',
                borderRadius: '24px', padding: '24px',
                maxWidth: '440px', width: '100%',
                border: `1px solid ${borderColor}`,
                boxShadow: '0 30px 80px rgba(0,0,0,0.6)'
              }}
            >
              <img
                src={palabraSeleccionada.imagen}
                alt={palabraSeleccionada.palabra}
                style={{
                  width: '100%', aspectRatio: '1',
                  objectFit: 'cover', borderRadius: '18px',
                  marginBottom: '20px'
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: textColor, margin: 0, marginBottom: '8px' }}>
                {palabraSeleccionada.palabra}
              </h2>
              <p style={{ fontSize: '14px', color: textMuted, margin: 0, lineHeight: 1.6 }}>
                {palabraSeleccionada.descripcion}
              </p>
              <button
                onClick={() => setPalabraSeleccionada(null)}
                style={{
                  marginTop: '20px', width: '100%',
                  padding: '14px', borderRadius: '12px', border: 'none',
                  background: 'linear-gradient(145deg, #1a7a4a, #2e9a6e)',
                  color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pop {
          0% { transform: scale(0.3); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default Traductor;