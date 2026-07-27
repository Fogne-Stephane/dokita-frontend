import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, MessageSquare, Calendar, X, ChevronLeft, ChevronRight, Star, MapPin, Clock, CreditCard } from 'lucide-react';
import api from '../../api/axios';

const DS = {
  primary:'#016472', secondary:'#E8613A', bg:'#f9f9ff',
  surface:'#ffffff', surfaceLow:'#f0f3ff', surfaceContainer:'#e7eeff',
  onSurface:'#111c2d', outline:'#6f797b', outlineVariant:'#bec8cb',
};

const DAYS_FR  = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
const DAYS_MAP = {'Lundi':0,'Mardi':1,'Mercredi':2,'Jeudi':3,'Vendredi':4,'Samedi':5,'Dimanche':6};

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor,  setDoctor]  = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modal, setModal] = useState(null); // null | 'choose' | 'consultation' | 'rdv'

  // Consultation
  const [consultType, setConsultType] = useState('video');
  const [motif,       setMotif]       = useState('');

  // RDV
  const [weekOffset,    setWeekOffset]    = useState(0);
  const [selectedDay,   setSelectedDay]   = useState(null);
  const [selectedSlot,  setSelectedSlot]  = useState(null);
  const [slots,         setSlots]         = useState([]);
  const [slotsLoading,  setSlotsLoading]  = useState(false);
  const [rdvType,       setRdvType]       = useState('video');
  const [rdvMotif,      setRdvMotif]      = useState('');

  const [booking, setBooking] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/doctors/${id}/public`),
      api.get(`/doctors/${id}/reviews`),
    ]).then(([docRes, revRes]) => {
      setDoctor(docRes.data);
      setReviews(revRes.data);
    }).catch(console.error)
    .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || id === 'undefined') {
        navigate('/patient/doctors');
        return;
    }
    Promise.all([
        api.get(`/doctors/${id}/public`),
        api.get(`/doctors/${id}/reviews`),
    ]).then(/* ... */)
}, [id]);

  // Générer les jours de la semaine
  const getWeekDays = () => {
    const today  = new Date();
    today.setDate(today.getDate() + weekOffset * 7);
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    return Array.from({ length:7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return {
        label:    DAYS_FR[i],
        num:      d.getDate(),
        date:     d.toISOString().split('T')[0],
        past:     d < new Date(new Date().setHours(0,0,0,0)),
        dayIndex: i,
      };
    });
  };

  const weekDays = getWeekDays();

  const isDayAvailable = (day) => {
    if (!doctor || day.past) return false;
    const avDays = doctor.available_days ?? [];
    if (avDays.length === 0) return true;
    const dayFr = Object.keys(DAYS_MAP).find(k => DAYS_MAP[k] === day.dayIndex);
    return avDays.includes(dayFr);
  };

  const selectDay = async (day) => {
    if (!isDayAvailable(day)) return;
    setSelectedDay(day);
    setSelectedSlot(null);
    setSlotsLoading(true);
    try {
      const res = await api.get(`/doctors/${id}/slots`, { params:{ date: day.date } });
      setSlots(res.data.slots || []);
    } catch { setSlots([]); }
    finally { setSlotsLoading(false); }
  };

  const weekLabel = (() => {
    const f = weekDays[0], l = weekDays[6];
    return `${f.num} – ${l.num} ${new Date(l.date).toLocaleDateString('fr',{ month:'long', year:'numeric' })}`;
  })();

  const getInitials = (name) => {
    const p = (name||'').split(' ');
    return (p[0]?.[0]||'') + (p[1]?.[0]||'');
  };

  // Payer une consultation immédiate
  const handlePayConsultation = async () => {
    setBooking(true);
    try {
      // Créer le RDV immédiat
      const rdvRes = await api.post('/patient/appointments', {
        doctor_id:    doctor.user_id,
        scheduled_at: new Date().toISOString().slice(0,19).replace('T',' '),
        type:         consultType,
        reason:       motif,
      });
      const appointmentId = rdvRes.data.appointment.id;
      // Aller au tunnel paiement
      navigate(`/patient/pay/${appointmentId}`);
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la création. Veuillez réessayer.');
    } finally {
      setBooking(false);
    }
  };

  // Réserver un RDV planifié
const handleBookRdv = async () => {
    if (!selectedDay || !selectedSlot) return;
    setBooking(true);
    try {
        const scheduledAt = `${selectedDay.date} ${selectedSlot}:00`;
        const rdvRes = await api.post('/patient/appointments', {
            doctor_id:    doctor.user_id,
            scheduled_at: scheduledAt,
            type:         'in_person', // ← Toujours en personne pour les RDV
            reason:       rdvMotif || 'Rendez-vous planifié',
        });
        navigate(`/patient/pay/${rdvRes.data.appointment.id}`);
    } catch (e) {
        console.error(e.response?.data);
        alert(e.response?.data?.message || 'Erreur. Veuillez réessayer.');
    } finally {
        setBooking(false);
    }
};

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:400, fontFamily:"'Inter',sans-serif" }}>
      <p style={{ color: DS.outline }}>Chargement...</p>
    </div>
  );

  if (!doctor) return (
    <div style={{ padding:40, textAlign:'center', fontFamily:"'Inter',sans-serif" }}>
      <p style={{ color:'#ba1a1a' }}>Médecin introuvable.</p>
    </div>
  );

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", maxWidth:900, margin:'0 auto' }}>

      {/* Retour */}
      <button onClick={() => navigate('/patient/doctors')}
        style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color: DS.outline, background:'none', border:'none', cursor:'pointer', marginBottom:20, fontFamily:'inherit', padding:0 }}>
        ← Retour aux médecins
      </button>

      {/* Card médecin */}
      <div style={{ background: DS.surface, borderRadius:16, padding:'clamp(16px,4vw,28px)', border:`1px solid ${DS.outlineVariant}`, marginBottom:16 }}>

        {/* Hero */}
        <div style={{ display:'flex', gap:16, marginBottom:20, flexWrap:'wrap' }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background: DS.surfaceContainer, color: DS.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:700, flexShrink:0 }}>
            {getInitials(doctor.name).toUpperCase()}
          </div>
          <div style={{ flex:1, minWidth:200 }}>
            <h2 style={{ fontSize:'clamp(18px,3vw,22px)', fontWeight:700, color: DS.onSurface, margin:'0 0 4px' }}>{doctor.name}</h2>
            <p style={{ fontSize:14, color: DS.outline, margin:'0 0 10px' }}>
              {doctor.specialty}{doctor.health_center && ` · ${doctor.health_center}`}
            </p>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {doctor.is_verified && (
                <span style={{ fontSize:12, padding:'3px 10px', borderRadius:999, background:'#e1f5ee', color: DS.primary, fontWeight:600 }}>✅ Vérifié</span>
              )}
              <span style={{ fontSize:12, padding:'3px 10px', borderRadius:999, background: doctor.is_available ? '#e1f5ee' : '#f5f5f5', color: doctor.is_available ? '#16a34a' : DS.outline, fontWeight:600 }}>
                {doctor.is_available ? '● Disponible' : '○ Indisponible'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:20 }}>
          {[
            { val: doctor.rating || '4.9',          label:'⭐ Note' },
            { val: doctor.reviews_count || 0,        label:'Avis' },
            { val: (doctor.experience_years || 0) + ' ans', label:'Expérience' },
            { val: doctor.patients_count || 0,       label:'Patients' },
          ].map((s,i) => (
            <div key={i} style={{ background: DS.surfaceLow, borderRadius:10, padding:'12px 8px', textAlign:'center' }}>
              <p style={{ fontSize:18, fontWeight:700, color: DS.onSurface, margin:'0 0 2px' }}>{s.val}</p>
              <p style={{ fontSize:11, color: DS.outline, margin:0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Infos */}
        <div style={{ display:'flex', gap:20, flexWrap:'wrap', fontSize:13, color: DS.outline, marginBottom: doctor.bio ? 16 : 0 }}>
          {doctor.health_center_city && <span><MapPin size={13} style={{ verticalAlign:-2 }} /> {doctor.health_center_city}</span>}
          <span><CreditCard size={13} style={{ verticalAlign:-2 }} /> {Number(doctor.consultation_fee||0).toLocaleString()} XAF</span>
          <span><Clock size={13} style={{ verticalAlign:-2 }} /> {doctor.consultation_duration||30} min</span>
        </div>

        {doctor.bio && <p style={{ fontSize:14, color:'#3f484b', lineHeight:1.7, marginTop:12, marginBottom:0 }}>{doctor.bio}</p>}
      </div>

      {/* Avis */}
      {reviews.length > 0 && (
        <div style={{ background: DS.surface, borderRadius:16, padding:'clamp(16px,4vw,24px)', border:`1px solid ${DS.outlineVariant}`, marginBottom:16 }}>
          <h3 style={{ fontSize:15, fontWeight:700, color: DS.onSurface, margin:'0 0 14px' }}>
            Avis patients ({doctor.reviews_count || reviews.length})
          </h3>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {reviews.slice(0,3).map((r,i) => (
              <div key={i} style={{ background: DS.surfaceLow, borderRadius:10, padding:'14px 16px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <div style={{ width:32, height:32, borderRadius:'50%', background: DS.surfaceContainer, color: DS.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700 }}>
                    {r.initials || 'P'}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight:600, color: DS.onSurface, margin:0 }}>{r.patient_name}</p>
                    <span style={{ color:'#f59e0b', fontSize:12 }}>{'★'.repeat(r.rating||5)}</span>
                  </div>
                  <span style={{ fontSize:11, color:'#9ca3af' }}>{r.date}</span>
                </div>
                <p style={{ fontSize:13, color:'#3f484b', margin:0, lineHeight:1.6 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bouton principal */}
      <div style={{ background: DS.surface, borderRadius:16, padding:'clamp(16px,4vw,24px)', border:`1px solid ${DS.outlineVariant}` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div>
            <p style={{ fontSize:22, fontWeight:700, color: DS.onSurface, margin:'0 0 4px' }}>
              {Number(doctor.consultation_fee||0).toLocaleString()} XAF
            </p>
            <p style={{ fontSize:13, color: DS.outline, margin:0 }}>par consultation</p>
          </div>
          <button
            onClick={() => setModal('choose')}
            disabled={!doctor.is_available}
            style={{ padding:'13px 28px', background: doctor.is_available ? `linear-gradient(90deg,${DS.secondary},#E8913A)` : DS.outlineVariant, color:'#fff', border:'none', borderRadius:10, fontWeight:700, fontSize:15, cursor: doctor.is_available ? 'pointer' : 'not-allowed', fontFamily:'inherit', boxShadow: doctor.is_available ? '0 4px 14px rgba(232,97,58,0.3)' : 'none' }}>
            {doctor.is_available ? '🩺 Consulter / Prendre RDV' : 'Médecin indisponible'}
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════
          MODAL CHOIX : Consultation ou RDV
      ════════════════════════════════════ */}
      {modal === 'choose' && (
        <ModalOverlay onClose={() => setModal(null)}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <h3 style={{ fontSize:18, fontWeight:700, color: DS.onSurface, margin:'0 0 6px' }}>Que souhaitez-vous faire ?</h3>
            <p style={{ fontSize:13, color: DS.outline, margin:0 }}>Choisissez entre une consultation immédiate ou un rendez-vous planifié</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <button onClick={() => setModal('consultation')}
              style={{ padding:'20px 16px', borderRadius:12, border:`2px solid ${DS.outlineVariant}`, background: DS.surfaceLow, cursor:'pointer', fontFamily:'inherit', textAlign:'center', transition:'all .2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = DS.primary}
              onMouseLeave={e => e.currentTarget.style.borderColor = DS.outlineVariant}>
              <div style={{ fontSize:32, marginBottom:10 }}>⚡</div>
              <p style={{ fontSize:14, fontWeight:700, color: DS.onSurface, margin:'0 0 4px' }}>Consultation</p>
              <p style={{ fontSize:12, color: DS.outline, margin:0 }}>Immédiate — maintenant</p>
            </button>
            <button onClick={() => setModal('rdv')}
              style={{ padding:'20px 16px', borderRadius:12, border:`2px solid ${DS.outlineVariant}`, background: DS.surfaceLow, cursor:'pointer', fontFamily:'inherit', textAlign:'center', transition:'all .2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = DS.secondary}
              onMouseLeave={e => e.currentTarget.style.borderColor = DS.outlineVariant}>
              <div style={{ fontSize:32, marginBottom:10 }}>📅</div>
              <p style={{ fontSize:14, fontWeight:700, color: DS.onSurface, margin:'0 0 4px' }}>Rendez-vous</p>
              <p style={{ fontSize:12, color: DS.outline, margin:0 }}>Planifier une date</p>
            </button>
          </div>
        </ModalOverlay>
      )}

      {/* ════════════════════════════════════
          MODAL CONSULTATION IMMÉDIATE
      ════════════════════════════════════ */}
      {modal === 'consultation' && (
        <ModalOverlay onClose={() => setModal(null)}>
          <div style={{ marginBottom:20 }}>
            <button onClick={() => setModal('choose')} style={{ background:'none', border:'none', cursor:'pointer', color: DS.outline, fontSize:13, fontFamily:'inherit', padding:0, marginBottom:12 }}>
              ← Retour
            </button>
            <h3 style={{ fontSize:18, fontWeight:700, color: DS.onSurface, margin:'0 0 4px' }}>Consultation immédiate</h3>
            <p style={{ fontSize:13, color: DS.outline, margin:0 }}>Le médecin recevra une notification et pourra accepter ou refuser</p>
          </div>

          {/* Type */}
          <div style={{ marginBottom:16 }}>
            <p style={{ fontSize:13, fontWeight:600, color: DS.onSurface, margin:'0 0 8px' }}>Type de consultation</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[
                { key:'video',   icon:<Video size={18}/>,          label:'Vidéo',   desc:'Appel vidéo HD' },
                { key:'message', icon:<MessageSquare size={18}/>,  label:'Message', desc:'Chat en direct' },
              ].map(t => (
                <button key={t.key} onClick={() => setConsultType(t.key)}
                  style={{ padding:'12px', borderRadius:10, border:`2px solid ${consultType===t.key ? DS.primary : DS.outlineVariant}`, background: consultType===t.key ? DS.surfaceContainer : DS.surface, cursor:'pointer', fontFamily:'inherit', display:'flex', flexDirection:'column', alignItems:'center', gap:6, transition:'all .2s', color: consultType===t.key ? DS.primary : DS.onSurface }}>
                  {t.icon}
                  <span style={{ fontSize:13, fontWeight:700 }}>{t.label}</span>
                  <span style={{ fontSize:11, color: DS.outline }}>{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Motif */}
          <div style={{ marginBottom:20 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color: DS.onSurface, marginBottom:6 }}>
              Motif <span style={{ color: DS.outline, fontWeight:400 }}>(optionnel)</span>
            </label>
            <textarea rows={2} value={motif} onChange={e => setMotif(e.target.value)}
              placeholder="Ex : douleurs thoraciques, contrôle tension..."
              style={{ width:'100%', border:`1.5px solid ${DS.outlineVariant}`, borderRadius:8, padding:'10px 12px', fontSize:14, fontFamily:'inherit', outline:'none', resize:'none', boxSizing:'border-box' }}
            />
          </div>

          {/* Récap prix */}
          <div style={{ background: DS.surfaceLow, borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:13, color: DS.outline }}>Montant à payer</span>
            <span style={{ fontSize:18, fontWeight:700, color: DS.primary }}>
              {Number(doctor.consultation_fee||0).toLocaleString()} XAF
            </span>
          </div>

          <button onClick={handlePayConsultation} disabled={booking}
            style={{ width:'100%', padding:'13px', background:`linear-gradient(90deg,${DS.secondary},#E8913A)`, color:'#fff', border:'none', borderRadius:10, fontWeight:700, fontSize:14, cursor: booking ? 'not-allowed' : 'pointer', fontFamily:'inherit', opacity: booking ? 0.7 : 1 }}>
            {booking ? 'Préparation...' : `💳 Payer et consulter · ${Number(doctor.consultation_fee||0).toLocaleString()} XAF`}
          </button>
        </ModalOverlay>
      )}

      {/* ════════════════════════════════════
          MODAL RENDEZ-VOUS PLANIFIÉ
      ════════════════════════════════════ */}
      {modal === 'rdv' && (
        <ModalOverlay onClose={() => setModal(null)}>
          <div style={{ marginBottom:20 }}>
            <button onClick={() => setModal('choose')} style={{ background:'none', border:'none', cursor:'pointer', color: DS.outline, fontSize:13, fontFamily:'inherit', padding:0, marginBottom:12 }}>
              ← Retour
            </button>
            <h3 style={{ fontSize:18, fontWeight:700, color: DS.onSurface, margin:'0 0 4px' }}>Prendre un rendez-vous</h3>
            <p style={{ fontSize:13, color: DS.outline, margin:0 }}>Choisissez une date et un créneau</p>
          </div>

          {/* Type RDV */}
{/* Type RDV — uniquement en personne */}
<div style={{ marginBottom:16 }}>
  <p style={{ fontSize:13, fontWeight:600, color: DS.onSurface, margin:'0 0 8px' }}>Type de rendez-vous</p>
  <div style={{ background: DS.surfaceContainer, borderRadius:10, padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
    <span style={{ fontSize:20 }}>🏥</span>
    <div>
      <p style={{ fontSize:14, fontWeight:600, color: DS.primary, margin:'0 0 2px' }}>En personne</p>
      <p style={{ fontSize:12, color: DS.outline, margin:0 }}>Au cabinet ou à l'hôpital</p>
    </div>
  </div>
</div>

          {/* Calendrier */}
          <div style={{ marginBottom:12 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
              <button onClick={() => setWeekOffset(w => w-1)} disabled={weekOffset===0}
                style={{ background:'none', border:`1px solid ${DS.outlineVariant}`, borderRadius:6, width:28, height:28, cursor: weekOffset===0 ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', opacity: weekOffset===0 ? 0.4 : 1, color: DS.outline }}>
                <ChevronLeft size={14} />
              </button>
              <span style={{ fontSize:13, fontWeight:600, color: DS.onSurface }}>{weekLabel}</span>
              <button onClick={() => setWeekOffset(w => w+1)}
                style={{ background:'none', border:`1px solid ${DS.outlineVariant}`, borderRadius:6, width:28, height:28, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color: DS.outline }}>
                <ChevronRight size={14} />
              </button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
              {weekDays.map((day,i) => {
                const avail    = isDayAvailable(day);
                const selected = selectedDay?.date === day.date;
                return (
                  <div key={i} onClick={() => avail && selectDay(day)}
                    style={{ textAlign:'center', borderRadius:8, padding:'6px 2px', cursor: avail ? 'pointer' : 'not-allowed', opacity: avail ? 1 : 0.35, background: selected ? DS.primary : 'transparent', border:`1.5px solid ${selected ? DS.primary : 'transparent'}`, transition:'all .15s' }}>
                    <p style={{ fontSize:10, color: selected ? '#fff' : DS.outline, margin:'0 0 2px' }}>{day.label}</p>
                    <p style={{ fontSize:13, fontWeight:700, color: selected ? '#fff' : DS.onSurface, margin:0 }}>{day.num}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Créneaux */}
          {selectedDay && (
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:13, fontWeight:600, color: DS.onSurface, margin:'0 0 8px' }}>Créneaux disponibles</p>
              {slotsLoading ? (
                <p style={{ fontSize:13, color: DS.outline, textAlign:'center', padding:'12px 0' }}>Chargement...</p>
              ) : slots.length === 0 ? (
                <p style={{ fontSize:13, color: DS.outline, textAlign:'center', padding:'12px 0' }}>Aucun créneau disponible ce jour.</p>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
                  {slots.map((slot,i) => (
                    <button key={i} disabled={slot.taken} onClick={() => !slot.taken && setSelectedSlot(slot.time)}
                      style={{ padding:'8px 4px', borderRadius:8, border:`1.5px solid ${selectedSlot===slot.time ? DS.primary : slot.taken ? '#f0f3ff' : DS.outlineVariant}`, background: selectedSlot===slot.time ? DS.surfaceContainer : slot.taken ? '#f9f9ff' : DS.surface, color: selectedSlot===slot.time ? DS.primary : slot.taken ? '#d1d5db' : DS.onSurface, fontSize:12, fontWeight: selectedSlot===slot.time ? 700 : 400, cursor: slot.taken ? 'not-allowed' : 'pointer', textDecoration: slot.taken ? 'line-through' : 'none', fontFamily:'inherit', transition:'all .15s' }}>
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Motif */}
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color: DS.onSurface, marginBottom:6 }}>
              Motif <span style={{ color: DS.outline, fontWeight:400 }}>(optionnel)</span>
            </label>
            <textarea rows={2} value={rdvMotif} onChange={e => setRdvMotif(e.target.value)}
              placeholder="Ex : suivi hypertension, bilan annuel..."
              style={{ width:'100%', border:`1.5px solid ${DS.outlineVariant}`, borderRadius:8, padding:'10px 12px', fontSize:14, fontFamily:'inherit', outline:'none', resize:'none', boxSizing:'border-box' }}
            />
          </div>

          {/* Résumé */}
          {selectedDay && selectedSlot && (
            <div style={{ background: DS.surfaceContainer, borderRadius:10, padding:'10px 14px', marginBottom:14, fontSize:13, color: DS.primary, fontWeight:600 }}>
              📅 {selectedDay.label} {selectedDay.num} · {selectedSlot} · {rdvType === 'video' ? 'Vidéo' : 'En personne'} · {doctor.consultation_duration||30} min
            </div>
          )}

          {/* Prix */}
          <div style={{ background: DS.surfaceLow, borderRadius:10, padding:'12px 16px', marginBottom:14, display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:13, color: DS.outline }}>Montant</span>
            <span style={{ fontSize:16, fontWeight:700, color: DS.primary }}>{Number(doctor.consultation_fee||0).toLocaleString()} XAF</span>
          </div>

          <button onClick={handleBookRdv} disabled={booking || !selectedDay || !selectedSlot}
            style={{ width:'100%', padding:'13px', background: (!selectedDay || !selectedSlot || booking) ? DS.outlineVariant : DS.primary, color:'#fff', border:'none', borderRadius:10, fontWeight:700, fontSize:14, cursor:(!selectedDay || !selectedSlot || booking) ? 'not-allowed' : 'pointer', fontFamily:'inherit' }}>
            {booking ? 'Réservation...' : `📅 Confirmer et payer · ${Number(doctor.consultation_fee||0).toLocaleString()} XAF`}
          </button>
        </ModalOverlay>
      )}
    </div>
  );
}

// Composant Modal réutilisable
function ModalOverlay({ children, onClose }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(12px,4vw,20px)' }}
      onClick={onClose}>
      <div style={{ background:'#fff', borderRadius:16, padding:'clamp(20px,4vw,28px)', width:'100%', maxWidth:480, maxHeight:'90vh', overflowY:'auto', position:'relative' }}
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose}
          style={{ position:'absolute', top:14, right:14, background:'none', border:'none', cursor:'pointer', color:'#6f797b', padding:4 }}>
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}