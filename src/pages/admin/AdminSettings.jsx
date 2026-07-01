import { useState } from 'react';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        platform_name: 'Dokita',
        support_email: 'support@dokita.cm',
        support_phone: '+237 699 000 000',
        consultation_fee_min: '5000',
        consultation_fee_max: '50000',
        maintenance_mode: false,
        allow_registration: true,
        email_verification: true,
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Inter', sans-serif" }}>
            <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111c2d' }}>Paramètres Plateforme</h2>
                <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>Configuration globale de Dokita</p>
            </div>

            {/* Infos générales */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e7eeff' }}>
                <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: '#016472' }}>⚙️ Informations générales</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {[
                        { key: 'platform_name',    label: 'Nom de la plateforme', type: 'text' },
                        { key: 'support_email',    label: 'Email support',         type: 'email' },
                        { key: 'support_phone',    label: 'Téléphone support',     type: 'tel' },
                        { key: 'consultation_fee_min', label: 'Tarif min (XAF)',   type: 'number' },
                        { key: 'consultation_fee_max', label: 'Tarif max (XAF)',   type: 'number' },
                    ].map(f => (
                        <div key={f.key}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6f797b', marginBottom: 5 }}>{f.label}</label>
                            <input type={f.type} value={settings[f.key]}
                                onChange={e => setSettings({ ...settings, [f.key]: e.target.value })}
                                style={{ width: '100%', border: '1.5px solid #dde3f0', borderRadius: 10, padding: '11px 14px', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Toggles */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e7eeff' }}>
                <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: '#E8613A' }}>🔧 Contrôles système</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                        { key: 'maintenance_mode',   label: 'Mode maintenance',          desc: 'Désactive l\'accès pour les utilisateurs', danger: true },
                        { key: 'allow_registration', label: 'Inscriptions ouvertes',     desc: 'Autoriser les nouvelles inscriptions' },
                        { key: 'email_verification', label: 'Vérification email requise', desc: 'Les nouveaux comptes doivent vérifier leur email' },
                    ].map(s => (
                        <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: '#f9f9ff', borderRadius: 12, border: `1px solid ${s.danger && settings[s.key] ? '#fecaca' : '#e7eeff'}` }}>
                            <div>
                                <p style={{ margin: '0 0 3px', fontWeight: 600, fontSize: 14, color: '#111c2d' }}>{s.label}</p>
                                <p style={{ margin: 0, fontSize: 12, color: '#6f797b' }}>{s.desc}</p>
                            </div>
                            <button onClick={() => setSettings({ ...settings, [s.key]: !settings[s.key] })}
                                style={{ width: 52, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer', background: settings[s.key] ? (s.danger ? '#dc2626' : '#016472') : '#d1d5db', position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}>
                                <span style={{ position: 'absolute', top: 3, left: settings[s.key] ? 26 : 3, width: 22, height: 22, borderRadius: '50%', background: 'white', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sauvegarder */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ background: '#111c2d', color: 'white', border: 'none', borderRadius: 12, padding: '13px 32px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                    💾 Sauvegarder les paramètres
                </button>
            </div>
        </div>
    );
};

export default AdminSettings;