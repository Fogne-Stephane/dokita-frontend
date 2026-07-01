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
    { path: '/admin/dashboard',      icon: '🏠', label: 'Accueil' },
    { path: '/admin/users',          icon: '👥', label: 'Utilisateurs' },
    { path: '/admin/doctors',        icon: '👨‍⚕️', label: 'Médecins' },
    { path: '/admin/health-centers', icon: '🏥', label: 'Centres santé' },
    { path: '/admin/payments',       icon: '💰', label: 'Paiements' },
    { path: '/admin/settings',       icon: '⚙️', label: 'Paramètres' },
];

const AdminLayout = ({ children }) => {
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

            {/* SIDEBAR */}
            <aside style={{
                width: sidebarOpen ? 240 : 70, flexShrink: 0,
                background: 'linear-gradient(180deg, #111c2d 0%, #1e2d3d 100%)',
                display: 'flex', flexDirection: 'column',
                transition: 'width 0.3s ease', overflow: 'hidden',
                position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 40,
            }}>
                {/* Logo */}
                <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center' }}>
                    {sidebarOpen && (
    <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
        <img src={logo} alt="Dokita" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
)}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: 'white', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {sidebarOpen ? '←' : '→'}
                    </button>
                </div>

                {/* Badge admin */}
                {sidebarOpen && (
                    <div style={{ margin: '14px 12px', background: 'rgba(232,97,58,0.15)', border: '1px solid rgba(232,97,58,0.25)', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #E8613A, #E8913A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚙️</div>
                        <div>
                            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'white' }}>{user?.name}</p>
                            <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Administrateur</p>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {NAV_ITEMS.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path} style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '11px 12px', borderRadius: 12, textDecoration: 'none',
                                background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: active ? 'white' : 'rgba(255,255,255,0.6)',
                                fontWeight: active ? 600 : 400, fontSize: 14,
                                transition: 'all 0.2s', whiteSpace: 'nowrap',
                                borderLeft: active ? '3px solid #E8613A' : '3px solid transparent',
                            }}
                                onMouseEnter={e => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                                onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
                            >
                                <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                                {sidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Déconnexion */}
                <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <button onClick={handleLogout} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                        padding: '11px 12px', borderRadius: 12, border: 'none',
                        background: 'rgba(232,97,58,0.15)', color: '#ffb5a0',
                        cursor: 'pointer', fontSize: 14, fontFamily: 'inherit',
                        transition: 'background 0.2s', whiteSpace: 'nowrap',
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,97,58,0.3)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(232,97,58,0.15)'}
                    >
                        <span style={{ fontSize: 20, flexShrink: 0 }}>🚪</span>
                        {sidebarOpen && <span>Déconnexion</span>}
                    </button>
                </div>
            </aside>

            {/* CONTENU */}
            <div style={{ flex: 1, marginLeft: sidebarOpen ? 240 : 70, transition: 'margin-left 0.3s ease', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <header style={{
                    position: 'sticky', top: 0, zIndex: 30,
                    background: 'white', borderBottom: '1px solid #e7eeff',
                    padding: '0 28px', height: 64,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
                }}>
                    <div>
                        <p style={{ fontSize: 11, color: '#6f797b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Administration</p>
                        <h1 style={{ fontSize: 18, fontWeight: 800, color: '#111c2d', margin: 0 }}>
                            {NAV_ITEMS.find(n => n.path === location.pathname)?.label || 'Dashboard'}
                        </h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ background: '#f0f3ff', padding: '7px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#016472' }}>
                            📅 {new Date().toLocaleDateString('fr', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <button style={{ position: 'relative', background: '#f0f3ff', border: 'none', borderRadius: 12, width: 42, height: 42, cursor: 'pointer', fontSize: 20 }}>
                            🔔
                            <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, background: '#E8613A', borderRadius: '50%', border: '2px solid white' }} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#111c2d', padding: '6px 14px 6px 6px', borderRadius: 12 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #E8613A, #E8913A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
                                {user?.name?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'white' }}>{user?.name}</p>
                                <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Admin</p>
                            </div>
                        </div>
                    </div>
                </header>
                <main style={{ flex: 1, padding: 28 }}>{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;