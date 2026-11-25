import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Users, X } from 'lucide-react';
import UsuarioAdminAcciones from '../components/UsuarioAdminAcciones';

const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #34423b', background: '#111a15', color: '#edf2f0', fontSize: 15, boxSizing: 'border-box' };
const vacio = { tipo_documento: 'Cédula de ciudadanía', numero_documento: '', nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', id_ficha: '' };

export default function AprendicesAdminDb() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState({ aprendices: [], fichas: [] });
  const [form, setForm] = useState(vacio);
  const [busqueda, setBusqueda] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    setCargando(true); setError('');
    try {
      const respuesta = await fetch('/api/aprendices', { credentials: 'include' });
      const cuerpo = await respuesta.json();
      if (!respuesta.ok) throw new Error(cuerpo.mensaje || 'No se pudieron cargar los aprendices.');
      setDatos(cuerpo);
      setForm((prev) => ({ ...prev, id_ficha: prev.id_ficha || String(cuerpo.fichas?.[0]?.id_ficha || '') }));
    } catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }, []);
  useEffect(() => { cargar(); }, [cargar]);

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return datos.aprendices.filter((a) => `${a.nombres} ${a.apellidos} ${a.correo} ${a.numero_documento} ${a.fichas || ''}`.toLowerCase().includes(q));
  }, [busqueda, datos.aprendices]);

  async function guardar(e) {
    e.preventDefault(); setGuardando(true); setMensaje(''); setError('');
    try {
      const respuesta = await fetch('/api/aprendices', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const cuerpo = await respuesta.json();
      if (!respuesta.ok) throw new Error(cuerpo.mensaje || 'No se pudo guardar el aprendiz.');
      setMensaje(cuerpo.mensaje); setMostrar(false); setForm(vacio); await cargar();
    } catch (err) { setError(err.message); }
    finally { setGuardando(false); }
  }

  return <main style={{ minHeight: '100vh', background: '#080c0a', color: '#edf2f0', padding: '32px clamp(20px, 5vw, 72px)' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <button onClick={() => navigate('/administrador')} style={{ ...inputStyle, width: 'auto', cursor: 'pointer', marginBottom: 32 }}><ArrowLeft size={17} style={{ verticalAlign: 'middle', marginRight: 8 }} />Volver al panel</button>
      <header style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}><Users color="#2e9a6e" size={34} /><h1 style={{ fontSize: 36, margin: 0 }}>Aprendices</h1><span style={{ color: '#a8b3b0', marginLeft: 'auto' }}>{datos.aprendices.length} aprendices</span><button onClick={() => { setError(''); setMostrar(true); }} disabled={!datos.fichas.length} style={{ ...inputStyle, width: 'auto', background: '#18794e', border: 0, cursor: datos.fichas.length ? 'pointer' : 'not-allowed' }}><Plus size={17} style={{ verticalAlign: 'middle', marginRight: 8 }} />Registrar aprendiz</button></header>
      <p style={{ color: '#a8b3b0', marginTop: 0, marginBottom: 24 }}>Cada cuenta se inscribe en una ficha activa y se guarda en la base de datos.</p>
      <label style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}><Search size={18} color="#82918b" /><input aria-label="Buscar aprendices" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar nombre, correo, documento o ficha" style={{ background: 'transparent', border: 0, outline: 0, color: '#edf2f0', width: '100%', fontSize: 15 }} /></label>
      {mensaje && <p role="status" style={{ background: '#123e2d', color: '#a8f0c9', padding: 16, borderRadius: 12 }}>{mensaje}</p>}
      {error && <p role="alert" style={{ background: '#512923', color: '#ffd0c8', padding: 16, borderRadius: 12 }}>{error}</p>}
      {!datos.fichas.length && !cargando && <p style={{ background: '#493919', color: '#ffe2a0', padding: 16, borderRadius: 12 }}>Primero crea una ficha activa para poder inscribir aprendices.</p>}
      {cargando ? <p>Cargando…</p> : <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>{filtrados.map((a) => <article key={a.id_usuario} style={{ background: '#111a15', border: '1px solid #29352e', borderRadius: 18, padding: 22 }}><h2 style={{ margin: '0 0 8px', fontSize: 21 }}>{a.nombres} {a.apellidos}</h2><p style={{ color: '#b5c1ba' }}>{a.correo}</p><p style={{ color: '#b5c1ba' }}>{a.tipo_documento}: {a.numero_documento}</p><p style={{ color: '#b5c1ba' }}>Ficha(s): {a.fichas || 'Sin ficha activa'}</p><p style={{ color: '#69d79d', marginBottom: 0 }}>Estado: {a.estado}</p><UsuarioAdminAcciones persona={{ ...a, rol: 'aprendiz' }} onActualizado={cargar} /></article>)}{!filtrados.length && <p style={{ color: '#a8b3b0' }}>{datos.aprendices.length ? 'No hay coincidencias.' : 'Todavía no hay aprendices.'}</p>}</section>}
    </div>
    {mostrar && <div role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setMostrar(false); }} style={{ position: 'fixed', inset: 0, background: '#000b', display: 'grid', placeItems: 'center', padding: 16, zIndex: 1000 }}><form onSubmit={guardar} style={{ width: 'min(100%, 520px)', maxHeight: '90vh', overflowY: 'auto', background: '#111a15', border: '1px solid #34423b', borderRadius: 20, padding: 24, display: 'grid', gap: 13 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}><h2 style={{ margin: 0, flex: 1 }}>Registrar e inscribir aprendiz</h2><button type="button" aria-label="Cerrar" onClick={() => setMostrar(false)} style={{ ...inputStyle, width: 42 }}><X size={18} /></button></div>
      <label style={{ color: '#b5c1ba' }}>Tipo de documento<select value={form.tipo_documento} onChange={(e) => setForm({ ...form, tipo_documento: e.target.value })} style={{ ...inputStyle, marginTop: 6 }}><option>Cédula de ciudadanía</option><option>Tarjeta de identidad</option><option>Cédula de extranjería</option><option>Pasaporte</option><option>Otro</option></select></label>
      <label style={{ color: '#b5c1ba' }}>Número de documento<input required maxLength={30} value={form.numero_documento} onChange={(e) => setForm({ ...form, numero_documento: e.target.value })} style={{ ...inputStyle, marginTop: 6 }} /></label>
      <label style={{ color: '#b5c1ba' }}>Nombres<input required maxLength={100} value={form.nombres} onChange={(e) => setForm({ ...form, nombres: e.target.value })} style={{ ...inputStyle, marginTop: 6 }} /></label>
      <label style={{ color: '#b5c1ba' }}>Apellidos<input required maxLength={100} value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })} style={{ ...inputStyle, marginTop: 6 }} /></label>
      <label style={{ color: '#b5c1ba' }}>Correo para iniciar sesión<input required type="email" maxLength={150} value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} style={{ ...inputStyle, marginTop: 6 }} /></label>
      <label style={{ color: '#b5c1ba' }}>Teléfono (opcional)<input maxLength={30} value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} style={{ ...inputStyle, marginTop: 6 }} /></label>
      <label style={{ color: '#b5c1ba' }}>Ficha<select required value={form.id_ficha} onChange={(e) => setForm({ ...form, id_ficha: e.target.value })} style={{ ...inputStyle, marginTop: 6 }}><option value="">Selecciona ficha</option>{datos.fichas.map((f) => <option key={f.id_ficha} value={f.id_ficha}>{f.codigo}</option>)}</select></label>
      <label style={{ color: '#b5c1ba' }}>Contraseña temporal<input required type="password" minLength={8} autoComplete="new-password" value={form.contrasena} onChange={(e) => setForm({ ...form, contrasena: e.target.value })} style={{ ...inputStyle, marginTop: 6 }} /><small>Al menos 8 caracteres; compártela de manera privada.</small></label>
      <button disabled={guardando} type="submit" style={{ ...inputStyle, background: '#18794e', border: 0, cursor: 'pointer', fontWeight: 700 }}>{guardando ? 'Guardando…' : 'Guardar aprendiz e inscripción'}</button>
    </form></div>}
  </main>;
}
