import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, MapPin, Check, X, MessageSquare } from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import { getEcho } from '../../api/echo';

const DS = {
  primary:'#016472', secondary:'#E8613A', surface:'#ffffff',
  surfaceLow:'#f0f3ff', surfaceContainer:'#e7eeff',
  onSurface:'#111c2d', outline:'#6f797b', outlineVariant:'#bec8cb',
  error:'#ba1a1a', errorContainer:'#ffdad6',
};

const STATUS = {
  confirmed: { label:'Confirmé',   bg:'#e1f5ee', color:'#016472' },
  pending:   { label:'En attente', bg:'#fff8e7', color:'#884b00' },
  completed: { label:'Terminé',    bg: '#e7eeff', color:'#016472' },
  cancelled: { label:'Annulé',     bg:'#ffdad6', color:'#ba1a1a' },
};

const TABS = ["Aujourd'hui", 'À venir', 'Terminés', 'Tous'];

export default function DoctorAgenda() {
  const navigate       = useNavigate();
  const { user }       = useSelector(s => s.auth);
  const [rdvs,    setRdvs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState("Aujourd'hui");
  const [modal,   setModal]   = useState(null);
  const [acting,  setActing]  = useState(null);

  const load = async () => {
    try {
      const res = await api.get('/doctor/appointments');
      setRdvs(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // Écouter les nouveaux RDV en temps réel
  useEffect(() => {
    if (!user?.id) return;
    const echo = getEcho();
    const ch   = echo.private(`doctor.${user.id}`);
    ch.listen('.appointment.created', (data) => {
      setRdvs(prev => [data, ...prev]);
    });
    return () => ch.stopListening('.appointment.created');
  }, [user?.id]);

  const isToday = (dateStr) => {
    const d = new Date(dateStr);
    const t = new Date();
    return d.getDate()===t.getDate() && d.getMonth()===t.getMonth() && d.getFullYear()===t.getFullYear();
  };

const filtered = rdvs.filter(a => {
    if (tab === "Aujourd'hui") return isToday(a.scheduled_at) && a.status !== 'completed' && a.status !== 'cancelled';
    if (tab === 'À venir')     return ['confirmed','pending'].includes(a.status) && !isToday(a.scheduled_at);
    if (tab === 'Terminés')    return a.status === 'completed' || a.status === 'cancelled';
    return true;
});

  const handleAccept = async (rdv) => {
    setActing(rdv.id);
    try {
      const res = await api.post(`/doctor/consultations/${rdv.id}/accept`);
      setRdvs(prev => prev.map(r => r.id === rdv.id ? { ...r, status:'confirmed' } : r));
      setModal(null);
      if (rdv.type === 'video') {
        navigate(`/consultation/room/${rdv.id}`, {
          state: { channel: res.data.channel, token: res.data.token, appId: res.data.app_id, role:'doctor' }
        });
      } else {
        navigate(`/consultation/chat/${rdv.id}`);
      }
    } catch (e) { console.error(e); }
    finally { setActing(null); }
  };

  const handleReject = async (id) => {
    setActing(id);
    try {
      await api.post(`/doctor/consultations/${id}/reject`);
      setRdvs(prev => prev.map(r => r.id === id ? { ...r, status:'cancelled' } : r));
      setModal(null);
    } catch (e) { console.error(e); }
    finally { setActing(null); }
  };

  const getInitials = (name) => {
    const p = (name||'').split(' ');
    return (p[0]?.[0]||'') + (p[1]?.[0]||'');
  };

  return (
    <div style={{ fontFamily:"'Inter',sans-serif" }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:'clamp(18px,3vw,24px)', fontWeight:700, color: DS.onSurface, margin:'0 0 4px' }}>Mon Agenda</h1>
          <p style={{ fontSize:14, color: DS.outline, margin:0 }}>
            {rdvs.filter(r => ['confirmed','pending'].includes(r.status)).length} rendez-vous actifs
          </p>
        </div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <div style={{ background:'#e1f5ee', color: DS.primary, padding:'7px 14px', borderRadius:10, fontSize:13, fontWeight:600 }}>
            ✅ {rdvs.filter(r => r.status==='confirmed').length} confirmés
          </div>
          <div style={{ background:'#fff8e7', color:'#884b00', padding:'7px 14px', borderRadius:10, fontSize:13, fontWeight:600 }}>
            ⏳ {rdvs.filter(r => r.status==='pending').length} en attente
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, background: DS.surface, padding:4, borderRadius:12, border:`1px solid ${DS.outlineVariant}`, width:'fit-content', marginBottom:20, flexWrap:'wrap' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding:'8px 16px', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:600, background: tab===t ? DS.primary : 'transparent', color: tab===t ? '#fff' : DS.outline, transition:'all .2s' }}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: DS.outline, textAlign:'center', padding:40 }}>Chargement...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'clamp(32px,6vw,48px)', background: DS.surface, borderRadius:12, border:`1px solid ${DS.outlineVariant}` }}>
          <p style={{ fontSize:40, margin:'0 0 12px' }}>📭</p>
          <p style={{ color: DS.outline, fontWeight:600 }}>Aucun rendez-vous dans cette catégorie</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map(rdv => {
            const st = STATUS[rdv.status] || STATUS.pending;
            return (
              <div key={rdv.id} style={{ background: DS.surface, borderRadius:12, padding:'clamp(14px,3vw,20px)', border:`1.5px solid ${rdv.status==='pending' ? '#fde047' : DS.outlineVariant}`, display:'flex', alignItems:'center', gap:'clamp(10px,2vw,16px)', flexWrap:'wrap' }}>
                {/* Avatar patient */}
                <div style={{ width:46, height:46, borderRadius:'50%', background:`linear-gradient(135deg,${DS.primary},#2e7d8c)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:16, flexShrink:0 }}>
                  {getInitials(rdv.patient?.name || 'P').toUpperCase()}
                </div>
                {/* Infos */}
                <div style={{ flex:1, minWidth:140 }}>
                  <p style={{ margin:'0 0 3px', fontWeight:600, fontSize:'clamp(13px,2vw,15px)', color: DS.onSurface }}>
                    {rdv.patient?.name || 'Patient'}
                  </p>
                  <p style={{ margin:'0 0 6px', fontSize:12, color: DS.outline }}>
                    {rdv.reason || 'Consultation générale'}
                  </p>
                  <div style={{ display:'flex', gap:'clamp(8px,2vw,12px)', flexWrap:'wrap' }}>
                    <span style={{ fontSize:12, color: DS.outline }}>📅 {rdv.scheduled_at}</span>
                    <span style={{ fontSize:12, color: DS.outline }}>
                      {rdv.type === 'video' ? '🎥 Vidéo' : rdv.type === 'message' ? '💬 Message' : '🏥 En personne'}
                    </span>
                    <span style={{ fontSize:12, color: DS.outline }}>💳 {rdv.fee}</span>
                  </div>
                </div>
                {/* Status */}
                <span style={{ background: st.bg, color: st.color, padding:'4px 12px', borderRadius:999, fontSize:12, fontWeight:600, flexShrink:0 }}>
                  {st.label}
                </span>
                {/* Actions */}
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  {rdv.status === 'pending' && (
                    <>
                      <button onClick={() => setModal(rdv)}
                        style={{ background:'#e1f5ee', color: DS.primary, border:'none', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:4 }}>
                        <Check size={13} /> Accepter
                      </button>
                      <button onClick={() => handleReject(rdv.id)} disabled={acting===rdv.id}
                        style={{ background: DS.errorContainer, color: DS.error, border:'none', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:4 }}>
                        <X size={13} /> Refuser
                      </button>
                    </>
                  )}
                  {rdv.status === 'confirmed' && (
                    <button onClick={() => handleAccept(rdv)}
                      style={{ background: DS.primary, color:'#fff', border:'none', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:4 }}>
                      {rdv.type === 'video' ? <><Video size={13}/> Démarrer</> : <><MessageSquare size={13}/> Chat</>}
                    </button>
                  )}
                  {rdv.status === 'completed' && (
                    <span style={{ fontSize:12, color: DS.outline, padding:'8px 14px' }}>✓ Terminée</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal confirmation acceptation */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          onClick={() => !acting && setModal(null)}>
          <div style={{ background: DS.surface, borderRadius:16, padding:'clamp(20px,4vw,28px)', maxWidth:380, width:'100%' }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize:18, fontWeight:700, color: DS.onSurface, margin:'0 0 6px' }}>Accepter cette consultation ?</h3>
            <p style={{ fontSize:13, color: DS.outline, margin:'0 0 16px' }}>La consultation démarrera immédiatement.</p>
            <div style={{ background: DS.surfaceLow, borderRadius:10, padding:14, marginBottom:20 }}>
              <p style={{ margin:'0 0 4px', fontWeight:700, color: DS.onSurface }}>{modal.patient?.name}</p>
              <p style={{ margin:0, fontSize:13, color: DS.outline }}>
                {modal.reason} · {modal.type === 'video' ? '🎥 Vidéo' : '💬 Message'} · {modal.fee}
              </p>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setModal(null)} disabled={!!acting}
                style={{ flex:1, padding:'12px', border:`1.5px solid ${DS.outlineVariant}`, borderRadius:10, background: DS.surface, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                Annuler
              </button>
              <button onClick={() => handleAccept(modal)} disabled={!!acting}
                style={{ flex:1, padding:'12px', background: DS.primary, color:'#fff', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', fontFamily:'inherit', opacity: acting ? 0.7 : 1 }}>
                {acting ? 'Démarrage...' : '✅ Accepter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}