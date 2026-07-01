import { useState } from 'react';
import { useSelector } from 'react-redux';

const DoctorProfile = () => {
    const { user } = useSelector((state) => state.auth);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || '', email: user?.email || '', phone: '+237 677 000 001',
        specialty: 'Cardiologue', license: 'CM-CARD-2014-0892',
        experience: '12', fee: '15000', duration: '30',
        bio: 'Cardiologue avec 12 ans d\'expérience, spécialisé dans le traitement de l\'hypertension et des maladies cardiovasculaires.',
        city: 'Douala', available_from: '08:00', available_to: '17:00',
    });
    const [days, setDays] = useState(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']);
    const allDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    const toggleDay = (day) => {
        if (!editing) return;
        setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111c2d' }}>Mon Profil Médecin</h2>
                    <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>Gérez vos informations professionnelles</p>
                </div>
                <button onClick={() => setEditing(!editing)} style={{ background: editing ? '#dcfce7' : '#016472', color: editing ? '#16a34a' : 'white', border: 'none', borderRadius: 12, padding: '10px 22px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {editing ? '✅ Sauvegarder' : '✏️ Modifier'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>

                {/* Card identité */}
                <div style={{ background: 'white', borderRadius: 18, padding: 28, border: '1px solid #e7eeff', textAlign: 'center' }}>
                    <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg, #E8613A, #E8913A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 36, fontWeight: 700, margin: '0 auto 16px' }}>
                        {user?.name?.[0]?.toUpperCase() || 'D'}
                    </div>
                    <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: 17, color: '#111c2d' }}>Dr. {user?.name}</p>
                    <p style={{ margin: '0 0 4px', fontSize: 13, color: '#016472', fontWeight: 600 }}>Cardiologue</p>
                    <div style={{ display: 'inline-block', background: '#dcfce7', color: '#16a34a', padding: '4px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, margin: '8px 0 20px' }}>
                        ✅ Médecin vérifié
                    </div>
                    <div style={{ background: '#f0f3ff', borderRadius: 12, padding: 16, textAlign: 'left' }}>
                        <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: '#6f797b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Stats</p>
                        {[
                            { label: 'Note', value: '⭐ 4.9 / 5' },
                            { label: 'Avis', value: '128' },
                            { label: 'Patients', value: '312' },
                        ].map((s, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < 2 ? '1px solid #e7eeff' : 'none' }}>
                                <span style={{ fontSize: 13, color: '#6f797b' }}>{s.label}</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: '#111c2d' }}>{s.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Formulaire */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Infos professionnelles */}
                    <div style={{ background: 'white', borderRadius: 18, padding: 24, border: '1px solid #e7eeff' }}>
                        <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: '#016472' }}>👨‍⚕️ Informations professionnelles</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            {[
                                { key: 'name',       label: 'Nom complet',         type: 'text' },
                                { key: 'email',      label: 'Email',               type: 'email' },
                                { key: 'phone',      label: 'Téléphone',           type: 'tel' },
                                { key: 'specialty',  label: 'Spécialité',          type: 'text' },
                                { key: 'license',    label: 'N° Ordre des médecins', type: 'text' },
                                { key: 'experience', label: 'Années d\'expérience', type: 'number' },
                                { key: 'fee',        label: 'Tarif consultation (XAF)', type: 'number' },
                                { key: 'city',       label: 'Ville',               type: 'text' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6f797b', marginBottom: 5 }}>{f.label}</label>
                                    <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} disabled={!editing}
                                        style={{ width: '100%', border: `1.5px solid ${editing ? '#016472' : '#e7eeff'}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: editing ? 'white' : '#f9f9ff', boxSizing: 'border-box' }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 14 }}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6f797b', marginBottom: 5 }}>Biographie</label>
                            <textarea rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} disabled={!editing}
                                style={{ width: '100%', border: `1.5px solid ${editing ? '#016472' : '#e7eeff'}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: editing ? 'white' : '#f9f9ff', resize: 'none', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>

                    {/* Disponibilités */}
                    <div style={{ background: 'white', borderRadius: 18, padding: 24, border: '1px solid #e7eeff' }}>
                        <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: '#E8613A' }}>📅 Disponibilités</h3>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6f797b', marginBottom: 10 }}>Jours de consultation</label>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {allDays.map(day => (
                                    <button key={day} onClick={() => toggleDay(day)} style={{ padding: '7px 14px', borderRadius: 10, border: 'none', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: editing ? 'pointer' : 'default', background: days.includes(day) ? '#016472' : '#f0f3ff', color: days.includes(day) ? 'white' : '#6f797b', transition: 'all 0.2s' }}>
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            {[
                                { key: 'available_from', label: 'Heure de début', type: 'time' },
                                { key: 'available_to',   label: 'Heure de fin',   type: 'time' },
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

export default DoctorProfile;