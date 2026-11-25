import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users } from 'lucide-react';

const estilo = { background: '#111a15', border: '1px solid #29352e', borderRadius: 16, padding: 20, color: '#edf2f0' };

export default function FichasInstructorDb() {
  const navigate = useNavigate();
  const [fichas, setFichas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const cargar = useCallback(async () => {
    setCargando(true); setError('');
    try {
      const r = await fetch('/api/instructor/fichas', { credentials: 'include' });
      const d = await r.json();
      if (!r.ok) throw new Error(d.mensaje || 'No se pudieron cargar tus fichas.');
      setFichas([...new Map((d.fichas || []).map((f) => [f.id_ficha, f])).values()]);
    } catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }, []);
  useEffect(() => { cargar(); }, [cargar]);
  return <main style={{ minHeight: '100vh', background: '#080c0a', color: '#edf2f0', padding: '30px clamp(18px, 5vw, 60px)' }}><div style={{ maxWidth: 1200, margin: '0 auto' }}>
    <button onClick={() => navigate('/instructor')} style={{ ...estilo, cursor: 'pointer', marginBottom: 24 }}><ArrowLeft size={17} style={{ verticalAlign: 'middle', marginRight: 8 }} />Volver al panel</button>
    <h1 style={{ fontSize: 36, margin: '0 0 8px' }}><BookOpen size={32} color="#2e9a6e" style={{ verticalAlign: 'middle', marginRight: 10 }} />Mis fichas</h1>
    <p style={{ color: '#a8b3b0' }}>Aquí aparecen las fichas que te asignó la administradora.</p>
    {error && <p role="alert" style={{ background: '#512923', color: '#ffd0c8', padding: 14, borderRadius: 10 }}>{error}</p>}
    {cargando ? <p>Cargando tus fichas…</p> : !fichas.length ? <p style={{ background: '#493919', color: '#ffe2a0', padding: 16, borderRadius: 12 }}>Todavía no tienes fichas asignadas. Pídele a la administradora que te asigne a una desde Administración → Fichas.</p> : <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 20 }}>{fichas.map((f) => <article key={f.id_ficha} style={estilo}><h2 style={{ margin: '0 0 10px' }}>Ficha {f.ficha}</h2><p style={{ color: '#b5c1ba' }}>Programa: {f.programa}</p><p>Estado: {f.estado_ficha === 'en_formacion' ? 'En formación' : f.estado_ficha}</p><p><Users size={17} style={{ verticalAlign: 'middle', marginRight: 6 }} />{f.curso ? `Curso asociado: ${f.curso}` : 'Aún no hay cursos asociados'}</p></article>)}</section>}
  </div></main>;
}
