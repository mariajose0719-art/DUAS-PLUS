import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Plus, Search, X } from 'lucide-react';

const campo = {
  width: '100%', padding: '12px 14px', borderRadius: 10,
  border: '1px solid #34423b', background: '#111a15', color: '#edf2f0',
  fontSize: 15, boxSizing: 'border-box',
};

function FichasAdmin() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState({ fichas: [], programas: [], opciones: { jornada: [], estado: [] } });
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [fichaEditando, setFichaEditando] = useState(null);
  const [fichaParaAsignar, setFichaParaAsignar] = useState(null);
  const [asignacion, setAsignacion] = useState({ id_usuario_instructor: '', rol_en_ficha: 'titular' });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [formulario, setFormulario] = useState({
    id_programa: '', codigo: '', jornada: '', fecha_inicio: '', fecha_fin: '', estado: '',
  });

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const respuesta = await fetch('/api/fichas', { credentials: 'include' });
      const cuerpo = await respuesta.json();
      if (!respuesta.ok) throw new Error(cuerpo.mensaje || 'No se pudieron cargar las fichas.');
      setDatos(cuerpo);
      setFormulario((anterior) => ({
        ...anterior,
        id_programa: anterior.id_programa || String(cuerpo.programas?.[0]?.id_programa || ''),
        jornada: anterior.jornada || cuerpo.opciones?.jornada?.[0] || '',
        estado: anterior.estado || cuerpo.opciones?.estado?.[0] || '',
      }));
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const filtradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return datos.fichas;
    return datos.fichas.filter((ficha) =>
      String(ficha.codigo).toLowerCase().includes(texto) || ficha.programa.toLowerCase().includes(texto));
  }, [busqueda, datos.fichas]);

  async function guardarFicha(evento) {
    evento.preventDefault();
    setGuardando(true);
    setMensaje('');
    setError('');
    try {
      const respuesta = await fetch(fichaEditando ? `/api/fichas/${fichaEditando.id_ficha}` : '/api/fichas', {
        method: fichaEditando ? 'PATCH' : 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario),
      });
      const cuerpo = await respuesta.json();
      if (!respuesta.ok) throw new Error(cuerpo.mensaje || 'No se pudo guardar la ficha.');
      setMensaje(cuerpo.mensaje);
      setMostrarFormulario(false);
      setFichaEditando(null);
      setFormulario((anterior) => ({ ...anterior, codigo: '', fecha_inicio: '', fecha_fin: '' }));
      await cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  function editarFicha(ficha) {
    setFormulario({ id_programa: String(ficha.id_programa), codigo: ficha.codigo, jornada: ficha.jornada, fecha_inicio: String(ficha.fecha_inicio).slice(0, 10), fecha_fin: ficha.fecha_fin ? String(ficha.fecha_fin).slice(0, 10) : '', estado: ficha.estado });
    setFichaEditando(ficha);
    setError('');
    setMostrarFormulario(true);
  }

  async function retirarInstructor(ficha, instructor) {
    if (!window.confirm(`¿Retirar a ${instructor.nombres} ${instructor.apellidos} de la ficha ${ficha.codigo}?`)) return;
    setError(''); setMensaje('');
    try {
      const respuesta = await fetch(`/api/fichas/${ficha.id_ficha}/instructores/${instructor.id_usuario}`, { method: 'DELETE', credentials: 'include' });
      const cuerpo = await respuesta.json();
      if (!respuesta.ok) throw new Error(cuerpo.mensaje || 'No se pudo retirar la asignación.');
      setMensaje(cuerpo.mensaje); await cargar();
    } catch (e) { setError(e.message); }
  }

  async function asignarInstructor(evento) {
    evento.preventDefault();
    setError(''); setMensaje('');
    try {
      const respuesta = await fetch(`/api/fichas/${fichaParaAsignar.id_ficha}/instructores`, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asignacion),
      });
      const cuerpo = await respuesta.json();
      if (!respuesta.ok) throw new Error(cuerpo.mensaje || 'No se pudo asignar el instructor.');
      setMensaje(cuerpo.mensaje);
      setFichaParaAsignar(null);
      await cargar();
    } catch (e) { setError(e.message); }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#080c0a', color: '#edf2f0', padding: '32px clamp(20px, 5vw, 72px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <button onClick={() => navigate('/administrador')} style={{ ...campo, width: 'auto', cursor: 'pointer', marginBottom: 32 }}>
          <ArrowLeft size={17} style={{ verticalAlign: 'middle', marginRight: 8 }} />Volver al panel
        </button>

        <header style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}>
          <BookOpen color="#2e9a6e" size={34} />
          <h1 style={{ fontSize: 36, margin: 0 }}>Fichas</h1>
          <span style={{ color: '#a8b3b0', marginLeft: 'auto' }}>{datos.fichas.length} fichas</span>
          <button onClick={() => { setError(''); setMostrarFormulario(true); }} disabled={!datos.programas.length}
            style={{ ...campo, width: 'auto', background: '#18794e', border: 0, cursor: datos.programas.length ? 'pointer' : 'not-allowed', opacity: datos.programas.length ? 1 : .6 }}>
            <Plus size={17} style={{ verticalAlign: 'middle', marginRight: 8 }} />Crear ficha
          </button>
        </header>
        <p style={{ color: '#a8b3b0', fontSize: 16, marginTop: 0, marginBottom: 28 }}>Las fichas se guardan en la base de datos y pertenecen a un programa.</p>

        <label style={{ ...campo, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Search size={18} color="#82918b" />
          <input aria-label="Buscar fichas" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por código o programa" style={{ background: 'transparent', border: 0, outline: 0, color: '#edf2f0', width: '100%', fontSize: 15 }} />
        </label>

        {mensaje && <p role="status" style={{ background: '#123e2d', color: '#a8f0c9', padding: 16, borderRadius: 12 }}>{mensaje}</p>}
        {error && <p role="alert" style={{ background: '#512923', color: '#ffd0c8', padding: 16, borderRadius: 12 }}>{error}</p>}
        {!cargando && datos.programas.length === 0 && <p style={{ background: '#493919', color: '#ffe2a0', padding: 16, borderRadius: 12 }}>Primero crea un programa activo. Luego podrás crear una ficha.</p>}
        {cargando ? <p role="status" style={{ color: '#a8b3b0' }}>Cargando fichas…</p> : (
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
            {filtradas.map((ficha) => (
              <article key={ficha.id_ficha} style={{ background: '#111a15', border: '1px solid #29352e', borderRadius: 18, padding: 22 }}>
                <h2 style={{ margin: '0 0 10px', fontSize: 21 }}>Ficha {ficha.codigo}</h2>
                <p style={{ color: '#b5c1ba' }}>{ficha.programa}</p>
                <p style={{ color: '#b5c1ba' }}>Jornada: {ficha.jornada}</p>
                <p style={{ color: '#b5c1ba' }}>Estado: {ficha.estado}</p>
                <p style={{ color: '#b5c1ba' }}>Inicio: {String(ficha.fecha_inicio).slice(0, 10)}{ficha.fecha_fin ? ` · Fin: ${String(ficha.fecha_fin).slice(0, 10)}` : ''}</p>
                <p style={{ color: '#b5c1ba' }}>Aprendices inscritos: {ficha.aprendices}</p>
                <p style={{ color: '#b5c1ba' }}>Instructores: {ficha.instructores_asignados || 'Sin asignar'}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>{(ficha.id_instructores || '').split(',').filter(Boolean).map((id) => datos.instructores?.find((i) => String(i.id_usuario) === id)).filter(Boolean).map((i) => <button key={i.id_usuario} type="button" onClick={() => retirarInstructor(ficha, i)} title={`Retirar a ${i.nombres} ${i.apellidos}`} style={{ ...campo, width: 'auto', padding: '7px 9px', cursor: 'pointer' }}>Quitar {i.nombres} ×</button>)}</div>
                <button onClick={() => editarFicha(ficha)} style={{ ...campo, marginTop: 8, cursor: 'pointer' }}>Editar ficha</button>
                <button onClick={() => { setError(''); setAsignacion({ id_usuario_instructor: '', rol_en_ficha: 'titular' }); setFichaParaAsignar(ficha); }} disabled={!datos.instructores?.length}
                  style={{ ...campo, marginTop: 8, cursor: datos.instructores?.length ? 'pointer' : 'not-allowed', opacity: datos.instructores?.length ? 1 : .6 }}>
                  Asignar instructor
                </button>
              </article>
            ))}
            {!filtradas.length && <p style={{ color: '#a8b3b0' }}>{datos.fichas.length ? 'No hay fichas que coincidan con la búsqueda.' : 'Todavía no hay fichas registradas.'}</p>}
          </section>
        )}
      </div>

      {mostrarFormulario && (
        <div role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setMostrarFormulario(false); }} style={{ position: 'fixed', inset: 0, background: '#000b', display: 'grid', placeItems: 'center', padding: 16, zIndex: 1000 }}>
          <form onSubmit={guardarFicha} style={{ width: 'min(100%, 520px)', maxHeight: '90vh', overflowY: 'auto', background: '#111a15', border: '1px solid #34423b', borderRadius: 20, padding: 24, display: 'grid', gap: 15 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}><h2 style={{ margin: 0, flex: 1 }}>{fichaEditando ? 'Editar ficha' : 'Crear ficha'}</h2><button type="button" aria-label="Cerrar" onClick={() => { setMostrarFormulario(false); setFichaEditando(null); }} style={{ ...campo, width: 42, cursor: 'pointer' }}><X size={18} /></button></div>
            <label style={{ color: '#b5c1ba' }}>Programa
              <select required value={formulario.id_programa} onChange={(e) => setFormulario({ ...formulario, id_programa: e.target.value })} style={{ ...campo, marginTop: 6 }}>
                <option value="">Selecciona un programa</option>{datos.programas.map((p) => <option key={p.id_programa} value={p.id_programa}>{p.nombre} · {p.codigo}</option>)}
              </select>
            </label>
            <label style={{ color: '#b5c1ba' }}>Código de ficha
              <input required maxLength={30} value={formulario.codigo} onChange={(e) => setFormulario({ ...formulario, codigo: e.target.value })} placeholder="Ejemplo: 3315566" style={{ ...campo, marginTop: 6 }} />
            </label>
            <label style={{ color: '#b5c1ba' }}>Jornada
              <select required value={formulario.jornada} onChange={(e) => setFormulario({ ...formulario, jornada: e.target.value })} style={{ ...campo, marginTop: 6 }}>
                <option value="">Selecciona jornada</option>{datos.opciones.jornada.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
              </select>
            </label>
            <label style={{ color: '#b5c1ba' }}>Fecha de inicio
              <input required type="date" value={formulario.fecha_inicio} onChange={(e) => setFormulario({ ...formulario, fecha_inicio: e.target.value })} style={{ ...campo, marginTop: 6 }} />
            </label>
            <label style={{ color: '#b5c1ba' }}>Fecha de finalización (opcional)
              <input type="date" min={formulario.fecha_inicio || undefined} value={formulario.fecha_fin} onChange={(e) => setFormulario({ ...formulario, fecha_fin: e.target.value })} style={{ ...campo, marginTop: 6 }} />
            </label>
            <label style={{ color: '#b5c1ba' }}>Estado
              <select required value={formulario.estado} onChange={(e) => setFormulario({ ...formulario, estado: e.target.value })} style={{ ...campo, marginTop: 6 }}>
                <option value="">Selecciona estado</option>{datos.opciones.estado.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
              </select>
            </label>
            <button disabled={guardando || !datos.programas.length} type="submit" style={{ ...campo, background: '#18794e', border: 0, cursor: 'pointer', fontWeight: 700 }}>{guardando ? 'Guardando…' : fichaEditando ? 'Guardar cambios' : 'Guardar ficha'}</button>
          </form>
        </div>
      )}

      {fichaParaAsignar && (
        <div role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setFichaParaAsignar(null); }} style={{ position: 'fixed', inset: 0, background: '#000b', display: 'grid', placeItems: 'center', padding: 16, zIndex: 1000 }}>
          <form onSubmit={asignarInstructor} style={{ width: 'min(100%, 480px)', background: '#111a15', border: '1px solid #34423b', borderRadius: 20, padding: 24, display: 'grid', gap: 15 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}><h2 style={{ margin: 0, flex: 1 }}>Asignar a ficha {fichaParaAsignar.codigo}</h2><button type="button" aria-label="Cerrar" onClick={() => setFichaParaAsignar(null)} style={{ ...campo, width: 42, cursor: 'pointer' }}><X size={18} /></button></div>
            <label style={{ color: '#b5c1ba' }}>Instructor
              <select required value={asignacion.id_usuario_instructor} onChange={(e) => setAsignacion({ ...asignacion, id_usuario_instructor: e.target.value })} style={{ ...campo, marginTop: 6 }}>
                <option value="">Selecciona un instructor</option>{(datos.instructores || []).map((i) => <option key={i.id_usuario} value={i.id_usuario}>{i.nombres} {i.apellidos}</option>)}
              </select>
            </label>
            <label style={{ color: '#b5c1ba' }}>Responsabilidad en la ficha
              <select value={asignacion.rol_en_ficha} onChange={(e) => setAsignacion({ ...asignacion, rol_en_ficha: e.target.value })} style={{ ...campo, marginTop: 6 }}>
                <option value="titular">Titular</option><option value="apoyo">Apoyo</option>
              </select>
            </label>
            <button type="submit" style={{ ...campo, background: '#18794e', border: 0, cursor: 'pointer', fontWeight: 700 }}>Guardar asignación</button>
          </form>
        </div>
      )}
    </main>
  );
}

export default FichasAdmin;
