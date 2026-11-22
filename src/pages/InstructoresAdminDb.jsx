import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Users, X } from 'lucide-react';
import UsuarioAdminAcciones from '../components/UsuarioAdminAcciones';

const campo = { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #34423b', background: '#111a15', color: '#edf2f0', fontSize: 15, boxSizing: 'border-box' };
const inicial = { tipo_documento: 'Cédula de ciudadanía', numero_documento: '', nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '' };

export default function InstructoresAdminDb() {
  const navigate = useNavigate();
  const [instructores, setInstructores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [formulario, setFormulario] = useState(inicial);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const respuesta = await fetch('/api/instructores', { credentials: 'include' });
      const cuerpo = await respuesta.json();
      if (!respuesta.ok) throw new Error(cuerpo.mensaje || 'No se pudieron cargar los instructores.');
      setInstructores(cuerpo.instructores || []);
    } catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return instructores.filter((i) => `${i.nombres} ${i.apellidos} ${i.correo} ${i.numero_documento}`.toLowerCase().includes(texto));
  }, [busqueda, instructores]);

  async function guardar(evento) {
    evento.preventDefault();
    setGuardando(true); setMensaje(''); setError('');
    try {
      const respuesta = await fetch('/api/instructores', {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formulario),
      });
      const cuerpo = await respuesta.json();
      if (!respuesta.ok) throw new Error(cuerpo.mensaje || 'No se pudo registrar el instructor.');
      setMensaje(cuerpo.mensaje);
      setFormulario(inicial);
      setMostrarFormulario(false);
      await cargar();
    } catch (e) { setError(e.message); }
    finally { setGuardando(false); }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#080c0a', color: '#edf2f0', padding: '32px clamp(20px, 5vw, 72px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <button onClick={() => navigate('/administrador')} style={{ ...campo, width: 'auto', cursor: 'pointer', marginBottom: 32 }}><ArrowLeft size={17} style={{ verticalAlign: 'middle', marginRight: 8 }} />Volver al panel</button>
        <header style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}>
          <Users color="#2e9a6e" size={34} /><h1 style={{ fontSize: 36, margin: 0 }}>Instructores</h1>
          <span style={{ color: '#a8b3b0', marginLeft: 'auto' }}>{instructores.length} instructores</span>
          <button onClick={() => { setError(''); setMostrarFormulario(true); }} style={{ ...campo, width: 'auto', background: '#18794e', border: 0, cursor: 'pointer' }}><Plus size={17} style={{ verticalAlign: 'middle', marginRight: 8 }} />Registrar instructor</button>
        </header>
        <p style={{ color: '#a8b3b0', fontSize: 16, marginTop: 0, marginBottom: 28 }}>Las cuentas se guardan en usuarios y la contraseña se almacena protegida.</p>
        <label style={{ ...campo, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}><Search size={18} color="#82918b" /><input aria-label="Buscar instructores" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por nombre, correo o documento" style={{ background: 'transparent', border: 0, outline: 0, color: '#edf2f0', width: '100%', fontSize: 15 }} /></label>
        {mensaje && <p role="status" style={{ background: '#123e2d', color: '#a8f0c9', padding: 16, borderRadius: 12 }}>{mensaje}</p>}
        {error && <p role="alert" style={{ background: '#512923', color: '#ffd0c8', padding: 16, borderRadius: 12 }}>{error}</p>}
        {cargando ? <p role="status" style={{ color: '#a8b3b0' }}>Cargando instructores…</p> : (
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
            {filtrados.map((i) => <article key={i.id_usuario} style={{ background: '#111a15', border: '1px solid #29352e', borderRadius: 18, padding: 22 }}>
              <h2 style={{ margin: '0 0 10px', fontSize: 21 }}>{i.nombres} {i.apellidos}</h2>
              <p style={{ color: '#b5c1ba' }}>{i.correo}</p><p style={{ color: '#b5c1ba' }}>{i.tipo_documento}: {i.numero_documento}</p>
              {i.telefono && <p style={{ color: '#b5c1ba' }}>Teléfono: {i.telefono}</p>}
              <p style={{ color: i.estado === 'activo' ? '#69d79d' : '#f0bd69', marginBottom: 0 }}>Estado: {i.estado}</p>
              <UsuarioAdminAcciones persona={{ ...i, rol: 'instructor' }} onActualizado={cargar} />
            </article>)}
            {!filtrados.length && <p style={{ color: '#a8b3b0' }}>{instructores.length ? 'No hay resultados para esa búsqueda.' : 'Todavía no hay instructores registrados.'}</p>}
          </section>
        )}
      </div>

      {mostrarFormulario && <div role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setMostrarFormulario(false); }} style={{ position: 'fixed', inset: 0, background: '#000b', display: 'grid', placeItems: 'center', padding: 16, zIndex: 1000 }}>
        <form onSubmit={guardar} style={{ width: 'min(100%, 520px)', maxHeight: '90vh', overflowY: 'auto', background: '#111a15', border: '1px solid #34423b', borderRadius: 20, padding: 24, display: 'grid', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}><h2 style={{ margin: 0, flex: 1 }}>Registrar instructor</h2><button type="button" aria-label="Cerrar" onClick={() => setMostrarFormulario(false)} style={{ ...campo, width: 42, cursor: 'pointer' }}><X size={18} /></button></div>
          <label style={{ color: '#b5c1ba' }}>Tipo de documento<select required value={formulario.tipo_documento} onChange={(e) => setFormulario({ ...formulario, tipo_documento: e.target.value })} style={{ ...campo, marginTop: 6 }}><option>Cédula de ciudadanía</option><option>Cédula de extranjería</option><option>Pasaporte</option><option>Otro</option></select></label>
          <label style={{ color: '#b5c1ba' }}>Número de documento<input required maxLength={30} value={formulario.numero_documento} onChange={(e) => setFormulario({ ...formulario, numero_documento: e.target.value })} style={{ ...campo, marginTop: 6 }} /></label>
          <label style={{ color: '#b5c1ba' }}>Nombres<input required maxLength={100} value={formulario.nombres} onChange={(e) => setFormulario({ ...formulario, nombres: e.target.value })} style={{ ...campo, marginTop: 6 }} /></label>
          <label style={{ color: '#b5c1ba' }}>Apellidos<input required maxLength={100} value={formulario.apellidos} onChange={(e) => setFormulario({ ...formulario, apellidos: e.target.value })} style={{ ...campo, marginTop: 6 }} /></label>
          <label style={{ color: '#b5c1ba' }}>Correo para iniciar sesión<input required type="email" maxLength={150} value={formulario.correo} onChange={(e) => setFormulario({ ...formulario, correo: e.target.value })} style={{ ...campo, marginTop: 6 }} /></label>
          <label style={{ color: '#b5c1ba' }}>Teléfono (opcional)<input maxLength={30} value={formulario.telefono} onChange={(e) => setFormulario({ ...formulario, telefono: e.target.value })} style={{ ...campo, marginTop: 6 }} /></label>
          <label style={{ color: '#b5c1ba' }}>Contraseña temporal<input required type="password" minLength={8} autoComplete="new-password" value={formulario.contrasena} onChange={(e) => setFormulario({ ...formulario, contrasena: e.target.value })} style={{ ...campo, marginTop: 6 }} /><small style={{ display: 'block', marginTop: 5, color: '#8f9f97' }}>Al menos 8 caracteres. Entrégasela al instructor de forma privada.</small></label>
          <button disabled={guardando} type="submit" style={{ ...campo, background: '#18794e', border: 0, cursor: 'pointer', fontWeight: 700 }}>{guardando ? 'Guardando…' : 'Guardar instructor'}</button>
        </form>
      </div>}
    </main>
  );
}
