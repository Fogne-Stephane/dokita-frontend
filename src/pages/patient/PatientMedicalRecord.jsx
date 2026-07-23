import { useState, useEffect } from 'react';
import { FileText, Download, Activity, Beaker, Stethoscope, Image } from 'lucide-react';
import api from '../../api/axios';

const DS = {
  primary:'#016472', secondary:'#E8613A', bg:'#f9f9ff',
  surface:'#ffffff', surfaceLow:'#f0f3ff', surfaceContainer:'#e7eeff',
  onSurface:'#111c2d', outline:'#6f797b', outlineVariant:'#bec8cb',
};

const TABS = ['Résumé', 'Historique', 'Documents'];

const TYPE_CONFIG = {
  lab_result: { icon: <Beaker size={18} color="#884b00" />,        bg:'#fff8e7', color:'#884b00', label:'Analyse' },
  imaging:    { icon: <Image size={18} color="#016472" />,          bg: '#e7eeff', color:'#016472', label:'Imagerie' },
  report:     { icon: <FileText size={18} color="#016472" />,       bg: '#e7eeff', color:'#016472', label:'Rapport' },
  other:      { icon: <FileText size={18} color="#6f797b" />,       bg: '#f5f5f5', color:'#6f797b', label:'Autre' },
};

export default function PatientMedicalRecord() {
  const [activeTab, setActiveTab] = useState('Résumé');
  const [data, setData]           = useState(null);
  const [docs, setDocs]           = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [recordRes, docsRes, consRes] = await Promise.all([
          api.get('/patient/medical-record'),
          api.get('/patient/medical-record/documents'),
          api.get('/patient/medical-record/consultations'),
        ]);
        setData(recordRes.data);
        setDocs(docsRes.data);
        setConsultations(consRes.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300, fontFamily:'Inter,sans-serif' }}>
      <p style={{ color: DS.outline }}>Chargement du dossier médical...</p>
    </div>
  );

  const patient = data?.patient;
  const stats   = data?.stats;

  return (
    <div style={{ fontFamily:'Inter,sans-serif' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:700, color: DS.onSurface, margin:'0 0 4px', letterSpacing:'-0.02em' }}>
          Dossier Médical
        </h1>
        <p style={{ fontSize:14, color: DS.outline, margin:0 }}>
          Votre historique médical complet et sécurisé
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, background: DS.surface, padding:4, borderRadius:12, border:`1px solid ${DS.outlineVariant}`, width:'fit-content', marginBottom:20 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ padding:'8px 18px', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:600, background: activeTab===t ? DS.primary : 'transparent', color: activeTab===t ? '#fff' : DS.outline, transition:'all .2s' }}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Résumé ── */}
      {activeTab === 'Résumé' && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12 }}>
            {[
              { label:'Consultations',  value: stats?.total_consultations, icon:'🩺' },
              { label:'Prescriptions',  value: stats?.total_prescriptions, icon:'💊' },
              { label:'Documents',      value: stats?.total_documents,     icon:'📁' },
              { label:'Dossiers',       value: stats?.total_records,       icon:'🗂️' },
            ].map((s,i) => (
              <div key={i} style={{ background: DS.surface, borderRadius:12, padding:'16px', border:`1px solid ${DS.outlineVariant}`, textAlign:'center' }}>
                <p style={{ fontSize:22, margin:'0 0 6px' }}>{s.icon}</p>
                <p style={{ fontSize:22, fontWeight:700, color: DS.primary, margin:'0 0 2px' }}>{s.value}</p>
                <p style={{ fontSize:12, color: DS.outline, margin:0 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Infos patient */}
          <div style={{ background: DS.surface, borderRadius:12, padding:20, border:`1px solid ${DS.outlineVariant}` }}>
            <h3 style={{ fontSize:15, fontWeight:700, color: DS.primary, margin:'0 0 16px', display:'flex', alignItems:'center', gap:8 }}>
              <Stethoscope size={18} /> Informations médicales
            </h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0 }}>
              {[
                { label:'Groupe sanguin',    value: patient?.blood_type || '—' },
                { label:'Date de naissance', value: patient?.birth_date || '—' },
                { label:'Genre',             value: patient?.gender === 'male' ? 'Homme' : patient?.gender === 'female' ? 'Femme' : '—' },
                { label:'Ville',             value: patient?.city || '—' },
              ].map((item,i) => (
                <div key={i} style={{ padding:'10px 0', borderBottom:`1px solid ${DS.outlineVariant}`, paddingRight: i%2===0 ? 20 : 0 }}>
                  <p style={{ fontSize:12, color: DS.outline, margin:'0 0 3px' }}>{item.label}</p>
                  <p style={{ fontSize:14, fontWeight:600, color: DS.onSurface, margin:0 }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Allergies */}
          {patient?.allergies && (
            <div style={{ background: DS.surface, borderRadius:12, padding:20, border:`1px solid ${DS.outlineVariant}` }}>
              <h3 style={{ fontSize:15, fontWeight:700, color:'#ba1a1a', margin:'0 0 12px' }}>⚠️ Allergies</h3>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {patient.allergies.split(',').map((a,i) => (
                  <span key={i} style={{ background:'#ffdad6', color:'#ba1a1a', padding:'4px 12px', borderRadius:999, fontSize:13, fontWeight:600 }}>
                    {a.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Maladies chroniques */}
          {patient?.chronic_diseases && (
            <div style={{ background: DS.surface, borderRadius:12, padding:20, border:`1px solid ${DS.outlineVariant}` }}>
              <h3 style={{ fontSize:15, fontWeight:700, color:'#884b00', margin:'0 0 12px' }}>🔶 Maladies chroniques</h3>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {patient.chronic_diseases.split(',').map((m,i) => (
                  <span key={i} style={{ background:'#fff8e7', color:'#884b00', padding:'4px 12px', borderRadius:999, fontSize:13, fontWeight:600 }}>
                    {m.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dossiers récents */}
          {data?.records?.length > 0 && (
            <div style={{ background: DS.surface, borderRadius:12, padding:20, border:`1px solid ${DS.outlineVariant}` }}>
              <h3 style={{ fontSize:15, fontWeight:700, color: DS.onSurface, margin:'0 0 14px' }}>🗂️ Dossiers récents</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {data.records.slice(0,3).map((r,i) => {
                  const tc = TYPE_CONFIG[r.type] || TYPE_CONFIG.other;
                  return (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px', background: DS.surfaceLow, borderRadius:10 }}>
                      <div style={{ width:38, height:38, borderRadius:10, background: tc.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        {tc.icon}
                      </div>
                      <div style={{ flex:1 }}>
                        <p style={{ margin:'0 0 2px', fontWeight:600, fontSize:13, color: DS.onSurface }}>{r.title}</p>
                        <p style={{ margin:0, fontSize:12, color: DS.outline }}>{r.record_date} · Dr. {r.doctor_name}</p>
                      </div>
                      <span style={{ background: tc.bg, color: tc.color, padding:'3px 8px', borderRadius:999, fontSize:11, fontWeight:600 }}>{tc.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Historique consultations ── */}
      {activeTab === 'Historique' && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {consultations.length === 0 ? (
            <div style={{ textAlign:'center', padding:40, background: DS.surface, borderRadius:12, border:`1px solid ${DS.outlineVariant}` }}>
              <Activity size={36} color={DS.outlineVariant} style={{ margin:'0 auto 12px' }} />
              <p style={{ color: DS.outline }}>Aucune consultation</p>
            </div>
          ) : consultations.map((c,i) => (
            <div key={i} style={{ background: DS.surface, borderRadius:12, padding:20, border:`1px solid ${DS.outlineVariant}` }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom: c.diagnosis ? 14 : 0 }}>
                <div style={{ width:44, height:44, borderRadius:12, background: DS.surfaceContainer, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:20 }}>
                  👨‍⚕️
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:'0 0 3px', fontWeight:600, fontSize:15, color: DS.onSurface }}>{c.doctor_name}</p>
                  <p style={{ margin:'0 0 6px', fontSize:13, color: DS.primary, fontWeight:500 }}>{c.specialty}</p>
                  <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                    <span style={{ fontSize:12, color: DS.outline }}>📅 {c.date}</span>
                    <span style={{ fontSize:12, color: DS.outline }}>🎥 {c.type === 'video' ? 'Vidéo' : 'En personne'}</span>
                    {c.reason && <span style={{ fontSize:12, color: DS.outline }}>📝 {c.reason}</span>}
                  </div>
                </div>
              </div>
              {c.diagnosis && (
                <div style={{ background: DS.surfaceLow, borderRadius:10, padding:'12px 14px', marginTop:12 }}>
                  <p style={{ fontSize:12, color: DS.outline, margin:'0 0 4px', fontWeight:600 }}>DIAGNOSTIC</p>
                  <p style={{ fontSize:13, color: DS.onSurface, margin:'0 0 8px', lineHeight:1.5 }}>{c.diagnosis}</p>
                  {c.treatment && (
                    <>
                      <p style={{ fontSize:12, color: DS.outline, margin:'0 0 4px', fontWeight:600 }}>TRAITEMENT</p>
                      <p style={{ fontSize:13, color: DS.onSurface, margin:0, lineHeight:1.5 }}>{c.treatment}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Documents ── */}
      {activeTab === 'Documents' && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {docs.length === 0 ? (
            <div style={{ textAlign:'center', padding:40, background: DS.surface, borderRadius:12, border:`1px solid ${DS.outlineVariant}` }}>
              <FileText size={36} color={DS.outlineVariant} style={{ margin:'0 auto 12px' }} />
              <p style={{ color: DS.outline }}>Aucun document</p>
            </div>
          ) : docs.map((doc,i) => (
            <div key={i} style={{ background: DS.surface, borderRadius:12, padding:'16px 20px', border:`1px solid ${DS.outlineVariant}`, display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:12, background: DS.surfaceContainer, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <FileText size={20} color={DS.primary} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ margin:'0 0 3px', fontWeight:600, fontSize:14, color: DS.onSurface, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {doc.name}
                </p>
                <p style={{ margin:0, fontSize:12, color: DS.outline }}>
                  {doc.category} · {doc.file_size} · {doc.date}
                </p>
              </div>
              <button style={{ background: DS.surfaceContainer, border:'none', borderRadius:8, padding:'8px 14px', fontSize:12, color: DS.primary, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                <Download size={14} /> Télécharger
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}