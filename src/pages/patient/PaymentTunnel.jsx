import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Calendar } from 'lucide-react';
import api from '../../api/axios';

const DS = {
  primary:'#016472', secondary:'#E8613A', surface:'#ffffff',
  surfaceLow:'#f0f3ff', surfaceContainer:'#e7eeff',
  onSurface:'#111c2d', outline:'#6f797b', outlineVariant:'#bec8cb',
};

const STEPS = ['Résumé','Paiement','Confirmation'];

const METHOD = {
  mtn_momo:     { label:'MTN MoMo',     icon:'🟡' },
  orange_money: { label:'Orange Money', icon:'🟠' },
};

export default function PaymentTunnel() {
  const { appointmentId } = useParams();
  const navigate          = useNavigate();

  const [step,        setStep]        = useState(0);
  const [appointment, setAppointment] = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [method,      setMethod]      = useState('mtn_momo');
  const [phone,       setPhone]       = useState('');
  const [paying,      setPaying]      = useState(false);
  const [error,       setError]       = useState('');
  const [paymentRef,  setPaymentRef]  = useState(null);
  const [payStatus,   setPayStatus]   = useState(null); // null | 'completed' | 'failed'
  const [countdown,   setCountdown]   = useState(10);
  const countRef = useRef(null);

  // Détecter si c'est une consultation immédiate ou un RDV planifié
  const isConsultation = appointment &&
    new Date(appointment.scheduled_at_raw || appointment.scheduled_at) <= new Date(Date.now() + 60000);

useEffect(() => {
    // D'abord essaie la route spéciale (RDV pas encore payé)
    api.get(`/patient/appointments/pending/${appointmentId}`)
        .then(res => {
            setAppointment(res.data);
        })
        .catch(() => {
            // Si 404, essaie les RDV payés
            api.get('/patient/appointments')
                .then(res => {
                    const rdv = res.data.find(a => a.id === parseInt(appointmentId));
                    if (!rdv) { navigate('/patient/dashboard'); return; }
                    setAppointment(rdv);
                })
                .catch(() => navigate('/patient/dashboard'));
        })
        .finally(() => setLoading(false));
}, [appointmentId]);

  const handlePay = async () => {
    if (!phone.trim()) { setError('Veuillez entrer votre numéro.'); return; }
    setPaying(true);
    setError('');
    try {
      const res = await api.post('/patient/payments/initiate', {
        appointment_id: parseInt(appointmentId),
        method,
        phone,
      });
      setPaymentRef(res.data);
      setStep(2);

      // Countdown simulation USSD
      let count = 10;
      setCountdown(10);
      countRef.current = setInterval(() => {
        count--;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(countRef.current);
          confirmPayment(res.data.payment_id);
        }
      }, 1000);
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur lors du paiement.');
    } finally {
      setPaying(false);
    }
  };

  const confirmPayment = async (paymentId) => {
    try {
      await api.post(`/patient/payments/${paymentId}/simulate-confirm`);
      setPayStatus('completed');
    } catch {
      setPayStatus('completed'); // Force en mode démo
    }
  };

  useEffect(() => () => clearInterval(countRef.current), []);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontFamily:"'Inter',sans-serif" }}>
      <p style={{ color: DS.outline }}>Chargement...</p>
    </div>
  );

  const fee = appointment?.fee || '0 XAF';
  const mt  = METHOD[method];

  return (
    <div style={{ minHeight:'100vh', background: DS.surfaceLow, fontFamily:"'Inter',sans-serif", display:'flex', flexDirection:'column', alignItems:'center', padding:'clamp(16px,4vw,32px)' }}>
      <div style={{ width:'100%', maxWidth:520 }}>

        {/* Progress */}
        <div style={{ display:'flex', alignItems:'center', marginBottom:28 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', flex: i < STEPS.length-1 ? 1 : 0 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <div style={{ width:34, height:34, borderRadius:'50%', background: i < step ? DS.primary : i===step ? DS.primary : DS.outlineVariant, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, transition:'all .3s' }}>
                  {i < step ? '✓' : i+1}
                </div>
                <span style={{ fontSize:11, color: i===step ? DS.primary : DS.outline, fontWeight: i===step ? 600 : 400 }}>{s}</span>
              </div>
              {i < STEPS.length-1 && (
                <div style={{ flex:1, height:2, background: i < step ? DS.primary : DS.outlineVariant, margin:'0 6px 18px', transition:'background .3s' }} />
              )}
            </div>
          ))}
        </div>

        {/* ── Étape 0 : Résumé ── */}
        {step === 0 && appointment && (
          <div style={{ background: DS.surface, borderRadius:16, padding:'clamp(20px,4vw,28px)', border:`1px solid ${DS.outlineVariant}` }}>
            <h2 style={{ fontSize:20, fontWeight:700, color: DS.onSurface, margin:'0 0 6px' }}>Résumé</h2>
            <p style={{ fontSize:13, color: DS.outline, margin:'0 0 20px' }}>
              {isConsultation ? 'Consultation immédiate' : 'Rendez-vous planifié'}
            </p>

            <div style={{ background: DS.surfaceLow, borderRadius:12, padding:16, marginBottom:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <div style={{ width:46, height:46, borderRadius:12, background: DS.surfaceContainer, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>👨‍⚕️</div>
                <div>
                  <p style={{ margin:0, fontWeight:700, fontSize:15, color: DS.onSurface }}>{appointment.doctor?.name}</p>
                  <p style={{ margin:0, fontSize:13, color: DS.primary }}>{appointment.doctor?.specialty}</p>
                </div>
              </div>
              {[
                { label: isConsultation ? '⚡ Type' : '📅 Date', value: isConsultation ? (appointment.type === 'video' ? 'Vidéo immédiate' : 'Message immédiat') : appointment.scheduled_at },
                { label:'🎥 Mode',   value: appointment.type === 'video' ? 'Téléconsultation vidéo' : appointment.type === 'message' ? 'Chat en direct' : 'En personne' },
                { label:'📝 Motif', value: appointment.reason || 'Non précisé' },
              ].map((item, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom: i < 2 ? `1px solid ${DS.outlineVariant}` : 'none' }}>
                  <span style={{ fontSize:13, color: DS.outline }}>{item.label}</span>
                  <span style={{ fontSize:13, fontWeight:600, color: DS.onSurface, maxWidth:'60%', textAlign:'right' }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background: DS.primary, borderRadius:12, padding:'14px 18px', marginBottom:20, color:'#fff' }}>
              <span style={{ fontSize:15, fontWeight:600 }}>Total à payer</span>
              <span style={{ fontSize:22, fontWeight:700 }}>{fee}</span>
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => navigate(-1)}
                style={{ flex:1, padding:'12px', border:`1.5px solid ${DS.outlineVariant}`, borderRadius:10, background: DS.surface, color: DS.onSurface, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                ← Retour
              </button>
              <button onClick={() => setStep(1)}
                style={{ flex:2, padding:'12px', background:`linear-gradient(90deg,${DS.secondary},#E8913A)`, color:'#fff', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', fontFamily:'inherit', fontSize:14 }}>
                Procéder au paiement →
              </button>
            </div>
          </div>
        )}

        {/* ── Étape 1 : Paiement ── */}
        {step === 1 && (
          <div style={{ background: DS.surface, borderRadius:16, padding:'clamp(20px,4vw,28px)', border:`1px solid ${DS.outlineVariant}` }}>
            <h2 style={{ fontSize:20, fontWeight:700, color: DS.onSurface, margin:'0 0 6px' }}>Méthode de paiement</h2>
            <p style={{ fontSize:13, color: DS.outline, margin:'0 0 22px' }}>Paiement sécurisé via Mobile Money</p>

            {error && (
              <div style={{ background:'#ffdad6', border:`1px solid ${DS.outlineVariant}`, color:'#ba1a1a', borderRadius:10, padding:'12px 16px', marginBottom:16, fontSize:14 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Méthodes */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
              {[
                { key:'mtn_momo',     emoji:'🟡', name:'MTN MoMo',     desc:'67x, 68x, 65x' },
                { key:'orange_money', emoji:'🟠', name:'Orange Money', desc:'69x, 655x' },
              ].map(m => (
                <button key={m.key} onClick={() => { setMethod(m.key); setPhone(''); }}
                  style={{ padding:'16px 12px', borderRadius:12, border:`2px solid ${method===m.key ? DS.primary : DS.outlineVariant}`, background: method===m.key ? DS.surfaceContainer : DS.surface, cursor:'pointer', fontFamily:'inherit', textAlign:'center', transition:'all .2s' }}>
                  <p style={{ fontSize:26, margin:'0 0 6px' }}>{m.emoji}</p>
                  <p style={{ fontSize:14, fontWeight:700, color: method===m.key ? DS.primary : DS.onSurface, margin:'0 0 3px' }}>{m.name}</p>
                  <p style={{ fontSize:11, color: DS.outline, margin:0 }}>{m.desc}</p>
                </button>
              ))}
            </div>

            {/* Numéro */}
            <div style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color: DS.onSurface, marginBottom:6 }}>
                Numéro {method === 'mtn_momo' ? 'MTN' : 'Orange'} à débiter
              </label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder={method === 'mtn_momo' ? '+237 67X XXX XXX' : '+237 69X XXX XXX'}
                style={{ width:'100%', border:`1.5px solid ${DS.outlineVariant}`, borderRadius:10, padding:'12px 14px', fontSize:15, fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}
              />
              <p style={{ fontSize:12, color: DS.outline, margin:'6px 0 0' }}>
                💡 Vous recevrez une notification USSD pour confirmer
              </p>
            </div>

            <div style={{ background: DS.surfaceLow, borderRadius:10, padding:'12px 16px', marginBottom:18, display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:13, color: DS.outline }}>Montant total</span>
              <span style={{ fontSize:17, fontWeight:700, color: DS.primary }}>{fee}</span>
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setStep(0)}
                style={{ flex:1, padding:'12px', border:`1.5px solid ${DS.outlineVariant}`, borderRadius:10, background: DS.surface, color: DS.onSurface, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                ← Retour
              </button>
              <button onClick={handlePay} disabled={paying || !phone.trim()}
                style={{ flex:2, padding:'12px', background: paying || !phone.trim() ? DS.outlineVariant : `linear-gradient(90deg,${DS.secondary},#E8913A)`, color:'#fff', border:'none', borderRadius:10, fontWeight:700, cursor: paying || !phone.trim() ? 'not-allowed' : 'pointer', fontFamily:'inherit', fontSize:14 }}>
                {paying ? '⏳ Traitement...' : `Payer ${fee}`}
              </button>
            </div>
          </div>
        )}

        {/* ── Étape 2 : Confirmation ── */}
        {step === 2 && (
          <div style={{ background: DS.surface, borderRadius:16, padding:'clamp(20px,4vw,36px)', border:`1px solid ${DS.outlineVariant}`, textAlign:'center' }}>

            {payStatus === 'completed' ? (
              <>
                <div style={{ width:72, height:72, borderRadius:'50%', background:'#e1f5ee', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px' }}>
                  <CheckCircle size={36} color={DS.primary} />
                </div>
                <h2 style={{ fontSize:22, fontWeight:700, color: DS.onSurface, margin:'0 0 8px' }}>Paiement confirmé !</h2>
                <p style={{ fontSize:14, color: DS.outline, margin:'0 0 20px' }}>
                  {isConsultation
                    ? 'Votre consultation est réservée. Le médecin va recevoir une notification.'
                    : 'Votre rendez-vous est confirmé et enregistré dans votre agenda.'}
                </p>
              </>
            ) : payStatus === 'failed' ? (
              <>
                <div style={{ width:72, height:72, borderRadius:'50%', background:'#ffdad6', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px', fontSize:36 }}>❌</div>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#ba1a1a', margin:'0 0 8px' }}>Paiement refusé</h2>
                <p style={{ fontSize:14, color: DS.outline, margin:'0 0 20px' }}>Le paiement a été annulé ou refusé.</p>
              </>
            ) : (
              <>
                {/* Countdown USSD */}
                <div style={{ width:72, height:72, borderRadius:'50%', background:'#fff8e7', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px', fontSize:36 }}>📱</div>
                <h2 style={{ fontSize:20, fontWeight:700, color: DS.onSurface, margin:'0 0 8px' }}>Notification USSD envoyée</h2>
                <p style={{ fontSize:13, color: DS.outline, margin:'0 0 4px' }}>Confirmez sur votre téléphone</p>
                <p style={{ fontSize:15, fontWeight:700, color: DS.primary, margin:'0 0 20px' }}>{phone}</p>
                <div style={{ background: DS.surfaceLow, borderRadius:14, padding:20, marginBottom:16 }}>
                  <p style={{ fontSize:13, color: DS.outline, margin:'0 0 10px' }}>Confirmation automatique dans</p>
                  <div style={{ fontSize:52, fontWeight:700, color: DS.primary, lineHeight:1 }}>{countdown}</div>
                  <p style={{ fontSize:12, color: DS.outline, margin:'8px 0 14px' }}>secondes</p>
                  <div style={{ height:4, background: DS.outlineVariant, borderRadius:999 }}>
                    <div style={{ height:'100%', background: DS.primary, borderRadius:999, width:`${(10-countdown)*10}%`, transition:'width 1s linear' }} />
                  </div>
                </div>
                <div style={{ background:'#fff8e7', borderRadius:10, padding:'10px 14px', marginBottom:16, fontSize:12, color:'#884b00', textAlign:'left', display:'flex', gap:8 }}>
                  <span>⚠️</span>
                  <span>En production, vous recevrez un vrai code USSD sur votre téléphone {method==='mtn_momo' ? 'MTN' : 'Orange'}.</span>
                </div>
              </>
            )}

            {/* Récap paiement */}
            {payStatus === 'completed' && (
              <div style={{ background: DS.surfaceLow, borderRadius:10, padding:14, marginBottom:20, textAlign:'left' }}>
                {[
                  { label:'Référence', value: paymentRef?.reference_id ? paymentRef.reference_id.slice(0,8).toUpperCase() : 'DOK-'+appointmentId+'-'+Date.now().toString().slice(-4) },
                  { label:'Méthode',   value: mt.icon + ' ' + mt.label },
                  { label:'Montant',   value: fee },
                  { label:'Statut',    value: '✅ Payé' },
                ].map((item,i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom: i<3 ? `1px solid ${DS.outlineVariant}` : 'none' }}>
                    <span style={{ fontSize:13, color: DS.outline }}>{item.label}</span>
                    <span style={{ fontSize:13, fontWeight:600, color: DS.onSurface }}>{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Boutons selon le type */}
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {payStatus === 'completed' && isConsultation && (
                <button onClick={() => navigate(`/consultation/waiting/${appointmentId}`)}
                  style={{ width:'100%', padding:'13px', background:`linear-gradient(90deg,${DS.secondary},#E8913A)`, color:'#fff', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', fontFamily:'inherit', fontSize:14 }}>
                  🚪 Entrer dans la salle d'attente →
                </button>
              )}
              {payStatus === 'completed' && !isConsultation && (
                <button onClick={() => navigate('/patient/rdv')}
                  style={{ width:'100%', padding:'13px', background: DS.primary, color:'#fff', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', fontFamily:'inherit', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  <Calendar size={16} /> Voir mes rendez-vous →
                </button>
              )}
              {payStatus === 'failed' && (
                <button onClick={() => setStep(1)}
                  style={{ width:'100%', padding:'13px', background: DS.primary, color:'#fff', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                  Réessayer
                </button>
              )}
              <button onClick={() => navigate('/patient/dashboard')}
                style={{ width:'100%', padding:'12px', border:`1.5px solid ${DS.outlineVariant}`, borderRadius:10, background: DS.surface, color: DS.onSurface, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                Retour au tableau de bord
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}