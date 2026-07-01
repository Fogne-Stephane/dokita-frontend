import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StatCard = ({ icon, value, label, color, sub }) => (
    <div style={{ background: 'white', borderRadius: 16, padding: 22, border: '1px solid #e7eeff', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{icon}</div>
        <div>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#111c2d', margin: 0 }}>{value}</p>
            <p style={{ fontSize: 13, color: '#6f797b', margin: 0 }}>{label}</p>
            {sub && <p style={{ fontSize: 11, color: color, fontWeight: 600, margin: '2px 0 0' }}>{sub}</p>}
        </div>
    </div>
);

const DoctorHome = () => {
    const { user } = useSelector((state) => state.auth);
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

    const todayRdv = [
        { id: 1, patient: 'M. Talla Jean',    motif: 'Contrôle tension',    heure: '09h00', type: 'Vidéo',      status: 'confirmed' },
        { id: 2, patient: 'Mme Eboa Claire',  motif: 'Douleurs thoraciques', heure: '10h30', type: 'Vidéo',      status: 'confirmed' },
        { id: 3, patient: 'M. Biya Paul',     motif: 'Suivi traitement',    heure: '14h00', type: 'En personne', status: 'pending' },
        { id: 4, patient: 'Mme Ngo Marie',    motif: 'Résultats analyse',   heure: '15h30', type: 'Vidéo',      status: 'confirmed' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Bannière */}
            <div style={{ background: 'linear-gradient(135deg, #0a3d4a 0%, #016472 100%)', borderRadius: 20, padding: '28px 32px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -40, top: -40, width: 220, height: 220, background: '#E8613A', borderRadius: '50%', opacity: 0.1 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ margin: '0 0 4px', opacity: 0.75, fontSize: 14 }}>{greeting} 👋</p>
                        <h2 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800 }}>Dr. {user?.name}</h2>
                        <p style={{ margin: '0 0 16px', opacity: 0.8, fontSize: 14 }}>Vous avez <strong>{todayRdv.length} rendez-vous</strong> aujourd'hui</p>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
                                🟢 Disponible
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
                                ⭐ 4.9 / 5 — 128 avis
                            </div>
                        </div>
                    </div>
                    <Link to="/doctor/agenda" style={{ background: 'linear-gradient(90deg, #E8613A, #E8913A)', padding: '13px 26px', borderRadius: 12, color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(232,97,58,0.4)' }}>
                        Voir l'agenda →
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <StatCard icon="📅" value="4"   label="RDV aujourd'hui"        color="#016472" sub="2 en attente" />
                <StatCard icon="👥" value="47"  label="Patients ce mois"       color="#E8613A" sub="+8 nouveaux" />
                <StatCard icon="✅" value="312" label="Consultations totales"   color="#22c55e" sub="Depuis jan. 2026" />
                <StatCard icon="💊" value="28"  label="Prescriptions ce mois"  color="#8b5cf6" />
            </div>

            {/* Contenu */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>

                {/* Agenda du jour */}
                <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e7eeff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111c2d' }}>📅 Agenda du jour</h3>
                        <Link to="/doctor/agenda" style={{ fontSize: 13, color: '#016472', fontWeight: 600, textDecoration: 'none' }}>Voir tout →</Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {todayRdv.map((rdv, i) => (
                            <div key={rdv.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', background: '#f9f9ff', borderRadius: 12, border: '1px solid #f0f3ff' }}>
                                <div style={{ textAlign: 'center', minWidth: 48 }}>
                                    <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#016472' }}>{rdv.heure}</p>
                                </div>
                                <div style={{ width: 1, height: 36, background: '#e7eeff' }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 14, color: '#111c2d' }}>{rdv.patient}</p>
                                    <p style={{ margin: 0, fontSize: 12, color: '#6f797b' }}>{rdv.motif} • {rdv.type}</p>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {rdv.status === 'confirmed' && (
                                        <button style={{ background: '#016472', color: 'white', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                                            🎥 Démarrer
                                        </button>
                                    )}
                                    {rdv.status === 'pending' && (
                                        <button style={{ background: '#fef9c3', color: '#ca8a04', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                                            ⏳ En attente
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Colonne droite */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Patients récents */}
                    <div style={{ background: 'white', borderRadius: 16, padding: 22, border: '1px solid #e7eeff' }}>
                        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#111c2d' }}>👥 Patients récents</h3>
                        {[
                            { name: 'M. Talla Jean',   last: 'Hier',      avatar: 'T' },
                            { name: 'Mme Eboa Claire', last: 'Il y a 2j', avatar: 'E' },
                            { name: 'M. Biya Paul',    last: 'Il y a 5j', avatar: 'B' },
                        ].map((p, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 2 ? '1px solid #f0f3ff' : 'none' }}>
                                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #016472, #2e7d8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>{p.avatar}</div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: '#111c2d' }}>{p.name}</p>
                                    <p style={{ margin: 0, fontSize: 11, color: '#6f797b' }}>Dernière visite : {p.last}</p>
                                </div>
                                <button style={{ background: '#f0f3ff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: '#016472', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Voir</button>
                            </div>
                        ))}
                    </div>

                    {/* Revenus du mois */}
                    <div style={{ background: 'linear-gradient(135deg, #E8613A, #E8913A)', borderRadius: 16, padding: 22, color: 'white' }}>
                        <p style={{ margin: '0 0 6px', fontSize: 13, opacity: 0.85 }}>💰 Revenus ce mois</p>
                        <p style={{ margin: '0 0 4px', fontSize: 32, fontWeight: 800 }}>470 000 XAF</p>
                        <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>47 consultations × moy. 10 000 XAF</p>
                        <div style={{ marginTop: 14, background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 600 }}>
                            📈 +12% vs mois dernier
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorHome;