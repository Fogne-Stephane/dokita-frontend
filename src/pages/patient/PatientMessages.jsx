import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import { getEcho } from '../../api/echo';

const PatientMessages = () => {
    const { user } = useSelector((state) => state.auth);

        if (!user || user.role !== 'patient') {
        return (
            <div style={{ padding: 40, textAlign: 'center', fontFamily: "'Inter', sans-serif" }}>
                <p style={{ color: '#dc2626', fontWeight: 600 }}>
                    ⚠️ Accès non autorisé.
                </p>
            </div>
        );
    }

    const [conversations, setConversations] = useState([]);
    const [activeConv, setActiveConv]       = useState(null);
    const [messages, setMessages]           = useState([]);
    const [newMessage, setNewMessage]       = useState('');
    const [loading, setLoading]             = useState(true);
    const [loadingMsgs, setLoadingMsgs]     = useState(false);
    const [doctors, setDoctors]             = useState([]);
    const [showNewConv, setShowNewConv]     = useState(false);
    const messagesEndRef                    = useRef(null);

    // Charger médecins pour nouveau message
    useEffect(() => {
        api.get('/doctors').then(r => setDoctors(r.data)).catch(() => {});
    }, []);

    // Charger conversations — se redéclenche si user change
useEffect(() => {
  if (!user?.id) return;
  let cancelled = false;

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await api.get(user.role === 'doctor' ? '/doctor/messages' : '/patient/messages');
      if (!cancelled) {
        setConversations(res.data);
        // ✅ Ouvrir automatiquement la première conversation
        if (res.data.length > 0) {
          setActiveConv(res.data[0]);
          // Charger immédiatement les messages de la première conversation
          const msgRes = await api.get(
            user.role === 'doctor'
              ? `/doctor/messages/${res.data[0].user.id}`
              : `/patient/messages/${res.data[0].user.id}`
          );
          if (!cancelled) setMessages(msgRes.data);
        }
      }
    } catch (e) { console.error(e); }
    finally { if (!cancelled) setLoading(false); }
  };

  fetchConversations();
  return () => { cancelled = true; };
}, [user?.id]);

    // Charger messages de la conversation active
    useEffect(() => {
        if (!activeConv?.user?.id) return;
        setLoadingMsgs(true);

        api.get(`/patient/messages/${activeConv.user.id}`)
            .then(r => setMessages(r.data))
            .catch(err => console.error('Erreur messages:', err))
            .finally(() => setLoadingMsgs(false));
    }, [activeConv?.user?.id]);

    // Écouter les messages temps réel
    useEffect(() => {
        if (!user?.id || !activeConv?.user?.id) return;

        const ids = [user.id, activeConv.user.id].sort((a, b) => a - b);
        const channelName = `chat.${ids[0]}.${ids[1]}`;

        const channel = getEcho().private(channelName);
        channel.listen('.message.sent', (data) => {
            setMessages(prev => {
                // Éviter les doublons
                if (prev.find(m => m.id === data.id)) return prev;
                return [...prev, {
                    id:      data.id,
                    from:    data.sender_id === user.id ? 'me' : 'other',
                    content: data.content,
                    time:    data.time,
                    is_read: false,
                }];
            });
        });

        return () => {
            try { getEcho().leave(channelName); } catch(e) {}
        };
    }, [user?.id, activeConv?.user?.id]);

    // Scroll vers le bas
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Envoyer un message
    const sendMessage = async () => {
        if (!newMessage.trim() || !activeConv) return;
        const content = newMessage;
        setNewMessage('');

        const tempId = 'temp-' + Date.now();
        setMessages(prev => [...prev, {
            id: tempId, from: 'me', content,
            time: new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }),
            is_read: false,
        }]);

        try {
            await api.post('/patient/messages', {
                receiver_id: activeConv.user.id,
                content,
            });
            setConversations(prev => prev.map(c =>
                c.user?.id === activeConv.user?.id
                    ? { ...c, last_message: content, time: "À l'instant" }
                    : c
            ));
        } catch (err) {
            console.error('Erreur envoi:', err);
            setMessages(prev => prev.filter(m => m.id !== tempId));
            setNewMessage(content);
        }
    };

    // Démarrer une nouvelle conversation
    const startConversation = async (doctor) => {
        setShowNewConv(false);
        try {
            await api.post('/patient/messages', {
                receiver_id: doctor.user_id,
                content: '👋 Bonjour Docteur, je souhaite vous contacter.',
            });
            const res = await api.get('/patient/messages');
            setConversations(res.data);
            const found = res.data.find(c => c.user?.id === doctor.user_id);
            if (found) setActiveConv(found);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, fontFamily: "'Inter', sans-serif" }}>
            <p style={{ color: '#6f797b' }}>Chargement des messages...</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', gap: 0, height: 'calc(100vh - 160px)', background: 'white', borderRadius: 20, border: '1px solid #e7eeff', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>

            {/* Liste conversations */}
            <div style={{ width: 300, borderRight: '1px solid #e7eeff', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <div style={{ padding: '20px 16px', borderBottom: '1px solid #e7eeff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#111c2d' }}>Messages</h3>
                        <button onClick={() => setShowNewConv(true)}
                            style={{ background: '#016472', color: 'white', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                            + Nouveau
                        </button>
                    </div>
                    <input placeholder="🔍  Rechercher..."
                        style={{ width: '100%', border: '1.5px solid #e7eeff', borderRadius: 12, padding: '9px 14px', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {conversations.length === 0 ? (
                        <div style={{ padding: 24, textAlign: 'center' }}>
                            <p style={{ fontSize: 32, margin: '0 0 8px' }}>💬</p>
                            <p style={{ fontSize: 13, color: '#6f797b' }}>Aucune conversation</p>
                            <button onClick={() => setShowNewConv(true)}
                                style={{ marginTop: 8, background: '#016472', color: 'white', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                                Contacter un médecin
                            </button>
                        </div>
                    ) : conversations.map((conv, i) => (
                        <div key={i} onClick={() => setActiveConv(conv)}
                            style={{ display: 'flex', gap: 12, padding: 16, cursor: 'pointer', background: activeConv?.user?.id === conv.user?.id ? '#f0f3ff' : 'white', borderBottom: '1px solid #f5f7ff', borderLeft: activeConv?.user?.id === conv.user?.id ? '3px solid #016472' : '3px solid transparent', transition: 'all 0.2s' }}>
                            <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #016472, #2e7d8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                                {conv.user?.role === 'doctor' ? '👨‍⚕️' : '🧑'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#111c2d' }}>{conv.user?.name}</p>
                                    <span style={{ fontSize: 11, color: '#6f797b', flexShrink: 0 }}>{conv.time}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: 12, color: '#6f797b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.last_message}</p>
                            </div>
                            {conv.unread > 0 && (
                                <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#E8613A', color: 'white', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{conv.unread}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Zone chat */}
            {activeConv ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #e7eeff', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #016472, #2e7d8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                            {activeConv.user?.role === 'doctor' ? '👨‍⚕️' : '🧑'}
                        </div>
                        <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#111c2d' }}>{activeConv.user?.name}</p>
                            <p style={{ margin: 0, fontSize: 12, color: '#22c55e', fontWeight: 600 }}>● En ligne</p>
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 12, background: '#f9f9ff' }}>
                        {loadingMsgs ? (
                            <p style={{ textAlign: 'center', color: '#6f797b', fontSize: 13 }}>Chargement...</p>
                        ) : messages.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 48 }}>
                                <p style={{ fontSize: 40, margin: '0 0 12px' }}>💬</p>
                                <p style={{ color: '#6f797b', fontSize: 14 }}>Commencez la conversation !</p>
                            </div>
                        ) : messages.map(msg => (
                            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
                                <div style={{
                                    maxWidth: '65%', padding: '10px 16px',
                                    borderRadius: msg.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                    background: msg.from === 'me' ? 'linear-gradient(135deg, #016472, #2e7d8c)' : 'white',
                                    color: msg.from === 'me' ? 'white' : '#111c2d',
                                    fontSize: 14, lineHeight: 1.6,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                    border: msg.from === 'other' ? '1px solid #e7eeff' : 'none',
                                }}>
                                    <p style={{ margin: '0 0 4px' }}>{msg.content}</p>
                                    <p style={{ margin: 0, fontSize: 11, opacity: 0.65, textAlign: 'right' }}>
                                        {msg.time} {msg.from === 'me' && (msg.is_read ? '✓✓' : '✓')}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div style={{ padding: '16px 24px', borderTop: '1px solid #e7eeff', display: 'flex', gap: 12, background: 'white' }}>
                        <input value={newMessage} onChange={e => setNewMessage(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                            placeholder="Écrire un message... (Entrée pour envoyer)"
                            style={{ flex: 1, border: '1.5px solid #dde3f0', borderRadius: 14, padding: '12px 18px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                        />
                        <button onClick={sendMessage} disabled={!newMessage.trim()}
                            style={{ background: newMessage.trim() ? 'linear-gradient(135deg, #016472, #2e7d8c)' : '#f0f3ff', color: newMessage.trim() ? 'white' : '#9ca3af', border: 'none', borderRadius: 14, padding: '0 22px', fontSize: 18, cursor: newMessage.trim() ? 'pointer' : 'not-allowed' }}>
                            ➤
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f9f9ff' }}>
                    <p style={{ fontSize: 48, margin: '0 0 16px' }}>💬</p>
                    <p style={{ fontWeight: 700, fontSize: 18, color: '#111c2d', margin: '0 0 8px' }}>Vos messages</p>
                    <p style={{ fontSize: 14, color: '#6f797b' }}>Sélectionnez une conversation pour commencer</p>
                </div>
            )}

            {/* Modal nouveau message */}
            {showNewConv && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => setShowNewConv(false)}>
                    <div style={{ background: 'white', borderRadius: 20, padding: 28, width: '100%', maxWidth: 420 }}
                        onClick={e => e.stopPropagation()}>
                        <h3 style={{ margin: '0 0 6px', fontWeight: 800, color: '#111c2d' }}>Nouvelle conversation</h3>
                        <p style={{ margin: '0 0 20px', fontSize: 13, color: '#6f797b' }}>Choisissez un médecin à contacter</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto' }}>
                            {doctors.map(doc => (
                                <div key={doc.id} onClick={() => startConversation(doc)}
                                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: '#f9f9ff', borderRadius: 14, cursor: 'pointer', border: '1px solid #e7eeff', transition: 'all 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#e7eeff'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#f9f9ff'}>
                                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #016472, #2e7d8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>👨‍⚕️</div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 14, color: '#111c2d' }}>{doc.name}</p>
                                        <p style={{ margin: 0, fontSize: 12, color: '#016472', fontWeight: 600 }}>{doc.specialty}</p>
                                    </div>
                                    <span style={{ fontSize: 12, color: doc.is_available ? '#16a34a' : '#6f797b', fontWeight: 600 }}>
                                        {doc.is_available ? '● Disponible' : '○ Occupé'}
                                    </span>
                                </div>
                            ))}
                            {doctors.length === 0 && (
                                <p style={{ textAlign: 'center', color: '#6f797b', fontSize: 13 }}>Aucun médecin disponible</p>
                            )}
                        </div>
                        <button onClick={() => setShowNewConv(false)}
                            style={{ width: '100%', marginTop: 16, padding: '11px', border: '1.5px solid #dde3f0', borderRadius: 12, background: 'white', color: '#3f484b', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientMessages;