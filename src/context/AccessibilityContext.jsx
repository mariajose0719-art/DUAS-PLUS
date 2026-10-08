import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

export const DALTONISMO = {
  NINGUNO: 'ninguno',
  PROTANOPIA: 'protanopia',
  DEUTERANOPIA: 'deuteranopia',
  TRITANOPIA: 'tritanopia',
  MONOCROMATISMO: 'monocromatismo'
};

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [lupaActiva, setLupaActiva] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [tamanoFuente, setTamanoFuente] = useState(16);
  const [lectorActivo, setLectorActivo] = useState(false);
  const [modoLecturaContinua, setModoLecturaContinua] = useState(false);
  const [modoDaltonismo, setModoDaltonismo] = useState(DALTONISMO.NINGUNO);
  const [altoContraste, setAltoContraste] = useState(false);

  const synth = window.speechSynthesis;
  let utteranceRef = useRef(null);

  const leerTexto = (texto) => {
    if (!texto || texto.trim().length === 0) return;
    if (!lectorActivo && !modoLecturaContinua) return;
    if (!synth) {
      alert('Tu navegador no soporta síntesis de voz.');
      return;
    }
    if (synth.speaking) synth.cancel();
    const textoLimpio = texto.replace(/\s+/g, ' ').trim();
    if (textoLimpio.length === 0) return;
    // Ignorar si solo son emojis
    if (/^[\p{Emoji}\s]+$/u.test(textoLimpio)) return;
    const utterance = new SpeechSynthesisUtterance(textoLimpio);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utteranceRef.current = utterance;
    synth.speak(utterance);
  };

  const detenerLectura = () => {
    if (synth && synth.speaking) synth.cancel();
  };

  // ===== FUNCIÓN MEJORADA PARA OBTENER TEXTO SIGNIFICATIVO =====
  const getSignificantText = (element) => {
    if (!element) return '';
    if (element === document.body || element === document.documentElement) return '';

    // Obtener el texto directo (sin hijos) y el texto completo (con hijos)
    const directText = element.innerText || element.textContent || '';
    const cleanDirect = directText.replace(/\s+/g, ' ').trim();
    const fullText = element.textContent || '';
    const cleanFull = fullText.replace(/\s+/g, ' ').trim();

    // Si el elemento no tiene texto visible, ignorar
    if (!cleanFull) return '';

    // Si el texto directo es corto (< 100 caracteres) y no es solo emojis, es candidato
    if (cleanDirect.length > 0 && cleanDirect.length < 100 && !/^[\p{Emoji}\s]+$/u.test(cleanDirect)) {
      return cleanDirect;
    }

    // Si el elemento es un contenedor con mucho texto (> 100 caracteres) y tiene hijos
    if (cleanDirect.length >= 100 && element.children.length > 0) {
      // Buscar el primer hijo que tenga texto significativo corto (títulos, etiquetas)
      for (let child of element.children) {
        const childText = child.innerText || child.textContent || '';
        const cleanChild = childText.replace(/\s+/g, ' ').trim();
        if (cleanChild.length > 0 && cleanChild.length < 100 && !/^[\p{Emoji}\s]+$/u.test(cleanChild)) {
          return cleanChild;
        }
      }
      // Si ningún hijo cumple, intentar encontrar un span o párrafo dentro
      const children = element.querySelectorAll('span, p, h1, h2, h3, h4, h5, h6, label, strong, b');
      for (let child of children) {
        const childText = child.innerText || child.textContent || '';
        const cleanChild = childText.replace(/\s+/g, ' ').trim();
        if (cleanChild.length > 0 && cleanChild.length < 100 && !/^[\p{Emoji}\s]+$/u.test(cleanChild)) {
          return cleanChild;
        }
      }
      // Si aún no, devolver el primer texto de un hijo directo (limitado a 50 caracteres)
      for (let child of element.children) {
        const childText = child.innerText || child.textContent || '';
        const cleanChild = childText.replace(/\s+/g, ' ').trim();
        if (cleanChild.length > 0 && !/^[\p{Emoji}\s]+$/u.test(cleanChild)) {
          // Tomar solo los primeros 50 caracteres para evitar leer párrafos largos
          return cleanChild.substring(0, 50) + (cleanChild.length > 50 ? '...' : '');
        }
      }
      // Si todo falla, devolver el texto completo pero limitado a 100 caracteres
      return cleanFull.substring(0, 100) + (cleanFull.length > 100 ? '...' : '');
    }

    // Si el texto directo es largo pero no tiene hijos, limitar a 100 caracteres
    if (cleanDirect.length > 100 && !/^[\p{Emoji}\s]+$/u.test(cleanDirect)) {
      return cleanDirect.substring(0, 100) + (cleanDirect.length > 100 ? '...' : '');
    }

    // Si el texto directo es solo emojis, devolver vacío
    if (/^[\p{Emoji}\s]+$/u.test(cleanDirect)) return '';

    // Si el texto directo es corto pero es solo números/símbolos, permitirlo (ej: "61%", "5h 42m")
    if (cleanDirect.length > 0 && cleanDirect.length < 20) {
      return cleanDirect;
    }

    return cleanDirect;
  };

  // ===== MANEJADOR DE HOVER =====
  const handleMouseOver = (e) => {
    if (!modoLecturaContinua || !lectorActivo) return;
    const target = e.target;
    if (target === document.body || target === document.documentElement) return;

    // Intentar obtener el texto del elemento o de su hijo más cercano
    let texto = getSignificantText(target);
    if (!texto || texto.length < 2) return;

    // Si el texto es igual al último leído en este elemento, evitar repetir
    if (texto === target.dataset.lastRead) return;
    target.dataset.lastRead = texto;

    leerTexto(texto);
  };

  // ===== ACTIVAR/DESACTIVAR EVENTOS =====
  useEffect(() => {
    if (modoLecturaContinua && lectorActivo) {
      document.addEventListener('mouseover', handleMouseOver);
    } else {
      document.removeEventListener('mouseover', handleMouseOver);
      document.querySelectorAll('[data-last-read]').forEach(el => el.removeAttribute('data-last-read'));
      detenerLectura();
    }
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [modoLecturaContinua, lectorActivo]);

  // ===== APLICAR ESTILOS =====
  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    if (lupaActiva) {
      body.style.transform = `scale(${zoom})`;
      body.style.transformOrigin = 'top left';
      body.style.width = `${100 / zoom}%`;
      body.style.height = `${100 / zoom}%`;
    } else {
      body.style.transform = 'scale(1)';
      body.style.transformOrigin = 'unset';
      body.style.width = '100%';
      body.style.height = '100%';
    }
    body.style.fontSize = `${tamanoFuente}px`;
    root.style.setProperty('--tamano-fuente-base', `${tamanoFuente}px`);

    let filtro = '';
    if (modoDaltonismo === DALTONISMO.PROTANOPIA) filtro = 'url(#protanopia)';
    else if (modoDaltonismo === DALTONISMO.DEUTERANOPIA) filtro = 'url(#deuteranopia)';
    else if (modoDaltonismo === DALTONISMO.TRITANOPIA) filtro = 'url(#tritanopia)';
    else if (modoDaltonismo === DALTONISMO.MONOCROMATISMO) filtro = 'grayscale(100%)';
    else filtro = 'none';

    if (altoContraste) {
      filtro = (filtro !== 'none' ? filtro + ' ' : '') + 'contrast(1.8) brightness(1.2)';
    }
    body.style.filter = filtro;
  }, [lupaActiva, zoom, tamanoFuente, modoDaltonismo, altoContraste]);

  const value = {
    lupaActiva,
    setLupaActiva,
    zoom,
    setZoom,
    tamanoFuente,
    setTamanoFuente,
    lectorActivo,
    setLectorActivo,
    modoLecturaContinua,
    setModoLecturaContinua,
    modoDaltonismo,
    setModoDaltonismo,
    altoContraste,
    setAltoContraste,
    leerTexto,
    detenerLectura,
    DALTONISMO,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0" />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0" />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0" />
          </filter>
        </defs>
      </svg>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
};