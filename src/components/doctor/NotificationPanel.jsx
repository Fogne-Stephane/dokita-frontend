import { useState } from 'react';
import { Bell, Video, MessageSquare, X, Check, XCircle } from 'lucide-react';
import { useDoctorNotifications } from '../../hooks/useDoctorNotifications';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function NotificationPanel() {
  const navigate = useNavigate();
  const { notifications, pendingCount, clearNotification } = useDoctorNotifications();
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(null);

  const handleAccept = async (notif) => {
    setLoading(notif.appointment_id);
    try {
      const res = await api.post(`/doctor/consultations/${notif.appointment_id}/accept`);
      clearNotification(notif.appointment_id);

      if (notif.type === 'video') {
        navigate(`/consultation/room/${notif.appointment_id}`, {
          state: {
            channel: res.data.channel,
            token:   res.data.token,
            appId:   res.data.app_id,
            role:    'doctor',
          }
        });
      } else {
        navigate(`/consultation/chat/${notif.appointment_id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
      setOpen(false);
    }
  };

  const handleReject = async (notif) => {
    setLoading('reject-' + notif.appointment_id);
    try {
      await api.post(`/doctor/consultations/${notif.appointment_id}/reject`);
      clearNotification(notif.appointment_id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ position:'relative' }}>
      {/* Bouton cloche */}
      <button
        onClick={() => setOpen(!open)}
        style={{ width:40, height:40, borderRadius:8, border:'1px solid var(--outline-variant)', background:'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', position:'relative', color:'var(--on-surface-variant)' }}>
        <Bell size={20} />
        {pendingCount > 0 && (
          <span style={{ position:'absolute', top:6, right:6, width:16, height:16, background:'var(--secondary)', borderRadius:'50%', border:'2px solid var(--surface)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, color:'#fff' }}>
            {pendingCount > 9 ? '9+' : pendingCount}
          </span>
        )}
      </button>

      {/* Panneau */}
      {open && (
        <>
          {/* Overlay */}
          <div style={{ position:'fixed', inset:0, zIndex:90 }} onClick={() => setOpen(false)} />

          <div style={{ position:'absolute', top:48, right:0, width:340, background:'var(--surface)', borderRadius:12, border:'1px solid var(--outline-variant)', boxShadow:'0 8px 32px rgba(0,0,0,0.12)', zIndex:100, overflow:'hidden', fontFamily:"'Inter',sans-serif" }}>

            {/* Header panneau */}
            <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--outline-variant)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <p style={{ fontSize:14, fontWeight:700, color:'var(--on-surface)', margin:0 }}>Demandes de consultation</p>
                <p style={{ fontSize:12, color:'var(--outline)', margin:0 }}>{pendingCount} en attente</p>
              </div>
              <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--outline)', padding:4 }}>
                <X size={18} />
              </button>
            </div>

            {/* Liste */}
            <div style={{ maxHeight:400, overflowY:'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding:32, textAlign:'center' }}>
                  <Bell size={28} color="var(--outline-variant)" style={{ margin:'0 auto 8px' }} />
                  <p style={{ fontSize:13, color:'var(--outline)', margin:0 }}>Aucune demande en attente</p>
                </div>
              ) : notifications.map((notif, i) => (
                <div key={notif.appointment_id} style={{ padding:'14px 16px', borderBottom: i < notifications.length - 1 ? '1px solid var(--outline-variant)' : 'none' }}>
                  {/* Info patient */}
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,var(--primary),#2e7d8c)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:14, flexShrink:0 }}>
                      {notif.patient_name?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:13, fontWeight:600, color:'var(--on-surface)', margin:'0 0 2px' }}>{notif.patient_name}</p>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        {notif.type === 'video'
                          ? <><Video size={12} color="var(--primary)" /><span style={{ fontSize:11, color:'var(--primary)' }}>Vidéo</span></>
                          : <><MessageSquare size={12} color="var(--tertiary)" /><span style={{ fontSize:11, color:'var(--tertiary)' }}>Message</span></>
                        }
                        <span style={{ fontSize:11, color:'var(--outline)' }}>· {notif.created_at}</span>
                      </div>
                    </div>
                    <span style={{ fontSize:12, fontWeight:700, color:'var(--primary)' }}>{notif.fee?.toLocaleString?.()} XAF</span>
                  </div>

                  {/* Motif */}
                  {notif.reason && (
                    <p style={{ fontSize:12, color:'var(--on-surface-variant)', background:'var(--surface-low)', borderRadius:6, padding:'6px 10px', margin:'0 0 10px', lineHeight:1.4 }}>
                      📝 {notif.reason}
                    </p>
                  )}

                  {/* Actions */}
                  <div style={{ display:'flex', gap:8 }}>
                    <button
                      onClick={() => handleAccept(notif)}
                      disabled={loading === notif.appointment_id}
                      style={{ flex:1, padding:'9px', background:'var(--primary)', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:6, opacity: loading === notif.appointment_id ? 0.6 : 1 }}>
                      <Check size={14} />
                      {loading === notif.appointment_id ? 'Démarrage...' : 'Accepter'}
                    </button>
                    <button
                      onClick={() => handleReject(notif)}
                      disabled={!!loading}
                      style={{ flex:1, padding:'9px', background:'var(--error-container)', color:'var(--error)', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                      <XCircle size={14} />
                      Refuser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}