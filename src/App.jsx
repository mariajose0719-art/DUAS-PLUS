import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AvatarProvider } from './context/AvatarContext';
import AccessibilityToolbar from './components/AccessibilityToolbar';
import AvatarVideo from './components/AvatarVideo';

// ===== PÚBLICAS =====
import Bienvenida from './pages/Bienvenida';
import Login from './pages/Login';

// ===== APRENDIZ =====
import DashboardAprendiz from './pages/DashboardAprendiz';
import MisClases from './pages/MisClases';
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
import MisAprendices from './pages/MisAprendices';
import Fichas from './pages/Fichas';
import ClasesInstructor from './pages/ClasesInstructor';
import EstadisticasInstructor from './pages/EstadisticasInstructor';
import IAInstructor from './pages/IAInstructor';
import ExperienciaDUA from './pages/ExperienciaDUA';
import ConfiguracionInstructor from './pages/ConfiguracionInstructor';

// ===== ADMINISTRADOR =====
import DashboardAdministrador from './pages/DashboardAdministrador';
import InstructoresAdmin from './pages/InstructoresAdmin';
import Programas from './pages/Programas';
import EstadisticasAdmin from './pages/EstadisticasAdmin';
import IAAdmin from './pages/IAAdmin';
import ConfiguracionAdmin from './pages/ConfiguracionAdmin';

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
              <Route path="/aprendiz" element={<DashboardAprendiz />} />
              <Route path="/aprendiz/clases" element={<MisClases />} />
              <Route path="/aprendiz/calendario" element={<Calendario />} />
              <Route path="/aprendiz/progreso" element={<MiProgreso />} />
              <Route path="/aprendiz/chat" element={<Chat />} />
              <Route path="/aprendiz/traductor" element={<Traductor />} />
              <Route path="/aprendiz/retroalimentacion" element={<Retroalimentacion />} />
              <Route path="/aprendiz/perfil" element={<MiPerfil />} />
              <Route path="/aprendiz/configuracion" element={<Configuracion />} />
              <Route path="/aprendiz/clase/:id" element={<ClaseDetalle />} />

              {/* Instructor */}
              <Route path="/instructor" element={<DashboardInstructor />} />
              <Route path="/instructor/aprendices" element={<MisAprendices />} />
              <Route path="/instructor/fichas" element={<Fichas />} />
              <Route path="/instructor/clases" element={<ClasesInstructor />} />
              <Route path="/instructor/estadisticas" element={<EstadisticasInstructor />} />
              <Route path="/instructor/ia" element={<IAInstructor />} />
              <Route path="/instructor/experiencia" element={<ExperienciaDUA />} />
              <Route path="/instructor/configuracion" element={<ConfiguracionInstructor />} />

              {/* Administrador */}
              <Route path="/administrador" element={<DashboardAdministrador />} />
              <Route path="/administrador/instructores" element={<InstructoresAdmin />} />
              <Route path="/administrador/programas" element={<Programas />} />
              <Route path="/administrador/estadisticas" element={<EstadisticasAdmin />} />
              <Route path="/administrador/ia" element={<IAAdmin />} />
              <Route path="/administrador/configuracion" element={<ConfiguracionAdmin />} />
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