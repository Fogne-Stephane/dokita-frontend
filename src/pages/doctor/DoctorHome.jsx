import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Video, MessageSquare, Users, ArrowRight, Check, X } from 'lucide-react';
import api from '../../api/axios';

const DS = {
  primary:'#016472', secondary:'#E8613A', surface:'#ffffff',
  surfaceLow:'#f0f3ff', surfaceContainer:'#e7eeff',
  onSurface:'#111c2d', outline:'#6f797b', outlineVariant:'#bec8cb',
};

export default function DoctorHome() {
  const navigate  = useNavigate();
  const { user }  = useSelector(s => s.auth);
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [acting,  setActing]  = useState(null);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  useEffect(() => {
    (async () => {
      try {
        const [apptRes, notifRes, patientsRes] = await Promise.all([
          api.get('/doctor/appointments'),
          api.get('/doctor/notifications'),
          api.get('/doctor/patients'),
        ]);
        setData({
          appointments: apptRes.data,
          notifications: notifRes.data,
          patients: patientsRes.data,
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const todayRdv    = data?.appointments?.filter(a => {
    const d = new Date(a.scheduled_at);
    const t = new Date();
    return d.getDate()===t.getDate() && d.getMonth()===t.getMonth() && d.getFullYear()===t.getFullYear();
  }) || [];
  const pending     = data?.notifications || [];
  const completed   = data?.appointments?.filter(a => a.status === 'completed').length || 0;
  const revenue     = (data?.appointments?.filter(a => a.is_paid) || [])
    .reduce((sum, a) => sum + (parseFloat(a.fee_raw || a.fee) || 0), 0);

  const handleAccept = async (notif) => {
    setActing(notif.appointment_id);
    try {
      const res = await api.post(`/doctor/consultations/${notif.appointment_id}/accept`);
      setData(prev => ({ ...prev, notifications: prev.notifications.filter(n => n.appointment_id !== notif.appointment_id) }));
      if (notif.type === 'video') {
        navigate(`/consultation/room/${notif.appointment_id}`, {
          state: { channel: res.data.channel, token: res.data.token, appId: res.data.app_id, role:'doctor' }
        });
      } else {
        navigate(`/consultation/chat/${notif.appointment_id}`);
      }
    } catch (e) { console.error(e); }
    finally { setActing(null); }
  };

  const handleReject = async (id) => {
    setActing('r'+id);
    try {
      await api.post(`/doctor/consultations/${id}/reject`);
      setData(prev => ({ ...prev, notifications: prev.notifications.filter(n => n.appointment_id !== id) }));
    } catch (e) { console.error(e); }
    finally { setActing(null); }
  };

  const getInitials = (name) => {
    const p = (name||'').split(' ');
    return (p[0]?.[0]||'') + (p[1]?.[0]||'');
  };

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", display:'flex', flexDirection:'column', gap:'clamp(16px,3vw,24px)' }}>

      {/* Bannière */}
      <div style={{ background:`linear-gradient(135deg,#0a3d4a 0%,${DS.primary} 100%)`, borderRadius:16, padding:'clamp(20px,4vw,28px)', color:'#fff', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-40, top:-40, width:200, height:200, background:'rgba(232,97,58,0.12)', borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16, position:'relative', zIndex:1 }}>
          <div>
            <p style={{ margin:'0 0 4px', opacity:0.8, fontSize:14 }}>{greeting} 👋</p>
            <h2 style={{ margin:'0 0 8px', fontSize:'clamp(18px,3vw,24px)', fontWeight:700 }}>Dr. {user?.name}</h2>
            <p style={{ margin:0, opacity:0.8, fontSize:13 }}>
              {todayRdv.length} rendez-vous aujourd'hui · {pending.length} demande{pending.length>1?'s':''} en attente
            </p>
          </div>
          <button onClick={() => navigate('/doctor/agenda')}
            style={{ background:`linear-gradient(90deg,${DS.secondary},#E8913A)`, padding:'11px 20px', borderRadius:10, color:'#fff', border:'none', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>
            Voir l'agenda →
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:'clamp(10px,2vw,16px)' }}>
        {[
          { val: todayRdv.length,              label:"RDV aujourd'hui",       color: DS.primary,   icon:'📅' },
          { val: data?.patients?.length || 0,  label:'Patients',              color: DS.secondary, icon:'👥' },
          { val: completed,                    label:'Consultations total',   color:'#16a34a',     icon:'✅' },
          { val: revenue > 0 ? (revenue/1000).toFixed(0)+'K' : '0', label:'Revenus XAF', color:'#7c3aed', icon:'💰' },
        ].map((s,i) => (
          <div key={i} style={{ background: DS.surface, borderRadius:12, padding:'clamp(14px,3vw,20px)', border:`1px solid ${DS.outlineVariant}`, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:12, background: DS.surfaceLow, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize:22, fontWeight:700, color: s.color, margin:0, lineHeight:1.2 }}>{loading ? '—' : s.val}</p>
              <p style={{ fontSize:12, color: DS.outline, margin:0 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'clamp(12px,2vw,20px)' }}>

        {/* Demandes en attente */}
        {pending.length > 0 && (
          <div style={{ background: DS.surface, borderRadius:12, padding:'clamp(16px,3vw,22px)', border:`2px solid #fde047` }}>
            <h3 style={{ fontSize:15, fontWeight:700, color: DS.onSurface, margin:'0 0 14px', display:'flex', alignItems:'center', gap:8 }}>
              🔔 Demandes en attente
              <span style={{ background: DS.secondary, color:'#fff', borderRadius:999, fontSize:11, padding:'2px 8px' }}>{pending.length}</span>
            </h3>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {pending.map((notif,i) => (
                <div key={i} style={{ background: DS.surfaceLow, borderRadius:10, padding:'12px 14px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg,${DS.primary},#2e7d8c)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:14, flexShrink:0 }}>
                      {getInitials(notif.patient_name).toUpperCase()}
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:13, fontWeight:600, color: DS.onSurface, margin:'0 0 2px' }}>{notif.patient_name}</p>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        {notif.type==='video' ? <Video size={12} color={DS.primary}/> : <MessageSquare size={12} color="#884b00"/>}
                        <span style={{ fontSize:11, color: DS.outline }}>{notif.type==='video' ? 'Vidéo' : 'Message'} · {notif.fee?.toLocaleString?.() || notif.fee} XAF</span>
                      </div>
                    </div>
                  </div>
                  {notif.reason && (
                    <p style={{ fontSize:12, color: DS.outline, background: DS.surface, borderRadius:6, padding:'6px 10px', margin:'0 0 10px' }}>
                      📝 {notif.reason}
                    </p>
                  )}
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => handleAccept(notif)} disabled={!!acting}
                      style={{ flex:1, padding:'8px', background: DS.primary, color:'#fff', border:'none', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:4, opacity: acting===notif.appointment_id ? 0.7 : 1 }}>
                      <Check size={13}/> Accepter
                    </button>
                    <button onClick={() => handleReject(notif.appointment_id)} disabled={!!acting}
                      style={{ flex:1, padding:'8px', background:'#ffdad6', color:'#ba1a1a', border:'none', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}>
                      <X size={13}/> Refuser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agenda du jour */}
        <div style={{ background: DS.surface, borderRadius:12, padding:'clamp(16px,3vw,22px)', border:`1px solid ${DS.outlineVariant}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <h3 style={{ fontSize:15, fontWeight:700, color: DS.onSurface, margin:0 }}>📅 Agenda du jour</h3>
            <button onClick={() => navigate('/doctor/agenda')}
              style={{ fontSize:12, color: DS.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
              Voir tout <ArrowRight size={13}/>
            </button>
          </div>
          {loading ? <p style={{ color: DS.outline, fontSize:13 }}>Chargement...</p>
          : todayRdv.length === 0 ? (
            <p style={{ color: DS.outline, fontSize:13, textAlign:'center', padding:'20px 0' }}>Aucun rendez-vous aujourd'hui</p>
          ) : todayRdv.slice(0,4).map((rdv,i) => (
            <div key={rdv.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom: i<Math.min(todayRdv.length,4)-1 ? `1px solid ${DS.outlineVariant}` : 'none' }}>
              <div style={{ minWidth:50, textAlign:'center', background: DS.surfaceLow, borderRadius:8, padding:'6px 4px' }}>
                <p style={{ fontSize:13, fontWeight:700, color: DS.primary, margin:0 }}>{rdv.scheduled_at?.slice(-5) || '--:--'}</p>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ margin:'0 0 2px', fontWeight:600, fontSize:13, color: DS.onSurface, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {rdv.patient?.name || 'Patient'}
                </p>
                <p style={{ margin:0, fontSize:12, color: DS.outline }}>{rdv.reason || 'Consultation'}</p>
              </div>
              <span style={{ fontSize:11, padding:'3px 8px', borderRadius:999, background: rdv.status==='confirmed' ? '#e1f5ee' : '#fff8e7', color: rdv.status==='confirmed' ? DS.primary : '#884b00', fontWeight:600, flexShrink:0 }}>
                {rdv.status==='confirmed' ? 'Confirmé' : 'En attente'}
              </span>
            </div>
          ))}
        </div>

        {/* Patients récents */}
        <div style={{ background: DS.surface, borderRadius:12, padding:'clamp(16px,3vw,22px)', border:`1px solid ${DS.outlineVariant}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <h3 style={{ fontSize:15, fontWeight:700, color: DS.onSurface, margin:0 }}>👥 Patients récents</h3>
            <button onClick={() => navigate('/doctor/patients')}
              style={{ fontSize:12, color: DS.primary, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
              Voir tout <ArrowRight size={13}/>
            </button>
          </div>
          {loading ? <p style={{ color: DS.outline, fontSize:13 }}>Chargement...</p>
          : (data?.patients||[]).length === 0 ? (
            <p style={{ color: DS.outline, fontSize:13, textAlign:'center', padding:'20px 0' }}>Aucun patient encore</p>
          ) : (data.patients||[]).slice(0,4).map((p,i) => (
            <div key={p.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom: i<Math.min(data.patients.length,4)-1 ? `1px solid ${DS.outlineVariant}` : 'none' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg,${DS.primary},#2e7d8c)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:13, flexShrink:0 }}>
                {getInitials(p.name).toUpperCase()}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ margin:0, fontWeight:600, fontSize:13, color: DS.onSurface, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</p>
                <p style={{ margin:0, fontSize:12, color: DS.outline }}>{p.consultations_count} consultation{p.consultations_count>1?'s':''}</p>
              </div>
              {p.last_visit && <span style={{ fontSize:11, color: DS.outline, flexShrink:0 }}>{p.last_visit}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}