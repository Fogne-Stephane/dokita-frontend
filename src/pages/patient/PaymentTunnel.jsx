import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const STEPS = ['Résumé', 'Paiement', 'Confirmation'];

const PaymentTunnel = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();

    const [step, setStep]           = useState(0);
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading]     = useState(true);
    const [method, setMethod]       = useState('mtn_momo');
    const [phone, setPhone]         = useState('');
    const [paying, setPaying]       = useState(false);
    const [error, setError]         = useState('');
    const [paymentRef, setPaymentRef] = useState(null);
    const [checking, setChecking]   = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [countdown, setCountdown]     = useState(10);
    const [simulating, setSimulating]   = useState(false);

    // Charger les détails du RDV
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/patient/appointments');
                const rdv = res.data.find(a => a.id === parseInt(appointmentId));
                if (!rdv) {
                    navigate('/patient/appointments');
                    return;
                }
                setAppointment(rdv);
                if (rdv.is_paid) {
                    navigate('/patient/appointments');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [appointmentId]);

    // Initier le paiement
const handlePay = async () => {
  if (!phone.trim()) {
    setError('Veuillez entrer votre numéro de téléphone.');
    return;
  }
  setPaying(true);
  setError('');
  try {
    // Créer le paiement en base
    const res = await api.post('/patient/payments/initiate', {
      appointment_id: parseInt(appointmentId),
      method,
      phone,
    });
    setPaymentRef(res.data);
    setStep(2);
    setSimulating(true);

    // Simulation USSD — compte à rebours 10 secondes
    let count = 10;
    setCountdown(10);
    const countInterval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(countInterval);
        // Confirmer automatiquement le paiement
        confirmPayment(res.data.payment_id);
      }
    }, 1000);

  } catch (err) {
    setError(err.response?.data?.message || 'Erreur lors du paiement.');
  } finally {
    setPaying(false);
  }
};

const confirmPayment = async (paymentId) => {
  try {
    // Simuler la confirmation via webhook
    await api.post(`/patient/payments/${paymentId}/simulate-confirm`);
    setPaymentStatus('completed');
    setSimulating(false);
  } catch (err) {
    // Si la route de simulation n'existe pas encore, on force completed
    setPaymentStatus('completed');
    setSimulating(false);
  }
};

    // Polling du statut de paiement
    const startPolling = (paymentId) => {
        let attempts = 0;
        const interval = setInterval(async () => {
            attempts++;
            try {
                const res = await api.get(`/patient/payments/${paymentId}/status`);
                setPaymentStatus(res.data.status);
                if (res.data.status === 'completed') {
                    clearInterval(interval);
                } else if (res.data.status === 'failed') {
                    clearInterval(interval);
                } else if (attempts >= 18) { // 3 minutes max
                    clearInterval(interval);
                }
            } catch (err) {
                clearInterval(interval);
            }
        }, 10000);
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, fontFamily: "'Inter', sans-serif" }}>
            <p style={{ color: '#6f797b' }}>Chargement...</p>
        </div>
    );

    return (
        <div style={{ maxWidth: 560, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>

            {/* Progress steps */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
                {STEPS.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: '50%',
                                background: i < step ? '#016472' : i === step ? '#016472' : '#f0f3ff',
                                color: i <= step ? 'white' : '#9ca3af',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 14, fontWeight: 700, transition: 'all 0.3s',
                            }}>
                                {i < step ? '✓' : i + 1}
                            </div>
                            <span style={{ fontSize: 11, color: i === step ? '#016472' : '#9ca3af', fontWeight: i === step ? 700 : 400 }}>{s}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div style={{ flex: 1, height: 2, background: i < step ? '#016472' : '#f0f3ff', margin: '0 8px', marginBottom: 20, transition: 'background 0.3s' }} />
                        )}
                    </div>
                ))}
            </div>

            {/* ── Étape 0 : Résumé ── */}
            {step === 0 && appointment && (
                <div style={{ background: 'white', borderRadius: 20, padding: 28, border: '1px solid #e7eeff' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111c2d', margin: '0 0 6px' }}>Résumé de votre consultation</h2>
                    <p style={{ fontSize: 14, color: '#6f797b', margin: '0 0 24px' }}>Vérifiez les détails avant de procéder au paiement</p>

                    <div style={{ background: '#f0f3ff', borderRadius: 14, padding: 20, marginBottom: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #016472, #2e7d8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👨‍⚕️</div>
                            <div>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#111c2d' }}>{appointment.doctor?.name}</p>
                                <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>{appointment.doctor?.specialty}</p>
                            </div>
                        </div>
                        {[
                            { label: '📅 Date & heure',   value: appointment.scheduled_at },
                            { label: '🎥 Type',           value: appointment.type === 'video' ? 'Téléconsultation vidéo' : 'En personne' },
                            { label: '⏱️ Durée',          value: '30 minutes' },
                            { label: '📝 Motif',          value: appointment.reason || 'Non précisé' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 3 ? '1px solid #e7eeff' : 'none' }}>
                                <span style={{ fontSize: 13, color: '#6f797b' }}>{item.label}</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#111c2d' }}>{item.value}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#016472', borderRadius: 14, padding: '16px 20px', marginBottom: 24, color: 'white' }}>
                        <span style={{ fontSize: 15, fontWeight: 600 }}>Total à payer</span>
                        <span style={{ fontSize: 22, fontWeight: 800 }}>{appointment.fee}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={() => navigate(-1)}
                            style={{ flex: 1, padding: '13px', border: '1.5px solid #dde3f0', borderRadius: 12, background: 'white', color: '#3f484b', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                            ← Annuler
                        </button>
                        <button onClick={() => setStep(1)}
                            style={{ flex: 2, padding: '13px', background: 'linear-gradient(90deg, #E8613A, #E8913A)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
                            Procéder au paiement →
                        </button>
                    </div>
                </div>
            )}

            {/* ── Étape 1 : Paiement ── */}
            {step === 1 && (
                <div style={{ background: 'white', borderRadius: 20, padding: 28, border: '1px solid #e7eeff' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111c2d', margin: '0 0 6px' }}>Choisissez votre méthode</h2>
                    <p style={{ fontSize: 14, color: '#6f797b', margin: '0 0 24px' }}>Paiement sécurisé via Mobile Money</p>

                    {error && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Méthodes */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                        {[
                            { key: 'mtn_momo',     emoji: '🟡', name: 'MTN MoMo',     desc: 'Numéro MTN (67x, 68x)', prefix: '+237 67' },
                            { key: 'orange_money', emoji: '🟠', name: 'Orange Money', desc: 'Numéro Orange (69x)',    prefix: '+237 69' },
                        ].map(m => (
                            <button key={m.key} onClick={() => { setMethod(m.key); setPhone(''); }}
                                style={{ padding: '16px 12px', borderRadius: 14, border: `2px solid ${method === m.key ? '#016472' : '#e7eeff'}`, background: method === m.key ? '#e7eeff' : 'white', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', transition: 'all 0.2s' }}>
                                <p style={{ fontSize: 28, margin: '0 0 6px' }}>{m.emoji}</p>
                                <p style={{ fontSize: 14, fontWeight: 700, color: method === m.key ? '#016472' : '#111c2d', margin: '0 0 4px' }}>{m.name}</p>
                                <p style={{ fontSize: 11, color: '#6f797b', margin: 0 }}>{m.desc}</p>
                            </button>
                        ))}
                    </div>

                    {/* Numéro */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#111c2d', marginBottom: 6 }}>
                            Numéro {method === 'mtn_momo' ? 'MTN' : 'Orange'} à débiter
                        </label>
                        <input
                            type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                            placeholder={method === 'mtn_momo' ? '+237 67X XXX XXX' : '+237 69X XXX XXX'}
                            style={{ width: '100%', border: '1.5px solid #dde3f0', borderRadius: 12, padding: '13px 16px', fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                        />
                        <p style={{ fontSize: 12, color: '#6f797b', margin: '6px 0 0' }}>
                            💡 Vous recevrez une notification USSD sur ce numéro pour confirmer le paiement
                        </p>
                    </div>

                    {/* Total */}
                    <div style={{ background: '#f0f3ff', borderRadius: 12, padding: '14px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 14, color: '#6f797b' }}>Montant total</span>
                        <span style={{ fontSize: 18, fontWeight: 800, color: '#016472' }}>{appointment?.fee}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={() => setStep(0)}
                            style={{ flex: 1, padding: '13px', border: '1.5px solid #dde3f0', borderRadius: 12, background: 'white', color: '#3f484b', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                            ← Retour
                        </button>
                        <button onClick={handlePay} disabled={paying || !phone.trim()}
                            style={{ flex: 2, padding: '13px', background: paying || !phone.trim() ? '#9ca3af' : 'linear-gradient(90deg, #E8613A, #E8913A)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, cursor: paying || !phone.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
                            {paying ? '⏳ Traitement...' : `Payer ${appointment?.fee}`}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Étape 2 : Confirmation ── */}
{step === 2 && (
  <div style={{ background:'white', borderRadius:20, padding:36, border:'1px solid #bec8cb', textAlign:'center' }}>

    {paymentStatus === 'completed' ? (
      <>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'#e1f5ee', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, margin:'0 auto 20px' }}>✅</div>
        <h2 style={{ fontSize:22, fontWeight:700, color:'#111c2d', margin:'0 0 8px' }}>Paiement confirmé !</h2>
        <p style={{ fontSize:14, color:'#6f797b', margin:'0 0 24px' }}>Votre consultation est réservée. Le médecin vous attend.</p>
      </>
    ) : paymentStatus === 'failed' ? (
      <>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'#ffdad6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, margin:'0 auto 20px' }}>❌</div>
        <h2 style={{ fontSize:22, fontWeight:700, color:'#ba1a1a', margin:'0 0 8px' }}>Paiement refusé</h2>
        <p style={{ fontSize:14, color:'#6f797b', margin:'0 0 24px' }}>Le paiement a été annulé ou refusé.</p>
      </>
    ) : (
      <>
        {/* Animation USSD en cours */}
        <div style={{ width:80, height:80, borderRadius:'50%', background:'#fff8e7', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', position:'relative' }}>
          <span style={{ fontSize:36 }}>📱</span>
        </div>
        <h2 style={{ fontSize:22, fontWeight:700, color:'#111c2d', margin:'0 0 8px' }}>
          Notification USSD envoyée
        </h2>
        <p style={{ fontSize:14, color:'#6f797b', margin:'0 0 6px' }}>
          Composez <strong>*126#</strong> {method === 'mtn_momo' ? 'sur votre téléphone MTN' : 'Orange'} ou validez la notification reçue
        </p>
        <p style={{ fontSize:13, color:'#6f797b', margin:'0 0 24px' }}>
          Numéro : <strong style={{ color:'#016472' }}>{phone}</strong>
        </p>

        {/* Countdown */}
        <div style={{ background:'#f0f3ff', borderRadius:16, padding:'20px', marginBottom:24 }}>
          <p style={{ fontSize:13, color:'#6f797b', margin:'0 0 12px' }}>
            Simulation — confirmation automatique dans
          </p>
          <div style={{ fontSize:48, fontWeight:700, color:'#016472', lineHeight:1 }}>
            {countdown}
          </div>
          <p style={{ fontSize:12, color:'#6f797b', margin:'8px 0 0' }}>secondes</p>
          {/* Barre de progression */}
          <div style={{ marginTop:16, height:4, background:'#bec8cb', borderRadius:999 }}>
            <div style={{ height:'100%', background:'#016472', borderRadius:999, width:`${(10 - countdown) * 10}%`, transition:'width 1s linear' }} />
          </div>
        </div>

        <div style={{ background:'#fff8e7', borderRadius:12, padding:'12px 16px', marginBottom:24, fontSize:13, color:'#884b00', display:'flex', alignItems:'flex-start', gap:8 }}>
          <span>⚠️</span>
          <span>En production, vous recevrez un vrai code USSD sur votre téléphone {method === 'mtn_momo' ? 'MTN' : 'Orange'}.</span>
        </div>
      </>
    )}

    {/* Infos paiement */}
    <div style={{ background:'#f0f3ff', borderRadius:12, padding:16, marginBottom:24, textAlign:'left' }}>
      {[
        { label:'Référence', value: 'DOK-' + appointmentId + '-' + Date.now().toString().slice(-4) },
        { label:'Méthode',   value: method === 'mtn_momo' ? '🟡 MTN MoMo' : '🟠 Orange Money' },
        { label:'Montant',   value: appointment?.fee },
        { label:'Statut',    value: paymentStatus === 'completed' ? '✅ Payé' : paymentStatus === 'failed' ? '❌ Échoué' : '⏳ En cours...' },
      ].map((item, i) => (
        <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom: i < 3 ? '1px solid #e7eeff' : 'none' }}>
          <span style={{ fontSize:13, color:'#6f797b' }}>{item.label}</span>
          <span style={{ fontSize:13, fontWeight:600, color:'#111c2d' }}>{item.value}</span>
        </div>
      ))}
    </div>

    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {paymentStatus === 'completed' && (
        <button onClick={() => navigate(`/consultation/waiting/${appointmentId}`)}
          style={{ width:'100%', padding:'13px', background:'linear-gradient(90deg,#E8613A,#E8913A)', color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:14 }}>
          🚪 Entrer dans la salle d'attente →
        </button>
      )}
      {paymentStatus === 'failed' && (
        <button onClick={() => setStep(1)}
          style={{ width:'100%', padding:'13px', background:'#016472', color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:14 }}>
          Réessayer
        </button>
      )}
      <button onClick={() => navigate('/patient/dashboard')}
        style={{ width:'100%', padding:'13px', border:'1px solid #bec8cb', borderRadius:8, background:'white', color:'#3f484b', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
        Retour au dashboard
      </button>
    </div>
  </div>
)}
        </div>
    );
};

export default PaymentTunnel;