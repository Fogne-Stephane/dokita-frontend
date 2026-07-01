import { useState } from 'react';

const DoctorPrescriptions = () => {
    const [showForm, setShowForm] = useState(false);
    const [medications, setMedications] = useState([{ name: '', dose: '', frequency: '', duration: '' }]);

    const addMed = () => setMedications([...medications, { name: '', dose: '', frequency: '', duration: '' }]);
    const removeMed = (i) => setMedications(medications.filter((_, idx) => idx !== i));

    const HISTORY = [
        { id: 1, patient: 'M. Talla Jean',   date: '10 Jun 2026', meds: ['Amlodipine 5mg', 'Aspirine 100mg'] },
        { id: 2, patient: 'Mme Eboa Claire', date: '08 Jun 2026', meds: ['Bisoprolol 2.5mg'] },
        { id: 3, patient: 'M. Biya Paul',    date: '02 Jun 2026', meds: ['Furosémide 40mg', 'Spironolactone 25mg'] },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111c2d' }}>Prescriptions</h2>
                    <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>Rédigez et gérez les ordonnances de vos patients</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} style={{ background: 'linear-gradient(90deg, #E8613A, #E8913A)', color: 'white', border: 'none', borderRadius: 12, padding: '12px 22px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(232,97,58,0.3)' }}>
                    {showForm ? '✕ Fermer' : '+ Nouvelle ordonnance'}
                </button>
            </div>

            {/* Formulaire */}
            {showForm && (
                <div style={{ background: 'white', borderRadius: 18, padding: 28, border: '1px solid #e7eeff' }}>
                    <h3 style={{ margin: '0 0 22px', fontSize: 17, fontWeight: 700, color: '#016472' }}>📝 Nouvelle ordonnance</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 22 }}>
                        <div>
                            <label style={labelStyle}>Patient</label>
                            <select style={inputStyle}>
                                <option>M. Talla Jean</option>
                                <option>Mme Eboa Claire</option>
                                <option>M. Biya Paul</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Date</label>
                            <input type="date" style={inputStyle} defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>
                        <div>
                            <label style={labelStyle}>Valide jusqu'au</label>
                            <input type="date" style={inputStyle} />
                        </div>
                    </div>

                    <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#111c2d' }}>Médicaments</h4>
                    {medications.map((med, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 10, marginBottom: 10, alignItems: 'end' }}>
                            {[
                                { key: 'name',      label: i === 0 ? 'Médicament' : '',  placeholder: 'Ex: Amlodipine 5mg' },
                                { key: 'dose',      label: i === 0 ? 'Dose' : '',         placeholder: '1 comprimé' },
                                { key: 'frequency', label: i === 0 ? 'Fréquence' : '',    placeholder: '2x/jour' },
                                { key: 'duration',  label: i === 0 ? 'Durée' : '',        placeholder: '30 jours' },
                            ].map(f => (
                                <div key={f.key}>
                                    {f.label && <label style={labelStyle}>{f.label}</label>}
                                    <input placeholder={f.placeholder} value={med[f.key]}
                                        onChange={e => {
                                            const updated = [...medications];
                                            updated[i][f.key] = e.target.value;
                                            setMedications(updated);
                                        }}
                                        style={inputStyle}
                                    />
                                </div>
                            ))}
                            <button onClick={() => removeMed(i)} disabled={medications.length === 1}
                                style={{ padding: '11px 12px', background: '#fee2e2', border: 'none', borderRadius: 10, color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>
                                ✕
                            </button>
                        </div>
                    ))}
                    <button onClick={addMed} style={{ background: '#f0f3ff', border: '1.5px dashed #016472', borderRadius: 10, padding: '10px 20px', color: '#016472', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 20 }}>
                        + Ajouter un médicament
                    </button>

                    <div>
                        <label style={labelStyle}>Instructions complémentaires</label>
                        <textarea rows={3} placeholder="Ex: Prendre avec de la nourriture, éviter l'alcool..." style={{ ...inputStyle, resize: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                        <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '13px', border: '1.5px solid #dde3f0', borderRadius: 12, background: 'white', color: '#3f484b', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                            Annuler
                        </button>
                        <button style={{ flex: 2, padding: '13px', border: 'none', borderRadius: 12, background: '#016472', color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                            ✅ Valider et envoyer au patient
                        </button>
                    </div>
                </div>
            )}

            {/* Historique */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e7eeff' }}>
                <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 700, color: '#111c2d' }}>📋 Ordonnances récentes</h3>
                {HISTORY.map((h, i) => (
                    <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: i < HISTORY.length - 1 ? '1px solid #f0f3ff' : 'none' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#e7eeff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>💊</div>
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 14, color: '#111c2d' }}>{h.patient}</p>
                            <p style={{ margin: 0, fontSize: 12, color: '#6f797b' }}>{h.date} • {h.meds.join(', ')}</p>
                        </div>
                        <button style={{ background: '#f0f3ff', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 12, color: '#016472', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                            ⬇️ PDF
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#6f797b', marginBottom: 5 };
const inputStyle = { width: '100%', border: '1.5px solid #dde3f0', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'white', boxSizing: 'border-box' };

export default DoctorPrescriptions;