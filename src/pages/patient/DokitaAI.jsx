import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import api from '../../api/axios';

const DS = {
  primary:'#016472', secondary:'#E8613A', surface:'#ffffff',
  surfaceLow:'#f0f3ff', surfaceContainer:'#e7eeff',
  onSurface:'#111c2d', outline:'#6f797b', outlineVariant:'#bec8cb',
};

const SUGGESTIONS = [
    "Quels sont les symptômes du paludisme ?",
    "J'ai de la fièvre depuis 3 jours, que faire ?",
    "Comment prévenir la typhoïde ?",
    "Quels médicaments pour l'hypertension ?",
];

export default function DokitaAI() {
  const [messages,   setMessages]   = useState([
    { role:'assistant', content:'Bonjour ! Je suis Dokita AI, votre assistant médical. Je peux vous aider à comprendre vos symptômes, vous informer sur les maladies ou vous orienter vers le bon spécialiste. Comment puis-je vous aider aujourd\'hui ?' }
  ]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const endRef  = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role:'user', content: msg }]);
    setLoading(true);
    try {
      const res = await api.post('/ai/chat', { message: msg });
      setMessages(prev => [...prev, { role:'assistant', content: res.data.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role:'assistant', content:'Désolé, je rencontre une difficulté technique. Veuillez réessayer.' }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", display:'flex', flexDirection:'column', height:'calc(100vh - 64px - clamp(12px,3vw,24px)*2)' }}>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${DS.primary},#004e5a)`, borderRadius:12, padding:'clamp(14px,3vw,20px)', marginBottom:16, display:'flex', alignItems:'center', gap:14, flexShrink:0 }}>
        <div style={{ width:48, height:48, borderRadius:12, background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Bot size={26} color="#fff" />
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <h2 style={{ fontSize:'clamp(16px,2.5vw,20px)', fontWeight:700, color:'#fff', margin:0 }}>Dokita AI</h2>
            <span style={{ background:'rgba(255,255,255,0.2)', color:'#fff', fontSize:11, padding:'2px 8px', borderRadius:999, fontWeight:600 }}>BETA</span>
          </div>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.75)', margin:0 }}>Assistant médical intelligent • Disponible 24h/7j</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:'#4ade80' }} />
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.75)' }}>En ligne</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:12, paddingRight:4 }}>

        {messages.map((msg, i) => (
          <div key={i} style={{ display:'flex', justifyContent: msg.role==='user' ? 'flex-end' : 'flex-start', gap:10 }}>
            {msg.role === 'assistant' && (
              <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${DS.primary},#2e7d8c)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                <Bot size={18} color="#fff" />
              </div>
            )}
            <div style={{
              maxWidth:'clamp(240px,70%,520px)',
              padding:'clamp(10px,2vw,14px) clamp(12px,2vw,16px)',
              borderRadius: msg.role==='user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role==='user' ? `linear-gradient(135deg,${DS.secondary},#E8913A)` : DS.surface,
              color: msg.role==='user' ? '#fff' : DS.onSurface,
              fontSize:'clamp(13px,2vw,14px)',
              lineHeight:1.6,
              border: msg.role==='assistant' ? `1px solid ${DS.outlineVariant}` : 'none',
              boxShadow:'0 2px 8px rgba(0,0,0,0.06)',
            }}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${DS.secondary},#E8913A)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                <User size={18} color="#fff" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display:'flex', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${DS.primary},#2e7d8c)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Bot size={18} color="#fff" />
            </div>
            <div style={{ background: DS.surface, borderRadius:'16px 16px 16px 4px', padding:'14px 18px', border:`1px solid ${DS.outlineVariant}`, display:'flex', gap:4, alignItems:'center' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width:8, height:8, borderRadius:'50%', background: DS.primary, opacity:0.6, animation:'pulse 1.4s ease-in-out infinite', animationDelay:`${i*0.2}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {messages.length === 1 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:8 }}>
            {SUGGESTIONS.map((s,i) => (
              <button key={i} onClick={() => send(s)}
                style={{ padding:'8px 14px', borderRadius:999, border:`1.5px solid ${DS.outlineVariant}`, background: DS.surface, color: DS.onSurface, fontSize:13, cursor:'pointer', fontFamily:'inherit', transition:'all .2s', display:'flex', alignItems:'center', gap:6 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=DS.primary; e.currentTarget.style.background=DS.surfaceLow; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=DS.outlineVariant; e.currentTarget.style.background=DS.surface; }}>
                <Sparkles size={13} color={DS.secondary} /> {s}
              </button>
            ))}
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Avertissement */}
      <div style={{ background:'#fff8e7', border:`1px solid #fde047`, borderRadius:8, padding:'8px 14px', margin:'10px 0 0', fontSize:12, color:'#884b00', display:'flex', gap:6, flexShrink:0 }}>
        <span>⚠️</span>
        <span>Dokita AI fournit des informations générales. Consultez toujours un médecin pour un diagnostic médical.</span>
      </div>

      {/* Input */}
      <div style={{ display:'flex', gap:10, alignItems:'flex-end', paddingTop:10, flexShrink:0 }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if(e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(); }}}
          placeholder="Posez votre question médicale..."
          rows={1}
          style={{ flex:1, border:`1.5px solid ${DS.outlineVariant}`, borderRadius:12, padding:'12px 16px', fontSize:14, fontFamily:'inherit', outline:'none', resize:'none', background: DS.surface, color: DS.onSurface, maxHeight:120, overflowY:'auto', transition:'border-color .2s' }}
          onFocus={e => e.target.style.borderColor=DS.primary}
          onBlur={e => e.target.style.borderColor=DS.outlineVariant}
        />
        <button onClick={() => send()} disabled={!input.trim() || loading}
          style={{ width:46, height:46, borderRadius:'50%', background: input.trim() && !loading ? `linear-gradient(135deg,${DS.primary},#2e7d8c)` : DS.outlineVariant, color:'#fff', border:'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background .2s' }}>
          <Send size={18} />
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}