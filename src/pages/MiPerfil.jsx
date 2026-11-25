import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Mail, MapPin, Calendar, ArrowLeft, Phone, CreditCard } from 'lucide-react';

const caja = { padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' };

export default function MiPerfil() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    fetch('/api/perfil', { credentials: 'include' })
      .then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.mensaje || 'No se pudo cargar tu perfil.'); return d; })
      .then((d) => setPerfil(d.perfil))
      .catch((e) => setError(e.message));
  }, []);
  const filas = perfil ? [
    { icon: Mail, etiqueta: 'Correo electrónico', valor: perfil.correo || 'No registrado' },
    { icon: CreditCard, etiqueta: perfil.tipo_documento || 'Documento', valor: perfil.numero_documento || 'No registrado' },
    { icon: Phone, etiqueta: 'Teléfono', valor: perfil.telefono || 'No registrado' },
    { icon: MapPin, etiqueta: 'Programa(s)', valor: perfil.programas || 'Sin programa activo' },
    { icon: Calendar, etiqueta: 'Ficha(s)', valor: perfil.fichas || 'Sin ficha activa' },
    { icon: UserCircle, etiqueta: 'Preferencia de accesibilidad', valor: perfil.preset_visual_dua || 'Sin preferencia configurada' },
  ] : [];
  return <main style={{ minHeight: '100vh', background: '#080c0a', color: '#edf2f0', padding: '32px clamp(18px, 5vw, 60px)' }}><div style={{ maxWidth: 900, margin: '0 auto' }}>
    <button onClick={() => navigate('/aprendiz')} style={{ ...caja, color: '#edf2f0', cursor: 'pointer', marginBottom: 24 }}><ArrowLeft size={17} style={{ verticalAlign: 'middle', marginRight: 8 }} />Volver al panel</button>
    <h1 style={{ fontSize: 32, margin: '0 0 20px' }}><UserCircle color="#2e9a6e" size={30} style={{ verticalAlign: 'middle', marginRight: 10 }} />Mi perfil</h1>
    {error && <p role="alert" style={{ background: '#512923', padding: 14, borderRadius: 10 }}>{error}</p>}
    {!perfil && !error ? <p>Cargando los datos de tu cuenta…</p> : perfil && <section style={{ ...caja, padding: 26 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}><div style={{ width: 74, height: 74, borderRadius: '50%', display: 'grid', placeItems: 'center', background: '#18794e', fontSize: 28, fontWeight: 700 }}>{`${perfil.nombres?.[0] || ''}${perfil.apellidos?.[0] || ''}`}</div><div><h2 style={{ margin: '0 0 4px' }}>{perfil.nombres} {perfil.apellidos}</h2><p style={{ color: '#a8b3b0', margin: 0 }}>{perfil.rol} · Cuenta {perfil.estado}</p></div></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12 }}>{filas.map(({ icon: Icon, etiqueta, valor }) => <div key={etiqueta} style={caja}><div style={{ color: '#91a099', fontSize: 13, marginBottom: 7 }}><Icon size={15} style={{ verticalAlign: 'middle', marginRight: 7 }} />{etiqueta}</div><div>{valor}</div></div>)}</div>
      <p style={{ color: '#91a099', marginBottom: 0, marginTop: 20 }}>Estos datos corresponden a la cuenta registrada por administración.</p>
    </section>}
  </div></main>;
}
