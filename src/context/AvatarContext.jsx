import { createContext, useContext, useState } from 'react';

const AvatarContext = createContext();

export function AvatarProvider({ children }) {
  const [activo, setActivo] = useState(false);       // ← NUEVO: estado global
  const [textoActual, setTextoActual] = useState('');
  const [videoActual, setVideoActual] = useState(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [version, setVersion] = useState(0);

  const toggleActivo = () => setActivo(prev => !prev);

  const reproducirTexto = (texto) => {
    if (!texto || !texto.trim()) return;
    // Si LAIA está apagada, no hace nada
    if (!activo) return;
    
    setTextoActual(texto.trim().toUpperCase());
    setVideoActual('/videos/hola-como-estas.mp4');
    setReproduciendo(true);
    setVersion(v => v + 1);
  };

  const detener = () => {
    setReproduciendo(false);
    setVideoActual(null);
    setTextoActual('');
  };

  const value = {
    activo,
    toggleActivo,
    textoActual,
    videoActual,
    reproduciendo,
    version,
    reproducirTexto,
    detener,
  };

  return (
    <AvatarContext.Provider value={value}>
      {children}
    </AvatarContext.Provider>
  );
}

export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (!context) throw new Error('useAvatar debe usarse dentro de AvatarProvider');
  return context;
};