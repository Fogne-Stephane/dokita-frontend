import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Calendar, Video, FileText, Pill, ArrowRight, Stethoscope } from 'lucide-react';
import api from '../../api/axios';

const DS = {
  primary:'#016472', secondary:'#E8613A', surface:'#ffffff',
  surfaceLow:'#f0f3ff', surfaceContainer:'#e7eeff',
  onSurface:'#111c2d', outline:'#6f797b', outlineVariant:'#bec8cb',
};

export default function PatientHome() {
  const navigate    = useNavigate();
  const { user }    = useSelector(s => s.auth);
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  useEffect(() => {
    (async () => {
      try {
        const [apptRes, presRes, recRes] = await Promise.all([
          api.get('/patient/appointments'),
          api.get('/patient/prescriptions'),
          api.get('/patient/medical-record'),
        ]);
        setData({
          appointments:  apptRes.data,
          prescriptions: presRes.data,
          stats:         recRes.data?.stats,
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const upcoming   = data?.appointments?.filter(a => ['confirmed','pending'].includes(a.status)) || [];
  const nextRdv    = upcoming[0];
  const activePres = data?.prescriptions?.filter(p => p.is_active) || [];

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", display:'flex', flexDirection:'column', gap:'clamp(16px,3vw,24px)' }}>

      {/* Bannière de bienvenue */}
      <div style={{ background:`linear-gradient(135deg,${DS.primary} 0%,#004e5a 100%)`, borderRadius:16, padding:'clamp(20px,4vw,28px)', color:'#fff', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-40, top:-40, width:200, height:200, background:'rgba(232,97,58,0.15)', borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16, position:'relative', zIndex:1 }}>
          <div>
            <p style={{ margin:'0 0 4px', opacity:0.8, fontSize:14 }}>{greeting} 👋</p>
            <h2 style={{ margin:'0 0 8px', fontSize:'clamp(18px,3vw,24px)', fontWeight:700 }}>{user?.name}</h2>
            <p style={{ margin:0, opacity:0.8, fontSize:13 }}>
              {nextRdv
                ? `Prochain RDV : ${nextRdv.scheduled_at}`
                : 'Aucun rendez-vous à venir'}
            </p>
          </div>
          <button onClick={() => navigate('/patient/doctors')}
            style={{ background:`linear-gradient(90deg,${DS.secondary},#E8913A)`, padding:'11px 20px', borderRadius:10, color:'#fff', border:'none', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap', boxShadow:'0 4px 14px rgba(232,97,58,0.4)' }}>
            + Consulter
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:'clamp(10px,2vw,16px)' }}>
        {[
          { icon:<Calendar size={22} color={DS.primary}/>,    val: upcoming.length,                              label:'RDV à venir',        path:'/patient/rdv' },
          { icon:<Video size={22} color={DS.secondary}/>,     val: data?.appointments?.filter(a=>a.status==='completed').length || 0, label:'Consultations',    path:'/patient/consultations' },
          { icon:<Pill size={22} color="#884b00"/>,            val: activePres.length,                            label:'Ordonnances actives', path:'/patient/prescriptions' },
          { icon:<FileText size={22} color="#7c3aed"/>,        val: data?.stats?.total_documents || 0,            label:'Documents',           path:'/patient/medical-record' },
        ].map((s,i) => (
          <div key={i} onClick={() => navigate(s.path)}
            style={{ background: DS.surface, borderRadius:12, padding:'clamp(14px,3vw,20px)', border:`1px solid ${DS.outlineVariant}`, display:'flex', alignItems:'center', gap:12, cursor:'pointer', transition:'box-shadow .2s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>
            <div style={{ width:44, height:44, borderRadius:12, background: DS.surfaceLow, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize:24, fontWeight:700, color: DS.onSurface, margin:0, lineHeight:1.2 }}>{loading ? '—' : s.val}</p>
              <p style={{ fontSize:12, color: DS.outline, margin:0 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'clamp(12px,2vw,20px)' }}>

        {/* Prochains RDV */}
        <div style={{ background: DS.surface, borderRadius:12, padding:'clamp(16px,3vw,22px)', border:`1px solid ${DS.outlineVariant}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <h3 style={{ fontSize:15, fontWeight:700, color: DS.onSurface, margin:0 }}>📅 Prochains RDV</h3>
            <button onClick={() => navigate('/patient/rdv')}
              style={{ fontSize:12, color: DS.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
              Voir tout <ArrowRight size={13}/>
            </button>
          </div>
          {loading ? <p style={{ color: DS.outline, fontSize:13 }}>Chargement...</p>
          : upcoming.length === 0 ? (
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              <p style={{ color: DS.outline, fontSize:13, margin:'0 0 12px' }}>Aucun rendez-vous à venir</p>
              <button onClick={() => navigate('/patient/doctors')}
                style={{ padding:'8px 16px', background: DS.surfaceContainer, color: DS.primary, border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:13 }}>
                Prendre un RDV
              </button>
            </div>
          ) : upcoming.slice(0,3).map((rdv,i) => (
            <div key={rdv.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom: i<Math.min(upcoming.length,3)-1 ? `1px solid ${DS.outlineVariant}` : 'none' }}>
              <div style={{ width:40, height:40, borderRadius:10, background: DS.surfaceContainer, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {rdv.type === 'video' ? <Video size={18} color={DS.primary}/> : <Stethoscope size={18} color={DS.primary}/>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ margin:'0 0 2px', fontWeight:600, fontSize:13, color: DS.onSurface, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {rdv.doctor?.name}
                </p>
                <p style={{ margin:0, fontSize:12, color: DS.outline }}>{rdv.scheduled_at}</p>
              </div>
              <span style={{ fontSize:11, padding:'3px 8px', borderRadius:999, background: rdv.status==='confirmed' ? '#e1f5ee' : '#fff8e7', color: rdv.status==='confirmed' ? DS.primary : '#884b00', fontWeight:600, flexShrink:0 }}>
                {rdv.status==='confirmed' ? 'Confirmé' : 'En attente'}
              </span>
            </div>
          ))}
        </div>

        {/* Ordonnances actives */}
        <div style={{ background: DS.surface, borderRadius:12, padding:'clamp(16px,3vw,22px)', border:`1px solid ${DS.outlineVariant}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <h3 style={{ fontSize:15, fontWeight:700, color: DS.onSurface, margin:0 }}>💊 Ordonnances actives</h3>
            <button onClick={() => navigate('/patient/prescriptions')}
              style={{ fontSize:12, color: DS.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
              Voir tout <ArrowRight size={13}/>
            </button>
          </div>
          {loading ? <p style={{ color: DS.outline, fontSize:13 }}>Chargement...</p>
          : activePres.length === 0 ? (
            <p style={{ color: DS.outline, fontSize:13, textAlign:'center', padding:'20px 0' }}>Aucune ordonnance active</p>
          ) : activePres.slice(0,3).map((p,i) => (
            <div key={p.id} style={{ padding:'12px 0', borderBottom: i<Math.min(activePres.length,3)-1 ? `1px solid ${DS.outlineVariant}` : 'none' }}>
              <p style={{ margin:'0 0 4px', fontWeight:600, fontSize:13, color: DS.onSurface }}>
                {p.doctor_name}
              </p>
              <p style={{ margin:'0 0 4px', fontSize:12, color: DS.outline }}>
                {p.medications?.length} médicament{p.medications?.length > 1 ? 's' : ''} · Valide jusqu'au {p.valid_until}
              </p>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {(p.medications||[]).slice(0,2).map((m,j) => (
                  <span key={j} style={{ fontSize:11, padding:'2px 8px', borderRadius:999, background: DS.surfaceContainer, color: DS.primary }}>
                    {m.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Accès rapide */}
        <div style={{ background: DS.surface, borderRadius:12, padding:'clamp(16px,3vw,22px)', border:`1px solid ${DS.outlineVariant}` }}>
          <h3 style={{ fontSize:15, fontWeight:700, color: DS.onSurface, margin:'0 0 14px' }}>⚡ Accès rapide</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { path:'/patient/doctors',        icon:'🩺', label:'Consulter',         color: DS.primary,   bg: DS.surfaceContainer },
              { path:'/patient/rdv',            icon:'📅', label:'Mes RDV',           color:'#884b00',     bg:'#fff8e7' },
              { path:'/patient/medical-record', icon:'🗂️', label:'Dossier médical',   color:'#7c3aed',     bg:'#f5f3ff' },
              { path:'/patient/prescriptions',  icon:'💊', label:'Prescriptions',     color: DS.secondary, bg:'#fff4f0' },
            ].map((item,i) => (
              <button key={i} onClick={() => navigate(item.path)}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'clamp(10px,2vw,14px)', background: item.bg, borderRadius:10, border:'none', cursor:'pointer', fontFamily:'inherit', transition:'transform .15s', textAlign:'left' }}
                onMouseEnter={e => e.currentTarget.style.transform='scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                <span style={{ fontSize:20 }}>{item.icon}</span>
                <span style={{ fontSize:13, fontWeight:600, color: item.color }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conseil santé */}
        <div style={{ background:`linear-gradient(135deg,${DS.secondary},#E8913A)`, borderRadius:12, padding:'clamp(16px,3vw,22px)', color:'#fff' }}>
          <h3 style={{ fontSize:15, fontWeight:700, margin:'0 0 10px' }}>💡 Conseil santé du jour</h3>
          <p style={{ fontSize:13, lineHeight:1.7, opacity:0.95, margin:'0 0 14px' }}>
            Boire au moins <strong>1,5 à 2 litres d'eau</strong> par jour est essentiel, surtout par les chaleurs de Douala. Commencez votre journée avec un grand verre d'eau.
          </p>
          <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:8, padding:'8px 12px', fontSize:12, display:'flex', alignItems:'center', gap:6 }}>
            🤖 <span>Powered by Dokita AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}