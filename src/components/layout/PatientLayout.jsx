import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/logo.png';
import { logoutUser } from '../../redux/slices/authSlice';

const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
};

const NAV_ITEMS = [
    { path: '/patient/dashboard',        icon: '🏠', label: 'Accueil' },
    { path: '/patient/appointments',     icon: '📅', label: 'Rendez-vous' },
    { path: '/patient/doctors',          icon: '👨‍⚕️', label: 'Médecins' },
    { path: '/patient/medical-record',   icon: '🗂️', label: 'Dossier médical' },
    { path: '/patient/prescriptions',    icon: '💊', label: 'Prescriptions' },
    { path: '/patient/messages',         icon: '💬', label: 'Messages' },
    { path: '/patient/payments',         icon: '💳', label: 'Paiements' },
    { path: '/patient/profile',          icon: '👤', label: 'Mon profil' },
];

const PatientLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f3ff', fontFamily: "'Inter', sans-serif" }}>

            {/* ── SIDEBAR ── */}
            <aside style={{
                width: sidebarOpen ? 240 : 70, flexShrink: 0,
                background: 'linear-gradient(180deg, #016472 0%, #004e5a 100%)',
                display: 'flex', flexDirection: 'column',
                transition: 'width 0.3s ease', overflow: 'hidden',
                position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 40,
            }}>
                {/* Logo */}
                <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center' }}>
{sidebarOpen && (
    <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
        <img src={logo} alt="Dokita" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
)}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: 'white', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {sidebarOpen ? '←' : '→'}
                    </button>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {NAV_ITEMS.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path} style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '11px 12px', borderRadius: 12, textDecoration: 'none',
                                background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                                color: active ? 'white' : 'rgba(255,255,255,0.7)',
                                fontWeight: active ? 600 : 400, fontSize: 14,
                                transition: 'all 0.2s', whiteSpace: 'nowrap',
                                borderLeft: active ? '3px solid #E8613A' : '3px solid transparent',
                            }}
                                onMouseEnter={e => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                                onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
                            >
                                <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                                {sidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Déconnexion */}
                <div style={{ padding: '16px 10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button onClick={handleLogout} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                        padding: '11px 12px', borderRadius: 12, border: 'none',
                        background: 'rgba(232,97,58,0.2)', color: '#ffb5a0',
                        cursor: 'pointer', fontSize: 14, fontFamily: 'inherit',
                        transition: 'background 0.2s', whiteSpace: 'nowrap',
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,97,58,0.35)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(232,97,58,0.2)'}
                    >
                        <span style={{ fontSize: 20, flexShrink: 0 }}>🚪</span>
                        {sidebarOpen && <span>Déconnexion</span>}
                    </button>
                </div>
            </aside>

            {/* ── CONTENU PRINCIPAL ── */}
            <div style={{ flex: 1, marginLeft: sidebarOpen ? 240 : 70, transition: 'margin-left 0.3s ease', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

                {/* Header */}
                <header style={{
                    position: 'sticky', top: 0, zIndex: 30,
                    background: 'white', borderBottom: '1px solid #e7eeff',
                    padding: '0 28px', height: 64,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
                }}>
                    <div>
                        <p style={{ fontSize: 11, color: '#6f797b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Espace Patient</p>
                        <h1 style={{ fontSize: 18, fontWeight: 800, color: '#016472', margin: 0 }}>
                            {NAV_ITEMS.find(n => n.path === location.pathname)?.label || 'Dashboard'}
                        </h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        {/* Notification */}
                        <button style={{ position: 'relative', background: '#f0f3ff', border: 'none', borderRadius: 12, width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 20 }}>
                            🔔
                            <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, background: '#E8613A', borderRadius: '50%', border: '2px solid white' }} />
                        </button>
                        {/* Avatar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f0f3ff', padding: '6px 14px 6px 6px', borderRadius: 12 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #016472, #2e7d8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
                                {user?.name?.[0]?.toUpperCase() || 'P'}
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111c2d' }}>{user?.name || 'Patient'}</p>
                                <p style={{ margin: 0, fontSize: 11, color: '#6f797b' }}>Patient</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main style={{ flex: 1, padding: 28 }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default PatientLayout;