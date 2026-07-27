import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, MessageSquare, FileText, ChevronRight } from 'lucide-react';
import api from '../../api/axios';

const DS = { primary:'#016472', secondary:'#E8613A', surface:'#ffffff', surfaceLow:'#f0f3ff', surfaceContainer:'#e7eeff', onSurface:'#111c2d', outline:'#6f797b', outlineVariant:'#bec8cb' };

export default function PatientConsultations() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    api.get('/patient/appointments')
      .then(res => {
        const done = res.data.filter(a => a.status === 'completed');
        setConsultations(done);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ fontFamily:"'Inter',sans-serif" }}>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:24, fontWeight:700, color: DS.onSurface, margin:'0 0 4px', letterSpacing:'-0.02em' }}>
          Mes Consultations
        </h1>
        <p style={{ fontSize:14, color: DS.outline, margin:0 }}>
          {consultations.length} consultation{consultations.length > 1 ? 's' : ''} effectuée{consultations.length > 1 ? 's' : ''}
        </p>
      </div>

      {loading ? (
        <p style={{ color: DS.outline, textAlign:'center', padding:40 }}>Chargement...</p>
      ) : consultations.length === 0 ? (
        <div style={{ textAlign:'center', padding:48, background: DS.surface, borderRadius:12, border:`1px solid ${DS.outlineVariant}` }}>
          <Video size={40} color={DS.outlineVariant} style={{ margin:'0 auto 12px' }} />
          <p style={{ color: DS.outline, fontWeight:600, margin:'0 0 16px' }}>Aucune consultation effectuée</p>
          <button onClick={() => navigate('/patient/doctors')}
            style={{ padding:'10px 22px', background:`linear-gradient(90deg,${DS.secondary},#E8913A)`, color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
            Consulter un médecin
          </button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {consultations.map(c => (
            <div key={c.id} style={{ background: DS.surface, borderRadius:12, border:`1px solid ${DS.outlineVariant}`, overflow:'hidden' }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px' }}>
                <div style={{ width:46, height:46, borderRadius:12, background: DS.surfaceContainer, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {c.type === 'video' ? <Video size={20} color={DS.primary} /> : <MessageSquare size={20} color={DS.primary} />}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:'0 0 3px', fontWeight:600, fontSize:15, color: DS.onSurface }}>
                    {c.doctor?.name || 'Médecin'}
                  </p>
                  <p style={{ margin:0, fontSize:12, color: DS.outline }}>
                    {c.doctor?.specialty} · {c.scheduled_at} · {c.type === 'video' ? 'Vidéo' : 'Message'}
                  </p>
                </div>
                <span style={{ background:'#e1f5ee', color: DS.primary, padding:'4px 12px', borderRadius:999, fontSize:12, fontWeight:600 }}>
                  Terminée
                </span>
              </div>
              {/* Actions */}
              <div style={{ display:'flex', gap:0, borderTop:`1px solid ${DS.outlineVariant}` }}>
                <button onClick={() => navigate('/patient/prescriptions')}
                  style={{ flex:1, padding:'11px', background:'transparent', border:'none', borderRight:`1px solid ${DS.outlineVariant}`, cursor:'pointer', fontFamily:'inherit', fontSize:13, color: DS.primary, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                  <FileText size={14} /> Ordonnance
                </button>
                <button onClick={() => navigate(`/consultation/summary/${c.id}`)}
                  style={{ flex:1, padding:'11px', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, color: DS.outline, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                  <ChevronRight size={14} /> Détails
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}