import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  PlusCircle, 
  Users, 
  Calendar, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  X
} from 'lucide-react';

function Fichas() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [fichas, setFichas] = useState([
    { id: 1, nombre: 'Ficha 1234', programa: 'Tecnología en Desarrollo de Software', aprendices: 18, estado: 'Activa', fecha: '2024-02-01' },
    { id: 2, nombre: 'Ficha 5678', programa: 'Tecnología en Diseño', aprendices: 15, estado: 'Activa', fecha: '2024-03-15' },
    { id: 3, nombre: 'Ficha 9012', programa: 'Tecnología en Redes', aprendices: 20, estado: 'Inactiva', fecha: '2024-01-10' },
  ]);
  const [nuevaFicha, setNuevaFicha] = useState({ nombre: '', programa: '', estado: 'Activa' });

  const handleAgregar = () => {
    if (!nuevaFicha.nombre || !nuevaFicha.programa) return;
    setFichas([...fichas, { ...nuevaFicha, id: Date.now(), aprendices: 0, fecha: new Date().toISOString().split('T')[0] }]);
    setNuevaFicha({ nombre: '', programa: '', estado: 'Activa' });
    setMostrarForm(false);
  };

  const filtradas = fichas.filter(f => 
    f.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    f.programa.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0a0e0c',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* ===== FONDO DUAS+ ===== */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 80% 60% at 15% 20%, rgba(26, 122, 74, 0.18) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 85% 80%, rgba(26, 122, 74, 0.12) 0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 50% 50%, rgba(26, 122, 74, 0.06) 0%, transparent 50%),
          #080c0a
        `,
      }}>
        <div style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(140px)',
          opacity: 0.20,
          width: '500px',
          height: '500px',
          background: 'rgba(46, 154, 110, 0.12)',
          top: '-150px',
          right: '-100px'
        }} />
        <div style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(160px)',
          opacity: 0.15,
          width: '400px',
          height: '400px',
          background: 'rgba(46, 154, 110, 0.08)',
          bottom: '-120px',
          left: '-80px'
        }} />
        <div style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.10,
          width: '300px',
          height: '300px',
          background: 'rgba(46, 154, 110, 0.06)',
          top: '40%',
          left: '60%'
        }} />
      </div>

      {/* ===== CONTENIDO ===== */}
      <div style={{
        flex: 1,
        padding: '32px 40px',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '8px',
            flexWrap: 'wrap',
            animation: 'fadeInDown 0.6s ease-out forwards'
          }}>
            <button
              onClick={() => navigate('/instructor')}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                color: '#a8b3b0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                padding: '8px 16px',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = '#edf2f0';
                e.currentTarget.style.borderColor = 'rgba(46,154,110,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.color = '#a8b3b0';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
              Volver
            </button>
            <BookOpen size={28} strokeWidth={1.5} color="#2e9a6e" />
            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0, letterSpacing: '-0.5px', color: '#edf2f0' }}>
              Fichas
            </h1>
            <span style={{
              fontSize: '14px',
              color: '#6a7a75',
              marginLeft: 'auto',
              background: 'rgba(255,255,255,0.04)',
              padding: '4px 16px',
              borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              {filtradas.length} fichas
            </span>
            <button
              onClick={() => setMostrarForm(true)}
              style={{
                padding: '10px 22px',
                background: 'linear-gradient(135deg, #1a7a4a, #2e9a6e)',
                border: 'none',
                borderRadius: '14px',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                fontWeight: '600',
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
              Crear ficha
            </button>
          </div>
          <p style={{ 
            color: '#a8b3b0', 
            fontSize: '15px', 
            marginBottom: '28px', 
            marginLeft: '52px',
            letterSpacing: '-0.2px'
          }}>
            Administra las fichas de tus aprendices.
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '28px',
            flexWrap: 'wrap',
            background: 'rgba(255,255,255,0.04)',
            padding: '16px 20px',
            borderRadius: '18px',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
            animation: 'fadeInUp 0.6s ease-out 0.1s forwards',
            opacity: 0
          }}>
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255,255,255,0.04)',
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.06)',
              minWidth: '200px',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#2e9a6e'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
            >
              <Search size={18} strokeWidth={1.5} color="#6a7a75" />
              <input
                type="text"
                placeholder="Buscar ficha..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#edf2f0',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
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
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              color: '#a8b3b0',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = '#edf2f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.color = '#a8b3b0';
            }}
            >
              <Filter size={18} strokeWidth={1.5} />
              Filtrar
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
            animation: 'fadeInUp 0.6s ease-out 0.15s forwards',
            opacity: 0
          }}>
            {filtradas.map((ficha, index) => (
              <div key={ficha.id} style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '20px',
                padding: '22px 24px',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                animation: `slideUp 0.5s ease-out ${0.1 + index * 0.05}s forwards`,
                opacity: 0,
                transform: 'translateY(16px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(46,154,110,0.15)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.boxShadow = '0 12px 48px rgba(0,0,0,0.3)';
              }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      margin: 0,
                      color: '#edf2f0',
                      letterSpacing: '-0.3px'
                    }}>
                      {ficha.nombre}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#a8b3b0',
                      margin: '4px 0 0'
                    }}>
                      {ficha.programa}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '12px',
                    padding: '4px 14px',
                    borderRadius: '100px',
                    background: ficha.estado === 'Activa' ? 'rgba(46,154,110,0.12)' : 'rgba(231,76,60,0.12)',
                    color: ficha.estado === 'Activa' ? '#2e9a6e' : '#e74c3c',
                    fontWeight: '500',
                    border: `1px solid ${ficha.estado === 'Activa' ? 'rgba(46,154,110,0.15)' : 'rgba(231,76,60,0.15)'}`
                  }}>
                    {ficha.estado}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '16px',
                  fontSize: '13px',
                  color: '#6a7a75',
                  marginBottom: '16px'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={16} strokeWidth={1.5} />
                    {ficha.aprendices} aprendices
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={16} strokeWidth={1.5} />
                    {ficha.fecha}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => {}}
                    style={{
                      padding: '6px 16px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '10px',
                      color: '#a8b3b0',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '13px',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.color = '#edf2f0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.color = '#a8b3b0';
                    }}
                  >
                    <Eye size={16} strokeWidth={1.5} />
                    Ver
                  </button>
                  <button
                    onClick={() => {}}
                    style={{
                      padding: '6px 16px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '10px',
                      color: '#a8b3b0',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '13px',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(52,152,219,0.08)';
                      e.currentTarget.style.color = '#3498db';
                      e.currentTarget.style.borderColor = 'rgba(52,152,219,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.color = '#a8b3b0';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    }}
                  >
                    <Edit size={16} strokeWidth={1.5} />
                    Editar
                  </button>
                  <button
                    onClick={() => {}}
                    style={{
                      padding: '6px 16px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '10px',
                      color: '#a8b3b0',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '13px',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(231,76,60,0.08)';
                      e.currentTarget.style.color = '#e74c3c';
                      e.currentTarget.style.borderColor = 'rgba(231,76,60,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.color = '#a8b3b0';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    }}
                  >
                    <Trash2 size={16} strokeWidth={1.5} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            {filtradas.length === 0 && (
              <div style={{
                gridColumn: '1 / -1',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '24px',
                padding: '56px',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <BookOpen size={48} strokeWidth={1.5} color="#6a7a75" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#a8b3b0', margin: 0 }}>No hay fichas creadas</h3>
                <p style={{ color: '#6a7a75', marginTop: '8px' }}>Haz clic en "Crear ficha" para empezar.</p>
              </div>
            )}
          </div>
        </div>
      </div>

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
            background: 'rgba(20,24,22,0.95)',
            borderRadius: '28px',
            padding: '40px',
            maxWidth: '480px',
            width: '100%',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '28px'
            }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: '700',
                margin: 0,
                color: '#edf2f0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <PlusCircle size={22} strokeWidth={1.5} color="#2e9a6e" />
                Nueva ficha
              </h2>
              <button
                onClick={() => setMostrarForm(false)}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  color: '#6a7a75',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = '#edf2f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = '#6a7a75';
                }}
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#a8b3b0', display: 'block', marginBottom: '6px' }}>
                  Nombre de la ficha *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Ficha 1234"
                  value={nuevaFicha.nombre}
                  onChange={(e) => setNuevaFicha({...nuevaFicha, nombre: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    color: '#edf2f0',
                    fontSize: '15px',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#2e9a6e'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#a8b3b0', display: 'block', marginBottom: '6px' }}>
                  Programa *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Tecnología en Desarrollo de Software"
                  value={nuevaFicha.programa}
                  onChange={(e) => setNuevaFicha({...nuevaFicha, programa: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    color: '#edf2f0',
                    fontSize: '15px',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#2e9a6e'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#a8b3b0', display: 'block', marginBottom: '6px' }}>
                  Estado
                </label>
                <select
                  value={nuevaFicha.estado}
                  onChange={(e) => setNuevaFicha({...nuevaFicha, estado: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    color: '#edf2f0',
                    fontSize: '15px',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#2e9a6e'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                >
                  <option value="Activa">Activa</option>
                  <option value="Inactiva">Inactiva</option>
                </select>
              </div>
              <button
                onClick={handleAgregar}
                style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, #1a7a4a, #2e9a6e)',
                  border: 'none',
                  borderRadius: '14px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '17px',
                  fontWeight: '600',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: '0 8px 32px rgba(46,154,110,0.2)',
                  marginTop: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(46,154,110,0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(46,154,110,0.2)';
                }}
              >
                Crear ficha
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
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

export default Fichas;