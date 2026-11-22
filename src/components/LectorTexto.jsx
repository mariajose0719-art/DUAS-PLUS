import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

function LectorTexto() {
  const { lectorActivo } = useTheme();
  const utteranceRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!lectorActivo) {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    const handleMouseOver = (e) => {
      const target = e.target;
      // Buscar el texto en el elemento o en sus hijos
      let text = target.innerText || target.textContent;
      if (!text || text.trim().length === 0) return;
      
      // Limpiar timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Esperar un momento para evitar lecturas accidentales
      timeoutRef.current = setTimeout(() => {
        // Cancelar cualquier lectura anterior
        if (utteranceRef.current) {
          window.speechSynthesis.cancel();
        }

        // Crear nueva utterance
        const utterance = new SpeechSynthesisUtterance(text.trim());
        utterance.lang = 'es-ES';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Seleccionar voz en español si está disponible
        const voices = window.speechSynthesis.getVoices();
        const spanishVoice = voices.find(v => v.lang.startsWith('es'));
        if (spanishVoice) {
          utterance.voice = spanishVoice;
        }

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }, 600);
    };

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // No cancelamos inmediatamente para permitir que termine la lectura
      // Si se mueve a otro elemento, se cancelará automáticamente
    };

    // Añadir event listeners a toda la página
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Cargar voces
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [lectorActivo]);

  return null; // Este componente no renderiza nada visual
}

export default LectorTexto;