import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, CreditCard, Activity, AlertTriangle, ArrowRight } from 'lucide-react';
import api from '../../api/axios';

const DS = {
  primary:'#016472', secondary:'#E8613A', surface:'#ffffff',
  surfaceLow:'#f0f3ff', surfaceContainer:'#e7eeff',
  onSurface:'#111c2d', outline:'#6f797b', outlineVariant:'#bec8cb',
};

export default function AdminHome() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [usersRes, doctorsRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/doctors'),
        ]);
        setData({
          users:   usersRes.data,
          doctors: doctorsRes.data,
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const patients  = data?.users?.filter(u => u.role==='patient') || [];
  const doctors   = data?.doctors || [];
  const pending   = doctors.filter(d => !d.is_verified);
  const active    = doctors.filter(d => d.is_verified);
  const blocked   = data?.users?.filter(u => !u.is_active) || [];

  const kpis = [
    { icon:<Users size={22} color={DS.primary}/>,      val: patients.length,  label:'Patients',          bg: DS.surfaceContainer },
    { icon:<UserCheck size={22} color={DS.secondary}/>, val: active.length,   label:'Médecins actifs',    bg:'#fff4f0' },
    { icon:<AlertTriangle size={22} color="#884b00"/>,  val: pending.length,  label:'Médecins en attente', bg:'#fff8e7' },
    { icon:<Activity size={22} color="#7c3aed"/>,       val: blocked.length,  label:'Comptes bloqués',    bg:'#f5f3ff' },
  ];

  const alerts = [
    pending.length > 0 && { type:'warning', text:`${pending.length} médecin${pending.length>1?'s':''} en attente de validation`, link:'/admin/doctors' },
    blocked.length > 0 && { type:'info',    text:`${blocked.length} compte${blocked.length>1?'s':''} bloqué${blocked.length>1?'s':''}`, link:'/admin/users' },
  ].filter(Boolean);

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", display:'flex', flexDirection:'column', gap:'clamp(16px,3vw,24px)' }}>

      {/* Bannière */}
      <div style={{ background:`linear-gradient(135deg,#111c2d 0%,#1e2d3d 100%)`, borderRadius:16, padding:'clamp(20px,4vw,28px)', color:'#fff', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-40, top:-40, width:200, height:200, background:'rgba(232,97,58,0.08)', borderRadius:'50%', pointerEvents:'none' }} />
        <h2 style={{ margin:'0 0 6px', fontSize:'clamp(18px,3vw,22px)', fontWeight:700, position:'relative', zIndex:1 }}>
          Tableau de bord — Administration
        </h2>
        <p style={{ margin:0, opacity:0.6, fontSize:13, position:'relative', zIndex:1 }}>
          Dokita · {new Date().toLocaleDateString('fr',{ weekday:'long', day:'numeric', month:'long', year:'numeric' })}
        </p>
      </div>

      {/* Alertes */}
      {alerts.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {alerts.map((a,i) => (
            <Link key={i} to={a.link}
              style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderRadius:10, textDecoration:'none', background: a.type==='warning' ? '#fff8e7' : DS.surfaceContainer, border:`1px solid ${a.type==='warning' ? '#fde047' : '#c7d2fe'}` }}>
              <AlertTriangle size={16} color={a.type==='warning' ? '#884b00' : DS.primary} />
              <span style={{ fontSize:14, fontWeight:600, color: DS.onSurface, flex:1 }}>{a.text}</span>
              <ArrowRight size={14} color={DS.outline} />
            </Link>
          ))}
        </div>
      )}

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:'clamp(10px,2vw,16px)' }}>
        {kpis.map((k,i) => (
          <div key={i} style={{ background: DS.surface, borderRadius:12, padding:'clamp(14px,3vw,20px)', border:`1px solid ${DS.outlineVariant}`, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:12, background: k.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {k.icon}
            </div>
            <div>
              <p style={{ fontSize:22, fontWeight:700, color: DS.onSurface, margin:0, lineHeight:1.2 }}>{loading ? '—' : k.val}</p>
              <p style={{ fontSize:12, color: DS.outline, margin:0 }}>{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'clamp(12px,2vw,20px)' }}>

        {/* Médecins en attente */}
        <div style={{ background: DS.surface, borderRadius:12, padding:'clamp(16px,3vw,22px)', border:`1px solid ${DS.outlineVariant}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <h3 style={{ fontSize:15, fontWeight:700, color: DS.onSurface, margin:0 }}>👨‍⚕️ Médecins en attente</h3>
            <Link to="/admin/doctors" style={{ fontSize:12, color: DS.primary, fontWeight:600, textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>
              Gérer <ArrowRight size={13}/>
            </Link>
          </div>
          {loading ? <p style={{ color: DS.outline, fontSize:13 }}>Chargement...</p>
          : pending.length === 0 ? (
            <p style={{ color: DS.outline, fontSize:13, textAlign:'center', padding:'20px 0' }}>✅ Aucune validation en attente</p>
          ) : pending.slice(0,4).map((d,i) => (
            <div key={d.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom: i<Math.min(pending.length,4)-1 ? `1px solid ${DS.outlineVariant}` : 'none' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg,${DS.secondary},#E8913A)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:13, flexShrink:0 }}>
                {d.name?.[0]?.toUpperCase()}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ margin:'0 0 2px', fontWeight:600, fontSize:13, color: DS.onSurface, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.name}</p>
                <p style={{ margin:0, fontSize:12, color: DS.outline }}>{d.specialty}</p>
              </div>
              <span style={{ fontSize:11, padding:'3px 8px', borderRadius:999, background:'#fff8e7', color:'#884b00', fontWeight:600, flexShrink:0 }}>
                En attente
              </span>
            </div>
          ))}
        </div>

        {/* Derniers inscrits */}
        <div style={{ background: DS.surface, borderRadius:12, padding:'clamp(16px,3vw,22px)', border:`1px solid ${DS.outlineVariant}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <h3 style={{ fontSize:15, fontWeight:700, color: DS.onSurface, margin:0 }}>👥 Derniers inscrits</h3>
            <Link to="/admin/users" style={{ fontSize:12, color: DS.primary, fontWeight:600, textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>
              Voir tout <ArrowRight size={13}/>
            </Link>
          </div>
          {loading ? <p style={{ color: DS.outline, fontSize:13 }}>Chargement...</p>
          : (data?.users||[]).slice(0,5).map((u,i) => (
            <div key={u.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom: i<Math.min((data?.users||[]).length,5)-1 ? `1px solid ${DS.outlineVariant}` : 'none' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background: u.role==='doctor' ? `linear-gradient(135deg,${DS.secondary},#E8913A)` : `linear-gradient(135deg,${DS.primary},#2e7d8c)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:13, flexShrink:0 }}>
                {u.name?.[0]?.toUpperCase()}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ margin:'0 0 2px', fontWeight:600, fontSize:13, color: DS.onSurface, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.name}</p>
                <p style={{ margin:0, fontSize:12, color: DS.outline }}>{u.role==='doctor' ? '👨‍⚕️ Médecin' : '🧑 Patient'} · {u.created_at}</p>
              </div>
              <span style={{ fontSize:11, padding:'3px 8px', borderRadius:999, background: u.is_active ? '#e1f5ee' : '#ffdad6', color: u.is_active ? DS.primary : '#ba1a1a', fontWeight:600, flexShrink:0 }}>
                {u.is_active ? 'Actif' : 'Bloqué'}
              </span>
            </div>
          ))}
        </div>

        {/* Actions rapides */}
        <div style={{ background: DS.surface, borderRadius:12, padding:'clamp(16px,3vw,22px)', border:`1px solid ${DS.outlineVariant}` }}>
          <h3 style={{ fontSize:15, fontWeight:700, color: DS.onSurface, margin:'0 0 14px' }}>⚡ Actions rapides</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[
              { to:'/admin/doctors',        icon:'👨‍⚕️', label:`Valider médecins (${pending.length})`, color: DS.secondary, bg:'#fff4f0' },
              { to:'/admin/users',          icon:'👥',   label:'Gérer utilisateurs',                   color: DS.primary,   bg: DS.surfaceContainer },
              { to:'/admin/health-centers', icon:'🏥',   label:'Centres de santé',                     color:'#7c3aed',     bg:'#f5f3ff' },
              { to:'/admin/payments',       icon:'💰',   label:'Transactions',                         color:'#16a34a',     bg:'#f0fdf4' },
            ].map((item,i) => (
              <Link key={i} to={item.to}
                style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', background: item.bg, borderRadius:10, textDecoration:'none', transition:'transform .15s' }}
                onMouseEnter={e => e.currentTarget.style.transform='scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                <span style={{ fontSize:20 }}>{item.icon}</span>
                <span style={{ fontSize:14, fontWeight:600, color: item.color }}>{item.label}</span>
                <ArrowRight size={14} color={item.color} style={{ marginLeft:'auto' }} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}