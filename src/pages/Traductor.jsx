import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAvatar } from '../context/AvatarContext';
import { 
  ArrowLeft, Languages, BookOpen, Camera, CameraOff, MessageSquare, 
  RefreshCw, Search, RotateCcw, Sparkles, Mic, MicOff, PlusCircle, Save, FolderOpen, Trash2
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
  
  // MediaPipe & TensorFlow / KNN
  const [iaLista, setIaLista] = useState(false);
  const handsRef = useRef(null);
  const knnClassifierRef = useRef(null);
  const [landmarks, setLandmarks] = useState([]);
  
  // Reconocimiento y Entrenamiento
  const [textoDeletreado, setTextoDeletreado] = useState('');
  const [detectando, setDetectando] = useState(false);
  const [letraActual, setLetraActual] = useState('');
  const [letrasDetectadas, setLetrasDetectadas] = useState([]);
  
  // Panel de entrenamiento
  const [letraEntrenando, setLetraEntrenando] = useState('A');
  const [conteoMuestras, setConteoMuestras] = useState({});
  const [modoEntrenamiento, setModoEntrenamiento] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  // Texto a señas
  const [frase, setFrase] = useState('');
  
  // Voz
  const [escuchando, setEscuchando] = useState(false);
  const [soporteVoz, setSoporteVoz] = useState(true);
  const recognitionRef = useRef(null);

  // Diccionario
  const [busqueda, setBusqueda] = useState('');
  const [palabraSeleccionada, setPalabraSeleccionada] = useState(null);

  // ===== FUNCIÓN AUXILIAR PARA CARGAR MODELO DESDE LOCALSTORAGE =====
  const restaurarModeloGuardado = () => {
    try {
      const guardado = localStorage.getItem('modeloSeñasDataset');
      const conteoGuardado = localStorage.getItem('conteoMuestrasSeñas');
      if (guardado && knnClassifierRef.current && window.tf) {
        const datasetObj = JSON.parse(guardado);
        const tensorDataset = {};
        Object.keys(datasetObj).forEach(key => {
          tensorDataset[key] = window.tf.tensor2d(datasetObj[key], [datasetObj[key].length / 63, 63]);
        });
        knnClassifierRef.current.setClassifierDataset(tensorDataset);
        if (conteoGuardado) {
          setConteoMuestras(JSON.parse(conteoGuardado));
        }
        return true;
      }
    } catch (err) {
      console.error('Error al restaurar el modelo guardado:', err);
    }
    return false;
  };

  // ===== CARGAR LIBRERÍAS DE MEDIAPIPE Y TENSORFLOW.JS / KNN =====
  useEffect(() => {
    const cargarLibreriasIA = async () => {
      try {
        if (!window.tf) {
          await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.21.0/dist/tf.min.js';
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
          });
        }
        if (!window.knnClassifier) {
          await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/knn-classifier@1.2.4/dist/knn-classifier.min.js';
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
          });
        }
        if (!window.Hands) {
          await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands.js';
            s.crossOrigin = 'anonymous';
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
          });
        }

        knnClassifierRef.current = window.knnClassifier.create();
        // Cargar automáticamente si ya existe un entrenamiento guardado
        restaurarModeloGuardado();
        setIaLista(true);
      } catch (error) {
        console.error('Error al cargar modelos de IA:', error);
        setIaLista(false);
      }
    };
    cargarLibreriasIA();
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
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
      }
      if (final) {
        setFrase(final);
      }
    };
    recognitionRef.current = recognition;
    return () => { try { recognition.abort(); } catch (e) {} };
  }, []);

  // ===== INICIALIZAR HANDS =====
  useEffect(() => {
    if (!camaraActiva || !iaLista || !window.Hands) return;
    
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
    return () => { handsRef.current = null; setLandmarks([]); };
  }, [camaraActiva, iaLista]);

  // ===== PROCESAR FRAMES DE CÁMARA =====
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
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
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
      ctx.strokeStyle = modoEntrenamiento ? 'rgba(243,156,18,0.9)' : 'rgba(46, 154, 110, 0.9)';
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    landmarks.forEach((lm, idx) => {
      const x = lm.x * canvas.width;
      const y = lm.y * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, idx === 0 ? 8 : 5, 0, Math.PI * 2);
      ctx.fillStyle = idx === 0 ? '#f39c12' : (modoEntrenamiento ? '#f39c12' : '#2e9a6e');
      ctx.fill();
    });
  }, [landmarks, modoEntrenamiento]);

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
      setErrorCamara('No se pudo acceder a la cámara.');
    }
  };

  useEffect(() => {
    if (camaraActiva && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play()
        .then(() => setCamaraLista(true))
        .catch(err => console.error(err));
    }
  }, [camaraActiva]);

  const detenerCamara = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
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

  // ===== CONVERTIR LANDMARKS A TENSOR =====
  const obtenerTensorDeLandmarks = (lms) => {
    const baseX = lms[0].x;
    const baseY = lms[0].y;
    const baseZ = lms[0].z || 0;

    const datosPlanos = [];
    lms.forEach(pt => {
      datosPlanos.push(pt.x - baseX);
      datosPlanos.push(pt.y - baseY);
      datosPlanos.push((pt.z || 0) - baseZ);
    });
    return window.tf.tensor1d(datosPlanos);
  };

  // ===== ENTRENAR UNA SEÑA =====
  const entrenarEjemplo = () => {
    if (landmarks.length === 0) {
      alert('Coloca tu mano frente a la cámara para entrenar.');
      return;
    }
    const tensor = obtenerTensorDeLandmarks(landmarks);
    knnClassifierRef.current.addExample(tensor, letraEntrenando);
    tensor.dispose();

    setConteoMuestras(prev => ({
      ...prev,
      [letraEntrenando]: (prev[letraEntrenando] || 0) + 1
    }));
  };

  // ===== GUARDAR / CARGAR / BORRAR MODELO =====
  const guardarModelo = () => {
    if (!knnClassifierRef.current || knnClassifierRef.current.getNumClasses() === 0) {
      alert('No hay muestras entrenadas para guardar.');
      return;
    }
    const dataset = knnClassifierRef.current.getClassifierDataset();
    const datasetObj = {};
    Object.keys(dataset).forEach(key => {
      datasetObj[key] = Array.from(dataset[key].dataSync());
    });
    localStorage.setItem('modeloSeñasDataset', JSON.stringify(datasetObj));
    localStorage.setItem('conteoMuestrasSeñas', JSON.stringify(conteoMuestras));
    alert('¡Modelo y muestras guardados con éxito en el navegador!');
  };

  const cargarModeloManual = () => {
    const exito = restaurarModeloGuardado();
    if (exito) {
      alert('¡Modelo cargado correctamente desde el almacenamiento!');
    } else {
      alert('No hay ningún modelo guardado previamente.');
    }
  };

  const borrarModeloGuardado = () => {
    if (!window.confirm('¿Seguro que deseas borrar todo el entrenamiento guardado?')) return;
    localStorage.removeItem('modeloSeñasDataset');
    localStorage.removeItem('conteoMuestrasSeñas');
    if (knnClassifierRef.current) {
      knnClassifierRef.current.clearAllClasses();
    }
    setConteoMuestras({});
    alert('Entrenamiento eliminado.');
  };

  // ===== RECONOCER SEÑA =====
  const reconocerSeña = async () => {
    if (!camaraActiva) return;
    if (landmarks.length === 0) {
      alert('No se detecta ninguna mano.');
      return;
    }
    if (!knnClassifierRef.current || knnClassifierRef.current.getNumClasses() === 0) {
      alert('El modelo no ha sido entrenado. Activa el modo entrenamiento y agrega muestras primero.');
      return;
    }

    setDetectando(true);
    const tensor = obtenerTensorDeLandmarks(landmarks);

    try {
      const res = await knnClassifierRef.current.predictClass(tensor);
      tensor.dispose();

      if (res && res.label && res.confidences[res.label] > 0.3) {
        const letraEncontrada = res.label;
        setLetraActual(letraEncontrada);
        setLetrasDetectadas(prev => [...prev, letraEncontrada]);
        setTextoDeletreado(prev => prev + letraEncontrada);
      } else {
        setLetraActual('?');
      }
    } catch (e) {
      console.error(e);
    }
    setDetectando(false);
  };

  const reiniciarDeteccion = () => {
    setTextoDeletreado('');
    setLetrasDetectadas([]);
    setLetraActual('');
  };

  const traducirFrase = () => {
    if (!frase.trim()) return;
    if (!activo) {
      alert('Activa LAIA (botón flotante) para reproducir.');
      return;
    }
    reproducirTexto(frase);
  };

  const toggleEscucha = () => {
    if (escuchando) {
      try { recognitionRef.current.stop(); } catch(e) {}
      setEscuchando(false);
    } else {
      setFrase('');
      try { recognitionRef.current.start(); setEscuchando(true); } catch(e) {}
    }
  };

  const señasFiltradas = DICCIONARIO_SENAS.filter(s => 
    s.palabra.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const isDark = modoOscuro;
  const textColor = isDark ? '#edf2f0' : '#1a1a1a';
  const textMuted = isDark ? '#a8b3b0' : '#555';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';

  return (
    <div style={{
      display: 'flex', minHeight: '100vh', background: isDark ? '#080c0a' : '#f0f2f5',
      color: textColor, position: 'relative', overflow: 'hidden',
      fontFamily: 'var(--fuente, Inter, sans-serif)', padding: '24px', justifyContent: 'center'
    }}>
      
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1200px', paddingTop: '16px' }}>

        {/* Encabezado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/aprendiz')}
            style={{
              background: cardBg, border: `1px solid ${borderColor}`,
              borderRadius: '12px', color: textMuted, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px'
            }}
          >
            <ArrowLeft size={16} /> Volver
          </button>
          <Languages size={28} strokeWidth={1.5} color="#2e9a6e" />
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>
            Traductor Inteligente con IA
          </h1>
        </div>

        {/* Selector de vista */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px',
          marginBottom: '24px', background: inputBg, padding: '6px', borderRadius: '14px',
          border: `1px solid ${borderColor}`, maxWidth: '620px'
        }}>
          {[
            { key: 'camara', label: 'Cámara & IA', icon: Camera },
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

        {/* ===== CÁMARA CON IA ===== */}
        {vista === 'camara' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', alignItems: 'start' }}>
              
              <div style={{
                background: cardBg, borderRadius: '20px', overflow: 'hidden',
                border: `1px solid ${borderColor}`, boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
              }}>
                <div style={{
                  position: 'relative', width: '100%', aspectRatio: '4/3',
                  background: '#0a0e0c', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <video
                    ref={videoRef} autoPlay playsInline muted
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      transform: 'scaleX(-1)', display: camaraActiva ? 'block' : 'none'
                    }}
                  />
                  <canvas
                    ref={canvasRef} width={640} height={480}
                    style={{
                      position: 'absolute', inset: 0, width: '100%', height: '100%',
                      transform: 'scaleX(-1)', pointerEvents: 'none', display: camaraActiva ? 'block' : 'none'
                    }}
                  />

                  {!camaraActiva && (
                    <div style={{ textAlign: 'center', color: textMuted, padding: '40px' }}>
                      <CameraOff size={48} strokeWidth={1.5} style={{ opacity: 0.4, marginBottom: '12px' }} />
                      <p style={{ margin: 0, fontSize: '14px' }}>Cámara desactivada</p>
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
                        color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                      }}
                    >
                      <Camera size={18} /> Activar cámara y modelo IA
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={detenerCamara}
                        style={{
                          padding: '12px 16px', borderRadius: '12px', border: `1px solid ${borderColor}`,
                          background: 'transparent', color: textMuted, cursor: 'pointer'
                        }}
                      >
                        Apagar
                      </button>
                      <button
                        onClick={() => setModoEntrenamiento(!modoEntrenamiento)}
                        style={{
                          flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                          background: modoEntrenamiento ? '#f39c12' : '#34495e',
                          color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '13px'
                        }}
                      >
                        {modoEntrenamiento ? 'Modo: Entrenando IA' : 'Modo: Reconocimiento'}
                      </button>
                      <button
                        onClick={reconocerSeña}
                        disabled={detectando || modoEntrenamiento}
                        style={{
                          flex: 1.5, padding: '12px', borderRadius: '12px', border: 'none',
                          background: 'linear-gradient(145deg, #1a7a4a, #2e9a6e)',
                          color: '#fff', fontWeight: 700, cursor: 'pointer'
                        }}
                      >
                        {detectando ? 'Analizando...' : 'Leer Seña'}
                      </button>
                    </>
                  )}
                </div>

                {errorCamara && (
                  <div style={{
                    margin: '0 16px 16px', padding: '10px 14px',
                    background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)',
                    borderRadius: '10px', color: '#e74c3c', fontSize: '12px'
                  }}>
                    {errorCamara}
                  </div>
                )}
              </div>

              {/* Panel lateral */}
              <div style={{
                background: cardBg, borderRadius: '20px', padding: '20px',
                border: `1px solid ${borderColor}`
              }}>
                {modoEntrenamiento ? (
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#f39c12' }}>
                      Entrenar Señas / Letras
                    </h3>
                    <p style={{ fontSize: '12px', color: textMuted, marginBottom: '16px' }}>
                      Escribe la letra, haz el gesto frente a la cámara (moviendo un poco la mano) y agrega varias muestras. Luego guarda el modelo.
                    </p>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                        Letra a entrenar:
                      </label>
                      <input
                        type="text" maxLength={2} value={letraEntrenando}
                        onChange={(e) => setLetraEntrenando(e.target.value.toUpperCase())}
                        style={{
                          width: '100%', padding: '10px', borderRadius: '10px',
                          border: `1px solid ${borderColor}`, background: inputBg,
                          color: textColor, fontSize: '18px', textAlign: 'center', fontWeight: 700,
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <button
                      onClick={entrenarEjemplo}
                      style={{
                        width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                        background: '#f39c12', color: '#fff', fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        marginBottom: '10px'
                      }}
                    >
                      <PlusCircle size={18} /> Agregar Muestra para "{letraEntrenando}"
                    </button>

                    {/* Botones de Persistencia */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <button
                        onClick={guardarModelo}
                        style={{
                          flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                          background: '#2e9a6e', color: '#fff', fontSize: '12px', fontWeight: 600,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                        }}
                      >
                        <Save size={14} /> Guardar
                      </button>

                      <button
                        onClick={cargarModeloManual}
                        style={{
                          flex: 1, padding: '10px', borderRadius: '10px', border: `1px solid ${borderColor}`,
                          background: inputBg, color: textColor, fontSize: '12px', fontWeight: 600,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                        }}
                      >
                        <FolderOpen size={14} /> Cargar
                      </button>

                      <button
                        onClick={borrarModeloGuardado}
                        title="Borrar entrenamiento guardado"
                        style={{
                          padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(231,76,60,0.3)',
                          background: 'rgba(231,76,60,0.1)', color: '#e74c3c',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={{ fontSize: '12px', color: textMuted }}>
                      <strong>Muestras guardadas ({Object.keys(conteoMuestras).length} letras):</strong>
                      <div style={{ marginTop: '6px', maxHeight: '140px', overflowY: 'auto', paddingRight: '4px' }}>
                        {Object.entries(conteoMuestras).map(([letra, count]) => (
                          <div key={letra} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: `1px solid ${borderColor}` }}>
                            <span>Letra <strong>{letra}</strong>:</span>
                            <strong style={{ color: '#2e9a6e' }}>{count} muestras</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                      <Sparkles size={18} color="#2e9a6e" />
                      <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Resultado de IA</h3>
                    </div>

                    <div style={{
                      width: '100px', height: '100px', borderRadius: '20px', margin: '0 auto 16px',
                      background: letraActual ? '#2e9a6e' : inputBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '50px', fontWeight: 800, color: '#fff' }}>
                        {letraActual || '?'}
                      </span>
                    </div>

                    <div style={{
                      padding: '12px', background: inputBg, borderRadius: '12px',
                      minHeight: '50px', textAlign: 'center', marginBottom: '16px',
                      fontSize: '20px', fontWeight: 700, color: '#2e9a6e', wordBreak: 'break-all'
                    }}>
                      {textoDeletreado || 'Esperando señas...'}
                    </div>

                    {letrasDetectadas.length > 0 && (
                      <button
                        onClick={reiniciarDeteccion}
                        style={{
                          width: '100%', padding: '10px', borderRadius: '10px',
                          border: `1px solid ${borderColor}`, background: 'transparent',
                          color: textMuted, cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', gap: '6px'
                        }}
                      >
                        <RotateCcw size={14} /> Limpiar texto
                      </button>
                    )}

                    <div style={{
                      marginTop: '16px', padding: '8px 12px', background: inputBg,
                      borderRadius: '8px', fontSize: '11px', color: textMuted, textAlign: 'center'
                    }}>
                      Letras entrenadas en memoria: <strong>{Object.keys(conteoMuestras).length}</strong>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ===== TEXTO A SEÑAS ===== */}
        {vista === 'texto' && (
          <div style={{ maxWidth: '800px' }}>
            <div style={{ padding: '16px 20px', background: inputBg, borderRadius: '14px', border: `1px solid ${borderColor}`, marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Traducir texto a Lengua de Señas</h2>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              <input
                type="text" placeholder="Ej: Hola, ¿cómo estás?"
                value={frase} onChange={(e) => setFrase(e.target.value)}
                style={{
                  flex: 1, padding: '16px', borderRadius: '14px',
                  border: `2px solid ${borderColor}`, background: inputBg,
                  color: textColor, fontSize: '15px', outline: 'none'
                }}
              />
              <button
                onClick={toggleEscucha}
                style={{
                  padding: '0 20px', borderRadius: '14px', border: 'none',
                  background: escuchando ? '#e74c3c' : inputBg, color: escuchando ? '#fff' : textColor,
                  cursor: 'pointer'
                }}
              >
                {escuchando ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button
                onClick={traducirFrase}
                style={{
                  padding: '16px 24px', borderRadius: '14px', border: 'none',
                  background: '#2e9a6e', color: '#fff', fontWeight: 700, cursor: 'pointer'
                }}
              >
                Representar
              </button>
            </div>
          </div>
        )}

        {/* ===== DICCIONARIO ===== */}
        {vista === 'diccionario' && (
          <div>
            <div style={{ display: 'flex', gap: '10px', background: cardBg, padding: '12px 18px', borderRadius: '14px', border: `1px solid ${borderColor}`, marginBottom: '24px', maxWidth: '500px' }}>
              <Search size={18} color={textMuted} />
              <input
                type="text" placeholder="Buscar seña..." value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ flex: 1, background: 'transparent', border: 'none', color: textColor, outline: 'none' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {señasFiltradas.map((seña) => (
                <div key={seña.id} onClick={() => setPalabraSeleccionada(seña)} style={{ background: cardBg, borderRadius: '20px', overflow: 'hidden', border: `1px solid ${borderColor}`, cursor: 'pointer' }}>
                  <img src={seña.imagen} alt={seña.palabra} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
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
    </div>
  );
}

export default Traductor;