import { useState, useEffect } from 'react';
import { Search, User, Phone, MapPin, ChevronRight, X, FileText, MessageSquare, Pill } from 'lucide-react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const DS = {
  primary:'#016472', secondary:'#E8613A', bg:'#f9f9ff',
  surface:'#ffffff', surfaceLow:'#f0f3ff', surfaceContainer:'#e7eeff',
  onSurface:'#111c2d', outline:'#6f797b', outlineVariant:'#bec8cb',
};

const getInitials = (name) => {
  const p = (name||'').split(' ');
  return (p[0]?.[0]||'') + (p[1]?.[0]||'');
};

export default function DoctorPatients() {
  const navigate = useNavigate();
  const [patients, setPatients]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/doctor/patients');
        setPatients(res.data);
        if (res.data.length > 0) setSelected(res.data[0]);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300, fontFamily:'Inter,sans-serif' }}>
      <p style={{ color: DS.outline }}>Chargement des patients...</p>
    </div>
  );

  return (
    <div style={{ fontFamily:'Inter,sans-serif', display:'flex', gap:20, alignItems:'flex-start' }}>

      {/* ── Liste patients ── */}
      <div style={{ flex:1 }}>
        <div style={{ marginBottom:20 }}>
          <h1 style={{ fontSize:24, fontWeight:700, color: DS.onSurface, margin:'0 0 4px', letterSpacing:'-0.02em' }}>
            Mes Patients
          </h1>
          <p style={{ fontSize:14, color: DS.outline, margin:0 }}>
            {patients.length} patient{patients.length > 1 ? 's' : ''} suivi{patients.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Recherche */}
        <div style={{ display:'flex', alignItems:'center', gap:10, background: DS.surface, border:`1.5px solid ${DS.outlineVariant}`, borderRadius:12, padding:'10px 16px', marginBottom:16 }}>
          <Search size={16} color={DS.outline} />
          <input
            type="text" placeholder="Rechercher un patient..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ border:'none', outline:'none', background:'transparent', fontSize:14, color: DS.onSurface, fontFamily:'inherit', flex:1 }}
          />
        </div>

        {/* Liste */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:40, background: DS.surface, borderRadius:12, border:`1px solid ${DS.outlineVariant}` }}>
              <User size={36} color={DS.outlineVariant} style={{ margin:'0 auto 12px' }} />
              <p style={{ color: DS.outline }}>Aucun patient trouvé</p>
            </div>
          ) : filtered.map(p => (
            <div key={p.id} onClick={() => setSelected(p)}
              style={{ background: DS.surface, borderRadius:12, padding:'14px 18px', border:`1.5px solid ${selected?.id === p.id ? DS.primary : DS.outlineVariant}`, display:'flex', alignItems:'center', gap:14, cursor:'pointer', transition:'all .2s' }}>
              {/* Avatar */}
              <div style={{ width:46, height:46, borderRadius:'50%', background:`linear-gradient(135deg,${DS.primary},#2e7d8c)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:16, flexShrink:0 }}>
                {getInitials(p.name).toUpperCase()}
              </div>
              {/* Infos */}
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ margin:'0 0 3px', fontWeight:600, fontSize:14, color: DS.onSurface }}>{p.name}</p>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  {p.city && <span style={{ fontSize:12, color: DS.outline, display:'flex', alignItems:'center', gap:3 }}><MapPin size={11} />{p.city}</span>}
                  {p.consultations_count > 0 && <span style={{ fontSize:12, color: DS.outline }}>🩺 {p.consultations_count} consultation{p.consultations_count>1?'s':''}</span>}
                  {p.last_visit && <span style={{ fontSize:12, color: DS.outline }}>📅 {p.last_visit}</span>}
                </div>
              </div>
              <ChevronRight size={16} color={selected?.id === p.id ? DS.primary : DS.outline} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Fiche patient ── */}
      <div style={{ width:320, flexShrink:0, position:'sticky', top:80 }}>
        {selected ? (
          <div style={{ background: DS.surface, borderRadius:16, border:`1px solid ${DS.outlineVariant}`, overflow:'hidden' }}>
            {/* Header fiche */}
            <div style={{ background:`linear-gradient(135deg,${DS.primary},#2e7d8c)`, padding:'24px 20px', textAlign:'center', position:'relative' }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:24, margin:'0 auto 12px' }}>
                {getInitials(selected.name).toUpperCase()}
              </div>
              <p style={{ color:'#fff', fontWeight:700, fontSize:16, margin:'0 0 4px' }}>{selected.name}</p>
              {selected.city && <p style={{ color:'rgba(255,255,255,0.75)', fontSize:13, margin:0 }}>📍 {selected.city}</p>}
            </div>

            {/* Infos */}
            <div style={{ padding:20 }}>

              {/* Stats rapides */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
                {[
                  { label:'Consultations', value: selected.consultations_count || 0 },
                  { label:'Groupe sg.',    value: selected.blood_type || '—' },
                ].map((s,i) => (
                  <div key={i} style={{ background: DS.surfaceLow, borderRadius:10, padding:'10px', textAlign:'center' }}>
                    <p style={{ fontSize:18, fontWeight:700, color: DS.primary, margin:'0 0 2px' }}>{s.value}</p>
                    <p style={{ fontSize:11, color: DS.outline, margin:0 }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Détails */}
              <div style={{ display:'flex', flexDirection:'column', gap:0, marginBottom:16 }}>
                {[
                  { icon:<Phone size={14}/>,   label:'Téléphone',    value: selected.phone || 'Non renseigné' },
                  { icon:<User size={14}/>,    label:'Genre',        value: selected.gender === 'male' ? 'Homme' : selected.gender === 'female' ? 'Femme' : '—' },
                  { icon:<User size={14}/>,    label:'Naissance',    value: selected.birth_date || '—' },
                  { icon:<MapPin size={14}/>,  label:'Adresse',      value: selected.city || '—' },
                ].map((item,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 0', borderBottom:`1px solid ${DS.outlineVariant}` }}>
                    <span style={{ color: DS.outline, marginTop:1, flexShrink:0 }}>{item.icon}</span>
                    <div>
                      <p style={{ fontSize:11, color: DS.outline, margin:'0 0 2px' }}>{item.label}</p>
                      <p style={{ fontSize:13, fontWeight:500, color: DS.onSurface, margin:0 }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Allergies */}
              {selected.allergies && (
                <div style={{ background:'#ffdad6', borderRadius:10, padding:'10px 12px', marginBottom:12 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:'#ba1a1a', margin:'0 0 6px' }}>⚠️ Allergies</p>
                  <p style={{ fontSize:12, color:'#ba1a1a', margin:0 }}>{selected.allergies}</p>
                </div>
              )}

              {/* Maladies chroniques */}
              {selected.chronic_diseases && (
                <div style={{ background:'#fff8e7', borderRadius:10, padding:'10px 12px', marginBottom:16 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:'#884b00', margin:'0 0 6px' }}>🔶 Maladies chroniques</p>
                  <p style={{ fontSize:12, color:'#884b00', margin:0 }}>{selected.chronic_diseases}</p>
                </div>
              )}

              {/* Dernière consultation */}
              {selected.last_diagnosis && (
                <div style={{ background: DS.surfaceLow, borderRadius:10, padding:'12px', marginBottom:16 }}>
                  <p style={{ fontSize:12, fontWeight:700, color: DS.outline, margin:'0 0 6px', textTransform:'uppercase', letterSpacing:'0.05em' }}>Dernier diagnostic</p>
                  <p style={{ fontSize:13, color: DS.onSurface, margin:0, lineHeight:1.5 }}>{selected.last_diagnosis}</p>
                </div>
              )}

              {/* Actions */}
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <button onClick={() => navigate('/doctor/prescriptions')}
                  style={{ width:'100%', padding:'11px', background:`linear-gradient(90deg,${DS.primary},#2e7d8c)`, color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  <Pill size={15} /> Nouvelle prescription
                </button>
                <button onClick={() => navigate('/doctor/messages')}
                  style={{ width:'100%', padding:'11px', background: DS.surfaceContainer, color: DS.primary, border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  <MessageSquare size={15} /> Envoyer un message
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: DS.surface, borderRadius:16, padding:40, border:`1px solid ${DS.outlineVariant}`, textAlign:'center' }}>
            <User size={36} color={DS.outlineVariant} style={{ margin:'0 auto 12px' }} />
            <p style={{ color: DS.outline, fontSize:14 }}>Sélectionnez un patient</p>
          </div>
        )}
      </div>
    </div>
  );
}