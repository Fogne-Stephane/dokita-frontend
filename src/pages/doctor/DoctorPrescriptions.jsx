import { useState, useEffect } from 'react';
import api from '../../api/axios';

const DS = {
  primary:'#016472', secondary:'#E8613A', surface:'#ffffff',
  surfaceLow:'#f0f3ff', surfaceContainer:'#e7eeff',
  onSurface:'#111c2d', outline:'#6f797b', outlineVariant:'#bec8cb',
};

const EMPTY_MED = { name:'', dose:'', frequency:'', duration:'' };

export default function DoctorPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients,      setPatients]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [showForm,      setShowForm]      = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [msg,           setMsg]           = useState('');

  const [form, setForm] = useState({
    patient_id:   '',
    valid_until:  '',
    instructions: '',
    medications:  [{ ...EMPTY_MED }],
  });

  useEffect(() => {
    Promise.all([
      api.get('/doctor/prescriptions'),
      api.get('/doctor/patients'),
    ]).then(([presRes, patRes]) => {
      setPrescriptions(presRes.data);
      setPatients(patRes.data);
    }).catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  const updateMed = (i, key, val) => {
    const updated = [...form.medications];
    updated[i][key] = val;
    setForm(prev => ({ ...prev, medications: updated }));
  };

  const addMed    = () => setForm(prev => ({ ...prev, medications: [...prev.medications, { ...EMPTY_MED }] }));
  const removeMed = (i) => setForm(prev => ({ ...prev, medications: prev.medications.filter((_,idx) => idx !== i) }));

  const handleSubmit = async () => {
    if (!form.patient_id) { setMsg('⚠️ Sélectionnez un patient.'); return; }
    if (form.medications.some(m => !m.name)) { setMsg('⚠️ Remplissez tous les médicaments.'); return; }
    setSaving(true);
    setMsg('');
    try {
      const res = await api.post('/doctor/prescriptions', form);
      setPrescriptions(prev => [res.data.prescription, ...prev]);
      setShowForm(false);
      setMsg('✅ Ordonnance créée avec succès !');
      setForm({ patient_id:'', valid_until:'', instructions:'', medications:[{ ...EMPTY_MED }] });
    } catch (e) {
      setMsg('⚠️ ' + (e.response?.data?.message || 'Erreur lors de la création.'));
    } finally { setSaving(false); }
  };

  const inp = { width:'100%', border:`1.5px solid ${DS.outlineVariant}`, borderRadius:8, padding:'9px 12px', fontSize:13, fontFamily:'inherit', outline:'none', background: DS.surface, boxSizing:'border-box' };
  const lbl = { display:'block', fontSize:11, fontWeight:600, color: DS.outline, marginBottom:4 };

  return (
    <div style={{ fontFamily:"'Inter',sans-serif" }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:'clamp(18px,3vw,24px)', fontWeight:700, color: DS.onSurface, margin:'0 0 4px' }}>Prescriptions</h1>
          <p style={{ fontSize:14, color: DS.outline, margin:0 }}>
            {prescriptions.length} ordonnance{prescriptions.length>1?'s':''} rédigée{prescriptions.length>1?'s':''}
          </p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setMsg(''); }}
          style={{ padding:'10px 20px', background:`linear-gradient(90deg,${DS.secondary},#E8913A)`, color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:14 }}>
          {showForm ? '✕ Fermer' : '+ Nouvelle ordonnance'}
        </button>
      </div>

      {msg && (
        <div style={{ background: msg.startsWith('✅') ? '#e1f5ee' : '#ffdad6', color: msg.startsWith('✅') ? DS.primary : '#ba1a1a', padding:'12px 16px', borderRadius:8, marginBottom:16, fontSize:14 }}>
          {msg}
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <div style={{ background: DS.surface, borderRadius:12, padding:'clamp(16px,3vw,24px)', border:`1px solid ${DS.outlineVariant}`, marginBottom:20 }}>
          <h3 style={{ fontSize:15, fontWeight:700, color: DS.primary, margin:'0 0 16px' }}>📝 Nouvelle ordonnance</h3>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12, marginBottom:16 }}>
            <div>
              <label style={lbl}>Patient *</label>
              <select value={form.patient_id} onChange={e => setForm(prev => ({ ...prev, patient_id: e.target.value }))} style={inp}>
                <option value="">— Sélectionner —</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={lbl}>Valide jusqu'au</label>
              <input type="date" value={form.valid_until} onChange={e => setForm(prev => ({ ...prev, valid_until: e.target.value }))} style={inp} />
            </div>
          </div>

          <p style={{ fontSize:13, fontWeight:600, color: DS.onSurface, margin:'0 0 10px' }}>Médicaments *</p>
          {form.medications.map((med, i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr auto', gap:8, marginBottom:8, alignItems:'end' }}>
              {[
                { key:'name',      label: i===0 ? 'Médicament' : '',  placeholder:'Amlodipine 5mg' },
                { key:'dose',      label: i===0 ? 'Dose' : '',         placeholder:'1 comprimé' },
                { key:'frequency', label: i===0 ? 'Fréquence' : '',    placeholder:'2x/jour' },
                { key:'duration',  label: i===0 ? 'Durée' : '',        placeholder:'30 jours' },
              ].map(f => (
                <div key={f.key}>
                  {f.label && <label style={lbl}>{f.label}</label>}
                  <input placeholder={f.placeholder} value={med[f.key]}
                    onChange={e => updateMed(i, f.key, e.target.value)} style={inp} />
                </div>
              ))}
              <button onClick={() => removeMed(i)} disabled={form.medications.length===1}
                style={{ padding:'9px 10px', background:'#ffdad6', border:'none', borderRadius:8, color:'#ba1a1a', cursor:'pointer', opacity: form.medications.length===1 ? 0.4 : 1 }}>
                ✕
              </button>
            </div>
          ))}

          <button onClick={addMed}
            style={{ background: DS.surfaceLow, border:`1.5px dashed ${DS.primary}`, borderRadius:8, padding:'8px 18px', color: DS.primary, fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'inherit', marginBottom:14 }}>
            + Ajouter un médicament
          </button>

          <div style={{ marginBottom:16 }}>
            <label style={lbl}>Instructions</label>
            <textarea rows={2} value={form.instructions} onChange={e => setForm(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Ex: Prendre avec de la nourriture, éviter l'alcool..."
              style={{ ...inp, resize:'none' }} />
          </div>

          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => { setShowForm(false); setMsg(''); }}
              style={{ flex:1, padding:'12px', border:`1.5px solid ${DS.outlineVariant}`, borderRadius:8, background: DS.surface, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
              Annuler
            </button>
            <button onClick={handleSubmit} disabled={saving}
              style={{ flex:2, padding:'12px', background: DS.primary, color:'#fff', border:'none', borderRadius:8, fontWeight:700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily:'inherit', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Création...' : '✅ Valider et envoyer'}
            </button>
          </div>
        </div>
      )}

      {/* Liste */}
      {loading ? (
        <p style={{ color: DS.outline, textAlign:'center', padding:40 }}>Chargement...</p>
      ) : prescriptions.length === 0 ? (
        <div style={{ textAlign:'center', padding:48, background: DS.surface, borderRadius:12, border:`1px solid ${DS.outlineVariant}` }}>
          <p style={{ fontSize:40, margin:'0 0 12px' }}>💊</p>
          <p style={{ color: DS.outline, fontWeight:600 }}>Aucune ordonnance rédigée</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {prescriptions.map((p, i) => (
            <div key={p.id || i} style={{ background: DS.surface, borderRadius:12, padding:'clamp(14px,3vw,18px)', border:`1px solid ${DS.outlineVariant}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom: p.medications?.length ? 10 : 0 }}>
                <div style={{ width:42, height:42, borderRadius:10, background: DS.surfaceContainer, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>💊</div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:'0 0 3px', fontWeight:600, fontSize:14, color: DS.onSurface }}>
                    {p.patient_name || p.patient?.name || 'Patient'}
                  </p>
                  <p style={{ margin:0, fontSize:12, color: DS.outline }}>
                    {p.created_at} · {p.medications?.length || 0} médicament{(p.medications?.length||0)>1?'s':''}
                    {p.valid_until && ` · Valide jusqu'au ${p.valid_until}`}
                  </p>
                </div>
                <button style={{ background: DS.surfaceLow, border:'none', borderRadius:8, padding:'7px 14px', fontSize:12, color: DS.primary, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                  ⬇️ PDF
                </button>
              </div>
              {p.medications?.length > 0 && (
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {(p.medications || []).slice(0,3).map((m,j) => (
                    <span key={j} style={{ fontSize:12, padding:'3px 10px', borderRadius:999, background: DS.surfaceContainer, color: DS.primary }}>
                      {m.name}
                    </span>
                  ))}
                  {p.medications.length > 3 && <span style={{ fontSize:12, color: DS.outline }}>+{p.medications.length-3}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}