import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentService } from '../../api/services';

const TABS = ['Tous', 'À venir', 'Terminés', 'Annulés'];

const STATUS_CONFIG = {
    confirmed: { label: 'Confirmé',  bg: '#dcfce7', color: '#16a34a' },
    pending:   { label: 'En attente', bg: '#fef9c3', color: '#ca8a04' },
    completed: { label: 'Terminé',   bg: '#e7eeff', color: '#016472' },
    cancelled: { label: 'Annulé',    bg: '#fee2e2', color: '#dc2626' },
};

const PatientAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Tous');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await appointmentService.getMyAppointments();
                setAppointments(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handleCancel = async (id) => {
        try {
            await appointmentService.cancelAsPatient(id);
            setAppointments(prev =>
                prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a)
            );
        } catch (err) {
            console.error(err);
        }
    };

    const filtered = appointments.filter(a => {
        if (activeTab === 'Tous') return true;
        if (activeTab === 'À venir')  return ['confirmed', 'pending'].includes(a.status);
        if (activeTab === 'Terminés') return a.status === 'completed';
        if (activeTab === 'Annulés')  return a.status === 'cancelled';
        return true;
    });

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
            <p style={{ color: '#6f797b', fontFamily: "'Inter', sans-serif" }}>Chargement...</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Inter', sans-serif" }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111c2d' }}>Mes Rendez-vous</h2>
                    <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>Gérez et suivez tous vos rendez-vous médicaux</p>
                </div>
                <button onClick={() => setShowModal(true)} style={{ background: 'linear-gradient(90deg, #E8613A, #E8913A)', color: 'white', border: 'none', borderRadius: 12, padding: '12px 22px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(232,97,58,0.35)' }}>
                    + Nouveau RDV
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, background: 'white', padding: 6, borderRadius: 14, border: '1px solid #e7eeff', width: 'fit-content' }}>
                {TABS.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, background: activeTab === tab ? '#016472' : 'transparent', color: activeTab === tab ? 'white' : '#6f797b', transition: 'all 0.2s' }}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Liste */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map(rdv => {
                    const st = STATUS_CONFIG[rdv.status];
                    return (
                        <div key={rdv.id} style={{ background: 'white', borderRadius: 16, padding: '20px 24px', border: '1px solid #e7eeff', display: 'flex', alignItems: 'center', gap: 18, transition: 'box-shadow 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                        >
                            {/* Avatar médecin */}
                            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #016472, #2e7d8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 24, flexShrink: 0 }}>👨‍⚕️</div>

                            {/* Infos */}
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 15, color: '#111c2d' }}>{rdv.doctor}</p>
                                <p style={{ margin: '0 0 6px', fontSize: 13, color: '#6f797b' }}>{rdv.spec}</p>
                                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: 12, color: '#3f484b', display: 'flex', alignItems: 'center', gap: 4 }}>📅 {rdv.date}</span>
                                    <span style={{ fontSize: 12, color: '#3f484b', display: 'flex', alignItems: 'center', gap: 4 }}>🕐 {rdv.heure}</span>
                                    <span style={{ fontSize: 12, color: '#3f484b', display: 'flex', alignItems: 'center', gap: 4 }}>🎥 {rdv.type}</span>
                                    <span style={{ fontSize: 12, color: '#3f484b', display: 'flex', alignItems: 'center', gap: 4 }}>💳 {rdv.fee}</span>
                                </div>
                            </div>

                            {/* Status */}
                            <span style={{ background: st.bg, color: st.color, padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{st.label}</span>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                {rdv.status === 'confirmed' && (
                                    <button style={{ background: '#016472', color: 'white', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                                        🎥 Rejoindre
                                    </button>
                                )}
                                {['confirmed', 'pending'].includes(rdv.status) && (
                                    <button onClick={() => handleCancel(rdv.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
    Annuler
</button>
                                )}
                                {rdv.status === 'completed' && (
                                    <button style={{ background: '#e7eeff', color: '#016472', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                                        Voir détails
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 48, background: 'white', borderRadius: 16, border: '1px solid #e7eeff' }}>
                        <p style={{ fontSize: 40, margin: '0 0 12px' }}>📭</p>
                        <p style={{ color: '#6f797b', fontWeight: 600 }}>Aucun rendez-vous dans cette catégorie</p>
                        <button onClick={() => setShowModal(true)} style={{ marginTop: 16, background: '#016472', color: 'white', border: 'none', borderRadius: 12, padding: '10px 22px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                            Prendre un RDV
                        </button>
                    </div>
                )}
            </div>

            {/* Modal nouveau RDV */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowModal(false)}>
                    <div style={{ background: 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 480, position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 800, color: '#111c2d' }}>Nouveau rendez-vous</h3>
                        <p style={{ margin: '0 0 24px', fontSize: 13, color: '#6f797b' }}>Remplissez les informations ci-dessous</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={labelStyle}>Spécialité recherchée</label>
                                <select style={inputStyle}>
                                    <option>Généraliste</option>
                                    <option>Cardiologue</option>
                                    <option>Pédiatre</option>
                                    <option>Dermatologue</option>
                                    <option>Neurologue</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Date souhaitée</label>
                                <input type="date" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Type de consultation</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    {['🎥 Vidéo', '🏥 En personne'].map((t, i) => (
                                        <button key={i} style={{ padding: '12px', border: '2px solid #e7eeff', borderRadius: 12, background: i === 0 ? '#e7eeff' : 'white', color: i === 0 ? '#016472' : '#6f797b', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Motif de consultation</label>
                                <textarea rows={3} placeholder="Décrivez brièvement votre problème..." style={{ ...inputStyle, resize: 'none' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '13px', border: '1.5px solid #dde3f0', borderRadius: 12, background: 'white', color: '#3f484b', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
                                Annuler
                            </button>
                            <button style={{ flex: 1, padding: '13px', border: 'none', borderRadius: 12, background: 'linear-gradient(90deg, #E8613A, #E8913A)', color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
                                Rechercher un médecin
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#111c2d', marginBottom: 6 };
const inputStyle = { width: '100%', border: '1.5px solid #dde3f0', borderRadius: 12, padding: '12px 14px', fontSize: 14, fontFamily: 'inherit', background: 'white', outline: 'none', boxSizing: 'border-box' };

export default PatientAppointments;