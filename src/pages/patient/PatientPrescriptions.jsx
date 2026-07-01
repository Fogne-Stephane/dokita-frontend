import { useState } from 'react';

const PRESCRIPTIONS = [
    { id: 1, doctor: 'Dr. Kamga Pierre', date: '10 Mai 2026', valid: '10 Août 2026', status: 'active', medications: [{ name: 'Amlodipine 5mg', dose: '1 comprimé', freq: 'Matin' }, { name: 'Aspirine 100mg', dose: '1 comprimé', freq: 'Soir' }] },
    { id: 2, doctor: 'Dr. Fongang Luc',  date: '02 Mar 2026', valid: '02 Jun 2026',  status: 'active', medications: [{ name: 'Vitamine D3 1000UI', dose: '1 gélule', freq: '1x/semaine' }, { name: 'Omega-3 1g', dose: '2 gélules', freq: '2x/jour' }] },
    { id: 3, doctor: 'Dr. Mballa Sophie', date: '15 Jan 2026', valid: '15 Mar 2026', status: 'expired', medications: [{ name: 'Amoxicilline 500mg', dose: '1 gélule', freq: '3x/jour' }] },
];

const PatientPrescriptions = () => {
    const [selected, setSelected] = useState(null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Inter', sans-serif" }}>
            <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111c2d' }}>Mes Prescriptions</h2>
                <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>Toutes vos ordonnances médicales en un seul endroit</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {PRESCRIPTIONS.map(p => (
                    <div key={p.id} style={{ background: 'white', borderRadius: 16, padding: 22, border: '1px solid #e7eeff', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                        onClick={() => setSelected(selected?.id === p.id ? null : p)}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 14, background: p.status === 'active' ? 'linear-gradient(135deg, #016472, #2e7d8c)' : '#f0f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>💊</div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 15, color: '#111c2d' }}>Ordonnance — {p.doctor}</p>
                                <p style={{ margin: 0, fontSize: 12, color: '#6f797b' }}>📅 {p.date} • Valide jusqu'au {p.valid} • {p.medications.length} médicament{p.medications.length > 1 ? 's' : ''}</p>
                            </div>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                <span style={{ background: p.status === 'active' ? '#dcfce7' : '#f0f3ff', color: p.status === 'active' ? '#16a34a' : '#6f797b', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                                    {p.status === 'active' ? '✅ Active' : '⏰ Expirée'}
                                </span>
                                <span style={{ color: '#6f797b', fontSize: 18 }}>{selected?.id === p.id ? '▲' : '▼'}</span>
                            </div>
                        </div>

                        {/* Détail dépliable */}
                        {selected?.id === p.id && (
                            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #f0f3ff' }}>
                                <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#111c2d' }}>Médicaments prescrits :</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {p.medications.map((m, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f0f3ff', borderRadius: 12, padding: '12px 16px' }}>
                                            <span style={{ fontSize: 20 }}>💊</span>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#111c2d' }}>{m.name}</p>
                                                <p style={{ margin: 0, fontSize: 12, color: '#6f797b' }}>{m.dose} • {m.freq}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button style={{ marginTop: 16, background: '#016472', color: 'white', border: 'none', borderRadius: 12, padding: '10px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                                    ⬇️ Télécharger PDF
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientPrescriptions;