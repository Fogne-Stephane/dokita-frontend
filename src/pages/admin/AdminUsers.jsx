import { useState } from 'react';

const USERS = [
    { id: 1, name: 'M. Talla Jean',     email: 'talla@test.com',   role: 'patient', status: 'active',   joined: '01 Jun 2026' },
    { id: 2, name: 'Mme Eboa Claire',   email: 'eboa@test.com',    role: 'patient', status: 'active',   joined: '03 Jun 2026' },
    { id: 3, name: 'Dr. Kamga Pierre',  email: 'kamga@test.com',   role: 'doctor',  status: 'active',   joined: '15 Mai 2026' },
    { id: 4, name: 'Dr. Mballa Sophie', email: 'mballa@test.com',  role: 'doctor',  status: 'pending',  joined: '08 Jun 2026' },
    { id: 5, name: 'M. Biya Paul',      email: 'biya@test.com',    role: 'patient', status: 'blocked',  joined: '20 Avr 2026' },
    { id: 6, name: 'Mme Ngo Marie',     email: 'ngo@test.com',     role: 'patient', status: 'active',   joined: '10 Jun 2026' },
];

const STATUS_CONFIG = {
    active:  { label: 'Actif',       bg: '#dcfce7', color: '#16a34a' },
    pending: { label: 'En attente',  bg: '#fef9c3', color: '#ca8a04' },
    blocked: { label: 'Bloqué',      bg: '#fee2e2', color: '#dc2626' },
};

const AdminUsers = () => {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('Tous');
    const [users, setUsers] = useState(USERS);

    const filtered = users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'Tous' || u.role === roleFilter.toLowerCase();
        return matchSearch && matchRole;
    });

    const toggleBlock = (id) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'blocked' ? 'active' : 'blocked' } : u));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Inter', sans-serif" }}>
            <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111c2d' }}>Gestion Utilisateurs</h2>
                <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>{users.length} utilisateurs enregistrés</p>
            </div>

            {/* Filtres */}
            <div style={{ background: 'white', borderRadius: 14, padding: 18, border: '1px solid #e7eeff', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <input placeholder="🔍  Rechercher..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    style={{ flex: 1, minWidth: 200, border: '1.5px solid #dde3f0', borderRadius: 10, padding: '10px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                />
                {['Tous', 'Patient', 'Doctor'].map(r => (
                    <button key={r} onClick={() => setRoleFilter(r)} style={{ padding: '9px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, background: roleFilter === r ? '#111c2d' : '#f0f3ff', color: roleFilter === r ? 'white' : '#6f797b', transition: 'all 0.2s' }}>
                        {r === 'Doctor' ? 'Médecins' : r}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e7eeff', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9f9ff', borderBottom: '1px solid #e7eeff' }}>
                            {['Utilisateur', 'Email', 'Rôle', 'Inscription', 'Statut', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6f797b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((u, i) => {
                            const st = STATUS_CONFIG[u.status];
                            return (
                                <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f0f3ff' : 'none', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f9f9ff'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                >
                                    <td style={{ padding: '14px 18px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: u.role === 'doctor' ? 'linear-gradient(135deg, #E8613A, #E8913A)' : 'linear-gradient(135deg, #016472, #2e7d8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
                                                {u.name.split(' ').pop()[0]}
                                            </div>
                                            <span style={{ fontWeight: 600, fontSize: 14, color: '#111c2d' }}>{u.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 18px', fontSize: 13, color: '#6f797b' }}>{u.email}</td>
                                    <td style={{ padding: '14px 18px' }}>
                                        <span style={{ background: u.role === 'doctor' ? '#fff4f0' : '#e7eeff', color: u.role === 'doctor' ? '#E8613A' : '#016472', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                                            {u.role === 'doctor' ? '👨‍⚕️ Médecin' : '🧑 Patient'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 18px', fontSize: 13, color: '#6f797b' }}>{u.joined}</td>
                                    <td style={{ padding: '14px 18px' }}>
                                        <span style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>{st.label}</span>
                                    </td>
                                    <td style={{ padding: '14px 18px' }}>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button style={{ background: '#f0f3ff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: '#016472', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                                                👁️ Voir
                                            </button>
                                            <button onClick={() => toggleBlock(u.id)} style={{ background: u.status === 'blocked' ? '#dcfce7' : '#fee2e2', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: u.status === 'blocked' ? '#16a34a' : '#dc2626', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                                                {u.status === 'blocked' ? '✅ Débloquer' : '🚫 Bloquer'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;