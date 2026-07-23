import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../../api/services';
import { Calendar, Clock, Video, MapPin, X, Plus, ChevronRight } from 'lucide-react';

const DS = {
  primary: '#016472', secondary: '#E8613A', bg: '#f9f9ff',
  surface: '#ffffff', surfaceLow: '#f0f3ff', surfaceContainer: '#e7eeff',
  onSurface: '#111c2d', onSurfaceVariant: '#3f484b', outline: '#6f797b',
  outlineVariant: '#bec8cb', error: '#ba1a1a',
};

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmé',   bg: '#e1f5ee', color: '#016472' },
  pending:   { label: 'En attente', bg: '#fff8e7', color: '#884b00' },
  completed: { label: 'Terminé',    bg: DS.surfaceContainer, color: DS.primary },
  cancelled: { label: 'Annulé',     bg: '#ffdad6', color: '#ba1a1a' },
};

const TABS = ['Tous', 'À venir', 'Terminés', 'Annulés'];

export default function PatientAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState('Tous');
  const [showModal, setShowModal]       = useState(false);
  const [form, setForm] = useState({ specialty: '', date: '', type: 'video', reason: '' });

  useEffect(() => {
    (async () => {
      try {
        const res = await appointmentService.getMyAppointments();
        setAppointments(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleCancel = async (id) => {
    try {
      await appointmentService.cancelAsPatient(id);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
    } catch (e) { console.error(e); }
  };

  const filtered = appointments.filter(a => {
    if (activeTab === 'Tous')     return true;
    if (activeTab === 'À venir')  return ['confirmed','pending'].includes(a.status);
    if (activeTab === 'Terminés') return a.status === 'completed';
    if (activeTab === 'Annulés')  return a.status === 'cancelled';
    return true;
  });

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300, fontFamily:'Inter,sans-serif' }}>
      <p style={{ color: DS.outline }}>Chargement...</p>
    </div>
  );

  return (
    <div style={{ fontFamily:'Inter,sans-serif', background: DS.bg, minHeight:'100vh' }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:700, color: DS.onSurface, margin:'0 0 4px', letterSpacing:'-0.02em' }}>
            Rendez-vous
          </h1>
          <p style={{ fontSize:14, color: DS.outline, margin:0 }}>
            {appointments.filter(a => ['confirmed','pending'].includes(a.status)).length} à venir
          </p>
        </div>
        <button onClick={() => navigate('/patient/doctors')}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 18px', background:'linear-gradient(90deg,#E8613A,#E8913A)', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
          <Plus size={16} />
          Nouveau RDV
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, background: DS.surface, padding:4, borderRadius:12, border:`1px solid ${DS.outlineVariant}`, width:'fit-content', marginBottom:20 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ padding:'8px 16px', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:600, background: activeTab===t ? DS.primary : 'transparent', color: activeTab===t ? '#fff' : DS.outline, transition:'all .2s' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:48, background: DS.surface, borderRadius:12, border:`1px solid ${DS.outlineVariant}` }}>
            <Calendar size={40} color={DS.outlineVariant} style={{ margin:'0 auto 12px' }} />
            <p style={{ color: DS.outline, fontWeight:600 }}>Aucun rendez-vous</p>
            <button onClick={() => navigate('/patient/doctors')}
              style={{ marginTop:16, padding:'10px 22px', background: DS.primary, color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:14 }}>
              Trouver un médecin
            </button>
          </div>
        )}
        {filtered.map(rdv => {
          const st = STATUS_CONFIG[rdv.status] || STATUS_CONFIG.pending;
          return (
            <div key={rdv.id} style={{ background: DS.surface, borderRadius:12, padding:'18px 20px', border:`1px solid ${DS.outlineVariant}`, display:'flex', alignItems:'center', gap:16, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
              {/* Avatar */}
              <div style={{ width:48, height:48, borderRadius:12, background: DS.surfaceContainer, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                👨‍⚕️
              </div>
              {/* Infos */}
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ margin:'0 0 3px', fontWeight:600, fontSize:15, color: DS.onSurface }}>
                  {/* ✅ On accède à .name pour éviter l'erreur */}
                  {rdv.doctor?.name || 'Médecin'}
                </p>
                <p style={{ margin:'0 0 6px', fontSize:13, color: DS.primary, fontWeight:500 }}>
                  {rdv.doctor?.specialty || ''}
                </p>
                <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                  <span style={{ fontSize:12, color: DS.outline, display:'flex', alignItems:'center', gap:4 }}>
                    <Calendar size={12} /> {rdv.scheduled_at}
                  </span>
                  <span style={{ fontSize:12, color: DS.outline, display:'flex', alignItems:'center', gap:4 }}>
                    {rdv.type === 'video' ? <Video size={12} /> : <MapPin size={12} />}
                    {rdv.type === 'video' ? 'Vidéo' : 'En personne'}
                  </span>
                  <span style={{ fontSize:12, color: DS.outline }}>
                    💳 {rdv.fee}
                  </span>
                </div>
              </div>
              {/* Status */}
              <span style={{ background: st.bg, color: st.color, padding:'4px 12px', borderRadius:999, fontSize:12, fontWeight:600, flexShrink:0 }}>
                {st.label}
              </span>
              {/* Actions */}
              <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                {rdv.status === 'confirmed' && (
                  <button onClick={() => navigate(`/consultation/waiting/${rdv.id}`)}
                    style={{ background: DS.primary, color:'#fff', border:'none', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:4 }}>
                    <Video size={14} /> Rejoindre
                  </button>
                )}
                {['confirmed','pending'].includes(rdv.status) && (
                  <button onClick={() => handleCancel(rdv.id)}
                    style={{ background:'#ffdad6', color:'#ba1a1a', border:'none', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:4 }}>
                    <X size={14} /> Annuler
                  </button>
                )}
                {rdv.status === 'completed' && (
                  <button onClick={() => navigate(`/consultation/waiting/${rdv.id}`)}
                    style={{ background: DS.surfaceLow, color: DS.primary, border:'none', borderRadius:8, padding:'8px 14px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:4 }}>
                    <ChevronRight size={14} /> Détails
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}