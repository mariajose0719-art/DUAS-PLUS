import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Plus, 
  X, 
  ArrowLeft 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function Calendario() {
  const navigate = useNavigate();
  const { modoOscuro } = useTheme();
  const [mes, setMes] = useState(new Date().getMonth());
  const [año, setAño] = useState(new Date().getFullYear());
  const [eventos, setEventos] = useState([
    { fecha: 5, titulo: 'Clase en vivo', hora: '9:00 AM', lugar: 'Virtual' },
    { fecha: 7, titulo: 'Entrega Taller 2', hora: '11:59 PM', lugar: 'Plataforma' },
    { fecha: 12, titulo: 'Evaluación', hora: '10:00 AM', lugar: 'Aula 3' },
  ]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState({ titulo: '', fecha: '', hora: '', lugar: '' });

  const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const primerDia = new Date(año, mes, 1).getDay();
  const ultimoDia = new Date(año, mes + 1, 0).getDate();

  const cambiarMes = (delta) => {
    let nuevoMes = mes + delta;
    let nuevoAño = año;
    if (nuevoMes < 0) { nuevoMes = 11; nuevoAño--; }
    if (nuevoMes > 11) { nuevoMes = 0; nuevoAño++; }
    setMes(nuevoMes);
    setAño(nuevoAño);
  };

  const esHoy = (dia) => {
    const hoy = new Date();
    return hoy.getDate() === dia && hoy.getMonth() === mes && hoy.getFullYear() === año;
  };

  const getEventos = (dia) => eventos.filter(e => e.fecha === dia);

  const agregarEvento = () => {
    if (!nuevoEvento.titulo || !nuevoEvento.fecha) return;
    setEventos([...eventos, { ...nuevoEvento, fecha: parseInt(nuevoEvento.fecha) }]);
    setNuevoEvento({ titulo: '', fecha: '', hora: '', lugar: '' });
    setMostrarForm(false);
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
      {/* ===== FONDO ===== */}
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

      {/* ===== CONTENIDO ===== */}
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
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/aprendiz')}
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
          <CalendarIcon size={28} strokeWidth={1.5} color="var(--color-primary)" />
          <h1 style={{
            fontSize: 'calc(var(--tamano-fuente) * 1.75)',
            fontWeight: '700',
            margin: 0,
            color: 'var(--color-texto)',
            letterSpacing: '-0.5px'
          }}>
            Calendario
          </h1>
          <span style={{
            fontSize: 'calc(var(--tamano-fuente) * 0.875)',
            color: modoOscuro ? '#6a7a75' : '#888',
            marginLeft: 'auto'
          }}>
            {meses[mes]} {año}
          </span>
          <button
            onClick={() => setMostrarForm(true)}
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
            <Plus size={18} strokeWidth={1.5} />
            Agregar
          </button>
        </div>

        {/* Tarjeta del calendario */}
        <div style={{
          background: 'var(--color-fondo-card)',
          backdropFilter: 'blur(16px)',
          borderRadius: '24px',
          padding: '28px 32px',
          border: '1px solid var(--color-borde)',
          boxShadow: 'var(--sombra)',
          transition: 'all 0.3s ease'
        }}>
          {/* Navegación del mes */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <button
              onClick={() => cambiarMes(-1)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-texto)',
                opacity: 0.5,
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = 'var(--color-fondo-card)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.background = 'transparent'; }}
            >
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>
            <span style={{
              fontSize: 'calc(var(--tamano-fuente) * 1.125)',
              fontWeight: '600',
              color: 'var(--color-texto)'
            }}>
              {meses[mes]} {año}
            </span>
            <button
              onClick={() => cambiarMes(1)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-texto)',
                opacity: 0.5,
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = 'var(--color-fondo-card)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.background = 'transparent'; }}
            >
              <ChevronRight size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Días de la semana */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            {dias.map(d => (
              <div key={d} style={{
                fontSize: 'calc(var(--tamano-fuente) * 0.8125)',
                fontWeight: '600',
                color: modoOscuro ? '#6a7a75' : '#888',
                padding: '8px 0'
              }}>
                {d}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            textAlign: 'center'
          }}>
            {Array.from({ length: primerDia === 0 ? 6 : primerDia - 1 }).map((_, i) => (
              <div key={`empty-${i}`} style={{ padding: '8px' }} />
            ))}
            {Array.from({ length: ultimoDia }).map((_, i) => {
              const dia = i + 1;
              const hoy = esHoy(dia);
              const eventosDia = getEventos(dia);
              return (
                <div key={dia} style={{
                  padding: '8px 4px',
                  borderRadius: '12px',
                  background: hoy ? 'rgba(46,154,110,0.15)' : 'transparent',
                  border: hoy ? '1px solid rgba(46,154,110,0.3)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  cursor: 'default',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = hoy ? 'rgba(46,154,110,0.2)' : 'rgba(255,255,255,0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = hoy ? 'rgba(46,154,110,0.15)' : 'transparent';
                }}
                >
                  <div style={{
                    fontSize: 'calc(var(--tamano-fuente) * 0.9375)',
                    fontWeight: hoy ? '700' : '400',
                    color: hoy ? 'var(--color-primary)' : 'var(--color-texto)'
                  }}>
                    {dia}
                  </div>
                  {eventosDia.length > 0 && (
                    <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'center', gap: '4px' }}>
                      {eventosDia.map((_, idx) => (
                        <div key={idx} style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: 'var(--color-primary)',
                          boxShadow: '0 0 10px var(--color-primary)'
                        }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Eventos del día */}
          <div style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--color-borde)'
          }}>
            <h3 style={{
              fontSize: 'calc(var(--tamano-fuente) * 0.9375)',
              fontWeight: '600',
              marginBottom: '12px',
              color: 'var(--color-texto)'
            }}>
              Eventos del día
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {eventos.length === 0 ? (
                <p style={{ color: modoOscuro ? '#6a7a75' : '#888', fontSize: 'calc(var(--tamano-fuente) * 0.875)' }}>
                  No hay eventos programados.
                </p>
              ) : (
                eventos.map((e, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 16px',
                    background: 'var(--color-fondo-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-borde)'
                  }}>
                    <div style={{ width: '4px', height: '40px', borderRadius: '4px', background: 'var(--color-primary)' }} />
                    <div style={{ flex: 1 }}>
                      <span style={{
                        fontSize: 'calc(var(--tamano-fuente) * 0.875)',
                        fontWeight: '500',
                        color: 'var(--color-texto)'
                      }}>
                        {e.titulo}
                      </span>
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        marginTop: '4px',
                        fontSize: 'calc(var(--tamano-fuente) * 0.8125)',
                        color: modoOscuro ? '#6a7a75' : '#888'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} strokeWidth={1.5} /> {e.hora || '--:--'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} strokeWidth={1.5} /> {e.lugar || 'No especificado'}
                        </span>
                      </div>
                    </div>
                    <span style={{
                      fontSize: 'calc(var(--tamano-fuente) * 0.75)',
                      padding: '4px 12px',
                      borderRadius: '100px',
                      background: 'rgba(46,154,110,0.15)',
                      color: 'var(--color-primary)'
                    }}>
                      {e.fecha === new Date().getDate() ? 'Hoy' : `Día ${e.fecha}`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODAL DE CREAR EVENTO - CON COLORES CORREGIDOS ===== */}
      {mostrarForm && (
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
            padding: '36px 32px',
            maxWidth: '480px',
            width: '100%',
            border: '1px solid var(--color-borde)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
            boxSizing: 'border-box'
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
                <Plus size={22} strokeWidth={1.5} color="var(--color-primary)" />
                Agregar evento
              </h2>
              <button
                onClick={() => setMostrarForm(false)}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Título */}
              <div>
                <label style={{
                  fontSize: 'calc(var(--tamano-fuente) * 0.875)',
                  fontWeight: '500',
                  color: modoOscuro ? '#a8b3b0' : '#555',
                  display: 'block',
                  marginBottom: '6px'
                }}>
                  Título del evento *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Clase de programación"
                  value={nuevoEvento.titulo}
                  onChange={(e) => setNuevoEvento({...nuevoEvento, titulo: e.target.value})}
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

              {/* Fecha y Hora */}
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <label style={{
                    fontSize: 'calc(var(--tamano-fuente) * 0.875)',
                    fontWeight: '500',
                    color: modoOscuro ? '#a8b3b0' : '#555',
                    display: 'block',
                    marginBottom: '6px'
                  }}>
                    Día *
                  </label>
                  <input
                    type="number"
                    placeholder="1-31"
                    min="1"
                    max="31"
                    value={nuevoEvento.fecha}
                    onChange={(e) => setNuevoEvento({...nuevoEvento, fecha: e.target.value})}
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
                  <label style={{
                    fontSize: 'calc(var(--tamano-fuente) * 0.875)',
                    fontWeight: '500',
                    color: modoOscuro ? '#a8b3b0' : '#555',
                    display: 'block',
                    marginBottom: '6px'
                  }}>
                    Hora
                  </label>
                  <input
                    type="text"
                    placeholder="10:00 AM"
                    value={nuevoEvento.hora}
                    onChange={(e) => setNuevoEvento({...nuevoEvento, hora: e.target.value})}
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

              {/* Lugar */}
              <div>
                <label style={{
                  fontSize: 'calc(var(--tamano-fuente) * 0.875)',
                  fontWeight: '500',
                  color: modoOscuro ? '#a8b3b0' : '#555',
                  display: 'block',
                  marginBottom: '6px'
                }}>
                  Lugar
                </label>
                <input
                  type="text"
                  placeholder="Ej: Aula 3"
                  value={nuevoEvento.lugar}
                  onChange={(e) => setNuevoEvento({...nuevoEvento, lugar: e.target.value})}
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

              {/* Botón Agregar */}
              <button
                onClick={agregarEvento}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, var(--color-primary), #2e9a6e)',
                  border: 'none',
                  borderRadius: '14px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontFamily: 'var(--fuente)',
                  fontSize: 'calc(var(--tamano-fuente) * 1.0625)',
                  fontWeight: '600',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: '0 8px 32px rgba(46,154,110,0.25)',
                  marginTop: '4px',
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
                Agregar evento
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default Calendario;