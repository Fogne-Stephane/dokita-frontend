import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Clock, Video, MessageSquare, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import { getEcho } from '../../api/echo';
import logo from '../../assets/logo.png';

export default function WaitingRoom() {
  const { appointmentId } = useParams();
  const navigate          = useNavigate();
  const { user }          = useSelector(s => s.auth);

  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [waitTime,   setWaitTime]   = useState(0);
  const [dots,       setDots]       = useState('');
  const [status,     setStatus]     = useState('waiting'); // waiting | accepted | rejected
  const [rejectMsg,  setRejectMsg]  = useState('');
  const timerRef = useRef(null);

  // Charger les infos du RDV
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/patient/consultations/${appointmentId}/waiting`);
        setData(res.data);
        // Si déjà accepté (session active)
        if (res.data.session?.status === 'active') {
          handleAccepted(res.data.session);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [appointmentId]);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => setWaitTime(t => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Animation dots
  useEffect(() => {
    const i = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(i);
  }, []);

  // Écouter la réponse du médecin via Reverb
useEffect(() => {
    if (!user?.id) return;
    const echo = getEcho();
    const ch   = echo.private(`patient.${user.id}`);

    const onAccepted = (event) => {
        console.log('🟢 Consultation acceptée reçue:', event);
        clearInterval(timerRef.current);
        const type = event.type || data?.appointment?.type;
        if (type === 'video') {
            navigate(`/consultation/room/${appointmentId}`, {
                state: {
                    channel:    event.channel,
                    token:      event.token,
                    appId:      event.app_id,
                    role:       'patient',
                    doctorName: event.doctor_name,
                },
                replace: true,
            });
        } else {
            navigate(`/consultation/chat/${appointmentId}`, {
                state: {
                    doctorId:   event.doctor_id,
                    doctorName: event.doctor_name,
                },
                replace: true,
            });
        }
    };

    const onRejected = (event) => {
        console.log('🔴 Consultation refusée:', event);
        clearInterval(timerRef.current);
        setStatus('rejected');
        setRejectMsg(event.reason || 'Le médecin n\'est pas disponible.');
    };

    ch.listen('.consultation.accepted', onAccepted);
    ch.listen('.consultation.rejected', onRejected);

    return () => {
        ch.stopListening('.consultation.accepted');
        ch.stopListening('.consultation.rejected');
    };
}, [user?.id, appointmentId]); // ← dependencies correctes

  const handleAccepted = (session) => {
    if (session.status === 'active' && data?.appointment?.type === 'video') {
      navigate(`/consultation/room/${appointmentId}`, {
        state: {
          channel: session.channel,
          token:   session.token,
          appId:   session.app_id,
          role:    'patient',
        }
      });
    }
  };

  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,var(--primary),#004e5a)', fontFamily:"'Inter',sans-serif" }}>
      <p style={{ color:'rgba(255,255,255,0.8)' }}>Chargement...</p>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,var(--primary) 0%,#004e5a 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'clamp(16px,4vw,32px)', fontFamily:"'Inter',sans-serif", position:'relative', overflow:'hidden' }}>

      {/* Déco */}
      <div style={{ position:'absolute', top:-100, right:-100, width:300, height:300, background:'var(--secondary)', borderRadius:'50%', opacity:0.1, pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-80, left:-80, width:250, height:250, background:'rgba(255,255,255,0.05)', borderRadius:'50%', pointerEvents:'none' }} />

      {/* Logo */}
      <div style={{ position:'absolute', top:24, left:24, display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:36, height:36, borderRadius:'50%', overflow:'hidden' }}>
          <img src={logo} alt="Dokita" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        </div>
        <span style={{ color:'#fff', fontWeight:700, fontSize:18 }}>Dokita</span>
      </div>

      {/* Bouton retour */}
      <button onClick={() => navigate('/patient/dashboard')}
        style={{ position:'absolute', top:24, right:24, background:'rgba(255,255,255,0.1)', border:'none', borderRadius:8, padding:'8px 14px', color:'#fff', cursor:'pointer', fontFamily:'inherit', fontSize:13, display:'flex', alignItems:'center', gap:6 }}>
        <ArrowLeft size={16} /> Tableau de bord
      </button>

      <div style={{ width:'100%', maxWidth:480, zIndex:1 }}>

        {status === 'rejected' ? (
          /* ── Refus ── */
          <div style={{ background:'rgba(255,255,255,0.1)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:20, padding:'clamp(20px,5vw,36px)', textAlign:'center' }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(186,26,26,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, margin:'0 auto 20px' }}>❌</div>
            <h2 style={{ color:'#fff', fontSize:'clamp(18px,3vw,22px)', fontWeight:700, margin:'0 0 10px' }}>Consultation refusée</h2>
            <p style={{ color:'rgba(255,255,255,0.75)', fontSize:14, margin:'0 0 24px', lineHeight:1.6 }}>{rejectMsg}</p>
            <button onClick={() => navigate('/patient/doctors')}
              style={{ width:'100%', padding:'13px', background:'linear-gradient(90deg,var(--secondary),var(--secondary-light))', color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:14 }}>
              Trouver un autre médecin
            </button>
          </div>
        ) : (
          /* ── Attente ── */
          <>
            <div style={{ background:'rgba(255,255,255,0.1)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:20, padding:'clamp(20px,5vw,36px)', marginBottom:12 }}>

              {/* Avatar animé */}
              <div style={{ position:'relative', width:88, height:88, margin:'0 auto 24px' }}>
                <div style={{ position:'absolute', inset:-10, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.15)' }} />
                <div style={{ position:'absolute', inset:-5, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.2)' }} />
                <div style={{ width:88, height:88, borderRadius:'50%', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40 }}>
                  👨‍⚕️
                </div>
              </div>

              <h2 style={{ color:'#fff', fontSize:'clamp(18px,3vw,22px)', fontWeight:700, textAlign:'center', margin:'0 0 8px' }}>
                Salle d'attente
              </h2>
              <p style={{ color:'rgba(255,255,255,0.75)', fontSize:14, textAlign:'center', margin:'0 0 24px' }}>
                {data?.doctor?.name} va vous rejoindre{dots}
              </p>

              {/* Infos médecin */}
              <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:12, padding:'14px 16px', marginBottom:20, display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:17, flexShrink:0 }}>
                  {data?.doctor?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p style={{ color:'#fff', fontWeight:700, fontSize:14, margin:'0 0 2px' }}>{data?.doctor?.name}</p>
                  <p style={{ color:'rgba(255,255,255,0.65)', fontSize:12, margin:0 }}>{data?.doctor?.specialty}</p>
                </div>
                <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6 }}>
                  {data?.appointment?.type === 'video'
                    ? <><Video size={14} color="rgba(255,255,255,0.8)" /><span style={{ color:'rgba(255,255,255,0.8)', fontSize:12 }}>Vidéo</span></>
                    : <><MessageSquare size={14} color="rgba(255,255,255,0.8)" /><span style={{ color:'rgba(255,255,255,0.8)', fontSize:12 }}>Message</span></>
                  }
                </div>
              </div>

              {/* Timer */}
              <div style={{ background:'rgba(0,0,0,0.2)', borderRadius:10, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <Clock size={16} color="rgba(255,255,255,0.65)" />
                  <span style={{ color:'rgba(255,255,255,0.65)', fontSize:13 }}>Temps d'attente</span>
                </div>
                <span style={{ color:'#fff', fontSize:20, fontWeight:700, fontVariantNumeric:'tabular-nums' }}>
                  {formatTime(waitTime)}
                </span>
              </div>
            </div>

            {/* Conseils */}
            <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:14, padding:'16px 18px' }}>
              <p style={{ color:'rgba(255,255,255,0.8)', fontSize:13, fontWeight:600, margin:'0 0 10px' }}>💡 Préparez votre consultation</p>
              {[
                'Soyez dans un endroit calme et bien éclairé',
                'Ayez vos ordonnances et analyses à portée',
                data?.appointment?.type === 'video' ? 'Testez votre caméra et microphone' : 'Soyez prêt à décrire vos symptômes',
              ].map((tip, i) => (
                <div key={i} style={{ display:'flex', gap:8, marginBottom: i < 2 ? 6 : 0 }}>
                  <span style={{ color:'#4ade80', fontSize:12, marginTop:1, flexShrink:0 }}>✓</span>
                  <span style={{ color:'rgba(255,255,255,0.65)', fontSize:12, lineHeight:1.5 }}>{tip}</span>
                </div>
              ))}
            </div>

            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:11, textAlign:'center', marginTop:14 }}>
              La page se met à jour automatiquement • Pas besoin de rafraîchir
            </p>
          </>
        )}
      </div>
    </div>
  );
}