import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Video, MapPin, Plus, X, AlertCircle } from 'lucide-react';
import { appointmentService } from '../../api/services';

const DS = {
  primary:'#016472', secondary:'#E8613A', surface:'#ffffff',
  surfaceLow:'#f0f3ff', surfaceContainer:'#e7eeff',
  onSurface:'#111c2d', outline:'#6f797b', outlineVariant:'#bec8cb',
  error:'#ba1a1a', errorContainer:'#ffdad6',
};

const STATUS = {
  confirmed: { label:'Confirmé',   bg:'#e1f5ee', color:'#016472' },
  pending:   { label:'En attente', bg:'#fff8e7', color:'#884b00' },
  cancelled: { label:'Annulé',     bg:'#ffdad6', color:'#ba1a1a' },
};

export default function PatientRdv() {
  const navigate = useNavigate();
  const [rdvs,         setRdvs]         = useState([]);
  const [loading,      setLoading]       = useState(true);
  const [tab,          setTab]           = useState('upcoming');
  const [cancelModal,  setCancelModal]   = useState(null); // appointment obj
  const [cancelling,   setCancelling]    = useState(false);

  const load = async () => {
    try {
      const res = await appointmentService.getMyAppointments();
      // RDV planifiés = pas de consultation immédiate terminée
      // On distingue par : scheduled_at > now OU status pending/confirmed
      const rdvs = res.data.filter(a => {
        const scheduledDate = new Date(a.scheduled_at_raw || a.scheduled_at);
        const isPast        = scheduledDate < new Date(Date.now() - 30 * 60000);
        // Exclure les consultations immédiates terminées
        if (a.status === 'completed' && isPast) return false;
        return true;
      });
      setRdvs(rdvs);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async () => {
    if (!cancelModal) return;
    setCancelling(true);
    try {
      await appointmentService.cancelAsPatient(cancelModal.id);
      setRdvs(prev => prev.map(r => r.id === cancelModal.id ? { ...r, status:'cancelled' } : r));
      setCancelModal(null);
    } catch (e) { console.error(e); }
    finally { setCancelling(false); }
  };

  const filtered = rdvs.filter(a => {
    if (tab === 'upcoming')  return ['confirmed','pending'].includes(a.status);
    if (tab === 'cancelled') return a.status === 'cancelled';
    return true;
  });

  return (
    <div style={{ fontFamily:"'Inter',sans-serif" }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:'clamp(18px,3vw,24px)', fontWeight:700, color: DS.onSurface, margin:'0 0 4px' }}>Rendez-vous</h1>
          <p style={{ fontSize:14, color: DS.outline, margin:0 }}>
            {filtered.filter(a => ['confirmed','pending'].includes(a.status)).length} à venir
          </p>
        </div>
        <button onClick={() => navigate('/patient/doctors')}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 18px', background:`linear-gradient(90deg,${DS.secondary},#E8913A)`, color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
          <Plus size={16} /> Nouveau RDV
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, background: DS.surface, padding:4, borderRadius:12, border:`1px solid ${DS.outlineVariant}`, width:'fit-content', marginBottom:20 }}>
        {[
          { key:'upcoming',  label:'À venir' },
          { key:'cancelled', label:'Annulés' },
          { key:'all',       label:'Tous' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding:'8px 16px', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:600, background: tab===t.key ? DS.primary : 'transparent', color: tab===t.key ? '#fff' : DS.outline, transition:'all .2s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: DS.outline, textAlign:'center', padding:40 }}>Chargement...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'clamp(32px,6vw,48px)', background: DS.surface, borderRadius:12, border:`1px solid ${DS.outlineVariant}` }}>
          <Calendar size={40} color={DS.outlineVariant} style={{ margin:'0 auto 12px' }} />
          <p style={{ color: DS.outline, fontWeight:600, margin:'0 0 16px' }}>Aucun rendez-vous</p>
          <button onClick={() => navigate('/patient/doctors')}
            style={{ padding:'10px 22px', background: DS.primary, color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
            Trouver un médecin
          </button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map(rdv => {
            const st = STATUS[rdv.status] || STATUS.pending;
            return (
              <div key={rdv.id} style={{ background: DS.surface, borderRadius:12, padding:'clamp(14px,3vw,20px)', border:`1px solid ${DS.outlineVariant}`, display:'flex', alignItems:'center', gap:'clamp(10px,2vw,16px)', flexWrap:'wrap' }}>
                {/* Icône */}
                <div style={{ width:46, height:46, borderRadius:12, background: DS.surfaceContainer, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {rdv.type === 'video' ? <Video size={20} color={DS.primary} /> : <MapPin size={20} color={DS.primary} />}
                </div>
                {/* Infos */}
                <div style={{ flex:1, minWidth:140 }}>
                  <p style={{ margin:'0 0 3px', fontWeight:600, fontSize:'clamp(13px,2vw,15px)', color: DS.onSurface }}>
                    {rdv.doctor?.name || 'Médecin'}
                  </p>
                  <p style={{ margin:'0 0 6px', fontSize:13, color: DS.primary, fontWeight:500 }}>
                    {rdv.doctor?.specialty}
                  </p>
                  <div style={{ display:'flex', gap:'clamp(8px,2vw,12px)', flexWrap:'wrap' }}>
                    <span style={{ fontSize:12, color: DS.outline }}>📅 {rdv.scheduled_at}</span>
                    <span style={{ fontSize:12, color: DS.outline }}>{rdv.type === 'video' ? '🎥 Vidéo' : '🏥 En personne'}</span>
                    <span style={{ fontSize:12, color: DS.outline }}>💳 {rdv.fee}</span>
                  </div>
                </div>
                {/* Status */}
                <span style={{ background: st.bg, color: st.color, padding:'4px 12px', borderRadius:999, fontSize:12, fontWeight:600, flexShrink:0 }}>
                  {st.label}
                </span>
                {/* Actions */}
{/* Actions — pas de bouton Rejoindre dans les RDV */}
<div style={{ display:'flex', gap:8, flexShrink:0 }}>
  {['confirmed','pending'].includes(rdv.status) && (
    <button onClick={() => setCancelModal(rdv)}
      style={{ background: DS.errorContainer, color: DS.error, border:'none', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:4 }}>
      <X size={13} /> Annuler
    </button>
  )}
</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal annulation */}
      {cancelModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
          onClick={() => !cancelling && setCancelModal(null)}>
          <div style={{ background: DS.surface, borderRadius:16, padding:'clamp(20px,4vw,28px)', maxWidth:380, width:'100%' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width:56, height:56, borderRadius:'50%', background: DS.errorContainer, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <AlertCircle size={28} color={DS.error} />
            </div>
            <h3 style={{ fontSize:18, fontWeight:700, color: DS.onSurface, textAlign:'center', margin:'0 0 8px' }}>
              Annuler ce rendez-vous ?
            </h3>
            <p style={{ fontSize:14, color: DS.outline, textAlign:'center', margin:'0 0 8px', lineHeight:1.5 }}>
              Vous êtes sur le point d'annuler votre rendez-vous avec
            </p>
            <p style={{ fontSize:14, fontWeight:700, color: DS.primary, textAlign:'center', margin:'0 0 20px' }}>
              {cancelModal.doctor?.name}
            </p>
            <div style={{ background: DS.surfaceLow, borderRadius:10, padding:'12px', marginBottom:20, fontSize:13, color: DS.outline }}>
              📅 {cancelModal.scheduled_at} · {cancelModal.type === 'video' ? '🎥 Vidéo' : '🏥 En personne'}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setCancelModal(null)} disabled={cancelling}
                style={{ flex:1, padding:'12px', border:`1.5px solid ${DS.outlineVariant}`, borderRadius:10, background: DS.surface, color: DS.onSurface, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                Garder
              </button>
              <button onClick={handleCancel} disabled={cancelling}
                style={{ flex:1, padding:'12px', background: DS.error, color:'#fff', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', fontFamily:'inherit', opacity: cancelling ? 0.7 : 1 }}>
                {cancelling ? 'Annulation...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}