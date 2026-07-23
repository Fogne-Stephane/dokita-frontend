import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronDown, ChevronUp, Download, Pill } from 'lucide-react';
import api from '../../api/axios';

const DS = {
  primary:'#016472', secondary:'#E8613A', bg:'#f9f9ff',
  surface:'#ffffff', surfaceLow:'#f0f3ff', surfaceContainer:'#e7eeff',
  onSurface:'#111c2d', outline:'#6f797b', outlineVariant:'#bec8cb',
};

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [expanded, setExpanded]           = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/patient/prescriptions');
        setPrescriptions(res.data);
        if (res.data.length > 0) setExpanded(res.data[0].id);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300, fontFamily:'Inter,sans-serif' }}>
      <p style={{ color: DS.outline }}>Chargement des prescriptions...</p>
    </div>
  );

  return (
    <div style={{ fontFamily:'Inter,sans-serif' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:700, color: DS.onSurface, margin:'0 0 4px', letterSpacing:'-0.02em' }}>
          Mes Prescriptions
        </h1>
        <p style={{ fontSize:14, color: DS.outline, margin:0 }}>
          {prescriptions.filter(p => p.is_active).length} ordonnance{prescriptions.filter(p=>p.is_active).length>1?'s':''} active{prescriptions.filter(p=>p.is_active).length>1?'s':''}
        </p>
      </div>

      {prescriptions.length === 0 ? (
        <div style={{ textAlign:'center', padding:48, background: DS.surface, borderRadius:12, border:`1px solid ${DS.outlineVariant}` }}>
          <FileText size={40} color={DS.outlineVariant} style={{ margin:'0 auto 12px' }} />
          <p style={{ color: DS.outline, fontWeight:600 }}>Aucune prescription</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {prescriptions.map(p => {
            const isOpen = expanded === p.id;
            return (
              <div key={p.id} style={{ background: DS.surface, borderRadius:12, border:`1.5px solid ${p.is_active ? DS.primary : DS.outlineVariant}`, overflow:'hidden', transition:'border-color .2s' }}>

                {/* Header */}
                <div onClick={() => setExpanded(isOpen ? null : p.id)}
                  style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px', cursor:'pointer' }}>
                  <div style={{ width:44, height:44, borderRadius:12, background: p.is_active ? DS.surfaceContainer : '#f5f5f5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <FileText size={22} color={ p.is_active ? DS.primary : DS.outline} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ margin:'0 0 3px', fontWeight:600, fontSize:14, color: DS.onSurface }}>
                      Ordonnance — {p.doctor_name}
                    </p>
                    <p style={{ margin:0, fontSize:12, color: DS.outline }}>
                      {p.specialty} · {p.created_at} · {p.medications?.length} médicament{p.medications?.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                    <span style={{ background: p.is_active ? '#e1f5ee' : '#f5f5f5', color: p.is_active ? DS.primary : DS.outline, padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:600 }}>
                      {p.is_active ? '✅ Active' : '⏰ Expirée'}
                    </span>
                    {isOpen ? <ChevronUp size={16} color={DS.outline} /> : <ChevronDown size={16} color={DS.outline} />}
                  </div>
                </div>

                {/* Détail */}
                {isOpen && (
                  <div style={{ padding:'0 20px 20px', borderTop:`1px solid ${DS.outlineVariant}`, paddingTop:16 }}>

                    {/* Diagnostic */}
                    {p.diagnosis && (
                      <div style={{ background: DS.surfaceLow, borderRadius:10, padding:'12px 14px', marginBottom:14 }}>
                        <p style={{ fontSize:12, color: DS.outline, margin:'0 0 4px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>Diagnostic</p>
                        <p style={{ fontSize:13, color: DS.onSurface, margin:0, lineHeight:1.5 }}>{p.diagnosis}</p>
                      </div>
                    )}

                    {/* Médicaments */}
                    <p style={{ fontSize:13, fontWeight:600, color: DS.onSurface, margin:'0 0 10px' }}>Médicaments prescrits</p>
                    <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:14 }}>
                      {(p.medications || []).map((med, i) => (
                        <div key={i} style={{ display:'flex', alignItems:'center', gap:12, background: DS.surfaceLow, borderRadius:10, padding:'12px 14px' }}>
                          <div style={{ width:36, height:36, borderRadius:10, background: DS.surfaceContainer, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <Pill size={18} color={DS.primary} />
                          </div>
                          <div style={{ flex:1 }}>
                            <p style={{ margin:'0 0 2px', fontWeight:600, fontSize:14, color: DS.onSurface }}>{med.name}</p>
                            <p style={{ margin:0, fontSize:12, color: DS.outline }}>
                              {med.dose} · {med.frequency}
                              {med.duration && ` · ${med.duration}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Instructions */}
                    {p.instructions && (
                      <div style={{ background:'#fff8e7', borderRadius:10, padding:'12px 14px', marginBottom:14, display:'flex', gap:8 }}>
                        <span style={{ fontSize:16 }}>💡</span>
                        <p style={{ fontSize:13, color:'#884b00', margin:0, lineHeight:1.5 }}>{p.instructions}</p>
                      </div>
                    )}

                    {/* Validité */}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                      <span style={{ fontSize:13, color: DS.outline }}>
                        Valide jusqu'au : <strong style={{ color: DS.onSurface }}>{p.valid_until || 'Non définie'}</strong>
                      </span>
                    </div>

                    {/* Bouton PDF */}
                    <button style={{ width:'100%', padding:'11px', background: DS.primary, color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                      <Download size={16} /> Télécharger l'ordonnance PDF
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}