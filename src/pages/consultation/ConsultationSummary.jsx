import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Calendar, MessageSquare } from 'lucide-react';
import api from '../../api/axios';

export default function ConsultationSummary() {
  const { appointmentId } = useParams();
  const navigate          = useNavigate();
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/patient/appointments')
      .then(res => {
        const rdv = res.data.find(a => a.id === parseInt(appointmentId));
        setData(rdv);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [appointmentId]);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontFamily:"'Inter',sans-serif" }}>
      <p style={{ color:'var(--outline)' }}>Chargement...</p>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'var(--background)', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(16px,4vw,32px)', fontFamily:"'Inter',sans-serif" }}>
      <div style={{ width:'100%', maxWidth:480 }}>

        {/* Succès */}
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:'#e1f5ee', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <CheckCircle size={36} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize:'clamp(20px,3vw,24px)', fontWeight:700, color:'var(--on-surface)', margin:'0 0 8px' }}>
            Consultation terminée
          </h1>
          <p style={{ fontSize:14, color:'var(--outline)', margin:0 }}>
            Merci d'avoir consulté via Dokita
          </p>
        </div>

        {/* Détails */}
        <div style={{ background:'var(--surface)', borderRadius:12, border:'1px solid var(--outline-variant)', padding:20, marginBottom:16 }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:'var(--primary)', margin:'0 0 14px' }}>Résumé de la consultation</h3>
          {data && [
            { label:'Médecin',  value: data.doctor?.name },
            { label:'Date',     value: data.scheduled_at },
            { label:'Type',     value: data.type === 'video' ? 'Téléconsultation vidéo' : 'Consultation par message' },
            { label:'Montant',  value: data.fee },
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom: i < 3 ? '1px solid var(--outline-variant)' : 'none' }}>
              <span style={{ fontSize:13, color:'var(--outline)' }}>{item.label}</span>
              <span style={{ fontSize:13, fontWeight:600, color:'var(--on-surface)' }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button onClick={() => navigate('/patient/prescriptions')}
            style={{ width:'100%', padding:'13px', background:'var(--primary)', color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <Download size={16} /> Voir mes ordonnances
          </button>
          <button onClick={() => navigate('/patient/appointments')}
            style={{ width:'100%', padding:'13px', background:'var(--surface-container)', color:'var(--primary)', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <Calendar size={16} /> Mes rendez-vous
          </button>
          <button onClick={() => navigate('/patient/dashboard')}
            style={{ width:'100%', padding:'13px', border:'1.5px solid var(--outline-variant)', borderRadius:8, background:'transparent', color:'var(--on-surface)', fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:14 }}>
            Retour au tableau de bord
          </button>
        </div>
      </div>
    </div>
  );
}