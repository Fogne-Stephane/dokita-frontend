import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import logo from '../../assets/logo.png';

const WaitingRoom = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();

    const [data, setData]           = useState(null);
    const [loading, setLoading]     = useState(true);
    const [waitTime, setWaitTime]   = useState(0);
    const [dots, setDots]           = useState('');

    // Charger les infos de la salle d'attente
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get(`/patient/consultations/${appointmentId}/waiting`);
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [appointmentId]);

    // Timer d'attente
    useEffect(() => {
        const timer = setInterval(() => {
            setWaitTime(t => t + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Animation des points
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(d => d.length >= 3 ? '' : d + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Polling — vérifier si le médecin a démarré la session
    useEffect(() => {
        const poll = setInterval(async () => {
            try {
                const res = await api.get(`/patient/consultations/${appointmentId}/waiting`);
                if (res.data.session?.status === 'active') {
                    clearInterval(poll);
                    navigate(`/consultation/room/${appointmentId}`);
                }
            } catch (err) {}
        }, 5000);
        return () => clearInterval(poll);
    }, [appointmentId]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const getInitials = (name) => {
        const parts = (name || '').split(' ');
        return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f0f3ff', fontFamily: "'Inter', sans-serif" }}>
            <p style={{ color: '#6f797b' }}>Chargement de la salle d'attente...</p>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #016472 0%, #004e5a 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>

            {/* Cercles décoratifs */}
            <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(232,97,58,0.1)' }} />
            <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

            {/* Logo */}
            <div style={{ position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden' }}>
                    <img src={logo} alt="Dokita" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ color: 'white', fontWeight: 800, fontSize: 18 }}>Dokita</span>
            </div>

            {/* Contenu principal */}
            <div style={{ width: '100%', maxWidth: 500, position: 'relative', zIndex: 1 }}>

                {/* Card principale */}
                <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24, padding: 36, textAlign: 'center', marginBottom: 16 }}>

                    {/* Animation pulsante */}
                    <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 28px' }}>
                        <div style={{ position: 'absolute', inset: -12, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', animation: 'none' }} />
                        <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)' }} />
                        <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, border: '2px solid rgba(255,255,255,0.3)' }}>
                            👨‍⚕️
                        </div>
                    </div>

                    <h2 style={{ color: 'white', fontSize: 24, fontWeight: 800, margin: '0 0 8px' }}>
                        Salle d'attente
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, margin: '0 0 28px' }}>
                        Votre médecin va vous rejoindre dans quelques instants{dots}
                    </p>

                    {/* Infos médecin */}
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 20, marginBottom: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                                {getInitials(data?.doctor?.name || '')}
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ color: 'white', fontWeight: 700, fontSize: 16, margin: 0 }}>{data?.doctor?.name}</p>
                                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, margin: 0 }}>{data?.doctor?.specialty}</p>
                            </div>
                            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} />
                                    <span style={{ color: '#4ade80', fontSize: 12, fontWeight: 600 }}>En ligne</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Détails RDV */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                        {[
                            { icon: '🎥', label: 'Type', value: data?.appointment?.type === 'video' ? 'Vidéo' : 'En personne' },
                            { icon: '⏱️', label: 'Durée', value: '30 min' },
                            { icon: '📋', label: 'Motif', value: data?.appointment?.reason || 'Consultation' },
                            { icon: '💳', label: 'Statut', value: data?.appointment?.is_paid ? '✅ Payé' : '⏳ En attente' },
                        ].map((item, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 14px', textAlign: 'left' }}>
                                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, margin: '0 0 4px' }}>{item.icon} {item.label}</p>
                                <p style={{ color: 'white', fontSize: 13, fontWeight: 600, margin: 0 }}>{item.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Timer */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>Temps d'attente</span>
                        <span style={{ color: 'white', fontSize: 18, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                            {formatTime(waitTime)}
                        </span>
                    </div>
                </div>

                {/* Conseils */}
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, margin: '0 0 12px' }}>
                        💡 Préparez votre consultation
                    </p>
                    {[
                        'Assurez-vous d\'être dans un endroit calme et bien éclairé',
                        'Ayez vos ordonnances et résultats d\'analyses à portée de main',
                        'Testez votre caméra et microphone',
                    ].map((tip, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: i < 2 ? 8 : 0 }}>
                            <span style={{ color: '#4ade80', fontSize: 12, marginTop: 1 }}>✓</span>
                            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, lineHeight: 1.5 }}>{tip}</span>
                        </div>
                    ))}
                </div>

                {/* Boutons */}
                <div style={{ display: 'flex', gap: 10 }}>
                    <button
                        onClick={() => navigate('/patient/dashboard')}
                        style={{ flex: 1, padding: '13px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
                        ← Dashboard
                    </button>
                    <button
                        onClick={() => navigate(`/consultation/room/${appointmentId}`)}
                        style={{ flex: 2, padding: '13px', background: 'linear-gradient(90deg, #E8613A, #E8913A)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, boxShadow: '0 4px 14px rgba(232,97,58,0.4)' }}>
                        🎥 Rejoindre la consultation
                    </button>
                </div>

                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, textAlign: 'center', marginTop: 14 }}>
                    La page se met à jour automatiquement quand le médecin démarre
                </p>
            </div>
        </div>
    );
};

export default WaitingRoom;