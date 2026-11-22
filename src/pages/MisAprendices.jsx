import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  UserCog,
  ArrowLeft,
  PlusCircle,
  Bot,
  Sparkles,
  X,
  Check,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function MisAprendices() {
  const navigate = useNavigate();
  const { modoOscuro } = useTheme();
  const [busqueda, setBusqueda] = useState('');
  const [modalPermisos, setModalPermisos] = useState(null); // id del aprendiz seleccionado
  const [permisosTemp, setPermisosTemp] = useState([]);

  const aprendices = [
    { 
      id: 1, 
      nombre: 'María González', 
      email: 'maria.g@email.com',
      ficha: 'Ficha 1234',
      perfil: 'Dislexia',
      progreso: 92,
      estado: 'Activo',
      permisos: ['IA', 'Avatar', 'Lector de voz', 'Traductor']
    },
    { 
      id: 2, 
      nombre: 'Carlos Pérez', 
      email: 'carlos.p@email.com',
      ficha: 'Ficha 1234',
      perfil: 'TDAH',
      progreso: 78,
      estado: 'Activo',
      permisos: ['IA', 'Modo calma', 'Recordatorios']
    },
    { 
      id: 3, 
      nombre: 'Ana Martínez', 
      email: 'ana.m@email.com',
      ficha: 'Ficha 5678',
      perfil: 'Baja visión',
      progreso: 45,
      estado: 'Inactivo',
      permisos: ['Lector de voz', 'Alto contraste', 'Lupa']
    },
    { 
      id: 4, 
      nombre: 'Luis Rodríguez', 
      email: 'luis.r@email.com',
      ficha: 'Ficha 5678',
      perfil: 'Auditiva',
      progreso: 63,
      estado: 'Activo',
      permisos: ['Subtítulos', 'Avatar en señas', 'Transcripción']
    },
    { 
      id: 5, 
      nombre: 'Laura Sánchez', 
      email: 'laura.s@email.com',
      ficha: 'Ficha 1234',
      perfil: 'TEA',
      progreso: 81,
      estado: 'Activo',
      permisos: ['Modo no molestar', 'Rutinas', 'Pictogramas']
    },
  ];

  const todasOpciones = ['IA', 'Avatar', 'Lector de voz', 'Traductor', 'Modo calma', 'Recordatorios', 'Alto contraste', 'Lupa', 'Subtítulos', 'Avatar en señas', 'Transcripción', 'Modo no molestar', 'Rutinas', 'Pictogramas'];

  const filtrados = aprendices.filter(a => 
    a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.ficha.toLowerCase().includes(busqueda.toLowerCase())
  );

  const getPerfilColor = (perfil) => {
    const colores = {
      'Dislexia': '#e67e22',
      'TDAH': '#9b59b6',
      'Baja visión': '#3498db',
      'Auditiva': '#e74c3c',
      'TEA': '#1abc9c',
    };
    return colores[perfil] || '#6a7a75';
  };

  const getPerfilBg = (perfil) => {
    const colores = {
      'Dislexia': 'rgba(230,126,34,0.12)',
      'TDAH': 'rgba(155,89,182,0.12)',
      'Baja visión': 'rgba(52,152,219,0.12)',
      'Auditiva': 'rgba(231,76,60,0.12)',
      'TEA': 'rgba(26,188,156,0.12)',
    };
    return colores[perfil] || 'rgba(255,255,255,0.04)';
  };

  const abrirPermisos = (aprendiz) => {
    setPermisosTemp([...aprendiz.permisos]);
    setModalPermisos(aprendiz.id);
  };

  const togglePermiso = (permiso) => {
    setPermisosTemp(prev => 
      prev.includes(permiso) ? prev.filter(p => p !== permiso) : [...prev, permiso]
    );
  };

  const guardarPermisos = () => {
    // Aquí iría la lógica para guardar los permisos en el backend
    alert('Permisos actualizados correctamente');
    setModalPermisos(null);
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
          <Users size={28} strokeWidth={1.5} color="var(--color-primary)" />
          <h1 style={{
            fontSize: 'calc(var(--tamano-fuente) * 1.75)',
            fontWeight: '700',
            margin: 0,
            color: 'var(--color-texto)',
            letterSpacing: '-0.5px'
          }}>
            Mis aprendices
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
            {filtrados.length} aprendices
          </span>
          <button
            onClick={() => alert('Funcionalidad de agregar aprendiz (simulada)')}
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
            Agregar
          </button>
        </div>
        <p style={{ 
          color: modoOscuro ? '#a8b3b0' : '#555', 
          fontSize: 'calc(var(--tamano-fuente) * 0.9375)', 
          marginBottom: '28px', 
          marginLeft: '52px',
          letterSpacing: '-0.2px'
        }}>
          Gestiona tus aprendices y sus perfiles de accesibilidad.
        </p>

        {/* Búsqueda y filtros */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '28px',
          flexWrap: 'wrap',
          background: 'var(--color-fondo-card)',
          padding: '16px 20px',
          borderRadius: '18px',
          border: '1px solid var(--color-borde)',
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255,255,255,0.04)',
            padding: '10px 16px',
            borderRadius: '12px',
            border: '1px solid var(--color-borde)',
            minWidth: '200px',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-borde)'}
          >
            <Search size={18} strokeWidth={1.5} color="#6a7a75" />
            <input
              type="text"
              placeholder="Buscar aprendiz..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-texto)',
                fontFamily: 'var(--fuente)',
                fontSize: 'var(--tamano-fuente)',
                outline: 'none',
                width: '100%'
              }}
            />
          </div>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--color-borde)',
            borderRadius: '12px',
            color: 'var(--color-texto)',
            cursor: 'pointer',
            fontFamily: 'var(--fuente)',
            fontSize: 'calc(var(--tamano-fuente) * 0.875)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          }}
          >
            <Filter size={18} strokeWidth={1.5} />
            Filtrar
          </button>
        </div>

        {/* Lista de aprendices */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          {filtrados.map((aprendiz, index) => (
            <div key={aprendiz.id} style={{
              background: 'var(--color-fondo-card)',
              backdropFilter: 'blur(16px)',
              borderRadius: '20px',
              padding: '22px 28px',
              border: '1px solid var(--color-borde)',
              boxShadow: 'var(--sombra)',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
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
                gap: '14px'
              }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    marginBottom: '4px'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${getPerfilColor(aprendiz.perfil)}, ${getPerfilColor(aprendiz.perfil)}dd)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#fff',
                      boxShadow: `0 4px 16px ${getPerfilColor(aprendiz.perfil)}33`
                    }}>
                      {aprendiz.nombre.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: 'calc(var(--tamano-fuente) * 1.125)',
                        fontWeight: '600',
                        margin: 0,
                        color: 'var(--color-texto)',
                        letterSpacing: '-0.3px'
                      }}>
                        {aprendiz.nombre}
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '12px',
                        fontSize: 'calc(var(--tamano-fuente) * 0.8125)',
                        color: modoOscuro ? '#6a7a75' : '#888',
                        marginTop: '2px'
                      }}>
                        <span>{aprendiz.email}</span>
                        <span>•</span>
                        <span style={{ color: 'var(--color-texto)' }}>{aprendiz.ficha}</span>
                        <span>•</span>
                        <span style={{
                          color: aprendiz.estado === 'Activo' ? 'var(--color-primary)' : '#e74c3c',
                          fontWeight: '500'
                        }}>
                          {aprendiz.estado}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    textAlign: 'center',
                    minWidth: '60px'
                  }}>
                    <div style={{
                      fontSize: 'calc(var(--tamano-fuente) * 1.375)',
                      fontWeight: '700',
                      color: aprendiz.progreso > 70 ? 'var(--color-primary)' : aprendiz.progreso > 40 ? '#f39c12' : '#e74c3c',
                      letterSpacing: '-0.5px'
                    }}>
                      {aprendiz.progreso}%
                    </div>
                    <div style={{ fontSize: 'calc(var(--tamano-fuente) * 0.6875)', color: modoOscuro ? '#6a7a75' : '#888' }}>Progreso</div>
                  </div>

                  <div style={{
                    padding: '4px 14px',
                    borderRadius: '100px',
                    background: getPerfilBg(aprendiz.perfil),
                    border: `1px solid ${getPerfilColor(aprendiz.perfil)}20`,
                    fontSize: 'calc(var(--tamano-fuente) * 0.75)',
                    color: getPerfilColor(aprendiz.perfil),
                    fontWeight: '500',
                    textAlign: 'center'
                  }}>
                    {aprendiz.perfil}
                  </div>

                  <button
                    onClick={() => abrirPermisos(aprendiz)}
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
                      e.currentTarget.style.borderColor = 'rgba(46,154,110,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.borderColor = 'var(--color-borde)';
                    }}
                  >
                    <UserCog size={16} strokeWidth={1.5} />
                    Permisos
                  </button>

                  <button
                    onClick={() => navigate(`/instructor/aprendiz/${aprendiz.id}`)}
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
                      e.currentTarget.style.borderColor = 'rgba(46,154,110,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.borderColor = 'var(--color-borde)';
                    }}
                  >
                    <Eye size={16} strokeWidth={1.5} />
                    Ver
                  </button>
                </div>
              </div>

              {/* Permisos activos */}
              <div style={{
                marginTop: '14px',
                paddingTop: '14px',
                borderTop: '1px solid var(--color-borde)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: 'calc(var(--tamano-fuente) * 0.75)',
                  color: modoOscuro ? '#6a7a75' : '#888',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Bot size={14} strokeWidth={1.5} />
                  Herramientas activas:
                </span>
                {aprendiz.permisos.map((permiso, idx) => (
                  <span key={idx} style={{
                    fontSize: 'calc(var(--tamano-fuente) * 0.6875)',
                    padding: '4px 14px',
                    background: 'rgba(46,154,110,0.08)',
                    borderRadius: '100px',
                    color: modoOscuro ? '#a8b3b0' : '#555',
                    border: '1px solid rgba(46,154,110,0.06)'
                  }}>
                    {permiso}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de permisos */}
      {modalPermisos !== null && (
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
            maxWidth: '500px',
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
                <UserCog size={22} strokeWidth={1.5} color="var(--color-primary)" />
                Gestionar permisos
              </h2>
              <button
                onClick={() => setModalPermisos(null)}
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

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginBottom: '24px'
            }}>
              {todasOpciones.map((opcion) => (
                <div
                  key={opcion}
                  onClick={() => togglePermiso(opcion)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: permisosTemp.includes(opcion) ? 'rgba(46,154,110,0.12)' : 'var(--color-fondo-card)',
                    border: permisosTemp.includes(opcion) ? '1px solid var(--color-primary)' : '1px solid var(--color-borde)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    color: 'var(--color-texto)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    if (!permisosTemp.includes(opcion)) {
                      e.currentTarget.style.background = 'var(--color-fondo-card)';
                    }
                  }}
                >
                  <span style={{ fontSize: 'calc(var(--tamano-fuente) * 0.8125)' }}>{opcion}</span>
                  {permisosTemp.includes(opcion) && <Check size={16} strokeWidth={2} color="var(--color-primary)" style={{ marginLeft: 'auto' }} />}
                </div>
              ))}
            </div>

            <button
              onClick={guardarPermisos}
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
              Guardar cambios
            </button>
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

export default MisAprendices;