// src/components/TextReader.jsx
import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

function TextReader() {
  const { configuracionFinal } = useTheme();

  useEffect(() => {
    if (!configuracionFinal.lectorActivo) return;

    const handleMouseEnter = (e) => {
      const texto = e.target.innerText;
      if (texto && texto.length > 0) {
        // Detener cualquier síntesis en curso
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'es-ES';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }
    };

    document.addEventListener('mouseenter', handleMouseEnter, true);

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      window.speechSynthesis.cancel();
    };
  }, [configuracionFinal.lectorActivo]);

  return null;
}

export default TextReader;