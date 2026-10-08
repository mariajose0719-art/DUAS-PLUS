import { 
  LayoutDashboard, 
  BookOpen, 
  Activity, 
  BarChart3, 
  Bot, 
  UserCircle, 
  Settings,
  LogOut,
  Languages,
  Calendar,
  Award,
  MessageSquare,
  Users,
  FileText,
  Building,
  TrendingUp,
  ClipboardList,
  Sparkles,
  UserCog,
  Eye,
  Smartphone
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar({ rol }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuItems = () => {
    const items = {
      aprendiz: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/aprendiz' },
        { icon: BookOpen, label: 'Mis clases', path: '/aprendiz/clases' },
        { icon: Calendar, label: 'Calendario', path: '/aprendiz/calendario' },
        { icon: Award, label: 'Mi progreso', path: '/aprendiz/progreso' },
        { icon: Bot, label: 'LAIA Chat', path: '/aprendiz/chat' },
        { icon: Languages, label: 'Traductor', path: '/aprendiz/traductor' },
        { icon: MessageSquare, label: 'Retroalimentación', path: '/aprendiz/retroalimentacion' },
        { icon: UserCircle, label: 'Mi perfil', path: '/aprendiz/perfil' },
        { icon: Settings, label: 'Configuración', path: '/aprendiz/configuracion' },
      ],
      instructor: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/instructor' },
        { icon: Users, label: 'Mis aprendices', path: '/instructor/aprendices' },
        { icon: FileText, label: 'Fichas', path: '/instructor/fichas' },
        { icon: ClipboardList, label: 'Clases', path: '/instructor/clases' },
        { icon: TrendingUp, label: 'Estadísticas', path: '/instructor/estadisticas' },
        { icon: Bot, label: 'IA asistente', path: '/instructor/ia' },
        { icon: Eye, label: 'Experiencia DUAS+', path: '/instructor/experiencia' },
        { icon: Settings, label: 'Configuración', path: '/instructor/configuracion' },
      ],
      administrador: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/administrador' },
        { icon: Users, label: 'Instructores', path: '/administrador/instructores' },
        { icon: Building, label: 'Programas', path: '/administrador/programas' },
        { icon: BarChart3, label: 'Estadísticas', path: '/administrador/estadisticas' },
        { icon: Bot, label: 'IA administrador', path: '/administrador/ia' },
        { icon: Settings, label: 'Configuración', path: '/administrador/configuracion' },
      ]
    };
    return items[rol] || items.aprendiz;
  };

  const menuItems = getMenuItems();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside style={{
      width: '260px',
      minHeight: '100vh',
      background: 'rgba(255, 255, 255, 0.04)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.06)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0 12px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        marginBottom: '24px'
      }}>
        <span style={{
          fontSize: '24px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #ffffff, #2e9a6e)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          DUAS+
        </span>
        <span style={{
          fontSize: '11px',
          padding: '2px 10px',
          background: 'rgba(255, 255, 255, 0.06)',
          borderRadius: '100px',
          color: '#6a7a75',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          textTransform: 'capitalize'
        }}>
          {rol}
        </span>
      </div>

      <nav style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        {menuItems.map((item, index) => {
          const active = isActive(item.path);
          return (
            <div
              key={index}
              onClick={() => handleNavigation(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                color: active ? '#edf2f0' : '#a8b3b0',
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: active ? '600' : '500',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                background: active ? 'rgba(46, 154, 110, 0.15)' : 'transparent',
                border: active ? '1px solid rgba(46, 154, 110, 0.2)' : '1px solid transparent',
                cursor: 'pointer',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.color = '#edf2f0';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#a8b3b0';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <item.icon size={20} strokeWidth={1.5} />
              {item.label}
              {active && (
                <span style={{
                  marginLeft: 'auto',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#2e9a6e',
                  boxShadow: '0 0 10px rgba(46, 154, 110, 0.5)'
                }}></span>
              )}
            </div>
          );
        })}
      </nav>

      <div style={{
        paddingTop: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        marginTop: 'auto'
      }}>
        <button
          onClick={() => navigate('/login')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            color: '#6a7a75',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 68, 68, 0.08)';
            e.currentTarget.style.color = '#ff6b6b';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#6a7a75';
          }}
        >
          <LogOut size={20} strokeWidth={1.5} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;