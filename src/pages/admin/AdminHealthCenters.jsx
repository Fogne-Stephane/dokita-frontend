import { useState } from 'react';

const CENTERS = [
    { id: 1, name: 'CHU de Douala',           type: 'Hôpital',  city: 'Douala',    doctors: 24, active: true  },
    { id: 2, name: 'Clinique La Grâce',        type: 'Clinique', city: 'Yaoundé',   doctors: 8,  active: true  },
    { id: 3, name: 'Centre Médical Bafoussam', type: 'Centre',   city: 'Bafoussam', doctors: 5,  active: true  },
    { id: 4, name: 'Polyclinique du Wouri',    type: 'Clinique', city: 'Douala',    doctors: 12, active: false },
];

const AdminHealthCenters = () => {
    const [centers, setCenters] = useState(CENTERS);
    const [showForm, setShowForm] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111c2d' }}>Centres de Santé</h2>
                    <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>{centers.length} établissements enregistrés</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} style={{ background: '#111c2d', color: 'white', border: 'none', borderRadius: 12, padding: '12px 22px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                    + Ajouter un centre
                </button>
            </div>

            {showForm && (
                <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e7eeff' }}>
                    <h3 style={{ margin: '0 0 20px', fontWeight: 700, color: '#111c2d' }}>Nouveau centre de santé</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                        {[{ label: 'Nom', ph: 'CHU de Douala' }, { label: 'Type', ph: 'Hôpital / Clinique' }, { label: 'Ville', ph: 'Douala' }, { label: 'Adresse', ph: 'Rue...' }, { label: 'Téléphone', ph: '+237...' }, { label: 'Email', ph: 'contact@...' }].map((f, i) => (
                            <div key={i}>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6f797b', marginBottom: 5 }}>{f.label}</label>
                                <input placeholder={f.ph} style={{ width: '100%', border: '1.5px solid #dde3f0', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                        <button onClick={() => setShowForm(false)} style={{ padding: '11px 24px', border: '1.5px solid #dde3f0', borderRadius: 12, background: 'white', color: '#3f484b', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Annuler</button>
                        <button style={{ padding: '11px 24px', background: '#111c2d', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Enregistrer</button>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {centers.map(c => (
                    <div key={c.id} style={{ background: 'white', borderRadius: 16, padding: 22, border: '1px solid #e7eeff', display: 'flex', gap: 16, alignItems: 'center' }}>
                        <div style={{ width: 54, height: 54, borderRadius: 14, background: '#e7eeff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>🏥</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 15, color: '#111c2d' }}>{c.name}</p>
                                <span style={{ background: c.active ? '#dcfce7' : '#fee2e2', color: c.active ? '#16a34a' : '#dc2626', padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>
                                    {c.active ? '● Actif' : '● Inactif'}
                                </span>
                            </div>
                            <p style={{ margin: '0 0 8px', fontSize: 13, color: '#6f797b' }}>{c.type} • {c.city} • {c.doctors} médecins</p>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button style={{ background: '#f0f3ff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: '#016472', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>✏️ Modifier</button>
                                <button onClick={() => setCenters(prev => prev.map(x => x.id === c.id ? { ...x, active: !x.active } : x))}
                                    style={{ background: c.active ? '#fee2e2' : '#dcfce7', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: c.active ? '#dc2626' : '#16a34a', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                                    {c.active ? '🚫 Désactiver' : '✅ Activer'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminHealthCenters;