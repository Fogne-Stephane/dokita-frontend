import { useState, useEffect } from 'react';
import api from '../../api/axios';

const DS = {
  primary:'#016472', secondary:'#E8613A', surface:'#ffffff',
  surfaceLow:'#f0f3ff', surfaceContainer:'#e7eeff',
  onSurface:'#111c2d', outline:'#6f797b', outlineVariant:'#bec8cb',
};

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('Tous');
  const [acting,  setActing]  = useState(null);

  useEffect(() => {
    api.get('/admin/doctors')
      .then(res => setDoctors(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleVerify = async (id) => {
    setActing(id + '_v');
    try {
      await api.post(`/admin/doctors/${id}/verify`);
      setDoctors(prev => prev.map(d => d.id === id ? { ...d, is_verified: true } : d));
    } catch (e) { console.error(e); }
    finally { setActing(null); }
  };

  const handleReject = async (id) => {
    setActing(id + '_r');
    try {
      await api.post(`/admin/doctors/${id}/reject`);
      setDoctors(prev => prev.map(d => d.id === id ? { ...d, is_verified: false } : d));
    } catch (e) { console.error(e); }
    finally { setActing(null); }
  };

  const pending = doctors.filter(d => !d.is_verified);

  const filtered = doctors.filter(d => {
    if (filter === 'Tous')      return true;
    if (filter === 'En attente') return !d.is_verified;
    if (filter === 'Vérifiés')  return d.is_verified;
    return true;
  });

  if (loading) return <p style={{ fontFamily:"'Inter',sans-serif", color:'#6f797b', textAlign:'center', padding:40 }}>Chargement...</p>;

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", display:'flex', flexDirection:'column', gap:20 }}>
      <div>
        <h1 style={{ fontSize:'clamp(18px,3vw,24px)', fontWeight:700, color: DS.onSurface, margin:'0 0 4px' }}>Gestion Médecins</h1>
        <p style={{ fontSize:14, color: DS.outline, margin:0 }}>{doctors.length} médecins enregistrés</p>
      </div>

      {pending.length > 0 && (
        <div style={{ background:'#fff8e7', border:'1px solid #fde047', borderRadius:12, padding:'14px 18px', display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:22 }}>⚠️</span>
          <p style={{ margin:0, fontWeight:600, fontSize:14, color:'#884b00' }}>
            {pending.length} médecin{pending.length>1?'s':''} en attente de validation
          </p>
        </div>
      )}

      <div style={{ display:'flex', gap:6, background: DS.surface, padding:4, borderRadius:12, border:`1px solid ${DS.outlineVariant}`, width:'fit-content' }}>
        {['Tous','En attente','Vérifiés'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding:'8px 16px', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:600, background: filter===f ? DS.primary : 'transparent', color: filter===f ? '#fff' : DS.outline, transition:'all .2s' }}>
            {f} {f==='En attente' ? `(${pending.length})` : ''}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:48, background: DS.surface, borderRadius:12, border:`1px solid ${DS.outlineVariant}` }}>
          <p style={{ color: DS.outline }}>Aucun médecin dans cette catégorie</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
          {filtered.map(doc => (
            <div key={doc.id} style={{ background: DS.surface, borderRadius:12, padding:'clamp(16px,3vw,22px)', border:`1.5px solid ${!doc.is_verified ? '#fde047' : DS.outlineVariant}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
                <div style={{ width:48, height:48, borderRadius:12, background:`linear-gradient(135deg,${DS.secondary},#E8913A)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:20 }}>
                  {doc.name?.[0]?.toUpperCase()}
                </div>
                <span style={{ background: doc.is_verified ? '#e1f5ee' : '#fff8e7', color: doc.is_verified ? DS.primary : '#884b00', padding:'4px 12px', borderRadius:999, fontSize:12, fontWeight:600, height:'fit-content' }}>
                  {doc.is_verified ? '✅ Vérifié' : '⏳ En attente'}
                </span>
              </div>
              <p style={{ margin:'0 0 3px', fontWeight:700, fontSize:15, color: DS.onSurface }}>{doc.name}</p>
              <p style={{ margin:'0 0 12px', fontSize:13, color: DS.primary, fontWeight:600 }}>{doc.specialty}</p>
              <div style={{ fontSize:12, color: DS.outline, display:'flex', flexDirection:'column', gap:4, marginBottom:14 }}>
                <span>📧 {doc.email}</span>
                {doc.license_number && <span>🪪 {doc.license_number}</span>}
                {doc.experience_years > 0 && <span>🏆 {doc.experience_years} ans d'expérience</span>}
                <span>📅 {doc.created_at}</span>
              </div>
              {!doc.is_verified ? (
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => handleVerify(doc.id)} disabled={acting===doc.id+'_v'}
                    style={{ flex:1, padding:'9px', background: DS.primary, color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:13, opacity: acting===doc.id+'_v' ? 0.7 : 1 }}>
                    ✅ Valider
                  </button>
                  <button onClick={() => handleReject(doc.id)} disabled={acting===doc.id+'_r'}
                    style={{ flex:1, padding:'9px', background:'#ffdad6', color:'#ba1a1a', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:13 }}>
                    ✕ Rejeter
                  </button>
                </div>
              ) : (
                <button onClick={() => handleReject(doc.id)}
                  style={{ width:'100%', padding:'9px', background:'#ffdad6', color:'#ba1a1a', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:13 }}>
                  🚫 Suspendre
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}