import { useState } from 'react';

const STATUS_CONFIG = {
    confirmed: { label: 'Confirmé',   bg: '#dcfce7', color: '#16a34a' },
    pending:   { label: 'En attente', bg: '#fef9c3', color: '#ca8a04' },
    completed: { label: 'Terminé',    bg: '#e7eeff', color: '#016472' },
    cancelled: { label: 'Annulé',     bg: '#fee2e2', color: '#dc2626' },
};

const ALL_RDV = [
    { id: 1, patient: 'M. Talla Jean',    motif: 'Contrôle tension',     heure: '09h00', date: "Aujourd'hui", type: 'Vidéo',      status: 'confirmed', fee: '15 000' },
    { id: 2, patient: 'Mme Eboa Claire',  motif: 'Douleurs thoraciques',  heure: '10h30', date: "Aujourd'hui", type: 'Vidéo',      status: 'confirmed', fee: '15 000' },
    { id: 3, patient: 'M. Biya Paul',     motif: 'Suivi traitement',     heure: '14h00', date: "Aujourd'hui", type: 'En personne', status: 'pending',   fee: '15 000' },
    { id: 4, patient: 'Mme Ngo Marie',    motif: 'Résultats analyse',    heure: '15h30', date: "Aujourd'hui", type: 'Vidéo',      status: 'confirmed', fee: '15 000' },
    { id: 5, patient: 'M. Fouda Luc',     motif: 'Première consultation', heure: '09h00', date: 'Demain',      type: 'Vidéo',      status: 'pending',   fee: '15 000' },
    { id: 6, patient: 'Mme Ateba Rose',   motif: 'Suivi cardiaque',      heure: '11h00', date: 'Demain',      type: 'Vidéo',      status: 'confirmed', fee: '15 000' },
    { id: 7, patient: 'M. Ndoumbe Eric',  motif: 'Contrôle annuel',      heure: '10h00', date: '12 Jun 2026', type: 'En personne', status: 'completed', fee: '15 000' },
];

const TABS = ["Aujourd'hui", 'Demain', 'Cette semaine', 'Tous'];

const DoctorAgenda = () => {
    const [activeTab, setActiveTab] = useState("Aujourd'hui");
    const [showModal, setShowModal] = useState(null);

    const filtered = ALL_RDV.filter(r => {
        if (activeTab === 'Tous') return true;
        if (activeTab === 'Cette semaine') return ["Aujourd'hui", 'Demain', '12 Jun 2026'].includes(r.date);
        return r.date === activeTab;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111c2d' }}>Mon Agenda</h2>
                    <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>Gérez vos rendez-vous et consultations</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ background: '#dcfce7', color: '#16a34a', padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>
                        ✅ {ALL_RDV.filter(r => r.status === 'confirmed').length} confirmés
                    </div>
                    <div style={{ background: '#fef9c3', color: '#ca8a04', padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>
                        ⏳ {ALL_RDV.filter(r => r.status === 'pending').length} en attente
                    </div>
                </div>
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
                        <div key={rdv.id} style={{ background: 'white', borderRadius: 16, padding: '18px 24px', border: '1px solid #e7eeff', display: 'flex', alignItems: 'center', gap: 18 }}>
                            {/* Heure */}
                            <div style={{ textAlign: 'center', minWidth: 60, background: '#f0f3ff', borderRadius: 12, padding: '10px 8px' }}>
                                <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#016472' }}>{rdv.heure}</p>
                                <p style={{ margin: 0, fontSize: 11, color: '#6f797b' }}>{rdv.date}</p>
                            </div>

                            {/* Avatar patient */}
                            <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #016472, #2e7d8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                                {rdv.patient.split(' ').pop()[0]}
                            </div>

                            {/* Infos */}
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 15, color: '#111c2d' }}>{rdv.patient}</p>
                                <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>{rdv.motif} • {rdv.type} • {rdv.fee} XAF</p>
                            </div>

                            {/* Status */}
                            <span style={{ background: st.bg, color: st.color, padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>{st.label}</span>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 8 }}>
                                {rdv.status === 'confirmed' && (
                                    <button style={{ background: '#016472', color: 'white', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                                        🎥 Démarrer
                                    </button>
                                )}
                                {rdv.status === 'pending' && (
                                    <>
                                        <button onClick={() => setShowModal(rdv)} style={{ background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                                            ✅ Confirmer
                                        </button>
                                        <button style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                                            ✕ Refuser
                                        </button>
                                    </>
                                )}
                                {rdv.status === 'completed' && (
                                    <button style={{ background: '#e7eeff', color: '#016472', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                                        📋 Voir dossier
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal confirmation */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowModal(null)}>
                    <div style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 420, width: '90%' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ margin: '0 0 8px', fontWeight: 800, color: '#111c2d' }}>Confirmer le rendez-vous</h3>
                        <p style={{ color: '#6f797b', fontSize: 14, marginBottom: 20 }}>Voulez-vous confirmer ce rendez-vous ?</p>
                        <div style={{ background: '#f0f3ff', borderRadius: 12, padding: 16, marginBottom: 24 }}>
                            <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#111c2d' }}>{showModal.patient}</p>
                            <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>{showModal.motif} • {showModal.heure} • {showModal.date}</p>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button onClick={() => setShowModal(null)} style={{ flex: 1, padding: '12px', border: '1.5px solid #dde3f0', borderRadius: 12, background: 'white', color: '#3f484b', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Annuler</button>
                            <button onClick={() => setShowModal(null)} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: 12, background: '#016472', color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>✅ Confirmer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorAgenda;