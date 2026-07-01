import { useState } from 'react';

const TABS = ['Résumé', 'Antécédents', 'Documents', 'Analyses'];

const PatientMedicalRecord = () => {
    const [activeTab, setActiveTab] = useState('Résumé');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Inter', sans-serif" }}>
            <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111c2d' }}>Dossier Médical</h2>
                <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>Votre historique médical complet et sécurisé</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, background: 'white', padding: 6, borderRadius: 14, border: '1px solid #e7eeff', width: 'fit-content' }}>
                {TABS.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, background: activeTab === tab ? '#016472' : 'transparent', color: activeTab === tab ? 'white' : '#6f797b', transition: 'all 0.2s' }}>
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'Résumé' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {/* Informations générales */}
                    <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e7eeff' }}>
                        <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 700, color: '#016472' }}>🩺 Informations générales</h3>
                        {[
                            { label: 'Groupe sanguin', value: 'A+' },
                            { label: 'Taille', value: '175 cm' },
                            { label: 'Poids', value: '72 kg' },
                            { label: 'IMC', value: '23.5 (Normal)' },
                            { label: 'Âge', value: '32 ans' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 4 ? '1px solid #f0f3ff' : 'none' }}>
                                <span style={{ fontSize: 13, color: '#6f797b' }}>{item.label}</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#111c2d' }}>{item.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Allergies */}
                    <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e7eeff' }}>
                        <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 700, color: '#E8613A' }}>⚠️ Allergies</h3>
                        {['Pénicilline', 'Arachides', 'Pollen'].map((a, i) => (
                            <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fef2f2', color: '#dc2626', padding: '5px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600, margin: '0 6px 8px 0' }}>
                                ⚠️ {a}
                            </div>
                        ))}
                        <div style={{ marginTop: 16 }}>
                            <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#111c2d' }}>Maladies chroniques</h4>
                            {['Hypertension légère'].map((m, i) => (
                                <div key={i} style={{ display: 'inline-flex', background: '#fff7ed', color: '#ea580c', padding: '5px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
                                    🔶 {m}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Traitements en cours */}
                    <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e7eeff', gridColumn: '1 / -1' }}>
                        <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 700, color: '#016472' }}>💊 Traitements en cours</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                            {[
                                { name: 'Amlodipine 5mg', freq: '1x par jour', since: 'Jan 2026', doctor: 'Dr. Kamga' },
                                { name: 'Vitamine D3', freq: '1x par semaine', since: 'Mar 2026', doctor: 'Dr. Fongang' },
                                { name: 'Omega-3', freq: '2x par jour', since: 'Mar 2026', doctor: 'Dr. Fongang' },
                            ].map((t, i) => (
                                <div key={i} style={{ background: '#f0f3ff', borderRadius: 12, padding: 16 }}>
                                    <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 14, color: '#111c2d' }}>{t.name}</p>
                                    <p style={{ margin: '0 0 4px', fontSize: 12, color: '#6f797b' }}>🕐 {t.freq}</p>
                                    <p style={{ margin: '0 0 4px', fontSize: 12, color: '#6f797b' }}>📅 Depuis {t.since}</p>
                                    <p style={{ margin: 0, fontSize: 12, color: '#016472', fontWeight: 600 }}>👨‍⚕️ {t.doctor}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'Documents' && (
                <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e7eeff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111c2d' }}>📁 Mes Documents</h3>
                        <button style={{ background: '#016472', color: 'white', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>+ Uploader</button>
                    </div>
                    {[
                        { name: 'Résultats analyse sanguine', type: 'PDF', date: '15 Mai 2026', size: '2.3 MB', icon: '🩸' },
                        { name: 'Radio thoracique', type: 'Image', date: '02 Avr 2026', size: '5.1 MB', icon: '🫁' },
                        { name: 'Ordonnance Dr. Kamga', type: 'PDF', date: '10 Mar 2026', size: '0.8 MB', icon: '💊' },
                        { name: 'ECG cardiaque', type: 'PDF', date: '28 Jan 2026', size: '1.2 MB', icon: '❤️' },
                    ].map((doc, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < 3 ? '1px solid #f0f3ff' : 'none' }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#e7eeff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{doc.icon}</div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#111c2d' }}>{doc.name}</p>
                                <p style={{ margin: 0, fontSize: 12, color: '#6f797b' }}>{doc.type} • {doc.size} • {doc.date}</p>
                            </div>
                            <button style={{ background: '#f0f3ff', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#016472', fontFamily: 'inherit' }}>
                                ⬇️ Télécharger
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'Antécédents' && (
                <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e7eeff' }}>
                    <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#111c2d' }}>📋 Antécédents médicaux</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[
                            { year: '2024', event: 'Hypertension diagnostiquée', doctor: 'Dr. Kamga Pierre', icon: '❤️', color: '#ef4444' },
                            { year: '2023', event: 'Appendicite opérée',         doctor: 'CHU de Douala',    icon: '🏥', color: '#E8613A' },
                            { year: '2022', event: 'Paludisme traité',            doctor: 'Dr. Fongang Luc',  icon: '🦟', color: '#f59e0b' },
                            { year: '2020', event: 'Fracture bras droit',         doctor: 'Clinique La Grâce', icon: '🦴', color: '#8b5cf6' },
                        ].map((a, i) => (
                            <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: a.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{a.icon}</div>
                                    {i < 3 && <div style={{ width: 2, height: 24, background: '#e7eeff' }} />}
                                </div>
                                <div style={{ paddingTop: 6 }}>
                                    <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 14, color: '#111c2d' }}>{a.event}</p>
                                    <p style={{ margin: 0, fontSize: 12, color: '#6f797b' }}>{a.year} • {a.doctor}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'Analyses' && (
                <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e7eeff' }}>
                    <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#111c2d' }}>🔬 Dernières analyses</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                        {[
                            { label: 'Glycémie',       value: '5.2 mmol/L', status: 'normal',  ref: '3.9–6.1' },
                            { label: 'Hémoglobine',    value: '14.5 g/dL',  status: 'normal',  ref: '13.5–17.5' },
                            { label: 'Pression art.',  value: '138/88 mmHg', status: 'warning', ref: '<120/80' },
                            { label: 'Cholestérol',    value: '5.8 mmol/L', status: 'warning', ref: '<5.2' },
                            { label: 'Créatinine',     value: '88 µmol/L',  status: 'normal',  ref: '62–115' },
                            { label: 'Leucocytes',     value: '6.8 G/L',    status: 'normal',  ref: '4.0–11.0' },
                        ].map((a, i) => {
                            const isWarning = a.status === 'warning';
                            return (
                                <div key={i} style={{ background: isWarning ? '#fff7ed' : '#f0fdf4', borderRadius: 12, padding: 16, border: `1px solid ${isWarning ? '#fed7aa' : '#bbf7d0'}` }}>
                                    <p style={{ margin: '0 0 6px', fontSize: 13, color: '#6f797b' }}>{a.label}</p>
                                    <p style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800, color: isWarning ? '#ea580c' : '#16a34a' }}>{a.value}</p>
                                    <p style={{ margin: 0, fontSize: 11, color: '#6f797b' }}>Réf : {a.ref}</p>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: isWarning ? '#ea580c' : '#16a34a' }}>
                                        {isWarning ? '⚠️ Attention' : '✅ Normal'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientMedicalRecord;