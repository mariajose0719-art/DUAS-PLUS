import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, Users, BookOpen, Calendar, TrendingUp } from 'lucide-react';

const caja = { background: '#111a15', border: '1px solid #29352e', borderRadius: 16, padding: 20 };

export default function EstadisticasInstructor() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    fetch('/api/instructor/estadisticas', { credentials: 'include' })
      .then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.mensaje || 'No se pudieron cargar tus estadísticas.'); return d; })
      .then(setDatos)
      .catch((e) => setError(e.message));
  }, []);
  const resumen = datos?.resumen;
  const metricas = [
    { icon: Users, valor: resumen?.aprendices ?? '—', titulo: 'Aprendices en tus fichas' },
    { icon: Calendar, valor: resumen?.clases ?? '—', titulo: 'Cursos activos en tus fichas' },
    { icon: TrendingUp, valor: resumen ? `${resumen.progreso}%` : '—', titulo: 'Progreso de lecciones' },
    { icon: BookOpen, valor: datos?.progresoClases?.length ?? '—', titulo: 'Cursos activos' },
  ];
  return <main style={{ minHeight: '100vh', background: '#080c0a', color: '#edf2f0', padding: '30px clamp(18px, 5vw, 60px)' }}><div style={{ maxWidth: 1100, margin: '0 auto' }}>
    <button onClick={() => navigate('/instructor')} style={{ ...caja, color: '#edf2f0', cursor: 'pointer', marginBottom: 24 }}><ArrowLeft size={17} style={{ verticalAlign: 'middle', marginRight: 8 }} />Volver</button>
    <h1 style={{ fontSize: 32, margin: '0 0 8px' }}><BarChart3 color="#2e9a6e" size={30} style={{ verticalAlign: 'middle', marginRight: 10 }} />Estadísticas</h1>
    <p style={{ color: '#a8b3b0' }}>Cifras calculadas de tus fichas, aprendices y lecciones registradas.</p>
    {error && <p role="alert" style={{ background: '#512923', color: '#ffd0c8', padding: 14, borderRadius: 10 }}>{error}</p>}
    {!datos && !error ? <p>Cargando estadísticas…</p> : datos && <>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14, margin: '22px 0' }}>{metricas.map(({ icon: Icon, valor, titulo }) => <article key={titulo} style={{ ...caja, textAlign: 'center' }}><Icon color="#2e9a6e" size={25} /><div style={{ fontSize: 28, fontWeight: 700, margin: '8px 0' }}>{valor}</div><div style={{ color: '#a8b3b0', fontSize: 14 }}>{titulo}</div></article>)}</section>
      <section style={caja}><h2 style={{ marginTop: 0 }}>Progreso por curso</h2>{datos.progresoClases.length ? <div style={{ display: 'grid', gap: 18 }}>{datos.progresoClases.map((c) => <article key={c.nombre}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}><strong>{c.nombre}</strong><span>{c.progreso}%</span></div><div style={{ height: 9, background: '#29352e', borderRadius: 99, overflow: 'hidden' }}><div style={{ width: `${c.progreso}%`, height: '100%', background: '#2e9a6e' }} /></div></article>)}</div> : <p style={{ color: '#a8b3b0' }}>No hay cursos con avance registrado en tus fichas.</p>}</section>
    </>}
  </div></main>;
}
