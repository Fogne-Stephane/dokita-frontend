import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { messageService } from '../../api/services';
import { getEcho } from '../../api/echo';
import api from '../../api/axios';

const PatientMessages = () => {
    const { user } = useSelector((state) => state.auth);
    const [conversations, setConversations] = useState([]);
    const [activeConv, setActiveConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const messagesEndRef = useRef(null);

    const [showNewConv, setShowNewConv] = useState(false);
const [doctors, setDoctors] = useState([]);

useEffect(() => {
    const fetchDoctors = async () => {
        try {
            const res = await api.get('/doctors');
            setDoctors(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    fetchDoctors();
}, []);
    // Charger les conversations au démarrage
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await messageService.getConversations();
                setConversations(res.data);
                if (res.data.length > 0) {
                    setActiveConv(res.data[0]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    // Charger les messages quand on change de conversation
    useEffect(() => {
        if (!activeConv) return;

        const fetchMessages = async () => {
            setLoadingMessages(true);
            try {
                const res = await messageService.getConversation(activeConv.user.id);
                setMessages(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingMessages(false);
            }
        };

        fetchMessages();
    }, [activeConv]);

    // Écouter les messages temps réel via Reverb
    useEffect(() => {
        if (!user || !activeConv) return;

        // Construire le nom du canal (même logique que le backend)
        const ids = [user.id, activeConv.user.id].sort((a, b) => a - b);
        const channelName = `chat.${ids[0]}.${ids[1]}`;

        // S'abonner au canal privé
        const channel = getEcho().private(channelName);

        channel.listen('.message.sent', (data) => {
            // Ajouter le message reçu à la liste
            setMessages(prev => [...prev, {
                id:      data.id,
                from:    data.sender_id === user.id ? 'me' : 'other',
                content: data.content,
                time:    data.time,
                is_read: data.is_read,
            }]);

            // Mettre à jour la dernière conversation
            setConversations(prev => prev.map(c =>
                c.user.id === activeConv.user.id
                    ? { ...c, last_message: data.content, time: data.time }
                    : c
            ));
        });

        // Se désabonner quand on change de conversation
        return () => {
            getEcho().leave(channelName);
        };
    }, [activeConv, user]);

    // Scroll automatique vers le bas
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Envoyer un message
const sendMessage = async () => {
    if (!newMessage.trim() || !activeConv) return;

    const content = newMessage;
    setNewMessage('');

    // Affichage optimiste
    const tempMsg = {
        id:      'temp-' + Date.now(),
        from:    'me',
        content: content,
        time:    new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }),
        is_read: false,
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
        await messageService.send({
            receiver_id: activeConv.user.id,
            content:     content,
        });

        // Mettre à jour last_message dans la liste sans recharger toute la liste
        setConversations(prev => prev.map(c =>
            c.user?.id === activeConv.user?.id
                ? { ...c, last_message: content, time: "À l'instant" }
                : c
        ));

    } catch (err) {
        console.error('Erreur envoi:', err);
        // Retirer le message optimiste si erreur
        setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
        setNewMessage(content);
    }
};
const [isOnline, setIsOnline] = useState(false);

useEffect(() => {
    if (!activeConv) return;

    const checkOnline = async () => {
        try {
            const res = await api.get(`/online-status?ids=${activeConv.user.id}`);
            const status = res.data.find(u => u.id === activeConv.user.id);
            setIsOnline(status?.is_online || false);
        } catch (err) {
            setIsOnline(false);
        }
    };

    checkOnline();
    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkOnline, 30000);
    return () => clearInterval(interval);
}, [activeConv]);

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, fontFamily: "'Inter', sans-serif" }}>
            <p style={{ color: '#6f797b' }}>Chargement des messages...</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', gap: 0, height: 'calc(100vh - 160px)', background: 'white', borderRadius: 20, border: '1px solid #e7eeff', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>

            {/* ── Liste conversations ── */}
            <div style={{ width: 300, borderRight: '1px solid #e7eeff', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <div style={{ padding: '20px 16px', borderBottom: '1px solid #e7eeff' }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 800, color: '#111c2d' }}>Messages</h3>
                    <input placeholder="🔍  Rechercher..."
                        style={{ width: '100%', border: '1.5px solid #e7eeff', borderRadius: 12, padding: '9px 14px', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {conversations.length === 0 ? (
                        <div style={{ padding: 24, textAlign: 'center' }}>
                            <p style={{ fontSize: 32, margin: '0 0 8px' }}>💬</p>
                            <p style={{ fontSize: 13, color: '#6f797b' }}>Aucune conversation</p>
                        </div>
                    ) : (
                        conversations.map((conv, i) => (
                            <div key={i} onClick={() => setActiveConv(conv)}
                                style={{ display: 'flex', gap: 12, padding: '16px', cursor: 'pointer', background: activeConv?.user?.id === conv.user?.id ? '#f0f3ff' : 'white', borderBottom: '1px solid #f5f7ff', transition: 'background 0.2s', borderLeft: activeConv?.user?.id === conv.user?.id ? '3px solid #016472' : '3px solid transparent' }}>
                                <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #016472, #2e7d8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                                    {conv.user?.role === 'doctor' ? '👨‍⚕️' : '🧑'}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                        <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#111c2d' }}>{conv.user?.name}</p>
                                        <span style={{ fontSize: 11, color: '#6f797b' }}>{conv.time}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: 12, color: '#6f797b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.last_message}</p>
                                </div>
                                {conv.unread > 0 && (
                                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#E8613A', color: 'white', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{conv.unread}</span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ── Zone chat ── */}
            {activeConv ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                    {/* Header */}
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #e7eeff', display: 'flex', alignItems: 'center', gap: 14, background: 'white' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #016472, #2e7d8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                            {activeConv.user?.role === 'doctor' ? '👨‍⚕️' : '🧑'}
                        </div>
                        <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#111c2d' }}>{activeConv.user?.name}</p>
                           <p style={{ margin: 0, fontSize: 12, color: isOnline ? '#22c55e' : '#6f797b', fontWeight: 600 }}>
    {isOnline ? '● En ligne' : '○ Hors ligne'}
</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 12, background: '#f9f9ff' }}>
                        {loadingMessages ? (
                            <div style={{ textAlign: 'center', padding: 24 }}>
                                <p style={{ color: '#6f797b', fontSize: 13 }}>Chargement...</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 48 }}>
                                <p style={{ fontSize: 40, margin: '0 0 12px' }}>💬</p>
                                <p style={{ color: '#6f797b', fontSize: 14 }}>Commencez la conversation !</p>
                            </div>
                        ) : (
                            messages.map(msg => (
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
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{ padding: '16px 24px', borderTop: '1px solid #e7eeff', display: 'flex', gap: 12, background: 'white' }}>
                        <input
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                            placeholder="Écrire un message... (Entrée pour envoyer)"
                            style={{ flex: 1, border: '1.5px solid #dde3f0', borderRadius: 14, padding: '12px 18px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                        />
                        <button onClick={sendMessage}
                            disabled={!newMessage.trim()}
                            style={{ background: newMessage.trim() ? 'linear-gradient(135deg, #016472, #2e7d8c)' : '#f0f3ff', color: newMessage.trim() ? 'white' : '#9ca3af', border: 'none', borderRadius: 14, padding: '0 22px', fontSize: 18, cursor: newMessage.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
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
        </div>
    );
};

export default PatientMessages;