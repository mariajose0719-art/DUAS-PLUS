import { useState } from 'react';
import { Edit3, MessageSquare, UserX, UserCheck, X } from 'lucide-react';

const campo = { width: '100%', padding: '10px 12px', borderRadius: 9, border: '1px solid #34423b', background: '#111a15', color: '#edf2f0', fontSize: 14, boxSizing: 'border-box' };

export default function UsuarioAdminAcciones({ persona, onActualizado }) {
  const [editar, setEditar] = useState(false);
  const [notas, setNotas] = useState(false);
  const [form, setForm] = useState({ tipo_documento: persona.tipo_documento || 'Cédula de ciudadanía', numero_documento: persona.numero_documento || '', nombres: persona.nombres || '', apellidos: persona.apellidos || '', correo: persona.correo || '', telefono: persona.telefono || '', estado: persona.estado || 'activo' });
  const [lista, setLista] = useState([]);
  const [texto, setTexto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function respuesta(url, opciones = {}) {
    const r = await fetch(url, { credentials: 'include', ...opciones });
    const d = await r.json();
    if (!r.ok) throw new Error(d.mensaje || 'No se pudo completar la acción.');
    return d;
  }
  async function guardarEdicion(e) {
    e.preventDefault(); setGuardando(true); setError(''); setMensaje('');
    try {
      const d = await respuesta(`/api/admin/usuarios/${persona.id_usuario}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      setMensaje(d.mensaje); setEditar(false); await onActualizado?.();
    } catch (e2) { setError(e2.message); }
    finally { setGuardando(false); }
  }
  async function cambiarEstado() {
    const nuevoEstado = persona.estado === 'activo' ? 'inactivo' : 'activo';
    if (nuevoEstado === 'inactivo' && !window.confirm(`¿Desactivar la cuenta de ${persona.nombres} ${persona.apellidos}? El historial se conservará.`)) return;
    setError(''); setMensaje('');
    try {
      const d = nuevoEstado === 'inactivo'
        ? await respuesta(`/api/admin/usuarios/${persona.id_usuario}`, { method: 'DELETE' })
        : await respuesta(`/api/admin/usuarios/${persona.id_usuario}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, estado: 'activo' }) });
      setMensaje(d.mensaje); await onActualizado?.();
    } catch (e) { setError(e.message); }
  }
  async function abrirNotas() {
    setNotas(true); setError(''); setMensaje('');
    try { const d = await respuesta(`/api/admin/usuarios/${persona.id_usuario}/observaciones`); setLista(d.observaciones || []); }
    catch (e) { setError(e.message); }
  }
  async function agregarNota(e) {
    e.preventDefault(); setGuardando(true); setError(''); setMensaje('');
    try {
      const d = await respuesta(`/api/admin/usuarios/${persona.id_usuario}/observaciones`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ observacion: texto }) });
      setTexto(''); setMensaje(d.mensaje); const nuevas = await respuesta(`/api/admin/usuarios/${persona.id_usuario}/observaciones`); setLista(nuevas.observaciones || []);
    } catch (e2) { setError(e2.message); }
    finally { setGuardando(false); }
  }

  return <>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
      <button type="button" onClick={() => { setForm({ tipo_documento: persona.tipo_documento || '', numero_documento: persona.numero_documento || '', nombres: persona.nombres || '', apellidos: persona.apellidos || '', correo: persona.correo || '', telefono: persona.telefono || '', estado: persona.estado || 'activo' }); setError(''); setEditar(true); }} style={{ ...campo, width: 'auto', cursor: 'pointer' }}><Edit3 size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />Editar</button>
      <button type="button" onClick={abrirNotas} style={{ ...campo, width: 'auto', cursor: 'pointer' }}><MessageSquare size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />Observaciones</button>
      <button type="button" onClick={cambiarEstado} style={{ ...campo, width: 'auto', cursor: 'pointer', color: persona.estado === 'activo' ? '#ffd0c8' : '#a8f0c9' }}>{persona.estado === 'activo' ? <><UserX size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />Desactivar</> : <><UserCheck size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />Reactivar</>}</button>
    </div>
    {mensaje && <p role="status" style={{ color: '#a8f0c9', marginBottom: 0 }}>{mensaje}</p>}{error && <p role="alert" style={{ color: '#ffd0c8' }}>{error}</p>}
    {(editar || notas) && <div role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) { setEditar(false); setNotas(false); } }} style={{ position: 'fixed', inset: 0, background: '#000b', display: 'grid', placeItems: 'center', padding: 16, zIndex: 1100 }}>
      {editar ? <form onSubmit={guardarEdicion} style={{ width: 'min(100%, 520px)', maxHeight: '90vh', overflowY: 'auto', background: '#111a15', border: '1px solid #34423b', borderRadius: 18, padding: 22, display: 'grid', gap: 12, color: '#edf2f0' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}><h2 style={{ flex: 1, margin: 0 }}>Editar {persona.rol || 'cuenta'}</h2><button type="button" aria-label="Cerrar" onClick={() => setEditar(false)} style={{ ...campo, width: 42 }}><X size={17} /></button></div>
        <label>Tipo de documento<select value={form.tipo_documento} onChange={(e) => setForm({ ...form, tipo_documento: e.target.value })} style={campo}><option>Cédula de ciudadanía</option><option>Tarjeta de identidad</option><option>Cédula de extranjería</option><option>Pasaporte</option><option>Otro</option></select></label>
        <label>Número de documento<input required maxLength={30} value={form.numero_documento} onChange={(e) => setForm({ ...form, numero_documento: e.target.value })} style={campo} /></label>
        <label>Nombres<input required maxLength={100} value={form.nombres} onChange={(e) => setForm({ ...form, nombres: e.target.value })} style={campo} /></label>
        <label>Apellidos<input required maxLength={100} value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })} style={campo} /></label>
        <label>Correo<input required type="email" maxLength={150} value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} style={campo} /></label>
        <label>Teléfono<input maxLength={30} value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} style={campo} /></label>
        <label>Estado<select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} style={campo}><option value="activo">Activo</option><option value="suspendido">Suspendido</option><option value="inactivo">Inactivo</option></select></label>
        {error && <p role="alert" style={{ color: '#ffd0c8' }}>{error}</p>}<button disabled={guardando} style={{ ...campo, background: '#18794e', cursor: 'pointer' }}>{guardando ? 'Guardando…' : 'Guardar cambios'}</button>
      </form> : <section style={{ width: 'min(100%, 620px)', maxHeight: '90vh', overflowY: 'auto', background: '#111a15', border: '1px solid #34423b', borderRadius: 18, padding: 22, color: '#edf2f0' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}><h2 style={{ flex: 1, margin: 0 }}>Observaciones · {persona.nombres} {persona.apellidos}</h2><button type="button" aria-label="Cerrar" onClick={() => setNotas(false)} style={{ ...campo, width: 42 }}><X size={17} /></button></div>
        <form onSubmit={agregarNota} style={{ display: 'grid', gap: 10, margin: '18px 0' }}><textarea required maxLength={5000} rows={4} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Agrega una observación; quedará registrada con fecha y autor." style={campo} />{error && <p role="alert" style={{ color: '#ffd0c8' }}>{error}</p>}{mensaje && <p role="status" style={{ color: '#a8f0c9' }}>{mensaje}</p>}<button disabled={guardando} style={{ ...campo, background: '#18794e', cursor: 'pointer' }}>{guardando ? 'Guardando…' : 'Guardar observación'}</button></form>
        <div style={{ display: 'grid', gap: 10 }}>{lista.map((n) => <article key={n.id_observacion} style={{ ...campo, width: 'auto' }}><p style={{ whiteSpace: 'pre-wrap', margin: '0 0 8px' }}>{n.observacion}</p><small style={{ color: '#94a39a' }}>{n.autor || 'Administración'} · {new Date(n.creado_en).toLocaleString()}</small></article>)}{!lista.length && <p style={{ color: '#a8b3b0' }}>Todavía no hay observaciones.</p>}</div>
      </section>}
    </div>}
  </>;
}
