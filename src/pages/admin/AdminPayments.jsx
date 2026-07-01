const TRANSACTIONS = [
    { id: 'TXN-001', patient: 'M. Talla Jean',   doctor: 'Dr. Kamga',  amount: '15 000', method: 'Orange Money', status: 'completed', date: '10 Jun 2026' },
    { id: 'TXN-002', patient: 'Mme Eboa Claire', doctor: 'Dr. Mballa', amount: '12 000', method: 'MTN MoMo',     status: 'completed', date: '10 Jun 2026' },
    { id: 'TXN-003', patient: 'M. Biya Paul',    doctor: 'Dr. Kamga',  amount: '15 000', method: 'Orange Money', status: 'pending',   date: '09 Jun 2026' },
    { id: 'TXN-004', patient: 'Mme Ngo Marie',   doctor: 'Dr. Fongang', amount: '10 000', method: 'MTN MoMo',    status: 'failed',    date: '08 Jun 2026' },
];

const STATUS = {
    completed: { label: 'Succès',    bg: '#dcfce7', color: '#16a34a' },
    pending:   { label: 'En cours',  bg: '#fef9c3', color: '#ca8a04' },
    failed:    { label: 'Échoué',    bg: '#fee2e2', color: '#dc2626' },
};

const AdminPayments = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Inter', sans-serif" }}>
        <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111c2d' }}>Paiements & Transactions</h2>
            <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>Suivi de toutes les transactions de la plateforme</p>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
                { label: 'Revenus du mois',     value: '12 400 000 XAF', icon: '💰', color: '#22c55e' },
                { label: 'Transactions totales', value: '3 891',          icon: '📊', color: '#016472' },
                { label: 'Orange Money',          value: '58%',            icon: '🟠', color: '#E8613A' },
                { label: 'MTN MoMo',              value: '42%',            icon: '🟡', color: '#ca8a04' },
            ].map((k, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 14, padding: 18, border: '1px solid #e7eeff', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 26 }}>{k.icon}</span>
                    <div>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#111c2d' }}>{k.value}</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#6f797b' }}>{k.label}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e7eeff', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f3ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111c2d' }}>Transactions récentes</h3>
                <button style={{ background: '#f0f3ff', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, color: '#016472', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    ⬇️ Exporter CSV
                </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f9f9ff' }}>
                        {['ID', 'Patient', 'Médecin', 'Montant', 'Méthode', 'Date', 'Statut'].map(h => (
                            <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6f797b', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e7eeff' }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {TRANSACTIONS.map((t, i) => {
                        const st = STATUS[t.status];
                        return (
                            <tr key={t.id} style={{ borderBottom: i < TRANSACTIONS.length - 1 ? '1px solid #f0f3ff' : 'none' }}>
                                <td style={{ padding: '13px 18px', fontSize: 13, fontWeight: 600, color: '#016472' }}>{t.id}</td>
                                <td style={{ padding: '13px 18px', fontSize: 13, color: '#111c2d', fontWeight: 500 }}>{t.patient}</td>
                                <td style={{ padding: '13px 18px', fontSize: 13, color: '#6f797b' }}>{t.doctor}</td>
                                <td style={{ padding: '13px 18px', fontSize: 13, fontWeight: 700, color: '#111c2d' }}>{t.amount} XAF</td>
                                <td style={{ padding: '13px 18px', fontSize: 13, color: '#6f797b' }}>{t.method}</td>
                                <td style={{ padding: '13px 18px', fontSize: 13, color: '#6f797b' }}>{t.date}</td>
                                <td style={{ padding: '13px 18px' }}>
                                    <span style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>{st.label}</span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
);

export default AdminPayments;