import { useState, useEffect } from 'react';
import api from '../../api/axios';

const DS = {
  primary:'#016472', secondary:'#E8613A', surface:'#ffffff',
  surfaceLow:'#f0f3ff', surfaceContainer:'#e7eeff',
  onSurface:'#111c2d', outline:'#6f797b', outlineVariant:'#bec8cb',
};

export default function AdminUsers() {
  const [users,  setUsers]  = useState([]);
  const [loading,setLoading]= useState(true);
  const [search, setSearch] = useState('');
  const [role,   setRole]   = useState('Tous');
  const [acting, setActing] = useState(null);

  useEffect(() => {
    api.get('/admin/users')
      .then(res => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleToggleBlock = async (u) => {
    setActing(u.id);
    try {
      await api.post(`/admin/users/${u.id}/toggle-block`);
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, is_active: !x.is_active } : x));
    } catch (e) { console.error(e); }
    finally { setActing(null); }
  };

  const filtered = users.filter(u => {
    const matchS = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchR = role === 'Tous' || u.role === role.toLowerCase();
    return matchS && matchR;
  });

  if (loading) return <p style={{ fontFamily:"'Inter',sans-serif", color:'#6f797b', textAlign:'center', padding:40 }}>Chargement...</p>;

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", display:'flex', flexDirection:'column', gap:20 }}>
      <div>
        <h1 style={{ fontSize:'clamp(18px,3vw,24px)', fontWeight:700, color: DS.onSurface, margin:'0 0 4px' }}>Gestion Utilisateurs</h1>
        <p style={{ fontSize:14, color: DS.outline, margin:0 }}>{users.length} utilisateurs enregistrés</p>
      </div>

      {/* Filtres */}
      <div style={{ background: DS.surface, borderRadius:12, padding:'14px 18px', border:`1px solid ${DS.outlineVariant}`, display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
        <input placeholder="🔍 Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex:1, minWidth:180, border:`1.5px solid ${DS.outlineVariant}`, borderRadius:8, padding:'9px 14px', fontSize:14, fontFamily:'inherit', outline:'none' }} />
        {['Tous','Patient','Doctor'].map(r => (
          <button key={r} onClick={() => setRole(r)}
            style={{ padding:'9px 16px', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:600, background: role===r ? DS.primary : DS.surfaceLow, color: role===r ? '#fff' : DS.outline, transition:'all .2s' }}>
            {r === 'Doctor' ? 'Médecins' : r}
          </button>
        ))}
      </div>

      {/* Table responsive */}
      <div style={{ background: DS.surface, borderRadius:12, border:`1px solid ${DS.outlineVariant}`, overflow:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', minWidth:600 }}>
          <thead>
            <tr style={{ background: DS.surfaceLow }}>
              {['Utilisateur','Email','Rôle','Statut','Actions'].map(h => (
                <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:12, fontWeight:700, color: DS.outline, textTransform:'uppercase', letterSpacing:'0.06em', borderBottom:`1px solid ${DS.outlineVariant}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i<filtered.length-1 ? `1px solid ${DS.outlineVariant}` : 'none' }}>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:'50%', background: u.role==='doctor' ? `linear-gradient(135deg,${DS.secondary},#E8913A)` : `linear-gradient(135deg,${DS.primary},#2e7d8c)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:13, flexShrink:0 }}>
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontWeight:600, fontSize:14, color: DS.onSurface }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding:'12px 16px', fontSize:13, color: DS.outline }}>{u.email}</td>
                <td style={{ padding:'12px 16px' }}>
                  <span style={{ background: u.role==='doctor' ? '#fff4f0' : DS.surfaceContainer, color: u.role==='doctor' ? DS.secondary : DS.primary, padding:'3px 10px', borderRadius:999, fontSize:12, fontWeight:600 }}>
                    {u.role==='doctor' ? '👨‍⚕️ Médecin' : '🧑 Patient'}
                  </span>
                </td>
                <td style={{ padding:'12px 16px' }}>
                  <span style={{ background: u.is_active ? '#e1f5ee' : '#ffdad6', color: u.is_active ? DS.primary : '#ba1a1a', padding:'3px 10px', borderRadius:999, fontSize:12, fontWeight:600 }}>
                    {u.is_active ? 'Actif' : 'Bloqué'}
                  </span>
                </td>
                <td style={{ padding:'12px 16px' }}>
                  <button onClick={() => handleToggleBlock(u)} disabled={acting===u.id}
                    style={{ background: u.is_active ? '#ffdad6' : '#e1f5ee', border:'none', borderRadius:8, padding:'6px 14px', fontSize:12, color: u.is_active ? '#ba1a1a' : DS.primary, fontWeight:600, cursor:'pointer', fontFamily:'inherit', opacity: acting===u.id ? 0.6 : 1 }}>
                    {u.is_active ? '🚫 Bloquer' : '✅ Débloquer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}