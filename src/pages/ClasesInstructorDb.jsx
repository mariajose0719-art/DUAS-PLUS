import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Plus, ClipboardCheck, Trash2 } from 'lucide-react';

const campo = { width: '100%', padding: '11px 13px', borderRadius: 10, border: '1px solid #34423b', background: '#111a15', color: '#edf2f0', fontSize: 15, boxSizing: 'border-box' };

export default function ClasesInstructorDb() {
  const navigate = useNavigate();
  const [filas, setFilas] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [lecciones, setLecciones] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [fichaId, setFichaId] = useState('');
  const [cursoId, setCursoId] = useState('');
  const [cursoForm, setCursoForm] = useState({ codigo: '', nombre: '', descripcion: '' });
  const [actividadForm, setActividadForm] = useState({ titulo: '', instrucciones: '', tipo_actividad: 'evidencia', fecha_limite: '' });
  const [leccionForm, setLeccionForm] = useState({ titulo: '', contenido: '', duracion_minutos: '' });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true); setError('');
    try {
      const [rFichas, rEntregas] = await Promise.all([
        fetch('/api/instructor/fichas', { credentials: 'include' }),
        fetch('/api/instructor/entregas', { credentials: 'include' }),
      ]);
      const [dFichas, dEntregas] = await Promise.all([rFichas.json(), rEntregas.json()]);
      if (!rFichas.ok) throw new Error(dFichas.mensaje || 'No se pudieron cargar tus fichas.');
      if (!rEntregas.ok) throw new Error(dEntregas.mensaje || 'No se pudieron cargar las entregas.');
      setFilas(dFichas.fichas || []); setEntregas(dEntregas.entregas || []);
      const firstFicha = dFichas.fichas?.[0];
      setFichaId((prev) => prev || (firstFicha ? String(firstFicha.id_ficha) : ''));
      setCursoId((prev) => prev || (firstFicha?.id_ficha_curso ? String(firstFicha.id_ficha_curso) : ''));
    } catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }, []);
  useEffect(() => { cargar(); }, [cargar]);

  const fichas = useMemo(() => [...new Map(filas.map((f) => [f.id_ficha, { id_ficha: f.id_ficha, ficha: f.ficha, programa: f.programa }])).values()], [filas]);
  const cursos = useMemo(() => filas.filter((f) => String(f.id_ficha) === fichaId && f.id_ficha_curso), [filas, fichaId]);

  useEffect(() => {
    if (!cursoId) { setActividades([]); return; }
    let vigente = true;
    fetch(`/api/instructor/cursos/${cursoId}/actividades`, { credentials: 'include' })
      .then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.mensaje || 'No se pudieron cargar actividades.'); return d; })
      .then((d) => { if (vigente) setActividades(d.actividades || []); })
      .catch((e) => { if (vigente) setError(e.message); });
    return () => { vigente = false; };
  }, [cursoId]);

  useEffect(() => {
    if (!cursoId) { setLecciones([]); return; }
    let vigente = true;
    fetch(`/api/instructor/cursos/${cursoId}/lecciones`, { credentials: 'include' })
      .then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.mensaje || 'No se pudieron cargar las lecciones.'); return d; })
      .then((d) => { if (vigente) setLecciones(d.lecciones || []); })
      .catch((e) => { if (vigente) setError(e.message); });
    return () => { vigente = false; };
  }, [cursoId]);

  async function enviar(url, body, exito, metodo = 'POST') {
    setGuardando(true); setError(''); setMensaje('');
    try {
      const r = await fetch(url, { method: metodo, credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const d = await r.json(); if (!r.ok) throw new Error(d.mensaje || 'No se pudo completar la acción.');
      setMensaje(d.mensaje || exito); await cargar(); return d;
    } catch (e) { setError(e.message); return null; }
    finally { setGuardando(false); }
  }

  async function crearCurso(e) {
    e.preventDefault();
    const d = await enviar(`/api/instructor/fichas/${fichaId}/cursos`, cursoForm, 'Curso guardado.');
    if (d) { setCursoForm({ codigo: '', nombre: '', descripcion: '' }); setCursoId(String(d.id_ficha_curso)); }
  }
  async function crearActividad(e) {
    e.preventDefault();
    const d = await enviar(`/api/instructor/cursos/${cursoId}/actividades`, actividadForm, 'Actividad guardada.');
    if (d) { setActividadForm({ titulo: '', instrucciones: '', tipo_actividad: 'evidencia', fecha_limite: '' }); const r = await fetch(`/api/instructor/cursos/${cursoId}/actividades`, { credentials: 'include' }); const data = await r.json(); setActividades(data.actividades || []); }
  }
  async function crearLeccion(e) {
    e.preventDefault();
    const d = await enviar(`/api/instructor/cursos/${cursoId}/lecciones`, leccionForm, 'Lección publicada.');
    if (d) {
      setLeccionForm({ titulo: '', contenido: '', duracion_minutos: '' });
      const r = await fetch(`/api/instructor/cursos/${cursoId}/lecciones`, { credentials: 'include' });
      const data = await r.json(); setLecciones(data.lecciones || []);
    }
  }
  async function eliminarLeccion(leccion) {
    if (!window.confirm(`¿Retirar “${leccion.titulo}”? Se conservará el avance ya registrado de los aprendices.`)) return;
    setError(''); setMensaje('');
    try {
      const r = await fetch(`/api/instructor/lecciones/${leccion.id_leccion}`, { method: 'DELETE', credentials: 'include' });
      const d = await r.json(); if (!r.ok) throw new Error(d.mensaje || 'No se pudo retirar la lección.');
      setMensaje(d.mensaje); setLecciones((prev) => prev.filter((x) => x.id_leccion !== leccion.id_leccion));
    } catch (e) { setError(e.message); }
  }
  async function evaluar(entrega, resultado, retroalimentacion) {
    const d = await enviar(`/api/instructor/entregas/${entrega.id_intento_entrega}/evaluacion`, { resultado, retroalimentacion }, 'Evaluación guardada.');
    if (d) setEntregas((prev) => prev.map((x) => x.id_intento_entrega === entrega.id_intento_entrega ? { ...x, resultado, retroalimentacion } : x));
  }

  async function eliminarCurso(curso) {
    if (!window.confirm(`¿Retirar “${curso.curso}” de la ficha ${curso.ficha}? Se ocultará a los aprendices; las entregas e historial se conservarán.`)) return;
    setError(''); setMensaje('');
    try {
      const r = await fetch(`/api/instructor/cursos/${curso.id_ficha_curso}`, { method: 'DELETE', credentials: 'include' });
      const d = await r.json();
      if (!r.ok) throw new Error(d.mensaje || 'No se pudo retirar el curso.');
      setMensaje(d.mensaje); setCursoId(''); setActividades([]); await cargar();
    } catch (e) { setError(e.message); }
  }

  return <main style={{ minHeight: '100vh', background: '#080c0a', color: '#edf2f0', padding: '30px clamp(18px, 5vw, 60px)' }}><div style={{ maxWidth: 1200, margin: '0 auto' }}>
    <button onClick={() => navigate('/instructor')} style={{ ...campo, width: 'auto', cursor: 'pointer', marginBottom: 24 }}><ArrowLeft size={17} style={{ verticalAlign: 'middle', marginRight: 8 }} />Volver al panel</button>
    <h1 style={{ fontSize: 36, margin: '0 0 8px' }}><BookOpen size={32} color="#2e9a6e" style={{ verticalAlign: 'middle', marginRight: 10 }} />Mis clases y actividades</h1>
    <p style={{ color: '#a8b3b0', marginTop: 0 }}>Tus fichas, cursos, actividades y entregas se consultan desde la base de datos.</p>
    {mensaje && <p role="status" style={{ background: '#123e2d', color: '#a8f0c9', padding: 14, borderRadius: 10 }}>{mensaje}</p>}{error && <p role="alert" style={{ background: '#512923', color: '#ffd0c8', padding: 14, borderRadius: 10 }}>{error}</p>}
    {cargando ? <p>Cargando…</p> : !fichas.length ? <p style={{ background: '#493919', color: '#ffe2a0', padding: 16, borderRadius: 12 }}>No tienes fichas asignadas todavía. La administradora debe asignarte a una ficha para que aparezca aquí.</p> : <>
      <section style={{ background: '#111a15', border: '1px solid #29352e', borderRadius: 16, padding: 20, margin: '22px 0' }}>
        <h2 style={{ marginTop: 0 }}>Crear curso para una ficha</h2>
        <form onSubmit={crearCurso} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <select required value={fichaId} onChange={(e) => { setFichaId(e.target.value); setCursoId(''); }} style={campo}>{fichas.map((f) => <option key={f.id_ficha} value={f.id_ficha}>Ficha {f.ficha} · {f.programa}</option>)}</select>
          <input required maxLength={30} placeholder="Código del curso" value={cursoForm.codigo} onChange={(e) => setCursoForm({ ...cursoForm, codigo: e.target.value })} style={campo} />
          <input required maxLength={150} placeholder="Nombre del curso" value={cursoForm.nombre} onChange={(e) => setCursoForm({ ...cursoForm, nombre: e.target.value })} style={campo} />
          <input placeholder="Descripción (opcional)" value={cursoForm.descripcion} onChange={(e) => setCursoForm({ ...cursoForm, descripcion: e.target.value })} style={campo} />
          <button disabled={guardando} style={{ ...campo, background: '#18794e', border: 0, cursor: 'pointer' }}><Plus size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />Guardar curso</button>
        </form>
        {!!cursos.length && <div style={{ display: 'grid', gap: 8, marginTop: 16 }}><strong>Cursos de esta ficha</strong>{cursos.map((c) => <div key={c.id_ficha_curso} style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between', borderTop: '1px solid #29352e', paddingTop: 10 }}><span>{c.codigo_curso} · {c.curso}</span><button type="button" onClick={() => eliminarCurso(c)} style={{ ...campo, width: 'auto', color: '#ffd0c8', cursor: 'pointer' }}><Trash2 size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />Retirar curso</button></div>)}</div>}
      </section>
      <section style={{ background: '#111a15', border: '1px solid #29352e', borderRadius: 16, padding: 20, margin: '22px 0' }}>
        <h2 style={{ marginTop: 0 }}>Lecciones de la clase</h2>
        {!cursos.length ? <p style={{ color: '#a8b3b0' }}>Crea o selecciona un curso activo para administrar sus lecciones.</p> : <>
          <select value={cursoId} onChange={(e) => setCursoId(e.target.value)} style={{ ...campo, marginBottom: 12 }}>{cursos.map((c) => <option key={c.id_ficha_curso} value={c.id_ficha_curso}>{c.codigo_curso} · {c.curso}</option>)}</select>
          <form onSubmit={crearLeccion} style={{ display: 'grid', gap: 10 }}>
            <input required maxLength={150} placeholder="Título de la lección" value={leccionForm.titulo} onChange={(e) => setLeccionForm({ ...leccionForm, titulo: e.target.value })} style={campo} />
            <textarea rows={4} maxLength={10000} placeholder="Contenido o instrucciones (opcional)" value={leccionForm.contenido} onChange={(e) => setLeccionForm({ ...leccionForm, contenido: e.target.value })} style={campo} />
            <input type="number" min="1" max="65535" placeholder="Duración en minutos (opcional)" value={leccionForm.duracion_minutos} onChange={(e) => setLeccionForm({ ...leccionForm, duracion_minutos: e.target.value })} style={campo} />
            <button disabled={guardando} style={{ ...campo, width: 'auto', background: '#18794e', border: 0, cursor: 'pointer' }}><Plus size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />Publicar lección</button>
          </form>
          {!lecciones.length ? <p style={{ color: '#a8b3b0' }}>Este curso aún no tiene lecciones publicadas.</p> : lecciones.map((l) => <article key={l.id_leccion} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderTop: '1px solid #29352e', padding: '12px 0' }}><div><strong>{l.orden}. {l.titulo}</strong><p style={{ color: '#a8b3b0', margin: '5px 0' }}>{l.duracion_minutos ? `${l.duracion_minutos} minutos` : 'Sin duración definida'}</p></div><button type="button" onClick={() => eliminarLeccion(l)} style={{ ...campo, width: 'auto', color: '#ffd0c8', cursor: 'pointer' }}><Trash2 size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />Retirar</button></article>)}
        </>}
      </section>
      <section style={{ background: '#111a15', border: '1px solid #29352e', borderRadius: 16, padding: 20, margin: '22px 0' }}>
        <h2 style={{ marginTop: 0 }}>Crear actividad</h2>
        {!cursos.length ? <p style={{ color: '#a8b3b0' }}>Crea un curso primero para poder publicar actividades.</p> : <form onSubmit={crearActividad} style={{ display: 'grid', gap: 12 }}>
          <select required value={cursoId} onChange={(e) => setCursoId(e.target.value)} style={campo}>{cursos.map((c) => <option key={c.id_ficha_curso} value={c.id_ficha_curso}>{c.codigo_curso} · {c.curso}</option>)}</select>
          <input required maxLength={150} placeholder="Título de la actividad" value={actividadForm.titulo} onChange={(e) => setActividadForm({ ...actividadForm, titulo: e.target.value })} style={campo} />
          <textarea required rows={4} placeholder="Instrucciones para los aprendices" value={actividadForm.instrucciones} onChange={(e) => setActividadForm({ ...actividadForm, instrucciones: e.target.value })} style={campo} />
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}><select value={actividadForm.tipo_actividad} onChange={(e) => setActividadForm({ ...actividadForm, tipo_actividad: e.target.value })} style={{ ...campo, flex: 1 }}><option value="evidencia">Evidencia</option><option value="taller">Taller</option><option value="evaluacion">Evaluación</option><option value="proyecto">Proyecto</option><option value="otra">Otra</option></select><input type="datetime-local" value={actividadForm.fecha_limite} onChange={(e) => setActividadForm({ ...actividadForm, fecha_limite: e.target.value })} style={{ ...campo, flex: 1 }} /></div>
          <button disabled={guardando} style={{ ...campo, background: '#18794e', border: 0, cursor: 'pointer' }}><Plus size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />Publicar actividad</button>
        </form>}
        {actividades.map((a) => <article key={a.id_actividad} style={{ borderTop: '1px solid #29352e', padding: '12px 0', marginTop: 12 }}><strong>{a.titulo}</strong><p style={{ color: '#a8b3b0', margin: '5px 0' }}>{a.tipo_actividad} · {a.estado} · {a.entregas} entregas</p><p style={{ whiteSpace: 'pre-wrap', color: '#b5c1ba' }}>{a.instrucciones}</p></article>)}
      </section>
    </>}
    <section style={{ background: '#111a15', border: '1px solid #29352e', borderRadius: 16, padding: 20, margin: '22px 0' }}><h2 style={{ marginTop: 0 }}><ClipboardCheck size={22} color="#2e9a6e" style={{ verticalAlign: 'middle', marginRight: 8 }} />Revisar entregas</h2>
      {!entregas.length && <p style={{ color: '#a8b3b0' }}>Todavía no hay entregas de tus fichas.</p>}
      {entregas.map((e) => <Entrega key={e.id_intento_entrega} entrega={e} guardando={guardando} evaluar={evaluar} />)}
    </section>
  </div></main>;
}

function Entrega({ entrega, guardando, evaluar }) {
  const [resultado, setResultado] = useState(entrega.resultado || 'aprobado');
  const [retroalimentacion, setRetroalimentacion] = useState(entrega.retroalimentacion || '');
  return <article style={{ borderTop: '1px solid #29352e', padding: '16px 0', display: 'grid', gap: 10 }}>
    <strong>{entrega.actividad} · {entrega.nombres} {entrega.apellidos}</strong><span style={{ color: '#a8b3b0' }}>Ficha {entrega.ficha} · Curso {entrega.curso} · Intento {entrega.numero_intento}</span>
    {entrega.comentario_aprendiz && <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{entrega.comentario_aprendiz}</p>}
    {entrega.enlace_entrega && <a href={entrega.enlace_entrega} target="_blank" rel="noreferrer" style={{ color: '#70c7ff' }}>Abrir enlace de entrega</a>}
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><select value={resultado} onChange={(e) => setResultado(e.target.value)} style={{ ...campo, width: 180 }}><option value="aprobado">Aprobado</option><option value="desaprobado">Desaprobado</option></select><input value={retroalimentacion} onChange={(e) => setRetroalimentacion(e.target.value)} placeholder="Retroalimentación (opcional)" style={{ ...campo, flex: 1 }} /><button disabled={guardando} onClick={() => evaluar(entrega, resultado, retroalimentacion)} style={{ ...campo, width: 'auto', background: '#18794e', border: 0, cursor: 'pointer' }}>Guardar evaluación</button></div>
  </article>;
}
