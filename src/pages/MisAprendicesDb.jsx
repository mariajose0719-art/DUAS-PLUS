import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';

export default function MisAprendicesDb() {
  const navigate = useNavigate();
  const [aprendices, setAprendices] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const cargar = useCallback(async () => {
    setCargando(true); setError('');
    try { const r = await fetch('/api/instructor/aprendices', { credentials: 'include' }); const d = await r.json(); if (!r.ok) throw new Error(d.mensaje || 'No se pudieron cargar tus aprendices.'); setAprendices(d.aprendices || []); }
    catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }, []);
  useEffect(() => { cargar(); }, [cargar]);
  return <main style={{ minHeight: '100vh', background: '#080c0a', color: '#edf2f0', padding: '30px clamp(18px, 5vw, 60px)' }}><div style={{ maxWidth: 1200, margin: '0 auto' }}>
    <button onClick={() => navigate('/instructor')} style={{ padding: '11px 15px', borderRadius: 10, border: '1px solid #34423b', background: '#111a15', color: '#edf2f0', cursor: 'pointer', marginBottom: 24 }}><ArrowLeft size={17} style={{ verticalAlign: 'middle', marginRight: 8 }} />Volver al panel</button>
    <h1 style={{ fontSize: 36, margin: '0 0 8px' }}><Users size={32} color="#2e9a6e" style={{ verticalAlign: 'middle', marginRight: 10 }} />Mis aprendices</h1>
    <p style={{ color: '#a8b3b0' }}>Lista de aprendices inscritos en las fichas que tienes asignadas.</p>
    {error && <p role="alert" style={{ background: '#512923', color: '#ffd0c8', padding: 14, borderRadius: 10 }}>{error}</p>}
    {cargando ? <p>Cargando…</p> : !aprendices.length ? <p style={{ background: '#493919', color: '#ffe2a0', padding: 16, borderRadius: 12 }}>Todavía no hay aprendices inscritos en tus fichas.</p> : <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 20 }}>{aprendices.map((a) => { const avance = a.lecciones_totales ? Math.round(a.lecciones_completadas / a.lecciones_totales * 100) : 0; return <article key={a.id_usuario} style={{ background: '#111a15', border: '1px solid #29352e', borderRadius: 18, padding: 20 }}><h2 style={{ fontSize: 21, margin: '0 0 8px' }}>{a.nombres} {a.apellidos}</h2><p style={{ color: '#b5c1ba' }}>{a.correo}</p><p style={{ color: '#b5c1ba' }}>Ficha(s): {a.fichas}</p><div style={{ height: 8, background: '#29352e', borderRadius: 99, overflow: 'hidden' }}><div style={{ width: `${avance}%`, background: '#2e9a6e', height: '100%' }} /></div><p style={{ color: '#b5c1ba', marginBottom: 0 }}>Avance en lecciones: {avance}%</p></article>; })}</section>}
  </div></main>;
}
