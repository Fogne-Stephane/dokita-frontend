import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Send, ArrowLeft, PhoneOff } from 'lucide-react';
import api from '../../api/axios';
import { getEcho } from '../../api/echo';

export default function ConsultationChat() {
  const { appointmentId } = useParams();
  const { state }         = useLocation();
  const navigate          = useNavigate();
  const { user }          = useSelector(s => s.auth);

  const [messages,  setMessages]  = useState([]);
  const [text,      setText]      = useState('');
  const [loading,   setLoading]   = useState(true);
  const [ending,    setEnding]    = useState(false);
  const [showEnd,   setShowEnd]   = useState(false);
  const endRef = useRef(null);

const doctor   = state?.doctor;
const doctorId = state?.doctorId || state?.doctor?.id || null;

// Debug
useEffect(() => {
    console.log('ConsultationChat state:', state);
    console.log('doctorId:', doctorId);
}, []);

useEffect(() => {
    if (!doctorId) {
        console.error('doctorId manquant dans state:', state);
        return;
    }
    api.get(`/patient/messages/consultation/${doctorId}`)
        .then(res => setMessages(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
}, [doctorId]);

  // Écouter les nouveaux messages
  useEffect(() => {
    if (!user?.id || !doctorId) return;
    const ids = [user.id, parseInt(doctorId)].sort((a,b) => a-b);
    const ch  = getEcho().private(`chat.${ids[0]}.${ids[1]}`);

    ch.listen('.message.sent', (data) => {
      setMessages(prev => [...prev, {
        id:      data.id,
        from:    data.sender_id === user.id ? 'me' : 'other',
        content: data.content,
        time:    data.time,
      }]);
    });

    return () => ch.stopListening('.message.sent');
  }, [user?.id, doctorId]);

  // Scroll auto
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !doctorId) return;
    const content = text.trim();
    setText('');
    try {
      await api.post('/patient/messages/consultation', {
        receiver_id: doctorId,
        content,
      });
    } catch (e) {
      console.error(e);
      setText(content);
    }
  };

const handleEnd = async () => {
    setEnding(true);
    try {
        await api.post(`/patient/consultations/${appointmentId}/end`);
        navigate(`/consultation/summary/${appointmentId}`, { replace: true });
    } catch (e) { console.error(e); }
    finally { setEnding(false); }
};

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'var(--background)', fontFamily:"'Inter',sans-serif" }}>

      {/* Header */}
      <header style={{ height:64, background:'var(--surface)', borderBottom:'1px solid var(--outline-variant)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 clamp(12px,3vw,20px)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={() => navigate(-1)}
            style={{ background:'none', border:'none', cursor:'pointer', color:'var(--outline)', padding:4 }}>
            <ArrowLeft size={20} />
          </button>
          <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,var(--primary),#2e7d8c)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:15 }}>
            {doctor?.name?.[0]?.toUpperCase() || 'D'}
          </div>
          <div>
            <p style={{ fontSize:14, fontWeight:700, color:'var(--on-surface)', margin:0 }}>{doctor?.name || 'Médecin'}</p>
            <div style={{ display:'flex', alignItems:'center', gap:4 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e' }} />
              <p style={{ fontSize:11, color:'#16a34a', margin:0 }}>Consultation en cours</p>
            </div>
          </div>
        </div>
        <button onClick={() => setShowEnd(true)}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:'var(--error-container)', color:'var(--error)', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:13 }}>
          <PhoneOff size={15} /> Terminer
        </button>
      </header>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'clamp(12px,3vw,20px)', display:'flex', flexDirection:'column', gap:10, background:'var(--surface-low)' }}>
        {loading ? (
          <p style={{ textAlign:'center', color:'var(--outline)', fontSize:13 }}>Chargement...</p>
        ) : messages.length === 0 ? (
          <div style={{ textAlign:'center', padding:40 }}>
            <p style={{ fontSize:32, margin:'0 0 8px' }}>💬</p>
            <p style={{ color:'var(--outline)', fontSize:14 }}>Commencez la conversation</p>
          </div>
        ) : messages.map(msg => (
          <div key={msg.id} style={{ display:'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth:'70%', padding:'10px 14px',
              borderRadius: msg.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.from === 'me' ? 'var(--primary)' : 'var(--surface)',
              color: msg.from === 'me' ? '#fff' : 'var(--on-surface)',
              fontSize:14, lineHeight:1.5,
              border: msg.from === 'other' ? '1px solid var(--outline-variant)' : 'none',
              boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
            }}>
              <p style={{ margin:'0 0 4px' }}>{msg.content}</p>
              <p style={{ margin:0, fontSize:10, opacity:0.6, textAlign:'right' }}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding:'clamp(10px,2vw,16px)', background:'var(--surface)', borderTop:'1px solid var(--outline-variant)', display:'flex', gap:10, alignItems:'flex-end', paddingBottom:'calc(clamp(10px,2vw,16px) + env(safe-area-inset-bottom,0px))', flexShrink:0 }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Écrire un message..."
          rows={1}
          style={{ flex:1, border:'1.5px solid var(--outline-variant)', borderRadius:12, padding:'11px 14px', fontSize:14, fontFamily:'inherit', outline:'none', resize:'none', background:'var(--surface-low)', color:'var(--on-surface)', maxHeight:120, overflowY:'auto' }}
        />
        <button onClick={sendMessage} disabled={!text.trim()}
          style={{ width:44, height:44, borderRadius:'50%', background: text.trim() ? 'var(--primary)' : 'var(--outline-variant)', color:'#fff', border:'none', cursor: text.trim() ? 'pointer' : 'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Send size={18} />
        </button>
      </div>

      {/* Modal fin */}
      {showEnd && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'var(--surface)', borderRadius:16, padding:28, maxWidth:320, width:'100%', textAlign:'center' }}>
            <h3 style={{ fontSize:18, fontWeight:700, margin:'0 0 8px' }}>Terminer la consultation ?</h3>
            <p style={{ fontSize:14, color:'var(--outline)', margin:'0 0 24px' }}>La conversation sera archivée dans votre dossier.</p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setShowEnd(false)} style={{ flex:1, padding:'12px', border:'1.5px solid var(--outline-variant)', borderRadius:8, background:'transparent', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Annuler</button>
              <button onClick={handleEnd} disabled={ending} style={{ flex:1, padding:'12px', background:'var(--error)', color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                {ending ? 'Fin...' : 'Terminer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}