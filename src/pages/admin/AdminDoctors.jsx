import { useState } from 'react';

const DOCTORS = [
    { id: 1, name: 'Dr. Kamga Pierre',  spec: 'Cardiologue',  city: 'Douala',    license: 'CM-CARD-2014-0892', exp: 12, status: 'verified',  joined: '15 Mai 2026' },
    { id: 2, name: 'Dr. Mballa Sophie', spec: 'Pédiatre',     city: 'Yaoundé',   license: 'CM-PED-2018-0234',  exp: 8,  status: 'pending',   joined: '08 Jun 2026' },
    { id: 3, name: 'Dr. Fongang Luc',   spec: 'Généraliste',  city: 'Douala',    license: 'CM-GEN-2009-0567',  exp: 15, status: 'verified',  joined: '01 Jan 2026' },
    { id: 4, name: 'Dr. Ateba Claire',  spec: 'Gynécologue',  city: 'Bafoussam', license: 'CM-GYN-2020-0891',  exp: 6,  status: 'pending',   joined: '10 Jun 2026' },
    { id: 5, name: 'Dr. Nkeng Paul',    spec: 'Neurologue',   city: 'Douala',    license: 'CM-NEU-2004-0123',  exp: 20, status: 'verified',  joined: '05 Mar 2026' },
    { id: 6, name: 'Dr. Biya Marie',    spec: 'Dermatologue', city: 'Yaoundé',   license: 'CM-DER-2022-0456',  exp: 4,  status: 'rejected',  joined: '02 Jun 2026' },
];

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState(DOCTORS);
    const [filter, setFilter] = useState('Tous');

    const pending = doctors.filter(d => d.status === 'pending');

    const updateStatus = (id, status) => {
        setDoctors(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    };

    const filtered = doctors.filter(d => {
        if (filter === 'Tous') return true;
        if (filter === 'En attente') return d.status === 'pending';
        if (filter === 'Vérifiés') return d.status === 'verified';
        if (filter === 'Rejetés') return d.status === 'rejected';
        return true;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Inter', sans-serif" }}>
            <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111c2d' }}>Gestion Médecins</h2>
                <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>{doctors.length} médecins enregistrés</p>
            </div>

            {/* Alerte validations en attente */}
            {pending.length > 0 && (
                <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 22 }}>⚠️</span>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#854d0e' }}>
                        {pending.length} médecin{pending.length > 1 ? 's' : ''} en attente de validation
                    </p>
                </div>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, background: 'white', padding: 6, borderRadius: 14, border: '1px solid #e7eeff', width: 'fit-content' }}>
                {['Tous', 'En attente', 'Vérifiés', 'Rejetés'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, background: filter === f ? '#111c2d' : 'transparent', color: filter === f ? 'white' : '#6f797b', transition: 'all 0.2s' }}>
                        {f}
                    </button>
                ))}
            </div>

            {/* Cards médecins */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {filtered.map(doc => {
                    const statusConfig = {
                        verified: { label: '✅ Vérifié',     bg: '#dcfce7', color: '#16a34a' },
                        pending:  { label: '⏳ En attente',  bg: '#fef9c3', color: '#ca8a04' },
                        rejected: { label: '❌ Rejeté',      bg: '#fee2e2', color: '#dc2626' },
                    }[doc.status];

                    return (
                        <div key={doc.id} style={{ background: 'white', borderRadius: 16, padding: 22, border: `1.5px solid ${doc.status === 'pending' ? '#fde047' : '#e7eeff'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                                <div style={{ width: 50, height: 50, borderRadius: 14, background: 'linear-gradient(135deg, #E8613A, #E8913A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👨‍⚕️</div>
                                <span style={{ background: statusConfig.bg, color: statusConfig.color, padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, height: 'fit-content' }}>{statusConfig.label}</span>
                            </div>
                            <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 15, color: '#111c2d' }}>{doc.name}</p>
                            <p style={{ margin: '0 0 12px', fontSize: 13, color: '#016472', fontWeight: 600 }}>{doc.spec}</p>
                            <div style={{ fontSize: 12, color: '#6f797b', display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
                                <span>📍 {doc.city}</span>
                                <span>🪪 {doc.license}</span>
                                <span>🏆 {doc.exp} ans d'expérience</span>
                                <span>📅 Inscrit le {doc.joined}</span>
                            </div>
                            {doc.status === 'pending' && (
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button onClick={() => updateStatus(doc.id, 'verified')} style={{ flex: 1, padding: '9px', background: '#016472', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
                                        ✅ Valider
                                    </button>
                                    <button onClick={() => updateStatus(doc.id, 'rejected')} style={{ flex: 1, padding: '9px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
                                        ✕ Rejeter
                                    </button>
                                </div>
                            )}
                            {doc.status === 'verified' && (
                                <button onClick={() => updateStatus(doc.id, 'rejected')} style={{ width: '100%', padding: '9px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
                                    🚫 Suspendre
                                </button>
                            )}
                            {doc.status === 'rejected' && (
                                <button onClick={() => updateStatus(doc.id, 'verified')} style={{ width: '100%', padding: '9px', background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
                                    ✅ Réactiver
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminDoctors;