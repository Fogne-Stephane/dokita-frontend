import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const StatCard = ({ icon, value, label, color }) => (
    <div style={{ background: 'white', borderRadius: 16, padding: 20, border: '1px solid #e7eeff', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{icon}</div>
        <div>
            <p style={{ fontSize: 26, fontWeight: 800, color: '#111c2d', margin: 0 }}>{value}</p>
            <p style={{ fontSize: 13, color: '#6f797b', margin: 0 }}>{label}</p>
        </div>
    </div>
);

const PatientHome = () => {
    const { user } = useSelector((state) => state.auth);
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Bannière de bienvenue */}
            <div style={{ background: 'linear-gradient(135deg, #016472 0%, #004e5a 100%)', borderRadius: 20, padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, background: '#E8613A', borderRadius: '50%', opacity: 0.1 }} />
                <div>
                    <p style={{ margin: '0 0 4px', opacity: 0.75, fontSize: 14 }}>{greeting} 👋</p>
                    <h2 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800 }}>{user?.name || 'Patient'}</h2>
                    <p style={{ margin: 0, opacity: 0.8, fontSize: 14 }}>Votre prochain rendez-vous est dans <strong>2 jours</strong></p>
                </div>
                <Link to="/patient/appointments" style={{ background: 'linear-gradient(90deg, #E8613A, #E8913A)', padding: '12px 24px', borderRadius: 12, color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 14px rgba(232,97,58,0.4)', whiteSpace: 'nowrap' }}>
                    Prendre RDV
                </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <StatCard icon="📅" value="3"  label="Rendez-vous à venir"  color="#016472" />
                <StatCard icon="✅" value="12" label="Consultations totales" color="#22c55e" />
                <StatCard icon="💊" value="2"  label="Prescriptions actives" color="#E8613A" />
                <StatCard icon="🗂️" value="5"  label="Documents médicaux"   color="#8b5cf6" />
            </div>

            {/* Contenu principal */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                {/* Prochain RDV */}
                <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e7eeff' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111c2d', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        📅 Prochains rendez-vous
                    </h3>
                    {[
                        { doctor: 'Dr. Kamga Pierre', spec: 'Cardiologue', date: '10 Juin 2026', heure: '10h00', type: 'Vidéo' },
                        { doctor: 'Dr. Mballa Sophie', spec: 'Pédiatre',    date: '15 Juin 2026', heure: '14h30', type: 'Vidéo' },
                    ].map((rdv, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i === 0 ? '1px solid #f0f3ff' : 'none' }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #016472, #2e7d8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20 }}>👨‍⚕️</div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#111c2d' }}>{rdv.doctor}</p>
                                <p style={{ margin: 0, fontSize: 12, color: '#6f797b' }}>{rdv.spec} • {rdv.date} à {rdv.heure}</p>
                            </div>
                            <span style={{ background: '#e7eeff', color: '#016472', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>{rdv.type}</span>
                        </div>
                    ))}
                    <Link to="/patient/appointments" style={{ display: 'block', textAlign: 'center', marginTop: 16, color: '#016472', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                        Voir tous les rendez-vous →
                    </Link>
                </div>

                {/* Activité récente */}
                <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e7eeff' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111c2d', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        🕐 Activité récente
                    </h3>
                    {[
                        { icon: '💊', text: 'Ordonnance reçue',        sub: 'Dr. Fongang • il y a 2 jours',   color: '#E8613A' },
                        { icon: '✅', text: 'Consultation terminée',   sub: 'Dr. Kamga • il y a 5 jours',     color: '#22c55e' },
                        { icon: '🗂️', text: 'Document ajouté',         sub: 'Analyse sanguine • il y a 1 sem', color: '#8b5cf6' },
                        { icon: '💬', text: 'Message de votre médecin', sub: 'Dr. Mballa • il y a 1 sem',      color: '#016472' },
                    ].map((a, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: i < 3 ? '1px solid #f0f3ff' : 'none' }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: a.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{a.icon}</div>
                            <div>
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111c2d' }}>{a.text}</p>
                                <p style={{ margin: 0, fontSize: 12, color: '#6f797b' }}>{a.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Accès rapide */}
                <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e7eeff' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111c2d', margin: '0 0 18px' }}>⚡ Accès rapide</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {[
                            { to: '/patient/doctors',        icon: '👨‍⚕️', label: 'Trouver un médecin', color: '#016472' },
                            { to: '/patient/prescriptions',  icon: '💊',  label: 'Mes prescriptions',  color: '#E8613A' },
                            { to: '/patient/medical-record', icon: '🗂️', label: 'Dossier médical',     color: '#8b5cf6' },
                            { to: '/patient/messages',       icon: '💬',  label: 'Messages',            color: '#22c55e' },
                        ].map((item, i) => (
                            <Link key={i} to={item.to} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px', background: item.color + '0f', borderRadius: 12, textDecoration: 'none', border: `1px solid ${item.color}22`, transition: 'transform 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <span style={{ fontSize: 22 }}>{item.icon}</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: item.color }}>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Santé du jour */}
                <div style={{ background: 'linear-gradient(135deg, #E8613A 0%, #E8913A 100%)', borderRadius: 16, padding: 24, color: 'white' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 14px' }}>💡 Conseil santé du jour</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.95, margin: '0 0 20px' }}>
                        Boire au moins <strong>1,5 à 2 litres d'eau</strong> par jour est essentiel pour maintenir votre corps hydraté, surtout par les chaleurs de Douala.
                    </p>
                    <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>🤖</span>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>Powered by Dokita AI</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientHome;