import { Link } from 'react-router-dom';

const KpiCard = ({ icon, value, label, color, trend }) => (
    <div style={{ background: 'white', borderRadius: 16, padding: 22, border: '1px solid #e7eeff', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{icon}</div>
        <div style={{ flex: 1 }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#111c2d', margin: 0 }}>{value}</p>
            <p style={{ fontSize: 13, color: '#6f797b', margin: 0 }}>{label}</p>
        </div>
        {trend && <span style={{ fontSize: 12, fontWeight: 700, color: trend > 0 ? '#16a34a' : '#dc2626', background: trend > 0 ? '#dcfce7' : '#fee2e2', padding: '4px 10px', borderRadius: 8 }}>
            {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
        </span>}
    </div>
);

const AdminHome = () => {
    const alerts = [
        { type: 'warning', text: '3 médecins en attente de validation', link: '/admin/doctors' },
        { type: 'info',    text: '12 nouveaux patients inscrits aujourd\'hui', link: '/admin/users' },
        { type: 'success', text: '47 consultations réalisées aujourd\'hui', link: '/admin/payments' },
    ];

    const recentUsers = [
        { name: 'M. Talla Jean',    role: 'Patient',  date: 'Il y a 5 min',  status: 'active' },
        { name: 'Dr. Kamga Pierre', role: 'Médecin',  date: 'Il y a 12 min', status: 'pending' },
        { name: 'Mme Eboa Claire',  role: 'Patient',  date: 'Il y a 1h',     status: 'active' },
        { name: 'Dr. Mballa Sophie',role: 'Médecin',  date: 'Il y a 2h',     status: 'active' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Bannière */}
            <div style={{ background: 'linear-gradient(135deg, #111c2d 0%, #1e2d3d 100%)', borderRadius: 20, padding: '28px 32px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -40, top: -40, width: 220, height: 220, background: '#E8613A', borderRadius: '50%', opacity: 0.08 }} />
                <div style={{ position: 'absolute', right: 60, bottom: -60, width: 180, height: 180, background: '#016472', borderRadius: '50%', opacity: 0.15 }} />
                <h2 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 800 }}>Tableau de bord — Administration</h2>
                <p style={{ margin: 0, opacity: 0.7, fontSize: 14 }}>Vue d'ensemble de la plateforme Dokita • {new Date().toLocaleDateString('fr', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>

            {/* Alertes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {alerts.map((a, i) => (
                    <Link key={i} to={a.link} style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
                        borderRadius: 12, textDecoration: 'none',
                        background: a.type === 'warning' ? '#fef9c3' : a.type === 'info' ? '#e7eeff' : '#dcfce7',
                        border: `1px solid ${a.type === 'warning' ? '#fde047' : a.type === 'info' ? '#c7d2fe' : '#86efac'}`,
                        transition: 'opacity 0.2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        <span style={{ fontSize: 18 }}>{a.type === 'warning' ? '⚠️' : a.type === 'info' ? 'ℹ️' : '✅'}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#111c2d', flex: 1 }}>{a.text}</span>
                        <span style={{ fontSize: 13, color: '#6f797b' }}>Voir →</span>
                    </Link>
                ))}
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <KpiCard icon="👥" value="1 247" label="Patients inscrits"     color="#016472" trend={12} />
                <KpiCard icon="👨‍⚕️" value="89"    label="Médecins actifs"      color="#E8613A" trend={5}  />
                <KpiCard icon="📅" value="3 891" label="Consultations totales" color="#22c55e" trend={18} />
                <KpiCard icon="💰" value="12.4M" label="Revenus XAF (mois)"   color="#8b5cf6" trend={9}  />
            </div>

            {/* Contenu */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>

                {/* Activité récente */}
                <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e7eeff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111c2d' }}>🕐 Nouveaux inscrits</h3>
                        <Link to="/admin/users" style={{ fontSize: 13, color: '#016472', fontWeight: 600, textDecoration: 'none' }}>Voir tout →</Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {recentUsers.map((u, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < recentUsers.length - 1 ? '1px solid #f0f3ff' : 'none' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: u.role === 'Médecin' ? 'linear-gradient(135deg, #E8613A, #E8913A)' : 'linear-gradient(135deg, #016472, #2e7d8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 15 }}>
                                    {u.name.split(' ').pop()[0]}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 14, color: '#111c2d' }}>{u.name}</p>
                                    <p style={{ margin: 0, fontSize: 12, color: '#6f797b' }}>{u.role} • {u.date}</p>
                                </div>
                                <span style={{ background: u.status === 'active' ? '#dcfce7' : '#fef9c3', color: u.status === 'active' ? '#16a34a' : '#ca8a04', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                                    {u.status === 'active' ? '✅ Actif' : '⏳ En attente'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions rapides */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ background: 'white', borderRadius: 16, padding: 22, border: '1px solid #e7eeff' }}>
                        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#111c2d' }}>⚡ Actions rapides</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[
                                { to: '/admin/doctors',        icon: '👨‍⚕️', label: 'Valider médecins (3)',  color: '#E8613A', bg: '#fff4f0' },
                                { to: '/admin/users',          icon: '👥',  label: 'Gérer utilisateurs',    color: '#016472', bg: '#f0f3ff' },
                                { to: '/admin/health-centers', icon: '🏥',  label: 'Centres de santé',      color: '#8b5cf6', bg: '#f5f3ff' },
                                { to: '/admin/payments',       icon: '💰',  label: 'Transactions du jour',  color: '#22c55e', bg: '#f0fdf4' },
                            ].map((item, i) => (
                                <Link key={i} to={item.to} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: item.bg, borderRadius: 12, textDecoration: 'none', transition: 'transform 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: item.color }}>{item.label}</span>
                                    <span style={{ marginLeft: 'auto', color: item.color }}>→</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Santé système */}
                    <div style={{ background: 'linear-gradient(135deg, #111c2d, #1e2d3d)', borderRadius: 16, padding: 22, color: 'white' }}>
                        <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700 }}>🖥️ Santé système</h3>
                        {[
                            { label: 'Serveur API',   value: 99.9, color: '#4ade80' },
                            { label: 'Base de données', value: 98.5, color: '#4ade80' },
                            { label: 'Stockage',      value: 67,   color: '#fbbf24' },
                        ].map((s, i) => (
                            <div key={i} style={{ marginBottom: i < 2 ? 12 : 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                    <span style={{ fontSize: 13, opacity: 0.8 }}>{s.label}</span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}%</span>
                                </div>
                                <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                                    <div style={{ height: '100%', width: `${s.value}%`, background: s.color, borderRadius: 3 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;