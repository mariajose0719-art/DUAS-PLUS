import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  User, 
  Brain, 
  Eye, 
  Ear, 
  BookOpen, 
  Palette,
  Sparkles,
  ZoomIn,
  Volume2,
  Type
} from 'lucide-react';

// ===== PERFILES =====
export const PERFILES = {
  NINGUNO: 'ninguno',
  TDAH: 'tdah',
  TEA: 'tea',
  BAJA_VISION: 'baja-vision',
  SORDERA: 'sordera',
  DISLEXIA: 'dislexia',
  DALTONISMO: 'daltonismo',
};

// ===== CONFIGURACIÓN POR PERFIL =====
export const PERFIL_CONFIG = {
  [PERFILES.NINGUNO]: {
    label: 'Sin necesidades especiales',
    descripcion: 'Configuración estándar',
    fuente: 'Inter, sans-serif',
    contraste: 'normal',
    tamañoFuente: 16,
    espaciado: 1.5,
    colorFondo: '#0a0e0c',
    colorTexto: '#edf2f0',
    colorPrimario: '#2e9a6e',
    colorSecundario: '#3498db',
    icon: User,
  },
  [PERFILES.TDAH]: {
    label: 'Déficit de atención (TDAH)',
    descripcion: 'Divide actividades, listas, recordatorios, paso a paso',
    fuente: 'Inter, sans-serif',
    contraste: 'normal',
    tamañoFuente: 18,
    espaciado: 2.0,
    colorFondo: '#f5f0eb',
    colorTexto: '#2d2d2d',
    colorPrimario: '#e67e22',
    colorSecundario: '#f39c12',
    icon: Brain,
  },
  [PERFILES.TEA]: {
    label: 'Autismo (TEA)',
    descripcion: 'Modo no molestar, rutinas, pictogramas, explicaciones sencillas',
    fuente: 'Inter, sans-serif',
    contraste: 'normal',
    tamañoFuente: 18,
    espaciado: 2.0,
    colorFondo: '#e8f0fe',
    colorTexto: '#1a1a2e',
    colorPrimario: '#1abc9c',
    colorSecundario: '#2ecc71',
    icon: Sparkles,
  },
  [PERFILES.BAJA_VISION]: {
    label: 'Baja visión',
    descripcion: 'Lector de voz, lupa, alto contraste, fuentes grandes',
    fuente: 'Arial, sans-serif',
    contraste: 'alto',
    tamañoFuente: 24,
    espaciado: 2.2,
    colorFondo: '#000000',
    colorTexto: '#ffffff',
    colorPrimario: '#ffff00',
    colorSecundario: '#00ffff',
    icon: Eye,
  },
  [PERFILES.SORDERA]: {
    label: 'Sordera / Discapacidad auditiva',
    descripcion: 'Subtítulos, avatar en señas, transcripción, notificaciones visuales',
    fuente: 'Inter, sans-serif',
    contraste: 'normal',
    tamañoFuente: 18,
    espaciado: 1.8,
    colorFondo: '#1a1a2e',
    colorTexto: '#e0e0e0',
    colorPrimario: '#e74c3c',
    colorSecundario: '#c0392b',
    icon: Ear,
  },
  [PERFILES.DISLEXIA]: {
    label: 'Dislexia',
    descripcion: 'Fuente OpenDyslexic, lectura palabra por palabra, espaciado amplio',
    fuente: 'OpenDyslexic, sans-serif',
    contraste: 'normal',
    tamañoFuente: 20,
    espaciado: 2.5,
    colorFondo: '#fcf9f2',
    colorTexto: '#1a1a1a',
    colorPrimario: '#2e9a6e',
    colorSecundario: '#16a085',
    icon: BookOpen,
  },
  [PERFILES.DALTONISMO]: {
    label: 'Daltonismo',
    descripcion: 'Paleta de colores adaptada para protanopia/deuteranopia',
    fuente: 'Inter, sans-serif',
    contraste: 'alto',
    tamañoFuente: 16,
    espaciado: 1.5,
    colorFondo: '#0a0e0c',
    colorTexto: '#edf2f0',
    colorPrimario: '#0072b2',
    colorSecundario: '#d55e00',
    icon: Palette,
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Estados base
  const [modoOscuro, setModoOscuro] = useState(() => {
    const stored = localStorage.getItem('duas-modo-oscuro');
    return stored ? JSON.parse(stored) : false;
  });

  const [perfil, setPerfil] = useState(() => {
    const stored = localStorage.getItem('duas-perfil');
    return stored || PERFILES.NINGUNO;
  });

  // Herramientas de accesibilidad
  const [lupaActiva, setLupaActiva] = useState(false);
  const [lectorActivo, setLectorActivo] = useState(false);
  const [modoDaltonismo, setModoDaltonismo] = useState('ninguno'); // 'ninguno', 'protanopia', 'deuteranopia', 'tritanopia', 'acromatopsia'
  const [tamanoFuenteExtra, setTamanoFuenteExtra] = useState(0); // incremento en px

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem('duas-modo-oscuro', JSON.stringify(modoOscuro));
  }, [modoOscuro]);

  useEffect(() => {
    localStorage.setItem('duas-perfil', perfil);
  }, [perfil]);

  useEffect(() => {
    localStorage.setItem('duas-lupa', JSON.stringify(lupaActiva));
  }, [lupaActiva]);

  useEffect(() => {
    localStorage.setItem('duas-lector', JSON.stringify(lectorActivo));
  }, [lectorActivo]);

  useEffect(() => {
    localStorage.setItem('duas-daltonismo', modoDaltonismo);
  }, [modoDaltonismo]);

  useEffect(() => {
    localStorage.setItem('duas-fuente-extra', String(tamanoFuenteExtra));
  }, [tamanoFuenteExtra]);

  // Cargar desde localStorage al inicio
  useEffect(() => {
    const storedLupa = localStorage.getItem('duas-lupa');
    if (storedLupa) setLupaActiva(JSON.parse(storedLupa));
    const storedLector = localStorage.getItem('duas-lector');
    if (storedLector) setLectorActivo(JSON.parse(storedLector));
    const storedDaltonismo = localStorage.getItem('duas-daltonismo');
    if (storedDaltonismo) setModoDaltonismo(storedDaltonismo);
    const storedFuenteExtra = localStorage.getItem('duas-fuente-extra');
    if (storedFuenteExtra) setTamanoFuenteExtra(Number(storedFuenteExtra));
  }, []);

  const perfilConfig = PERFIL_CONFIG[perfil] || PERFIL_CONFIG[PERFILES.NINGUNO];

  // Aplicar estilos al body y root
  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    
    // Fuente y tamaño base
    let fuenteBase = perfilConfig.fuente;
    let tamanoBase = perfilConfig.tamañoFuente + tamanoFuenteExtra;
    let espaciadoBase = perfilConfig.espaciado;
    let contrasteBase = perfilConfig.contraste;

    // Aplicar daltonismo (filtros CSS)
    let filter = '';
    if (modoDaltonismo === 'protanopia') {
      filter = 'url(#protanopia)';
    } else if (modoDaltonismo === 'deuteranopia') {
      filter = 'url(#deuteranopia)';
    } else if (modoDaltonismo === 'tritanopia') {
      filter = 'url(#tritanopia)';
    } else if (modoDaltonismo === 'acromatopsia') {
      filter = 'grayscale(100%)';
    } else {
      filter = 'none';
    }

    // Lupa (zoom en el body)
    let zoom = lupaActiva ? 1.2 : 1; // 120% de zoom

    // Colores según modo oscuro/claro y perfil
    let fondo, texto, primary, secondary, fondoCard, borde, sombra;
    
    if (modoOscuro) {
      fondo = '#0a0e0c';
      texto = '#edf2f0';
      fondoCard = 'rgba(255,255,255,0.04)';
      borde = 'rgba(255,255,255,0.06)';
      sombra = 'rgba(0,0,0,0.3)';
    } else {
      fondo = '#f0f2f5';
      texto = '#1a1a1a';
      fondoCard = 'rgba(255,255,255,0.7)';
      borde = 'rgba(0,0,0,0.06)';
      sombra = 'rgba(0,0,0,0.08)';
    }

    // Sobrescribir con perfil si es necesario
    if (perfil === PERFILES.BAJA_VISION) {
      fondo = perfilConfig.colorFondo;
      texto = perfilConfig.colorTexto;
      primary = perfilConfig.colorPrimario;
      secondary = perfilConfig.colorSecundario;
    } else if (perfil === PERFILES.DISLEXIA) {
      fondo = perfilConfig.colorFondo;
      texto = perfilConfig.colorTexto;
      primary = perfilConfig.colorPrimario;
      secondary = perfilConfig.colorSecundario;
    } else {
      primary = perfilConfig.colorPrimario || (modoOscuro ? '#2e9a6e' : '#1a7a4a');
      secondary = perfilConfig.colorSecundario || '#3498db';
    }

    // Aplicar variables CSS
    root.style.setProperty('--fuente', fuenteBase);
    root.style.setProperty('--tamano-fuente', `${tamanoBase}px`);
    root.style.setProperty('--espaciado', espaciadoBase);
    root.style.setProperty('--contraste', contrasteBase);
    root.style.setProperty('--color-fondo', fondo);
    root.style.setProperty('--color-texto', texto);
    root.style.setProperty('--color-primary', primary);
    root.style.setProperty('--color-secondary', secondary);
    root.style.setProperty('--color-fondo-card', fondoCard);
    root.style.setProperty('--color-borde', borde);
    root.style.setProperty('--sombra', sombra);

    // Aplicar filtro de daltonismo al body
    if (filter !== 'none') {
      body.style.filter = filter;
    } else {
      body.style.filter = 'none';
    }

    // Aplicar zoom
    body.style.transform = `scale(${zoom})`;
    body.style.transformOrigin = 'top left';
    body.style.width = `${100 / zoom}%`;
    body.style.height = `${100 / zoom}%`;

    // Estilos directos al body
    body.style.backgroundColor = fondo;
    body.style.color = texto;
    body.style.fontFamily = fuenteBase;
    body.style.fontSize = `${tamanoBase}px`;
    body.style.lineHeight = espaciadoBase;
    body.style.transition = 'all 0.3s ease';

    // Lector de pantalla: añadir event listener para leer al pasar el mouse
    const handleMouseOver = (e) => {
      if (lectorActivo) {
        const text = e.target.innerText || e.target.textContent;
        if (text && text.trim().length > 0 && !e.target.closest('button') && !e.target.closest('a')) {
          // Solo leer texto que no sea de botones o enlaces para evitar spam
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text.trim());
          utterance.lang = 'es-ES';
          utterance.rate = 0.9;
          window.speechSynthesis.speak(utterance);
        }
      }
    };

    if (lectorActivo) {
      document.addEventListener('mouseover', handleMouseOver);
    } else {
      document.removeEventListener('mouseover', handleMouseOver);
      window.speechSynthesis.cancel();
    }

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      window.speechSynthesis.cancel();
    };
  }, [modoOscuro, perfil, perfilConfig, lupaActiva, lectorActivo, modoDaltonismo, tamanoFuenteExtra]);

  const value = {
    modoOscuro,
    setModoOscuro,
    perfil,
    setPerfil,
    perfilConfig,
    lupaActiva,
    setLupaActiva,
    lectorActivo,
    setLectorActivo,
    modoDaltonismo,
    setModoDaltonismo,
    tamanoFuenteExtra,
    setTamanoFuenteExtra,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};