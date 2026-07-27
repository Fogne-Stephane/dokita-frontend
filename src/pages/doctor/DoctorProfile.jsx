import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Camera, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import api from '../../api/axios';

const DS = {
  primary:'#016472', secondary:'#E8613A', surface:'#ffffff',
  surfaceLow:'#f0f3ff', surfaceContainer:'#e7eeff',
  onSurface:'#111c2d', outline:'#6f797b', outlineVariant:'#bec8cb',
};
const DAYS = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];

export default function DoctorProfilePage() {
  const { user }    = useSelector(s => s.auth);
  const [profileData, setProfileData] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [editing,   setEditing]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [toggling,  setToggling]  = useState(false);
  const [form,      setForm]      = useState({});
  const [days,      setDays]      = useState([]);
  const [msg,       setMsg]       = useState({ type:'', text:'' });

  useEffect(() => {
    api.get('/profile/me')
      .then(res => {
        const d = res.data;
        setProfileData(d);
        setForm({
          name:                  d.user?.name || '',
          email:                 d.user?.email || '',
          phone:                 d.user?.phone || '',
          specialty:             d.profile?.specialty || '',
          bio:                   d.profile?.bio || '',
          consultation_fee:      d.profile?.consultation_fee || 0,
          consultation_duration: d.profile?.consultation_duration || 30,
          available_from:        d.profile?.available_from?.slice(0,5) || '08:00',
          available_to:          d.profile?.available_to?.slice(0,5) || '17:00',
          license_number:        d.profile?.license_number || '',
          experience_years:      d.profile?.experience_years || 0,
          is_available:          d.profile?.is_available ?? true,
        });
        setDays(d.profile?.available_days || []);
      })
      .catch(e => { console.error(e); setMsg({ type:'error', text:'Erreur de chargement du profil.' }); })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg({ type:'', text:'' });
    try {
      await api.post('/profile/update', { ...form, available_days: days });
      setEditing(false);
      setMsg({ type:'success', text:'✅ Profil mis à jour avec succès !' });
      // Recharger
      const res = await api.get('/profile/me');
      setProfileData(res.data);
    } catch (e) {
      const errors = e.response?.data?.errors;
      const msg = errors
        ? Object.values(errors).flat().join(' · ')
        : e.response?.data?.message || 'Erreur lors de la sauvegarde.';
      setMsg({ type:'error', text: '⚠️ ' + msg });
    } finally { setSaving(false); }
  };

  const toggleAvailability = async () => {
    setToggling(true);
    try {
      const newVal = !form.is_available;
      await api.post('/profile/update', { is_available: newVal });
      setForm(prev => ({ ...prev, is_available: newVal }));
      setMsg({ type:'success', text: newVal ? '✅ Vous êtes maintenant disponible.' : '⏸️ Vous êtes maintenant indisponible.' });
    } catch (e) { setMsg({ type:'error', text:'Erreur lors du changement de disponibilité.' }); }
    finally { setToggling(false); }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await api.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfileData(prev => ({ ...prev, user: { ...prev.user, avatar_url: res.data.avatar_url } }));
      setMsg({ type:'success', text:'✅ Photo de profil mise à jour !' });
    } catch (e) { setMsg({ type:'error', text:'Erreur upload photo.' }); }
  };

  const toggleDay = (day) => {
    if (!editing) return;
    setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const getInitials = (name) => {
    const p = (name||'').split(' ');
    return (p[0]?.[0]||'') + (p[1]?.[0]||'');
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300, fontFamily:"'Inter',sans-serif" }}>
      <p style={{ color: DS.outline }}>Chargement du profil...</p>
    </div>
  );

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", maxWidth:860, margin:'0 auto' }}>

      {/* Messages */}
      {msg.text && (
        <div style={{ background: msg.type==='success' ? '#e1f5ee' : '#ffdad6', color: msg.type==='success' ? '#016472' : '#ba1a1a', padding:'12px 16px', borderRadius:8, marginBottom:16, fontSize:14 }}>
          {msg.text}
        </div>
      )}

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:'clamp(18px,3vw,24px)', fontWeight:700, color: DS.onSurface, margin:'0 0 4px' }}>Mon Profil Médecin</h1>
          <p style={{ fontSize:14, color: DS.outline, margin:0 }}>Gérez vos informations professionnelles</p>
        </div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
          {/* Toggle dispo */}
          <button onClick={toggleAvailability} disabled={toggling}
            style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 16px', borderRadius:8, border:`1px solid ${form.is_available ? DS.primary : DS.outlineVariant}`, background: form.is_available ? DS.surfaceContainer : DS.surface, cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:600, color: form.is_available ? DS.primary : DS.outline, transition:'all .2s', opacity: toggling ? 0.6 : 1 }}>
            {form.is_available ? <ToggleRight size={20} color={DS.primary}/> : <ToggleLeft size={20} color={DS.outline}/>}
            {form.is_available ? '● Disponible' : '○ Indisponible'}
          </button>
          {editing ? (
            <button onClick={handleSave} disabled={saving}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 18px', background: DS.primary, color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily:'inherit', fontSize:13, opacity: saving ? 0.7 : 1 }}>
              <Save size={15}/> {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          ) : (
            <button onClick={() => { setEditing(true); setMsg({ type:'', text:'' }); }}
              style={{ padding:'9px 18px', background: DS.surfaceContainer, color: DS.primary, border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:13 }}>
              ✏️ Modifier
            </button>
          )}
          {editing && (
            <button onClick={() => setEditing(false)}
              style={{ padding:'9px 14px', background:'transparent', color: DS.outline, border:`1px solid ${DS.outlineVariant}`, borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:13 }}>
              Annuler
            </button>
          )}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'clamp(12px,2vw,20px)' }}>

        {/* Card gauche — avatar + stats */}
        <div style={{ background: DS.surface, borderRadius:12, padding:'clamp(16px,3vw,24px)', border:`1px solid ${DS.outlineVariant}`, textAlign:'center' }}>

          {/* Avatar avec upload */}
          <div style={{ position:'relative', width:80, height:80, margin:'0 auto 14px' }}>
            <div style={{ width:80, height:80, borderRadius:'50%', background: `linear-gradient(135deg,${DS.secondary},#E8913A)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:28, overflow:'hidden' }}>
              {profileData?.user?.avatar_url
                ? <img src={profileData.user.avatar_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                : getInitials(form.name).toUpperCase()
              }
            </div>
            <label style={{ position:'absolute', bottom:0, right:0, width:26, height:26, borderRadius:'50%', background: DS.primary, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', border:'2px solid white' }}>
              <Camera size={14} color="#fff"/>
              <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display:'none' }}/>
            </label>
          </div>

          <p style={{ fontSize:16, fontWeight:700, color: DS.onSurface, margin:'0 0 4px' }}>Dr. {form.name}</p>
          <p style={{ fontSize:13, color: DS.primary, margin:'0 0 10px', fontWeight:600 }}>{form.specialty || 'Spécialité'}</p>

          <span style={{ display:'inline-block', fontSize:12, padding:'3px 12px', borderRadius:999, background: profileData?.profile?.is_verified ? '#e1f5ee' : '#fff8e7', color: profileData?.profile?.is_verified ? DS.primary : '#884b00', fontWeight:600, marginBottom:16 }}>
            {profileData?.profile?.is_verified ? '✅ Médecin vérifié' : '⏳ En attente vérification'}
          </span>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {[
              { label:'Expérience', val: (form.experience_years || 0) + ' ans' },
              { label:'Tarif',      val: Number(form.consultation_fee || 0).toLocaleString() + ' XAF' },
              { label:'Durée',      val: (form.consultation_duration || 30) + ' min' },
              { label:'Note',       val: '⭐ 4.9' },
            ].map((s,i) => (
              <div key={i} style={{ background: DS.surfaceLow, borderRadius:8, padding:'10px 8px', textAlign:'center' }}>
                <p style={{ fontSize:14, fontWeight:700, color: DS.onSurface, margin:'0 0 2px' }}>{s.val}</p>
                <p style={{ fontSize:11, color: DS.outline, margin:0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <div style={{ display:'flex', flexDirection:'column', gap:'clamp(12px,2vw,16px)' }}>

          {/* Infos personnelles */}
          <div style={{ background: DS.surface, borderRadius:12, padding:'clamp(14px,3vw,20px)', border:`1px solid ${DS.outlineVariant}` }}>
            <h3 style={{ fontSize:14, fontWeight:700, color: DS.primary, margin:'0 0 14px' }}>👤 Informations personnelles</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10 }}>
              {[
                { key:'name',             label:'Nom complet',           type:'text' },
                { key:'email',            label:'Email',                 type:'email' },
                { key:'phone',            label:'Téléphone',             type:'tel' },
                { key:'specialty',        label:'Spécialité',            type:'text' },
                { key:'license_number',   label:"N° Ordre des médecins", type:'text' },
                { key:'experience_years', label:"Années d'expérience",   type:'number' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display:'block', fontSize:11, fontWeight:600, color: DS.outline, marginBottom:4 }}>{f.label}</label>
                  <input type={f.type} value={form[f.key] || ''} disabled={!editing}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    style={{ width:'100%', border:`1.5px solid ${editing ? DS.primary : DS.outlineVariant}`, borderRadius:8, padding:'9px 11px', fontSize:13, fontFamily:'inherit', outline:'none', background: editing ? DS.surface : DS.surfaceLow, boxSizing:'border-box', color: DS.onSurface }}
                  />
                </div>
              ))}
            </div>
            <div style={{ marginTop:10 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:600, color: DS.outline, marginBottom:4 }}>Biographie</label>
              <textarea rows={3} value={form.bio || ''} disabled={!editing}
                onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                style={{ width:'100%', border:`1.5px solid ${editing ? DS.primary : DS.outlineVariant}`, borderRadius:8, padding:'9px 11px', fontSize:13, fontFamily:'inherit', outline:'none', background: editing ? DS.surface : DS.surfaceLow, resize:'none', boxSizing:'border-box', color: DS.onSurface }}
              />
            </div>
          </div>

          {/* Tarifs & Horaires */}
          <div style={{ background: DS.surface, borderRadius:12, padding:'clamp(14px,3vw,20px)', border:`1px solid ${DS.outlineVariant}` }}>
            <h3 style={{ fontSize:14, fontWeight:700, color: DS.secondary, margin:'0 0 14px' }}>💳 Tarifs & Disponibilité</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10, marginBottom:14 }}>
              {[
                { key:'consultation_fee',      label:'Tarif (XAF)',   type:'number' },
                { key:'consultation_duration', label:'Durée (min)',   type:'number' },
                { key:'available_from',        label:'Heure début',   type:'time' },
                { key:'available_to',          label:'Heure fin',     type:'time' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display:'block', fontSize:11, fontWeight:600, color: DS.outline, marginBottom:4 }}>{f.label}</label>
                  <input type={f.type} value={form[f.key] || ''} disabled={!editing}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    style={{ width:'100%', border:`1.5px solid ${editing ? DS.primary : DS.outlineVariant}`, borderRadius:8, padding:'9px 11px', fontSize:13, fontFamily:'inherit', outline:'none', background: editing ? DS.surface : DS.surfaceLow, boxSizing:'border-box', color: DS.onSurface }}
                  />
                </div>
              ))}
            </div>
            <label style={{ display:'block', fontSize:11, fontWeight:600, color: DS.outline, marginBottom:8 }}>Jours de consultation</label>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {DAYS.map(day => (
                <button key={day} type="button" onClick={() => toggleDay(day)}
                  style={{ padding:'5px 11px', borderRadius:999, border:`1.5px solid ${days.includes(day) ? DS.primary : DS.outlineVariant}`, background: days.includes(day) ? DS.surfaceContainer : DS.surface, color: days.includes(day) ? DS.primary : DS.outline, fontSize:12, fontWeight:600, cursor: editing ? 'pointer' : 'default', fontFamily:'inherit', transition:'all .15s' }}>
                  {day.slice(0,3)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}