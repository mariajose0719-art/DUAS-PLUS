import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Send } from 'lucide-react';

const campo = { width: '100%', padding: '11px 13px', borderRadius: 10, border: '1px solid #34423b', background: '#111a15', color: '#edf2f0', fontSize: 15, boxSizing: 'border-box' };

export default function MisClasesDb() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState({ cursos: [], actividades: [], lecciones: [] });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const cargar = useCallback(async () => {
    setCargando(true); setError('');
    try {
      const r = await fetch('/api/aprendiz/cursos', { credentials: 'include' });
      const d = await r.json(); if (!r.ok) throw new Error(d.mensaje || 'No se pudieron cargar tus clases.');
      setDatos({ cursos: d.cursos || [], actividades: d.actividades || [], lecciones: d.lecciones || [] });
    } catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }, []);
  useEffect(() => { cargar(); }, [cargar]);

  async function entregar(id, contenido) {
    setError(''); setMensaje('');
    try {
      const r = await fetch(`/api/aprendiz/actividades/${id}/entregas`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contenido) });
      const d = await r.json(); if (!r.ok) throw new Error(d.mensaje || 'No se pudo guardar la entrega.');
      setMensaje(d.mensaje); await cargar();
    } catch (e) { setError(e.message); }
  }

  async function completarLeccion(id) {
    setError(''); setMensaje('');
    try {
      const r = await fetch(`/api/aprendiz/lecciones/${id}/completar`, { method: 'POST', credentials: 'include' });
      const d = await r.json(); if (!r.ok) throw new Error(d.mensaje || 'No se pudo guardar el avance.');
      setMensaje(d.mensaje); await cargar();
    } catch (e) { setError(e.message); }
  }

  return <main style={{ minHeight: '100vh', background: '#080c0a', color: '#edf2f0', padding: '30px clamp(18px, 5vw, 60px)' }}><div style={{ maxWidth: 1200, margin: '0 auto' }}>
    <button onClick={() => navigate('/aprendiz')} style={{ ...campo, width: 'auto', cursor: 'pointer', marginBottom: 24 }}><ArrowLeft size={17} style={{ verticalAlign: 'middle', marginRight: 8 }} />Volver al panel</button>
    <h1 style={{ fontSize: 36, margin: '0 0 8px' }}><BookOpen size={32} color="#2e9a6e" style={{ verticalAlign: 'middle', marginRight: 10 }} />Mis clases</h1>
    <p style={{ color: '#a8b3b0', marginTop: 0 }}>Tus cursos, actividades y entregas cargan desde tu inscripción en la base de datos.</p>
    {mensaje && <p role="status" style={{ background: '#123e2d', color: '#a8f0c9', padding: 14, borderRadius: 10 }}>{mensaje}</p>}{error && <p role="alert" style={{ background: '#512923', color: '#ffd0c8', padding: 14, borderRadius: 10 }}>{error}</p>}
    {cargando ? <p>Cargando tus clases…</p> : !datos.cursos.length ? <p style={{ background: '#493919', color: '#ffe2a0', padding: 16, borderRadius: 12 }}>Aún no tienes cursos asignados. La administradora debe inscribirte a una ficha y el instructor debe asociar cursos a ella.</p> : <>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16, margin: '20px 0 30px' }}>{datos.cursos.map((curso) => {
        const porcentaje = curso.lecciones_totales ? Math.round((curso.lecciones_completadas / curso.lecciones_totales) * 100) : 0;
        return <article key={curso.id_ficha_curso} style={{ background: '#111a15', border: '1px solid #29352e', borderRadius: 18, padding: 20 }}><h2 style={{ fontSize: 21, margin: '0 0 8px' }}>{curso.nombre}</h2><p style={{ color: '#a8b3b0' }}>{curso.programa} · Ficha {curso.ficha}</p><p style={{ color: '#a8b3b0' }}>Instructor(es): {curso.instructores || 'Por asignar'}</p><div style={{ height: 8, background: '#29352e', borderRadius: 99, overflow: 'hidden' }}><div style={{ width: `${porcentaje}%`, background: '#2e9a6e', height: '100%' }} /></div><p style={{ color: '#a8b3b0', marginBottom: 0 }}>Progreso de lecciones: {porcentaje}%</p></article>;
      })}</section>
      <h2>Lecciones</h2>
      {!datos.lecciones.length ? <p style={{ color: '#a8b3b0' }}>Tus instructores aún no han publicado lecciones.</p> : <section style={{ display: 'grid', gap: 12, marginBottom: 28 }}>{datos.lecciones.map((leccion) => <article key={leccion.id_leccion} style={{ background: '#111a15', border: '1px solid #29352e', borderRadius: 16, padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}><div><strong>{leccion.titulo}</strong><p style={{ color: '#a8b3b0', margin: '6px 0' }}>{leccion.curso}{leccion.duracion_minutos ? ` · ${leccion.duracion_minutos} min` : ''}</p>{leccion.contenido && <p style={{ whiteSpace: 'pre-wrap', margin: '8px 0 0' }}>{leccion.contenido}</p>}</div><button type="button" disabled={Boolean(Number(leccion.completada))} onClick={() => completarLeccion(leccion.id_leccion)} style={{ ...campo, width: 'auto', background: Number(leccion.completada) ? '#26372e' : '#18794e', border: 0, cursor: Number(leccion.completada) ? 'default' : 'pointer' }}>{Number(leccion.completada) ? 'Completada' : 'Marcar como completada'}</button></article>)}</section>}
      <h2>Actividades</h2>
      {!datos.actividades.length && <p style={{ color: '#a8b3b0' }}>Todavía no hay actividades publicadas para tus cursos.</p>}
      <section style={{ display: 'grid', gap: 16 }}>{datos.actividades.map((a) => <Actividad key={a.id_actividad} actividad={a} entregar={entregar} />)}</section>
    </>}
  </div></main>;
}

function Actividad({ actividad, entregar }) {
  const [comentario, setComentario] = useState('');
  const [enlace, setEnlace] = useState('');
  const [enviando, setEnviando] = useState(false);
  async function enviar(e) { e.preventDefault(); setEnviando(true); await entregar(actividad.id_actividad, { comentario, enlace }); setComentario(''); setEnlace(''); setEnviando(false); }
  const fecha = actividad.fecha_limite ? new Date(String(actividad.fecha_limite).replace(' ', 'T')).toLocaleString() : 'Sin fecha límite';
  return <article style={{ background: '#111a15', border: '1px solid #29352e', borderRadius: 16, padding: 20 }}>
    <h3 style={{ margin: '0 0 6px' }}>{actividad.titulo}</h3><p style={{ color: '#a8b3b0', marginTop: 0 }}>{actividad.curso} · {actividad.tipo_actividad} · Cierra: {fecha}</p><p style={{ whiteSpace: 'pre-wrap' }}>{actividad.instrucciones}</p>
    {actividad.resultado && <p style={{ color: actividad.resultado === 'aprobado' ? '#69d79d' : '#f0bd69' }}>Evaluación: {actividad.resultado}{actividad.retroalimentacion ? ` · ${actividad.retroalimentacion}` : ''}</p>}
    {actividad.id_intento_entrega && !actividad.resultado && <p style={{ color: '#f0bd69' }}>Entrega enviada · intento {actividad.numero_intento}</p>}
    {(!actividad.id_intento_entrega || actividad.permite_multiples_intentos) && <form onSubmit={enviar} style={{ display: 'grid', gap: 10 }}><textarea rows={3} placeholder="Escribe tu respuesta" value={comentario} onChange={(e) => setComentario(e.target.value)} style={campo} /><input type="url" placeholder="Enlace de entrega (opcional)" value={enlace} onChange={(e) => setEnlace(e.target.value)} style={campo} /><button disabled={enviando || (!comentario.trim() && !enlace.trim())} style={{ ...campo, width: 'auto', background: '#18794e', border: 0, cursor: 'pointer' }}><Send size={16} style={{ verticalAlign: 'middle', marginRight: 7 }} />{enviando ? 'Enviando…' : 'Enviar entrega'}</button></form>}
  </article>;
}
