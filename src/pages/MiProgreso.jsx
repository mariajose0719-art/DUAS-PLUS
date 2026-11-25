import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Award, ClipboardCheck, BookOpen, ArrowLeft } from 'lucide-react';

const tarjeta = { background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.06)' };

export default function MiProgreso() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    fetch('/api/aprendiz/progreso', { credentials: 'include' })
      .then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.mensaje || 'No se pudo cargar tu progreso.'); return d; })
      .then(setDatos)
      .catch((e) => setError(e.message));
  }, []);
  const resumen = datos?.resumen;
  const metricas = [
    { icon: Award, color: '#2e9a6e', valor: `${resumen?.progreso ?? 0}%`, nombre: 'Progreso de lecciones' },
    { icon: ClipboardCheck, color: '#3498db', valor: `${resumen?.entregadas ?? 0}/${resumen?.actividades ?? 0}`, nombre: 'Actividades entregadas' },
    { icon: BookOpen, color: '#f39c12', valor: `${resumen?.lecciones_completadas ?? 0}/${resumen?.lecciones_totales ?? 0}`, nombre: 'Lecciones completadas' },
  ];
  return <main style={{ minHeight: '100vh', background: '#080c0a', color: '#edf2f0', padding: '30px clamp(18px, 5vw, 60px)' }}><div style={{ maxWidth: 1100, margin: '0 auto' }}>
    <button onClick={() => navigate('/aprendiz')} style={{ ...tarjeta, color: '#edf2f0', cursor: 'pointer', marginBottom: 24 }}><ArrowLeft size={17} style={{ verticalAlign: 'middle', marginRight: 8 }} />Volver</button>
    <h1 style={{ fontSize: 32, margin: '0 0 8px' }}><TrendingUp color="#2e9a6e" size={30} style={{ verticalAlign: 'middle', marginRight: 10 }} />Mi progreso</h1>
    <p style={{ color: '#a8b3b0' }}>Avance calculado con tus lecciones y entregas registradas.</p>
    {error && <p role="alert" style={{ background: '#512923', padding: 14, borderRadius: 10 }}>{error}</p>}
    {!datos && !error ? <p>Cargando tu progreso…</p> : datos && <>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14, margin: '22px 0' }}>{metricas.map(({ icon: Icon, color, valor, nombre }) => <article key={nombre} style={{ ...tarjeta, textAlign: 'center' }}><Icon color={color} size={25} /><div style={{ fontSize: 28, fontWeight: 700, margin: '8px 0' }}>{valor}</div><div style={{ color: '#a8b3b0', fontSize: 14 }}>{nombre}</div></article>)}</section>
      <section style={{ ...tarjeta }}><h2 style={{ marginTop: 0 }}>Progreso por curso</h2>{datos.cursos.length ? <div style={{ display: 'grid', gap: 18 }}>{datos.cursos.map((curso) => <article key={curso.id_ficha_curso}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 7 }}><strong>{curso.nombre}</strong><span>{curso.porcentaje}%</span></div><div style={{ height: 9, background: '#29352e', borderRadius: 99, overflow: 'hidden' }}><div style={{ width: `${curso.porcentaje}%`, height: '100%', background: '#2e9a6e' }} /></div><small style={{ color: '#a8b3b0' }}>{curso.lecciones_completadas} de {curso.lecciones_totales} lecciones completadas</small></article>)}</div> : <p style={{ color: '#a8b3b0' }}>Todavía no tienes cursos ni lecciones registrados. Tu avance aparecerá cuando el instructor publique lecciones para tu ficha.</p>}</section>
    </>}
  </div></main>;
}
