import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AvatarProvider } from './context/AvatarContext';
import AccessibilityToolbar from './components/AccessibilityToolbar';
import AvatarVideo from './components/AvatarVideo';

// ===== PÁGINAS PÚBLICAS =====
import Bienvenida from './pages/Bienvenida';
import Login from './pages/Login';

// ===== APRENDIZ =====
import DashboardAprendiz from './pages/DashboardAprendiz';
import MisClasesDb from './pages/MisClasesDb';
import Calendario from './pages/Calendario';
import MiProgreso from './pages/MiProgreso';
import Chat from './pages/Chat';
import Traductor from './pages/Traductor';
import Retroalimentacion from './pages/Retroalimentacion';
import MiPerfil from './pages/MiPerfil';
import Configuracion from './pages/Configuracion';
import ClaseDetalle from './pages/ClaseDetalle';

// ===== INSTRUCTOR =====
import DashboardInstructor from './pages/DashboardInstructor';
import MisAprendicesDb from './pages/MisAprendicesDb';
import FichasInstructorDb from './pages/FichasInstructorDb';
import ClasesInstructorDb from './pages/ClasesInstructorDb';
import EstadisticasInstructor from './pages/EstadisticasInstructor';
import IAInstructor from './pages/IAInstructor';
import ExperienciaDUA from './pages/ExperienciaDUA';
import ConfiguracionInstructor from './pages/ConfiguracionInstructor';

// ===== ADMINISTRADOR =====
import DashboardAdministrador from './pages/DashboardAdministrador';
import InstructoresAdminDb from './pages/InstructoresAdminDb';
import Programas from './pages/Programas';
import FichasAdmin from './pages/FichasAdmin';
import AprendicesAdminDb from './pages/AprendicesAdminDb';
import EstadisticasAdmin from './pages/EstadisticasAdmin';
import IAAdmin from './pages/IAAdmin';
import ConfiguracionAdmin from './pages/ConfiguracionAdmin';

function RutaProtegida({ roles }) {
  const [estado, setEstado] = useState('cargando');
  const [rolUsuario, setRolUsuario] = useState(null);

  useEffect(() => {
    let activa = true;
    fetch('/api/auth/me', { credentials: 'include' })
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error('Sin sesión');
        return respuesta.json();
      })
      .then((datos) => {
        if (!activa) return;
        setRolUsuario(datos.usuario?.rol || null);
        setEstado('autenticado');
      })
      .catch(() => {
        if (activa) setEstado('sin-sesion');
      });
    return () => { activa = false; };
  }, []);

  if (estado === 'cargando') return <p role="status">Verificando tu sesión…</p>;
  if (estado !== 'autenticado') return <Navigate to="/login" replace />;
  if (!roles.includes(rolUsuario)) return <Navigate to="/" replace />;
  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AccessibilityProvider>
          <AvatarProvider>
            <Routes>
              {/* Públicas */}
              <Route path="/" element={<Bienvenida />} />
              <Route path="/login" element={<Login />} />

              {/* Aprendiz */}
              <Route element={<RutaProtegida roles={['aprendiz']} />}>
                <Route path="/aprendiz" element={<DashboardAprendiz />} />
                <Route path="/aprendiz/clases" element={<MisClasesDb />} />
                <Route path="/aprendiz/calendario" element={<Calendario />} />
                <Route path="/aprendiz/progreso" element={<MiProgreso />} />
                <Route path="/aprendiz/chat" element={<Chat />} />
                <Route path="/aprendiz/traductor" element={<Traductor />} />
                <Route path="/aprendiz/retroalimentacion" element={<Retroalimentacion />} />
                <Route path="/aprendiz/perfil" element={<MiPerfil />} />
                <Route path="/aprendiz/configuracion" element={<Configuracion />} />
                <Route path="/aprendiz/clase/:id" element={<ClaseDetalle />} />
              </Route>

              {/* Instructor */}
              <Route element={<RutaProtegida roles={['instructor']} />}>
                <Route path="/instructor" element={<DashboardInstructor />} />
                <Route path="/instructor/aprendices" element={<MisAprendicesDb />} />
                <Route path="/instructor/fichas" element={<FichasInstructorDb />} />
                <Route path="/instructor/clases" element={<ClasesInstructorDb />} />
                <Route path="/instructor/estadisticas" element={<EstadisticasInstructor />} />
                <Route path="/instructor/ia" element={<IAInstructor />} />
                <Route path="/instructor/experiencia" element={<ExperienciaDUA />} />
                <Route path="/instructor/configuracion" element={<ConfiguracionInstructor />} />
              </Route>

              {/* Administrador */}
              <Route element={<RutaProtegida roles={['administrador']} />}>
                <Route path="/administrador" element={<DashboardAdministrador />} />
                <Route path="/administrador/instructores" element={<InstructoresAdminDb />} />
                <Route path="/administrador/aprendices" element={<AprendicesAdminDb />} />
                <Route path="/administrador/programas" element={<Programas />} />
                <Route path="/administrador/fichas" element={<FichasAdmin />} />
                <Route path="/administrador/estadisticas" element={<EstadisticasAdmin />} />
                <Route path="/administrador/ia" element={<IAAdmin />} />
                <Route path="/administrador/configuracion" element={<ConfiguracionAdmin />} />
              </Route>
            </Routes>

            {/* Componentes flotantes globales */}
            <AccessibilityToolbar />
            <AvatarVideo />
          </AvatarProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
