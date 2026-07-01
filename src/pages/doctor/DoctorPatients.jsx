import { useState } from 'react';

const PATIENTS = [
    { id: 1, name: 'M. Talla Jean',    age: 45, city: 'Douala',   lastVisit: '10 Jun 2026', consultations: 8,  condition: 'Hypertension',   avatar: 'T' },
    { id: 2, name: 'Mme Eboa Claire',  age: 38, city: 'Yaoundé',  lastVisit: '08 Jun 2026', consultations: 5,  condition: 'Arythmie',       avatar: 'E' },
    { id: 3, name: 'M. Biya Paul',     age: 52, city: 'Douala',   lastVisit: '02 Jun 2026', consultations: 12, condition: 'Insuffisance',   avatar: 'B' },
    { id: 4, name: 'Mme Ngo Marie',    age: 29, city: 'Bafoussam', lastVisit: '28 Mai 2026', consultations: 3,  condition: 'Palpitations',   avatar: 'N' },
    { id: 5, name: 'M. Fouda Luc',     age: 61, city: 'Douala',   lastVisit: '20 Mai 2026', consultations: 15, condition: 'Hypertension',   avatar: 'F' },
    { id: 6, name: 'Mme Ateba Rose',   age: 44, city: 'Yaoundé',  lastVisit: '15 Mai 2026', consultations: 7,  condition: 'Suivi général',  avatar: 'A' },
];

const DoctorPatients = () => {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);

    const filtered = PATIENTS.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.condition.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', gap: 20, fontFamily: "'Inter', sans-serif" }}>

            {/* Liste patients */}
            <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 20 }}>
                    <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#111c2d' }}>Mes Patients</h2>
                    <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>{PATIENTS.length} patients au total</p>
                </div>

                <input placeholder="🔍  Rechercher un patient..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', border: '1.5px solid #dde3f0', borderRadius: 12, padding: '12px 16px', fontSize: 14, fontFamily: 'inherit', outline: 'none', marginBottom: 16, boxSizing: 'border-box', background: 'white' }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {filtered.map(p => (
                        <div key={p.id} onClick={() => setSelected(p)}
                            style={{ background: 'white', borderRadius: 14, padding: '16px 20px', border: `1.5px solid ${selected?.id === p.id ? '#016472' : '#e7eeff'}`, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                        >
                            <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #016472, #2e7d8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>{p.avatar}</div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 14, color: '#111c2d' }}>{p.name}</p>
                                <p style={{ margin: 0, fontSize: 12, color: '#6f797b' }}>{p.age} ans • {p.city} • {p.condition}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: '0 0 2px', fontSize: 12, color: '#6f797b' }}>Dernière visite</p>
                                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#016472' }}>{p.lastVisit}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fiche patient */}
            {selected ? (
                <div style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e7eeff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111c2d' }}>Fiche patient</h3>
                            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#6f797b' }}>✕</button>
                        </div>
                        <div style={{ textAlign: 'center', marginBottom: 18 }}>
                            <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'linear-gradient(135deg, #016472, #2e7d8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 28, margin: '0 auto 12px' }}>{selected.avatar}</div>
                            <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: 16, color: '#111c2d' }}>{selected.name}</p>
                            <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>{selected.age} ans • {selected.city}</p>
                        </div>
                        {[
                            { label: 'Condition principale', value: selected.condition },
                            { label: 'Consultations', value: selected.consultations + ' séances' },
                            { label: 'Dernière visite', value: selected.lastVisit },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid #f0f3ff' : 'none' }}>
                                <span style={{ fontSize: 13, color: '#6f797b' }}>{item.label}</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#111c2d' }}>{item.value}</span>
                            </div>
                        ))}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
                            <button style={{ width: '100%', padding: '11px', background: '#016472', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
                                📋 Voir dossier complet
                            </button>
                            <button style={{ width: '100%', padding: '11px', background: 'linear-gradient(90deg, #E8613A, #E8913A)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
                                💊 Nouvelle prescription
                            </button>
                            <button style={{ width: '100%', padding: '11px', background: '#f0f3ff', color: '#016472', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
                                💬 Envoyer message
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ width: 300, flexShrink: 0, background: 'white', borderRadius: 16, padding: 28, border: '1px solid #e7eeff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <p style={{ fontSize: 40, margin: '0 0 12px' }}>👤</p>
                    <p style={{ fontWeight: 600, color: '#6f797b', margin: 0 }}>Sélectionnez un patient pour voir sa fiche</p>
                </div>
            )}
        </div>
    );
};

export default DoctorPatients;