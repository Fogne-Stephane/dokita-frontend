import { useState } from 'react';

const MOCK_PENDING = [
    { id: 1, doctor: 'Dr. Kamga Pierre', spec: 'Cardiologue', date: '10 Jun 2026', amount: 15000, appointmentId: 1 },
    { id: 2, doctor: 'Dr. Mballa Sophie', spec: 'Pédiatre',   date: '15 Jun 2026', amount: 12000, appointmentId: 2 },
];

const MOCK_HISTORY = [
    { id: 1, doctor: 'Dr. Fongang Luc', amount: '10 000 XAF', method: 'mtn_momo',     status: 'completed', date: '02 Jun 2026' },
    { id: 2, doctor: 'Dr. Kamga Pierre', amount: '15 000 XAF', method: 'orange_money', status: 'completed', date: '15 Mai 2026' },
    { id: 3, doctor: 'Dr. Nkeng Paul',   amount: '20 000 XAF', method: 'mtn_momo',     status: 'failed',    date: '01 Mai 2026' },
];

const STATUS_CONFIG = {
    completed: { label: 'Payé',      bg: '#dcfce7', color: '#16a34a' },
    pending:   { label: 'En cours',  bg: '#fef9c3', color: '#ca8a04' },
    failed:    { label: 'Échoué',    bg: '#fee2e2', color: '#dc2626' },
};

const METHOD_CONFIG = {
    mtn_momo:     { label: 'MTN MoMo',     icon: '🟡', color: '#ca8a04' },
    orange_money: { label: 'Orange Money', icon: '🟠', color: '#ea580c' },
};

const PatientPayments = () => {
    const [showModal, setShowModal]   = useState(false);
    const [selected, setSelected]     = useState(null);
    const [method, setMethod]         = useState('mtn_momo');
    const [phone, setPhone]           = useState('');
    const [loading, setLoading]       = useState(false);
    const [success, setSuccess]       = useState(false);
    const [activeTab, setActiveTab]   = useState('pending');

    const openModal = (rdv) => {
        setSelected(rdv);
        setSuccess(false);
        setShowModal(true);
    };

    const handlePay = async () => {
        if (!phone.trim()) return;
        setLoading(true);
        // Simulation — en production, appeler l'API réelle
        await new Promise(r => setTimeout(r, 2000));
        setLoading(false);
        setSuccess(true);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Inter', sans-serif" }}>

            {/* Header */}
            <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111c2d' }}>Paiements</h2>
                <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>Gérez vos paiements de consultations</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, background: 'white', padding: 6, borderRadius: 14, border: '1px solid #e7eeff', width: 'fit-content' }}>
                {[
                    { key: 'pending', label: '⏳ À payer' },
                    { key: 'history', label: '📋 Historique' },
                ].map(t => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)}
                        style={{ padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, background: activeTab === t.key ? '#016472' : 'transparent', color: activeTab === t.key ? 'white' : '#6f797b', transition: 'all 0.2s' }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* À payer */}
            {activeTab === 'pending' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {MOCK_PENDING.map(rdv => (
                        <div key={rdv.id} style={{ background: 'white', borderRadius: 16, padding: '20px 24px', border: '1px solid #e7eeff', display: 'flex', alignItems: 'center', gap: 18 }}>
                            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #016472, #2e7d8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>👨‍⚕️</div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 15, color: '#111c2d' }}>{rdv.doctor}</p>
                                <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>{rdv.spec} • {rdv.date}</p>
                            </div>
                            <div style={{ textAlign: 'right', marginRight: 16 }}>
                                <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#016472' }}>{rdv.amount.toLocaleString()} XAF</p>
                                <p style={{ margin: 0, fontSize: 12, color: '#6f797b' }}>Consultation vidéo</p>
                            </div>
                            <button onClick={() => openModal(rdv)}
                                style={{ background: 'linear-gradient(90deg, #E8613A, #E8913A)', color: 'white', border: 'none', borderRadius: 12, padding: '12px 22px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(232,97,58,0.3)', whiteSpace: 'nowrap' }}>
                                💳 Payer maintenant
                            </button>
                        </div>
                    ))}
                    {MOCK_PENDING.length === 0 && (
                        <div style={{ textAlign: 'center', padding: 48, background: 'white', borderRadius: 16, border: '1px solid #e7eeff' }}>
                            <p style={{ fontSize: 40, margin: '0 0 12px' }}>✅</p>
                            <p style={{ color: '#6f797b', fontWeight: 600 }}>Aucun paiement en attente</p>
                        </div>
                    )}
                </div>
            )}

            {/* Historique */}
            {activeTab === 'history' && (
                <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e7eeff', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9f9ff', borderBottom: '1px solid #e7eeff' }}>
                                {['Médecin', 'Montant', 'Méthode', 'Date', 'Statut'].map(h => (
                                    <th key={h} style={{ padding: '13px 18px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6f797b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_HISTORY.map((p, i) => {
                                const st = STATUS_CONFIG[p.status];
                                const mt = METHOD_CONFIG[p.method];
                                return (
                                    <tr key={p.id} style={{ borderBottom: i < MOCK_HISTORY.length - 1 ? '1px solid #f0f3ff' : 'none' }}>
                                        <td style={{ padding: '14px 18px', fontWeight: 600, fontSize: 14, color: '#111c2d' }}>{p.doctor}</td>
                                        <td style={{ padding: '14px 18px', fontWeight: 700, fontSize: 14, color: '#016472' }}>{p.amount}</td>
                                        <td style={{ padding: '14px 18px', fontSize: 13 }}>
                                            <span style={{ color: mt.color, fontWeight: 600 }}>{mt.icon} {mt.label}</span>
                                        </td>
                                        <td style={{ padding: '14px 18px', fontSize: 13, color: '#6f797b' }}>{p.date}</td>
                                        <td style={{ padding: '14px 18px' }}>
                                            <span style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>{st.label}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de paiement */}
            {showModal && selected && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
                    onClick={() => !loading && setShowModal(false)}>
                    <div style={{ background: 'white', borderRadius: 24, padding: 36, width: '100%', maxWidth: 460, position: 'relative' }}
                        onClick={e => e.stopPropagation()}>

                        {!success ? (
                            <>
                                <h3 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 800, color: '#111c2d' }}>
                                    💳 Paiement DOKITA
                                </h3>
                                <p style={{ margin: '0 0 24px', fontSize: 13, color: '#6f797b' }}>
                                    Choisissez votre méthode de paiement Mobile Money
                                </p>

                                {/* Récap RDV */}
                                <div style={{ background: '#f0f3ff', borderRadius: 14, padding: 16, marginBottom: 24 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 14, color: '#111c2d' }}>{selected.doctor}</p>
                                            <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>{selected.spec} • {selected.date}</p>
                                        </div>
                                        <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#016472' }}>
                                            {selected.amount.toLocaleString()} XAF
                                        </p>
                                    </div>
                                </div>

                                {/* Choix méthode */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                                    {[
                                        { key: 'mtn_momo',     label: 'MTN MoMo',     icon: '🟡', desc: 'Mobile Money MTN' },
                                        { key: 'orange_money', label: 'Orange Money', icon: '🟠', desc: 'Paiement Orange' },
                                    ].map(m => (
                                        <button key={m.key} onClick={() => setMethod(m.key)}
                                            style={{ padding: '16px 12px', borderRadius: 14, border: `2px solid ${method === m.key ? '#016472' : '#e7eeff'}`, background: method === m.key ? '#e7eeff' : 'white', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', textAlign: 'center' }}>
                                            <p style={{ margin: '0 0 4px', fontSize: 28 }}>{m.icon}</p>
                                            <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 14, color: '#111c2d' }}>{m.label}</p>
                                            <p style={{ margin: 0, fontSize: 11, color: '#6f797b' }}>{m.desc}</p>
                                        </button>
                                    ))}
                                </div>

                                {/* Numéro de téléphone */}
                                <div style={{ marginBottom: 24 }}>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#111c2d', marginBottom: 6 }}>
                                        Numéro {method === 'mtn_momo' ? 'MTN' : 'Orange'} à débiter
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder={method === 'mtn_momo' ? '+237 67X XXX XXX' : '+237 69X XXX XXX'}
                                        style={{ width: '100%', border: '1.5px solid #dde3f0', borderRadius: 12, padding: '13px 16px', fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                    <p style={{ margin: '6px 0 0', fontSize: 12, color: '#6f797b' }}>
                                        💡 Vous recevrez une notification USSD sur ce numéro pour confirmer
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button onClick={() => setShowModal(false)} disabled={loading}
                                        style={{ flex: 1, padding: '13px', border: '1.5px solid #dde3f0', borderRadius: 12, background: 'white', color: '#3f484b', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                                        Annuler
                                    </button>
                                    <button onClick={handlePay} disabled={loading || !phone.trim()}
                                        style={{ flex: 2, padding: '13px', border: 'none', borderRadius: 12, background: loading ? '#9ca3af' : 'linear-gradient(90deg, #E8613A, #E8913A)', color: 'white', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
                                        {loading ? '⏳ Traitement en cours...' : `Payer ${selected.amount.toLocaleString()} XAF`}
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* Succès */
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, margin: '0 auto 20px' }}>
                                    ✅
                                </div>
                                <h3 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#111c2d' }}>
                                    Demande envoyée !
                                </h3>
                                <p style={{ margin: '0 0 6px', fontSize: 14, color: '#6f797b' }}>
                                    Une notification USSD a été envoyée au
                                </p>
                                <p style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#016472' }}>{phone}</p>
                                <div style={{ background: '#fef9c3', borderRadius: 12, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: '#854d0e' }}>
                                    ⚠️ Confirmez le paiement sur votre téléphone dans les <strong>2 minutes</strong>
                                </div>
                                <button onClick={() => setShowModal(false)}
                                    style={{ width: '100%', padding: '13px', border: 'none', borderRadius: 12, background: '#016472', color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
                                    Fermer
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientPayments;