import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import api from '../../api/axios';

export default function VideoRoom() {
  const { appointmentId } = useParams();
  const { state }         = useLocation();
  const navigate          = useNavigate();
  const { user }          = useSelector(s => s.auth);
  const role    = state?.role    || 'patient';
  const channel = state?.channel || '';

  const [micOn,        setMicOn]        = useState(true);
  const [camOn,        setCamOn]        = useState(true);
  const [duration,     setDuration]     = useState(0);
  const [showEnd,      setShowEnd]      = useState(false);
  const [ending,       setEnding]       = useState(false);
  const [connected,    setConnected]    = useState(false);
  const localVideoRef  = useRef(null);
  const streamRef      = useRef(null);
  const timerRef       = useRef(null);

  // Démarrer la caméra locale via WebRTC natif
  useEffect(() => {
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setConnected(true);
      } catch (err) {
        console.warn('Caméra non disponible:', err);
        setConnected(true); // Continue quand même
      }
    };
    startMedia();
    timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
      clearInterval(timerRef.current);
    };
  }, []);

  const toggleMic = () => {
    streamRef.current?.getAudioTracks().forEach(t => t.enabled = !micOn);
    setMicOn(!micOn);
  };

  const toggleCam = () => {
    streamRef.current?.getVideoTracks().forEach(t => t.enabled = !camOn);
    setCamOn(!camOn);
  };

  const handleEnd = async () => {
    setEnding(true);
    try {
      const route = role === 'doctor'
        ? `/doctor/consultations/${appointmentId}/end`
        : `/patient/consultations/${appointmentId}/end`;
      await api.post(route);
    } catch (e) { console.error(e); }
    streamRef.current?.getTracks().forEach(t => t.stop());
    clearInterval(timerRef.current);
    if (role === 'doctor') {
      navigate('/doctor/agenda', { replace: true });
    } else {
      navigate(`/consultation/summary/${appointmentId}`, { replace: true });
    }
  };

  const fmt = (s) =>
    `${Math.floor(s/3600).toString().padStart(2,'0')}:${Math.floor((s%3600)/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <div style={{ width:'100vw', height:'100vh', background:'#0a0a0a', display:'flex', flexDirection:'column', fontFamily:"'Inter',sans-serif", overflow:'hidden' }}>

      {/* Header */}
      <div style={{ height:56, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background: connected ? '#4ade80' : '#f59e0b' }} />
          <span style={{ color:'#fff', fontSize:14, fontWeight:600 }}>
            {connected ? 'Consultation en cours' : 'Connexion...'}
          </span>
        </div>
        <span style={{ color:'rgba(255,255,255,0.6)', fontSize:13, fontVariantNumeric:'tabular-nums' }}>
          {fmt(duration)}
        </span>
      </div>

      {/* Zone vidéo */}
      <div style={{ flex:1, position:'relative', background:'#111', display:'flex', alignItems:'center', justifyContent:'center' }}>

        {/* Placeholder remote */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
          <div style={{ width:96, height:96, borderRadius:'50%', background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:48 }}>
            {role === 'doctor' ? '🧑' : '👨‍⚕️'}
          </div>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:14 }}>
            {connected ? 'En attente de l\'autre participant...' : 'Connexion au canal...'}
          </p>
          {channel && <p style={{ color:'rgba(255,255,255,0.3)', fontSize:11 }}>Canal : {channel}</p>}
        </div>

        {/* Vidéo locale (PiP) */}
        <div style={{ position:'absolute', bottom:80, right:16, width:'clamp(100px,15vw,160px)', aspectRatio:'3/4', borderRadius:12, overflow:'hidden', border:'2px solid rgba(255,255,255,0.2)', background:'#222' }}>
          {camOn ? (
            <video ref={localVideoRef} autoPlay muted playsInline style={{ width:'100%', height:'100%', objectFit:'cover', transform:'scaleX(-1)' }} />
          ) : (
            <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Contrôles */}
      <div style={{ height:80, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', gap:16, flexShrink:0, paddingBottom:'env(safe-area-inset-bottom,0px)' }}>
        <button onClick={toggleMic}
          style={{ width:52, height:52, borderRadius:'50%', background: micOn ? 'rgba(255,255,255,0.15)' : '#ba1a1a', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
          {micOn ? <Mic size={22}/> : <MicOff size={22}/>}
        </button>
        <button onClick={toggleCam}
          style={{ width:52, height:52, borderRadius:'50%', background: camOn ? 'rgba(255,255,255,0.15)' : '#ba1a1a', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
          {camOn ? <Video size={22}/> : <VideoOff size={22}/>}
        </button>
        <button onClick={() => setShowEnd(true)}
          style={{ width:60, height:60, borderRadius:'50%', background:'#ba1a1a', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
          <PhoneOff size={26}/>
        </button>
      </div>

      {/* Modal fin */}
      {showEnd && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'white', borderRadius:16, padding:28, maxWidth:320, width:'100%', textAlign:'center' }}>
            <PhoneOff size={36} color="#ba1a1a" style={{ margin:'0 auto 16px' }} />
            <h3 style={{ fontSize:18, fontWeight:700, margin:'0 0 8px' }}>Terminer ?</h3>
            <p style={{ fontSize:14, color:'#6f797b', margin:'0 0 24px' }}>La consultation sera terminée pour les deux participants.</p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setShowEnd(false)} style={{ flex:1, padding:'12px', border:'1.5px solid #bec8cb', borderRadius:8, background:'white', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Annuler</button>
              <button onClick={handleEnd} disabled={ending} style={{ flex:1, padding:'12px', background:'#ba1a1a', color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', opacity: ending ? 0.7 : 1 }}>
                {ending ? 'Fin...' : 'Terminer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}