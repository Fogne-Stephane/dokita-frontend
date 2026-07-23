import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const DAYS_EN = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAYS_MAP = { 'Lundi': 0, 'Mardi': 1, 'Mercredi': 2, 'Jeudi': 3, 'Vendredi': 4, 'Samedi': 5, 'Dimanche': 6 };

const DoctorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [doctor, setDoctor]       = useState(null);
    const [reviews, setReviews]     = useState([]);
    const [loading, setLoading]     = useState(true);
    const [slots, setSlots]         = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [consultType, setConsultType] = useState('video');
    const [motif, setMotif]         = useState('');
    const [booking, setBooking]     = useState(false);
    const [weekOffset, setWeekOffset] = useState(0);
    const [slotsLoading, setSlotsLoading] = useState(false);

    // Générer les 7 jours de la semaine courante
    const getWeekDays = () => {
        const today = new Date();
        today.setDate(today.getDate() + weekOffset * 7);
        const monday = new Date(today);
        monday.setDate(today.getDate() - today.getDay() + 1);

        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            return {
                label: DAYS_FR[i],
                num: d.getDate(),
                date: d.toISOString().split('T')[0],
                past: d < new Date(new Date().setHours(0, 0, 0, 0)),
                dayIndex: i,
            };
        });
    };

    const weekDays = getWeekDays();

    // Charger le profil médecin
    useEffect(() => {
        const fetch = async () => {
            try {
                const [docRes, revRes] = await Promise.all([
                    api.get(`/doctors/${id}/public`),
                    api.get(`/doctors/${id}/reviews`),
                ]);
                setDoctor(docRes.data);
                setReviews(revRes.data);

                // Sélectionner le premier jour disponible
                const availableDays = docRes.data.available_days ?? [];
                const firstAvailable = weekDays.find(d => {
                    if (d.past) return false;
                    if (availableDays.length === 0) return true;
                    const dayFr = Object.keys(DAYS_MAP).find(k => DAYS_MAP[k] === d.dayIndex);
                    return availableDays.includes(dayFr);
                });
                if (firstAvailable) selectDay(firstAvailable, docRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    const selectDay = async (day, doc = doctor) => {
        if (!doc || day.past) return;
        const availableDays = doc.available_days ?? [];
        if (availableDays.length > 0) {
            const dayFr = Object.keys(DAYS_MAP).find(k => DAYS_MAP[k] === day.dayIndex);
            if (!availableDays.includes(dayFr)) return;
        }
        setSelectedDay(day);
        setSelectedSlot(null);
        setSlotsLoading(true);
        try {
            const res = await api.get(`/doctors/${id}/slots`, { params: { date: day.date } });
            setSlots(res.data.slots || []);
        } catch (err) {
            setSlots([]);
        } finally {
            setSlotsLoading(false);
        }
    };

    const isDayAvailable = (day) => {
        if (!doctor) return false;
        if (day.past) return false;
        const availableDays = doctor.available_days ?? [];
        if (availableDays.length === 0) return true;
        const dayFr = Object.keys(DAYS_MAP).find(k => DAYS_MAP[k] === day.dayIndex);
        return availableDays.includes(dayFr);
    };

    const handleBook = async () => {
        if (!selectedDay || !selectedSlot) return;
        setBooking(true);
        try {
            const scheduledAt = `${selectedDay.date} ${selectedSlot}:00`;
            const res = await api.post('/patient/appointments', {
                doctor_id:    doctor.user_id,
                scheduled_at: scheduledAt,
                type:         consultType,
                reason:       motif,
            });
            // Rediriger vers le paiement
            navigate(`/patient/pay/${res.data.appointment.id}`);
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la réservation. Veuillez réessayer.');
        } finally {
            setBooking(false);
        }
    };

    const getInitials = (name) => {
        const parts = (name || '').split(' ');
        return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, fontFamily: "'Inter', sans-serif" }}>
            <p style={{ color: '#6f797b' }}>Chargement du profil...</p>
        </div>
    );

    if (!doctor) return (
        <div style={{ padding: 40, textAlign: 'center', fontFamily: "'Inter', sans-serif" }}>
            <p style={{ color: '#dc2626' }}>Médecin introuvable.</p>
        </div>
    );

    // Mois de la semaine courante
    const weekLabel = (() => {
        const first = weekDays[0];
        const last  = weekDays[6];
        return `${first.num} – ${last.num} ${new Date(last.date).toLocaleDateString('fr', { month: 'long', year: 'numeric' })}`;
    })();

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Bouton retour */}
            <button onClick={() => navigate('/patient/doctors')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6f797b', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, fontFamily: 'inherit', padding: 0 }}>
                ← Retour aux médecins
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

                {/* ── Colonne gauche ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Hero card */}
                    <div style={cardStyle}>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#e7eeff', color: '#016472', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, flexShrink: 0 }}>
                                {getInitials(doctor.name).toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111c2d', margin: '0 0 4px' }}>{doctor.name}</h2>
                                <p style={{ fontSize: 14, color: '#6f797b', margin: '0 0 10px' }}>
                                    {doctor.specialty} {doctor.health_center && `· ${doctor.health_center}`}
                                </p>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {doctor.is_verified && (
                                        <span style={badgeStyle('#dcfce7', '#16a34a')}>✅ Médecin vérifié</span>
                                    )}
                                    <span style={badgeStyle(doctor.is_available ? '#dcfce7' : '#f0f3ff', doctor.is_available ? '#16a34a' : '#6f797b')}>
                                        {doctor.is_available ? '● Disponible maintenant' : '○ Indisponible'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
                            {[
                                { val: doctor.rating,          label: '⭐ Note' },
                                { val: doctor.reviews_count,   label: 'Avis' },
                                { val: doctor.experience_years + ' ans', label: 'Expérience' },
                                { val: doctor.patients_count,  label: 'Patients' },
                            ].map((s, i) => (
                                <div key={i} style={{ background: '#f0f3ff', borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
                                    <p style={{ fontSize: 18, fontWeight: 800, color: '#111c2d', margin: 0 }}>{s.val}</p>
                                    <p style={{ fontSize: 11, color: '#6f797b', margin: 0 }}>{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Bio */}
                        {doctor.bio && (
                            <>
                                <p style={sectionTitle}>À propos</p>
                                <p style={{ fontSize: 14, color: '#3f484b', lineHeight: 1.7, marginBottom: 16 }}>{doctor.bio}</p>
                            </>
                        )}

                        {/* Langues + localisation */}
                        <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#6f797b' }}>
                            {doctor.health_center_city && <span>📍 {doctor.health_center_city}</span>}
                            <span>💳 {Number(doctor.consultation_fee).toLocaleString()} XAF / consultation</span>
                            <span>⏱️ {doctor.consultation_duration} min</span>
                        </div>
                    </div>

                    {/* Avis */}
                    {reviews.length > 0 && (
                        <div style={cardStyle}>
                            <p style={sectionTitle}>Avis patients ({doctor.reviews_count})</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {reviews.slice(0, 4).map((r, i) => (
                                    <div key={i} style={{ background: '#f9f9ff', borderRadius: 12, padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e7eeff', color: '#016472', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                                                {r.initials || 'P'}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: 13, fontWeight: 600, color: '#111c2d', margin: 0 }}>{r.patient_name}</p>
                                                <span style={{ color: '#f59e0b', fontSize: 12 }}>{'★'.repeat(r.rating)}</span>
                                            </div>
                                            <span style={{ fontSize: 11, color: '#9ca3af' }}>{r.date}</span>
                                        </div>
                                        <p style={{ fontSize: 13, color: '#3f484b', margin: 0, lineHeight: 1.6 }}>{r.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Colonne droite — Booking ── */}
                <div style={{ ...cardStyle, position: 'sticky', top: 80 }}>

                    {/* Prix */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f0f3ff' }}>
                        <span style={{ fontSize: 22, fontWeight: 800, color: '#111c2d' }}>
                            {Number(doctor.consultation_fee).toLocaleString()} XAF
                        </span>
                        <span style={{ fontSize: 13, color: '#6f797b' }}>/ consultation</span>
                    </div>

                    {/* Type */}
                    <p style={sectionTitle}>Type de consultation</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                        {[
                            { key: 'video',     label: '🎥 Vidéo' },
                            { key: 'in_person', label: '🏥 En personne' },
                        ].map(t => (
                            <button key={t.key} onClick={() => setConsultType(t.key)}
                                style={{ padding: '10px', borderRadius: 12, border: `2px solid ${consultType === t.key ? '#016472' : '#e7eeff'}`, background: consultType === t.key ? '#e7eeff' : 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: consultType === t.key ? '#016472' : '#6f797b', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Navigation semaine */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <button onClick={() => setWeekOffset(w => w - 1)} disabled={weekOffset === 0}
                            style={navBtnStyle(weekOffset === 0)}>←</button>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#111c2d' }}>{weekLabel}</span>
                        <button onClick={() => setWeekOffset(w => w + 1)} style={navBtnStyle(false)}>→</button>
                    </div>

                    {/* Jours */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 14 }}>
                        {weekDays.map((day, i) => {
                            const available = isDayAvailable(day);
                            const selected  = selectedDay?.date === day.date;
                            return (
                                <div key={i} onClick={() => selectDay(day)}
                                    style={{
                                        textAlign: 'center', borderRadius: 10, padding: '6px 2px',
                                        cursor: available ? 'pointer' : 'not-allowed',
                                        opacity: available ? 1 : 0.35,
                                        background: selected ? '#016472' : 'transparent',
                                        border: `1.5px solid ${selected ? '#016472' : 'transparent'}`,
                                        transition: 'all 0.15s',
                                    }}>
                                    <p style={{ fontSize: 10, color: selected ? 'white' : '#6f797b', margin: '0 0 2px' }}>{day.label}</p>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: selected ? 'white' : '#111c2d', margin: 0 }}>{day.num}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Créneaux */}
                    <p style={sectionTitle}>Créneaux disponibles</p>
                    {slotsLoading ? (
                        <p style={{ fontSize: 13, color: '#6f797b', textAlign: 'center', padding: '16px 0' }}>Chargement...</p>
                    ) : slots.length === 0 ? (
                        <p style={{ fontSize: 13, color: '#6f797b', textAlign: 'center', padding: '16px 0' }}>Aucun créneau disponible ce jour.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 14 }}>
                            {slots.map((slot, i) => (
                                <button key={i} disabled={slot.taken}
                                    onClick={() => !slot.taken && setSelectedSlot(slot.time)}
                                    style={{
                                        padding: '8px 4px', borderRadius: 10, border: `1.5px solid ${selectedSlot === slot.time ? '#016472' : slot.taken ? '#f0f3ff' : '#dde3f0'}`,
                                        background: selectedSlot === slot.time ? '#e7eeff' : slot.taken ? '#f9f9ff' : 'white',
                                        color: selectedSlot === slot.time ? '#016472' : slot.taken ? '#d1d5db' : '#3f484b',
                                        fontSize: 12, fontWeight: selectedSlot === slot.time ? 700 : 400,
                                        cursor: slot.taken ? 'not-allowed' : 'pointer',
                                        textDecoration: slot.taken ? 'line-through' : 'none',
                                        fontFamily: 'inherit', transition: 'all 0.15s',
                                    }}>
                                    {slot.time}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Résumé sélection */}
                    {selectedDay && selectedSlot && (
                        <div style={{ background: '#e7eeff', borderRadius: 12, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#016472', fontWeight: 600 }}>
                            📅 {selectedDay.label} {selectedDay.num} · {selectedSlot} · {consultType === 'video' ? 'Vidéo' : 'En personne'} · {doctor.consultation_duration} min
                        </div>
                    )}

                    {/* Motif */}
                    <div style={{ marginBottom: 16 }}>
                        <p style={{ fontSize: 12, color: '#6f797b', margin: '0 0 6px' }}>Motif (optionnel)</p>
                        <textarea rows={2} value={motif} onChange={e => setMotif(e.target.value)}
                            placeholder="Ex : douleurs thoraciques, contrôle tension..."
                            style={{ width: '100%', border: '1.5px solid #dde3f0', borderRadius: 10, padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                        />
                    </div>

                    {/* Boutons */}
                    {doctor.is_available && (
                        <button onClick={handleBook} disabled={booking}
                            style={{ width: '100%', padding: '13px', background: 'linear-gradient(90deg, #E8613A, #E8913A)', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: booking ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginBottom: 10, opacity: booking ? 0.7 : 1 }}>
                            ⚡ Consulter maintenant · {Number(doctor.consultation_fee).toLocaleString()} XAF
                        </button>
                    )}
                    <button onClick={handleBook} disabled={booking || !selectedDay || !selectedSlot}
                        style={{ width: '100%', padding: '13px', background: !selectedDay || !selectedSlot ? '#f0f3ff' : 'linear-gradient(135deg, #016472, #004e5a)', color: !selectedDay || !selectedSlot ? '#9ca3af' : 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: (!selectedDay || !selectedSlot || booking) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginBottom: 12 }}>
                        {booking ? 'Réservation...' : `📅 Confirmer le RDV · ${Number(doctor.consultation_fee).toLocaleString()} XAF`}
                    </button>

                    <p style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af' }}>
                        🛡️ Remboursement garanti si annulation 24h avant
                    </p>
                </div>
            </div>
        </div>
    );
};

// Styles réutilisables
const cardStyle = { background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e7eeff' };
const sectionTitle = { fontSize: 14, fontWeight: 700, color: '#111c2d', margin: '0 0 10px' };
const badgeStyle = (bg, color) => ({ fontSize: 11, padding: '3px 10px', borderRadius: 999, background: bg, color });
const navBtnStyle = (disabled) => ({
    background: 'white', border: '1px solid #dde3f0', borderRadius: 8,
    width: 28, height: 28, cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: disabled ? 0.4 : 1, fontSize: 14, color: '#6f797b',
});

export default DoctorProfile;