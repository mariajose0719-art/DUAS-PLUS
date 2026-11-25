import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calendar, MapPin, PlusCircle, Search, Users, X } from 'lucide-react';

const FORMULARIO_VACIO = {
  codigo: '',
  nombre: '',
  id_regional: '',
  tipo_oferta: 'tecnologia',
  modalidad: 'presencial',
  duracion_horas: '',
  descripcion: '',
};

const REGIONAL_VACIA = { codigo: '', nombre: '', departamento: '', municipio: '' };
const estiloCampo = {
  width: '100%', padding: '12px 14px', borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.12)', background: '#151c19',
  color: '#edf2f0', fontSize: '14px', boxSizing: 'border-box',
};

async function leerRespuesta(respuesta) {
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) throw new Error(datos.mensaje || 'No se pudo completar la operación.');
  return datos;
}

function Programas() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [programas, setProgramas] = useState([]);
  const [regionales, setRegionales] = useState([]);
  const [nuevoPrograma, setNuevoPrograma] = useState(FORMULARIO_VACIO);
  const [nuevaRegional, setNuevaRegional] = useState(REGIONAL_VACIA);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mostrarFormRegional, setMostrarFormRegional] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setMensajeError('');
    try {
      const [datosProgramas, datosRegionales] = await Promise.all([
        fetch('/api/programas', { credentials: 'include' }).then(leerRespuesta),
        fetch('/api/regionales', { credentials: 'include' }).then(leerRespuesta),
      ]);
      setProgramas(datosProgramas.programas || []);
      setRegionales(datosRegionales.regionales || []);
    } catch (error) {
      setMensajeError(error.message || 'No se pudieron cargar los programas.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const filtrados = programas.filter((programa) =>
    `${programa.nombre} ${programa.codigo} ${programa.regional || ''}`
      .toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleAgregarRegional = async (evento) => {
    evento.preventDefault();
    setGuardando(true);
    setMensajeError('');
    try {
      const datos = await fetch('/api/regionales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(nuevaRegional),
      }).then(leerRespuesta);
      setRegionales((actuales) => [...actuales, datos.regional]);
      setNuevoPrograma((actual) => ({ ...actual, id_regional: String(datos.regional.id_regional) }));
      setNuevaRegional(REGIONAL_VACIA);
      setMostrarFormRegional(false);
      setMensajeExito('Regional guardada en la base de datos.');
    } catch (error) {
      setMensajeError(error.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleAgregarPrograma = async (evento) => {
    evento.preventDefault();
    setGuardando(true);
    setMensajeError('');
    try {
      await fetch('/api/programas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(nuevoPrograma),
      }).then(leerRespuesta);
      setNuevoPrograma(FORMULARIO_VACIO);
      setMostrarForm(false);
      setMensajeExito('Programa guardado en la base de datos.');
      await cargarDatos();
    } catch (error) {
      setMensajeError(error.message);
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (programa) => {
    setMensajeError('');
    try {
      await fetch(`/api/programas/${programa.id_programa}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ activo: !programa.activo }),
      }).then(leerRespuesta);
      setMensajeExito(programa.activo ? 'Programa desactivado.' : 'Programa activado.');
      await cargarDatos();
    } catch (error) {
      setMensajeError(error.message);
    }
  };

  const tipoOfertaTexto = (tipo) => ({ tecnico: 'Técnico', tecnologia: 'Tecnología', curso_corto: 'Curso corto' }[tipo] || tipo);
  const modalidadTexto = (modalidad) => ({ presencial: 'Presencial', virtual: 'Virtual', mixta: 'Mixta' }[modalidad] || modalidad);
  const fechaTexto = (fecha) => fecha ? new Date(fecha).toLocaleDateString('es-CO') : '—';

  return (
    <main style={{ minHeight: '100vh', padding: '32px', background: '#080c0a', color: '#edf2f0', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <button onClick={() => navigate('/administrador')} style={{ ...estiloCampo, width: 'auto', cursor: 'pointer', marginBottom: '20px' }}>
          <ArrowLeft size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Volver al panel
        </button>

        <header style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '10px' }}>
          <BookOpen size={28} color="#2e9a6e" />
          <h1 style={{ margin: 0, fontSize: '30px' }}>Programas</h1>
          <span style={{ color: '#a8b3b0', marginLeft: 'auto' }}>{filtrados.length} programas</span>
          <button onClick={() => { setMensajeError(''); setMostrarFormRegional(true); }} style={{ ...estiloCampo, width: 'auto', cursor: 'pointer' }}>
            <MapPin size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Agregar regional
          </button>
          <button onClick={() => { setMensajeError(''); setMostrarForm(true); }} style={{ ...estiloCampo, width: 'auto', cursor: 'pointer', background: '#1a7a4a' }}>
            <PlusCircle size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Crear programa
          </button>
        </header>
        <p style={{ color: '#a8b3b0', margin: '0 0 22px 42px' }}>Los registros de esta pantalla se leen y guardan en la base de datos.</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <Search size={18} color="#6a7a75" />
          <input value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} placeholder="Buscar por nombre, código o regional" style={estiloCampo} />
        </div>

        {mensajeError && <p role="alert" style={{ background: '#4a2222', color: '#ffdada', padding: '12px 16px', borderRadius: '10px' }}>{mensajeError}</p>}
        {mensajeExito && <p role="status" style={{ background: '#173d2c', color: '#b9f4d2', padding: '12px 16px', borderRadius: '10px' }}>{mensajeExito}</p>}
        {regionales.length === 0 && !cargando && (
          <p style={{ background: '#3d3217', color: '#ffe8aa', padding: '14px 16px', borderRadius: '10px' }}>
            Aún no hay regionales. Primero pulsa “Agregar regional”; luego podrás crear programas.
          </p>
        )}
        {cargando ? <p role="status">Cargando información desde la base de datos…</p> : (
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '18px' }}>
            {filtrados.map((programa) => (
              <article key={programa.id_programa} style={{ border: '1px solid rgba(255,255,255,0.1)', background: '#111815', borderRadius: '18px', padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', margin: '0 0 6px' }}>{programa.nombre}</h2>
                    <p style={{ color: '#a8b3b0', margin: 0 }}>Código: {programa.codigo}</p>
                  </div>
                  <span style={{ color: programa.activo ? '#66d6a0' : '#f59c9c' }}>{programa.activo ? 'Activo' : 'Inactivo'}</span>
                </div>
                <p style={{ color: '#a8b3b0', margin: '14px 0 6px' }}>{tipoOfertaTexto(programa.tipo_oferta)} · {modalidadTexto(programa.modalidad)}</p>
                <p style={{ color: '#a8b3b0', margin: '6px 0' }}>Duración: {programa.duracion_horas ? `${programa.duracion_horas} horas` : 'No especificada'}</p>
                <p style={{ color: '#a8b3b0', margin: '6px 0' }}>Regional: {programa.regional}</p>
                <div style={{ display: 'flex', gap: '18px', color: '#7f918a', fontSize: '14px', marginTop: '14px' }}>
                  <span><Users size={15} style={{ verticalAlign: 'middle', marginRight: '5px' }} />{programa.aprendices} aprendices</span>
                  <span><Calendar size={15} style={{ verticalAlign: 'middle', marginRight: '5px' }} />{fechaTexto(programa.creado_en)}</span>
                </div>
                {programa.descripcion && <p style={{ color: '#a8b3b0', lineHeight: 1.5 }}>{programa.descripcion}</p>}
                <button onClick={() => cambiarEstado(programa)} style={{ ...estiloCampo, width: 'auto', marginTop: '18px', cursor: 'pointer' }}>
                  {programa.activo ? 'Desactivar' : 'Activar'} programa
                </button>
              </article>
            ))}
            {filtrados.length === 0 && !cargando && <p style={{ color: '#a8b3b0' }}>No hay programas que mostrar todavía.</p>}
          </section>
        )}
      </div>

      {mostrarFormRegional && (
        <div role="dialog" aria-modal="true" aria-labelledby="titulo-regional" style={fondoModal}>
          <form onSubmit={handleAgregarRegional} style={cajaModal}>
            <div style={cabeceraModal}><h2 id="titulo-regional" style={{ margin: 0 }}>Agregar regional</h2><button type="button" onClick={() => setMostrarFormRegional(false)} style={botonCerrar}><X /></button></div>
            <Campo label="Código *" value={nuevaRegional.codigo} onChange={(v) => setNuevaRegional({ ...nuevaRegional, codigo: v })} required />
            <Campo label="Nombre *" value={nuevaRegional.nombre} onChange={(v) => setNuevaRegional({ ...nuevaRegional, nombre: v })} required />
            <Campo label="Departamento *" value={nuevaRegional.departamento} onChange={(v) => setNuevaRegional({ ...nuevaRegional, departamento: v })} required />
            <Campo label="Municipio (opcional)" value={nuevaRegional.municipio} onChange={(v) => setNuevaRegional({ ...nuevaRegional, municipio: v })} />
            <button disabled={guardando} type="submit" style={botonPrincipal}>{guardando ? 'Guardando…' : 'Guardar regional'}</button>
          </form>
        </div>
      )}

      {mostrarForm && (
        <div role="dialog" aria-modal="true" aria-labelledby="titulo-programa" style={fondoModal}>
          <form onSubmit={handleAgregarPrograma} style={cajaModal}>
            <div style={cabeceraModal}><h2 id="titulo-programa" style={{ margin: 0 }}>Crear programa</h2><button type="button" onClick={() => setMostrarForm(false)} style={botonCerrar}><X /></button></div>
            <Campo label="Código del programa *" value={nuevoPrograma.codigo} onChange={(v) => setNuevoPrograma({ ...nuevoPrograma, codigo: v })} required />
            <Campo label="Nombre del programa *" value={nuevoPrograma.nombre} onChange={(v) => setNuevoPrograma({ ...nuevoPrograma, nombre: v })} required />
            <label style={etiquetaCampo}>Regional *
              <select required value={nuevoPrograma.id_regional} onChange={(e) => setNuevoPrograma({ ...nuevoPrograma, id_regional: e.target.value })} style={estiloCampo}>
                <option value="">Selecciona una regional</option>
                {regionales.filter((regional) => regional.activa).map((regional) => <option key={regional.id_regional} value={regional.id_regional}>{regional.nombre} — {regional.departamento}</option>)}
              </select>
            </label>
            <label style={etiquetaCampo}>Tipo de oferta *
              <select value={nuevoPrograma.tipo_oferta} onChange={(e) => setNuevoPrograma({ ...nuevoPrograma, tipo_oferta: e.target.value })} style={estiloCampo}>
                <option value="tecnico">Técnico</option><option value="tecnologia">Tecnología</option><option value="curso_corto">Curso corto</option>
              </select>
            </label>
            <label style={etiquetaCampo}>Modalidad *
              <select value={nuevoPrograma.modalidad} onChange={(e) => setNuevoPrograma({ ...nuevoPrograma, modalidad: e.target.value })} style={estiloCampo}>
                <option value="presencial">Presencial</option><option value="virtual">Virtual</option><option value="mixta">Mixta</option>
              </select>
            </label>
            <Campo label="Duración en horas (opcional)" type="number" min="1" max="65535" value={nuevoPrograma.duracion_horas} onChange={(v) => setNuevoPrograma({ ...nuevoPrograma, duracion_horas: v })} />
            <label style={etiquetaCampo}>Descripción (opcional)
              <textarea value={nuevoPrograma.descripcion} onChange={(e) => setNuevoPrograma({ ...nuevoPrograma, descripcion: e.target.value })} rows="3" style={{ ...estiloCampo, resize: 'vertical' }} />
            </label>
            {regionales.filter((regional) => regional.activa).length === 0 && <p style={{ color: '#ffe8aa' }}>Primero agrega una regional activa.</p>}
            <button disabled={guardando || !regionales.some((regional) => regional.activa)} type="submit" style={botonPrincipal}>{guardando ? 'Guardando…' : 'Guardar programa'}</button>
          </form>
        </div>
      )}
    </main>
  );
}

function Campo({ label, value, onChange, type = 'text', ...props }) {
  return <label style={etiquetaCampo}>{label}<input {...props} type={type} value={value} onChange={(evento) => onChange(evento.target.value)} style={estiloCampo} /></label>;
}

const fondoModal = { position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.72)', display: 'grid', placeItems: 'center', padding: '18px', overflowY: 'auto' };
const cajaModal = { width: 'min(540px, 100%)', maxHeight: '92vh', overflowY: 'auto', background: '#101714', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', color: '#edf2f0' };
const cabeceraModal = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' };
const botonCerrar = { background: 'transparent', color: '#a8b3b0', border: 0, cursor: 'pointer' };
const botonPrincipal = { padding: '13px', background: '#1a7a4a', color: '#fff', border: 0, borderRadius: '10px', fontWeight: 700, cursor: 'pointer' };
const etiquetaCampo = { display: 'flex', flexDirection: 'column', gap: '7px', color: '#a8b3b0', fontSize: '14px' };

export default Programas;
