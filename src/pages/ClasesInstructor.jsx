import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  PlusCircle, 
  FileText, 
  Upload, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  X,
  Sparkles,
  Tag
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function ClasesInstructor() {
  const navigate = useNavigate();
  const { modoOscuro } = useTheme();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clases, setClases] = useState([
    {
      id: 1,
      titulo: 'Fundamentos de Programación',
      ficha: 'Ficha 1234',
      fecha: '2024-07-15',
      hora: '09:00',
      lugar: 'Aula 3 - Virtual',
      descripcion: 'Introducción a variables, condicionales y ciclos.',
      guias: ['Guía 1 - Variables.pdf', 'Guía 2 - Condicionales.pdf'],
      taller: 'Taller 1 - Ejercicios prácticos.pdf',
      presentacion: 'Clase_1_Programacion.pptx',
      estado: 'Programada'
    },
    {
      id: 2,
      titulo: 'Diseño Universal para el Aprendizaje',
      ficha: 'Ficha 5678',
      fecha: '2024-07-18',
      hora: '10:00',
      lugar: 'Aula 2 - Presencial',
      descripcion: 'Principios del DUA y cómo aplicarlos en el aula.',
      guias: ['Guía DUA - Principios.pdf'],
      taller: null,
      presentacion: 'DUA_Introduccion.pptx',
      estado: 'Programada'
    },
  ]);

  const [nuevaClase, setNuevaClase] = useState({
    titulo: '',
    ficha: '',
    fecha: '',
    hora: '',
    lugar: '',
    descripcion: '',
    guias: [],
    taller: null,
    presentacion: null,
    estado: 'Programada'
  });
  const [archivosSubidos, setArchivosSubidos] = useState([]);

  const handleAgregarClase = () => {
    if (!nuevaClase.titulo || !nuevaClase.ficha || !nuevaClase.fecha || !nuevaClase.hora) {
      alert('Por favor completa los campos obligatorios: Título, Ficha, Fecha y Hora.');
      return;
    }
    const nueva = {
      ...nuevaClase,
      id: Date.now(),
      guias: archivosSubidos.filter(a => a.tipo === 'guia').map(a => a.nombre),
      taller: archivosSubidos.find(a => a.tipo === 'taller')?.nombre || null,
      presentacion: archivosSubidos.find(a => a.tipo === 'presentacion')?.nombre || null,
    };
    setClases([nueva, ...clases]);
    setNuevaClase({ titulo: '', ficha: '', fecha: '', hora: '', lugar: '', descripcion: '', guias: [], taller: null, presentacion: null, estado: 'Programada' });
    setArchivosSubidos([]);
    setMostrarFormulario(false);
  };

  const handleEliminarClase = (id) => {
    if (window.confirm('¿Seguro que quieres eliminar esta clase?')) {
      setClases(clases.filter(c => c.id !== id));
    }
  };

  const handleSubirArchivo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const tipo = e.target.name;
    const nuevoArchivo = {
      nombre: file.name,
      tipo: tipo,
    };
    setArchivosSubidos([...archivosSubidos, nuevoArchivo]);
    e.target.value = '';
  };

  const eliminarArchivo = (nombre) => {
    setArchivosSubidos(archivosSubidos.filter(a => a.nombre !== nombre));
  };

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Programada': return 'var(--color-primary)';
      case 'En curso': return '#f39c12';
      case 'Finalizada': return '#3498db';
      case 'Cancelada': return '#e74c3c';
      default: return '#6a7a75';
    }
  };

  const getEstadoBg = (estado) => {
    switch(estado) {
      case 'Programada': return 'rgba(46,154,110,0.15)';
      case 'En curso': return 'rgba(243,156,18,0.15)';
      case 'Finalizada': return 'rgba(52,152,219,0.15)';
      case 'Cancelada': return 'rgba(231,76,60,0.15)';
      default: return 'rgba(255,255,255,0.05)';
    }
  };

  const fondoGradiente = modoOscuro 
    ? `
        radial-gradient(ellipse 90% 70% at 15% 25%, rgba(26, 122, 74, 0.20) 0%, transparent 60%),
        radial-gradient(ellipse 70% 60% at 85% 75%, rgba(26, 122, 74, 0.15) 0%, transparent 55%),
        radial-gradient(ellipse 60% 50% at 50% 50%, rgba(26, 122, 74, 0.08) 0%, transparent 50%),
        #080c0a
      `
    : `
        radial-gradient(ellipse 90% 70% at 15% 25%, rgba(26, 122, 74, 0.12) 0%, transparent 60%),
        radial-gradient(ellipse 70% 60% at 85% 75%, rgba(26, 122, 74, 0.08) 0%, transparent 55%),
        radial-gradient(ellipse 60% 50% at 50% 50%, rgba(26, 122, 74, 0.04) 0%, transparent 50%),
        #f0f2f5
      `;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--color-fondo)',
      color: 'var(--color-texto)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.3s ease, color 0.3s ease',
      padding: '24px',
      justifyContent: 'center'
    }}>
      {/* Fondo */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: fondoGradiente,
        transition: 'background 0.3s ease'
      }}>
        <div style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(180px)',
          opacity: modoOscuro ? 0.25 : 0.15,
          width: '600px',
          height: '600px',
          background: 'rgba(26, 122, 74, 0.15)',
          top: '-200px',
          right: '-150px'
        }} />
        <div style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(200px)',
          opacity: modoOscuro ? 0.20 : 0.10,
          width: '500px',
          height: '500px',
          background: 'rgba(26, 122, 74, 0.10)',
          bottom: '-150px',
          left: '-100px'
        }} />
        <div style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(140px)',
          opacity: modoOscuro ? 0.15 : 0.08,
          width: '300px',
          height: '300px',
          background: 'rgba(26, 122, 74, 0.08)',
          top: '40%',
          left: '60%'
        }} />
      </div>

      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        {/* Encabezado */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/instructor')}
            style={{
              background: 'var(--color-fondo-card)',
              border: '1px solid var(--color-borde)',
              borderRadius: '12px',
              color: 'var(--color-texto)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: 'calc(var(--tamano-fuente) * 0.875)',
              fontFamily: 'var(--fuente)',
              padding: '8px 16px',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = modoOscuro ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-fondo-card)';
            }}
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
            Volver
          </button>
          <Calendar size={28} strokeWidth={1.5} color="var(--color-primary)" />
          <h1 style={{
            fontSize: 'calc(var(--tamano-fuente) * 1.75)',
            fontWeight: '700',
            margin: 0,
            color: 'var(--color-texto)',
            letterSpacing: '-0.5px'
          }}>
            Mis clases
          </h1>
          <span style={{
            fontSize: 'calc(var(--tamano-fuente) * 0.875)',
            color: modoOscuro ? '#6a7a75' : '#888',
            marginLeft: 'auto',
            background: 'var(--color-fondo-card)',
            padding: '4px 16px',
            borderRadius: '100px',
            border: '1px solid var(--color-borde)'
          }}>
            {clases.length} clases
          </span>
          <button
            onClick={() => setMostrarFormulario(true)}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, var(--color-primary), #2e9a6e)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--fuente)',
              fontSize: 'calc(var(--tamano-fuente) * 0.875)',
              fontWeight: '500',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: '0 8px 32px rgba(46,154,110,0.25)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.04)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(46,154,110,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(46,154,110,0.25)';
            }}
          >
            <PlusCircle size={18} strokeWidth={1.5} />
            Crear clase
          </button>
        </div>
        <p style={{ 
          color: modoOscuro ? '#a8b3b0' : '#555', 
          fontSize: 'calc(var(--tamano-fuente) * 0.9375)', 
          marginBottom: '28px', 
          marginLeft: '52px',
          letterSpacing: '-0.2px'
        }}>
          Programa tus clases, asígnalas a una ficha y sube el material didáctico.
        </p>

        {/* Lista de clases */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {clases.length === 0 ? (
            <div style={{
              background: 'var(--color-fondo-card)',
              borderRadius: '24px',
              padding: '56px',
              textAlign: 'center',
              border: '1px solid var(--color-borde)'
            }}>
              <Calendar size={48} strokeWidth={1.5} color="#6a7a75" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: 'calc(var(--tamano-fuente) * 1.25)', fontWeight: '600', color: '#a8b3b0', margin: 0 }}>No hay clases programadas</h3>
              <p style={{ color: '#6a7a75', marginTop: '8px' }}>Haz clic en "Crear clase" para programar tu primera clase.</p>
            </div>
          ) : (
            clases.map((clase, index) => (
              <div key={clase.id} style={{
                background: 'var(--color-fondo-card)',
                backdropFilter: 'blur(16px)',
                borderRadius: '20px',
                padding: '24px 28px',
                border: '1px solid var(--color-borde)',
                boxShadow: 'var(--sombra)',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                animation: `fadeInUp 0.4s ease-out ${0.1 + index * 0.05}s forwards`,
                opacity: 0,
                transform: 'translateY(16px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(46,154,110,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-fondo-card)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--color-borde)';
              }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap',
                      marginBottom: '4px'
                    }}>
                      <h3 style={{
                        fontSize: 'calc(var(--tamano-fuente) * 1.25)',
                        fontWeight: '600',
                        margin: 0,
                        color: 'var(--color-texto)'
                      }}>
                        {clase.titulo}
                      </h3>
                      <span style={{
                        fontSize: 'calc(var(--tamano-fuente) * 0.75)',
                        padding: '4px 14px',
                        borderRadius: '100px',
                        background: getEstadoBg(clase.estado),
                        color: getEstadoColor(clase.estado),
                        fontWeight: '500'
                      }}>
                        {clase.estado}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '16px',
                      marginTop: '6px',
                      fontSize: 'calc(var(--tamano-fuente) * 0.875)',
                      color: modoOscuro ? '#a8b3b0' : '#555'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={16} strokeWidth={1.5} />
                        {clase.fecha}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={16} strokeWidth={1.5} />
                        {clase.hora}
                      </span>
                      {clase.lugar && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={16} strokeWidth={1.5} />
                          {clase.lugar}
                        </span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)' }}>
                        <Tag size={16} strokeWidth={1.5} />
                        {clase.ficha}
                      </span>
                    </div>
                    {clase.descripcion && (
                      <p style={{
                        fontSize: 'calc(var(--tamano-fuente) * 0.875)',
                        color: modoOscuro ? '#6a7a75' : '#888',
                        marginTop: '8px',
                        marginBottom: 0,
                        maxWidth: '600px'
                      }}>
                        {clase.descripcion}
                      </p>
                    )}
                    {/* Materiales */}
                    {(clase.guias?.length > 0 || clase.taller || clase.presentacion) && (
                      <div style={{
                        marginTop: '12px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: 'calc(var(--tamano-fuente) * 0.8125)', color: modoOscuro ? '#6a7a75' : '#888', marginRight: '4px' }}>
                          📎 Materiales:
                        </span>
                        {clase.guias?.map((guia, idx) => (
                          <span key={idx} style={{
                            fontSize: 'calc(var(--tamano-fuente) * 0.75)',
                            padding: '4px 12px',
                            background: 'rgba(46,154,110,0.08)',
                            borderRadius: '100px',
                            color: modoOscuro ? '#a8b3b0' : '#555',
                            border: '1px solid rgba(46,154,110,0.06)'
                          }}>
                            📄 {guia}
                          </span>
                        ))}
                        {clase.taller && (
                          <span style={{
                            fontSize: 'calc(var(--tamano-fuente) * 0.75)',
                            padding: '4px 12px',
                            background: 'rgba(243,156,18,0.08)',
                            borderRadius: '100px',
                            color: '#f39c12',
                            border: '1px solid rgba(243,156,18,0.06)'
                          }}>
                            🛠️ {clase.taller}
                          </span>
                        )}
                        {clase.presentacion && (
                          <span style={{
                            fontSize: 'calc(var(--tamano-fuente) * 0.75)',
                            padding: '4px 12px',
                            background: 'rgba(52,152,219,0.08)',
                            borderRadius: '100px',
                            color: '#3498db',
                            border: '1px solid rgba(52,152,219,0.06)'
                          }}>
                            📊 {clase.presentacion}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                    <button
                      onClick={() => alert(`Ver clase: ${clase.titulo}`)}
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--color-borde)',
                        borderRadius: '10px',
                        color: 'var(--color-texto)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: 'calc(var(--tamano-fuente) * 0.8125)',
                        fontFamily: 'var(--fuente)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      }}
                    >
                      <Eye size={16} strokeWidth={1.5} />
                      Ver
                    </button>
                    <button
                      onClick={() => alert(`Editar clase: ${clase.titulo}`)}
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--color-borde)',
                        borderRadius: '10px',
                        color: 'var(--color-texto)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: 'calc(var(--tamano-fuente) * 0.8125)',
                        fontFamily: 'var(--fuente)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(52,152,219,0.08)';
                        e.currentTarget.style.color = '#3498db';
                        e.currentTarget.style.borderColor = 'rgba(52,152,219,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.color = 'var(--color-texto)';
                        e.currentTarget.style.borderColor = 'var(--color-borde)';
                      }}
                    >
                      <Edit size={16} strokeWidth={1.5} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminarClase(clase.id)}
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--color-borde)',
                        borderRadius: '10px',
                        color: 'var(--color-texto)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: 'calc(var(--tamano-fuente) * 0.8125)',
                        fontFamily: 'var(--fuente)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(231,76,60,0.08)';
                        e.currentTarget.style.color = '#e74c3c';
                        e.currentTarget.style.borderColor = 'rgba(231,76,60,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.color = 'var(--color-texto)';
                        e.currentTarget.style.borderColor = 'var(--color-borde)';
                      }}
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de crear clase */}
      {mostrarFormulario && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            background: 'var(--color-fondo-card)',
            backdropFilter: 'blur(24px)',
            borderRadius: '28px',
            padding: '32px 28px',
            maxWidth: '520px',
            width: '100%',
            border: '1px solid var(--color-borde)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
            boxSizing: 'border-box',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: 'calc(var(--tamano-fuente) * 1.25)',
                fontWeight: '700',
                margin: 0,
                color: 'var(--color-texto)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <PlusCircle size={22} strokeWidth={1.5} color="var(--color-primary)" />
                Nueva clase
              </h2>
              <button
                onClick={() => setMostrarFormulario(false)}
                style={{
                  background: 'var(--color-fondo-card)',
                  border: '1px solid var(--color-borde)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  color: 'var(--color-texto)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = modoOscuro ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--color-fondo-card)';
                }}
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: 'calc(var(--tamano-fuente) * 0.875)', fontWeight: '500', color: modoOscuro ? '#a8b3b0' : '#555', display: 'block', marginBottom: '6px' }}>
                  Título *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Clase 3 - Funciones"
                  value={nuevaClase.titulo}
                  onChange={(e) => setNuevaClase({...nuevaClase, titulo: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--color-fondo-card)',
                    border: '1px solid var(--color-borde)',
                    borderRadius: '12px',
                    color: 'var(--color-texto)',
                    fontSize: 'var(--tamano-fuente)',
                    fontFamily: 'var(--fuente)',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-borde)'}
                />
              </div>

              <div>
                <label style={{ fontSize: 'calc(var(--tamano-fuente) * 0.875)', fontWeight: '500', color: modoOscuro ? '#a8b3b0' : '#555', display: 'block', marginBottom: '6px' }}>
                  Ficha *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Ficha 1234"
                  value={nuevaClase.ficha}
                  onChange={(e) => setNuevaClase({...nuevaClase, ficha: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--color-fondo-card)',
                    border: '1px solid var(--color-borde)',
                    borderRadius: '12px',
                    color: 'var(--color-texto)',
                    fontSize: 'var(--tamano-fuente)',
                    fontFamily: 'var(--fuente)',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-borde)'}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <label style={{ fontSize: 'calc(var(--tamano-fuente) * 0.875)', fontWeight: '500', color: modoOscuro ? '#a8b3b0' : '#555', display: 'block', marginBottom: '6px' }}>
                    Fecha *
                  </label>
                  <input
                    type="date"
                    value={nuevaClase.fecha}
                    onChange={(e) => setNuevaClase({...nuevaClase, fecha: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'var(--color-fondo-card)',
                      border: '1px solid var(--color-borde)',
                      borderRadius: '12px',
                      color: 'var(--color-texto)',
                      fontSize: 'var(--tamano-fuente)',
                      fontFamily: 'var(--fuente)',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-borde)'}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <label style={{ fontSize: 'calc(var(--tamano-fuente) * 0.875)', fontWeight: '500', color: modoOscuro ? '#a8b3b0' : '#555', display: 'block', marginBottom: '6px' }}>
                    Hora *
                  </label>
                  <input
                    type="time"
                    value={nuevaClase.hora}
                    onChange={(e) => setNuevaClase({...nuevaClase, hora: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'var(--color-fondo-card)',
                      border: '1px solid var(--color-borde)',
                      borderRadius: '12px',
                      color: 'var(--color-texto)',
                      fontSize: 'var(--tamano-fuente)',
                      fontFamily: 'var(--fuente)',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-borde)'}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 'calc(var(--tamano-fuente) * 0.875)', fontWeight: '500', color: modoOscuro ? '#a8b3b0' : '#555', display: 'block', marginBottom: '6px' }}>
                  Lugar
                </label>
                <input
                  type="text"
                  placeholder="Ej: Aula 3 - Virtual"
                  value={nuevaClase.lugar}
                  onChange={(e) => setNuevaClase({...nuevaClase, lugar: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--color-fondo-card)',
                    border: '1px solid var(--color-borde)',
                    borderRadius: '12px',
                    color: 'var(--color-texto)',
                    fontSize: 'var(--tamano-fuente)',
                    fontFamily: 'var(--fuente)',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-borde)'}
                />
              </div>

              <div>
                <label style={{ fontSize: 'calc(var(--tamano-fuente) * 0.875)', fontWeight: '500', color: modoOscuro ? '#a8b3b0' : '#555', display: 'block', marginBottom: '6px' }}>
                  Descripción
                </label>
                <textarea
                  placeholder="Contenido y objetivos de la clase"
                  rows="3"
                  value={nuevaClase.descripcion}
                  onChange={(e) => setNuevaClase({...nuevaClase, descripcion: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--color-fondo-card)',
                    border: '1px solid var(--color-borde)',
                    borderRadius: '12px',
                    color: 'var(--color-texto)',
                    fontSize: 'var(--tamano-fuente)',
                    fontFamily: 'var(--fuente)',
                    outline: 'none',
                    transition: 'all 0.2s',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-borde)'}
                />
              </div>

              <div>
                <label style={{ fontSize: 'calc(var(--tamano-fuente) * 0.875)', fontWeight: '500', color: modoOscuro ? '#a8b3b0' : '#555', display: 'block', marginBottom: '8px' }}>
                  📎 Subir materiales
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <label style={{
                    padding: '8px 14px',
                    background: 'var(--color-fondo-card)',
                    border: '1px solid var(--color-borde)',
                    borderRadius: '10px',
                    color: 'var(--color-texto)',
                    cursor: 'pointer',
                    fontSize: 'calc(var(--tamano-fuente) * 0.8125)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-fondo-card)'; }}
                  >
                    <Upload size={16} strokeWidth={1.5} style={{ marginRight: '6px' }} />
                    Guía
                    <input type="file" name="guia" onChange={handleSubirArchivo} style={{ display: 'none' }} />
                  </label>
                  <label style={{
                    padding: '8px 14px',
                    background: 'var(--color-fondo-card)',
                    border: '1px solid var(--color-borde)',
                    borderRadius: '10px',
                    color: 'var(--color-texto)',
                    cursor: 'pointer',
                    fontSize: 'calc(var(--tamano-fuente) * 0.8125)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-fondo-card)'; }}
                  >
                    <Upload size={16} strokeWidth={1.5} style={{ marginRight: '6px' }} />
                    Taller
                    <input type="file" name="taller" onChange={handleSubirArchivo} style={{ display: 'none' }} />
                  </label>
                  <label style={{
                    padding: '8px 14px',
                    background: 'var(--color-fondo-card)',
                    border: '1px solid var(--color-borde)',
                    borderRadius: '10px',
                    color: 'var(--color-texto)',
                    cursor: 'pointer',
                    fontSize: 'calc(var(--tamano-fuente) * 0.8125)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-fondo-card)'; }}
                  >
                    <Upload size={16} strokeWidth={1.5} style={{ marginRight: '6px' }} />
                    Presentación
                    <input type="file" name="presentacion" onChange={handleSubirArchivo} style={{ display: 'none' }} />
                  </label>
                </div>

                {archivosSubidos.length > 0 && (
                  <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {archivosSubidos.map((arch, idx) => (
                      <span key={idx} style={{
                        padding: '4px 12px',
                        background: 'rgba(46,154,110,0.10)',
                        borderRadius: '8px',
                        fontSize: 'calc(var(--tamano-fuente) * 0.75)',
                        color: modoOscuro ? '#a8b3b0' : '#555',
                        border: '1px solid rgba(46,154,110,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <FileText size={14} strokeWidth={1.5} color="var(--color-primary)" />
                        {arch.nombre}
                        <button
                          onClick={() => eliminarArchivo(arch.nombre)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#e74c3c',
                            cursor: 'pointer',
                            padding: '0 4px',
                            fontSize: '16px'
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleAgregarClase}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, var(--color-primary), #2e9a6e)',
                  border: 'none',
                  borderRadius: '14px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontFamily: 'var(--fuente)',
                  fontSize: 'calc(var(--tamano-fuente) * 1)',
                  fontWeight: '600',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: '0 8px 32px rgba(46,154,110,0.25)',
                  marginTop: '8px',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(46,154,110,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(46,154,110,0.25)';
                }}
              >
                Crear clase
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default ClasesInstructor;