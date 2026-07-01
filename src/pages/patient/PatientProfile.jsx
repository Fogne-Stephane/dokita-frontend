import { useState } from 'react';
import { useSelector } from 'react-redux';

const PatientProfile = () => {
    const { user } = useSelector((state) => state.auth);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || '', email: user?.email || '', phone: user?.phone || '+237 6XX XXX XXX',
        birth_date: '1993-05-14', gender: 'male', blood_type: 'A+',
        city: 'Douala', address: 'Akwa, Rue des Brasseries',
        emergency_name: 'Marie Dupont', emergency_phone: '+237 699 000 000',
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111c2d' }}>Mon Profil</h2>
                    <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>Gérez vos informations personnelles</p>
                </div>
                <button onClick={() => setEditing(!editing)} style={{ background: editing ? '#dcfce7' : '#016472', color: editing ? '#16a34a' : 'white', border: 'none', borderRadius: 12, padding: '10px 22px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {editing ? '✅ Sauvegarder' : '✏️ Modifier'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>

                {/* Card avatar */}
                <div style={{ background: 'white', borderRadius: 18, padding: 28, border: '1px solid #e7eeff', textAlign: 'center' }}>
                    <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg, #016472, #2e7d8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 36, fontWeight: 700, margin: '0 auto 16px' }}>
                        {user?.name?.[0]?.toUpperCase() || 'P'}
                    </div>
                    <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: 17, color: '#111c2d' }}>{user?.name}</p>
                    <p style={{ margin: '0 0 16px', fontSize: 13, color: '#016472', fontWeight: 600 }}>Patient</p>
                    <div style={{ display: 'inline-block', background: '#dcfce7', color: '#16a34a', padding: '4px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, marginBottom: 20 }}>
                        ✅ Compte vérifié
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[
                            { icon: '📧', value: user?.email },
                            { icon: '📞', value: '+237 677 000 000' },
                            { icon: '📍', value: 'Douala, Cameroun' },
                        ].map((info, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0f3ff', borderRadius: 10, padding: '9px 12px' }}>
                                <span style={{ fontSize: 15 }}>{info.icon}</span>
                                <span style={{ fontSize: 12, color: '#3f484b', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{info.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Formulaire */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Infos personnelles */}
                    <div style={{ background: 'white', borderRadius: 18, padding: 24, border: '1px solid #e7eeff' }}>
                        <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: '#016472' }}>👤 Informations personnelles</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            {[
                                { key: 'name', label: 'Nom complet', type: 'text' },
                                { key: 'email', label: 'Email', type: 'email' },
                                { key: 'phone', label: 'Téléphone', type: 'tel' },
                                { key: 'birth_date', label: 'Date de naissance', type: 'date' },
                                { key: 'city', label: 'Ville', type: 'text' },
                                { key: 'address', label: 'Adresse', type: 'text' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6f797b', marginBottom: 5 }}>{f.label}</label>
                                    <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} disabled={!editing}
                                        style={{ width: '100%', border: `1.5px solid ${editing ? '#016472' : '#e7eeff'}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: editing ? 'white' : '#f9f9ff', color: '#111c2d', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6f797b', marginBottom: 5 }}>Genre</label>
                                <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} disabled={!editing}
                                    style={{ width: '100%', border: `1.5px solid ${editing ? '#016472' : '#e7eeff'}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: editing ? 'white' : '#f9f9ff' }}>
                                    <option value="male">Homme</option>
                                    <option value="female">Femme</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6f797b', marginBottom: 5 }}>Groupe sanguin</label>
                                <select value={form.blood_type} onChange={e => setForm({ ...form, blood_type: e.target.value })} disabled={!editing}
                                    style={{ width: '100%', border: `1.5px solid ${editing ? '#016472' : '#e7eeff'}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: editing ? 'white' : '#f9f9ff' }}>
                                    {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(g => <option key={g}>{g}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Contact urgence */}
                    <div style={{ background: 'white', borderRadius: 18, padding: 24, border: '1px solid #e7eeff' }}>
                        <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: '#E8613A' }}>🚨 Contact d'urgence</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            {[
                                { key: 'emergency_name', label: 'Nom du contact', type: 'text' },
                                { key: 'emergency_phone', label: 'Téléphone urgence', type: 'tel' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6f797b', marginBottom: 5 }}>{f.label}</label>
                                    <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} disabled={!editing}
                                        style={{ width: '100%', border: `1.5px solid ${editing ? '#016472' : '#e7eeff'}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: editing ? 'white' : '#f9f9ff', boxSizing: 'border-box' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;