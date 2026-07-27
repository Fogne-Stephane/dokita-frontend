import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, Download, ChevronRight, CreditCard } from 'lucide-react';
import api from '../../api/axios';

const DS = {
  primary:'#016472', secondary:'#E8613A', bg:'#f9f9ff',
  surface:'#ffffff', surfaceLow:'#f0f3ff', surfaceContainer:'#e7eeff',
  onSurface:'#111c2d', onSurfaceVariant:'#3f484b', outline:'#6f797b',
  outlineVariant:'#bec8cb',
};

const STATUS = {
  completed: { label:'Payé',      bg:'#e1f5ee', color:'#016472' },
  pending:   { label:'En cours',  bg:'#fff8e7', color:'#884b00' },
  failed:    { label:'Échoué',    bg:'#ffdad6', color:'#ba1a1a' },
};

const METHOD = {
  mtn_momo:     { label:'MTN MoMo',     icon:'🟡' },
  orange_money: { label:'Orange Money', icon:'🟠' },
};

export default function PatientPayments() {
  const navigate = useNavigate();
  const [payments, setPayments]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/patient/payments/history');
        setPayments(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

const total = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => {
        const amount = parseFloat(String(p.amount).replace(/[^0-9.]/g, '')) || 0;
        return sum + amount;
    }, 0);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300, fontFamily:'Inter,sans-serif' }}>
      <p style={{ color: DS.outline }}>Chargement...</p>
    </div>
  );

  return (
    <div style={{ fontFamily:'Inter,sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:700, color: DS.onSurface, margin:'0 0 4px', letterSpacing:'-0.02em' }}>
          Paiements & Reçus
        </h1>
        <p style={{ fontSize:14, color: DS.outline, margin:0 }}>Historique de vos transactions</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12, marginBottom:24 }}>
        {[
{ label:'Total dépensé', value: total.toLocaleString('fr') + ' XAF', icon:'💰', color: DS.primary },          { label:'Consultations',     value: payments.filter(p=>p.status==='completed').length, icon:'✅', color:'#016472' },
          { label:'En attente',        value: payments.filter(p=>p.status==='pending').length,   icon:'⏳', color:'#884b00' },
        ].map((s,i) => (
          <div key={i} style={{ background: DS.surface, borderRadius:12, padding:'16px', border:`1px solid ${DS.outlineVariant}` }}>
            <p style={{ fontSize:22, margin:'0 0 4px' }}>{s.icon}</p>
            <p style={{ fontSize:20, fontWeight:700, color: s.color, margin:'0 0 2px' }}>{s.value}</p>
            <p style={{ fontSize:12, color: DS.outline, margin:0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Liste des reçus */}
      {payments.length === 0 ? (
        <div style={{ textAlign:'center', padding:48, background: DS.surface, borderRadius:12, border:`1px solid ${DS.outlineVariant}` }}>
          <Receipt size={40} color={DS.outlineVariant} style={{ margin:'0 auto 12px' }} />
          <p style={{ color: DS.outline, fontWeight:600, margin:'0 0 8px' }}>Aucun paiement effectué</p>
          <p style={{ color: DS.outline, fontSize:14, margin:'0 0 20px' }}>Vos reçus apparaîtront ici après votre première consultation</p>
          <button onClick={() => navigate('/patient/doctors')}
            style={{ padding:'10px 22px', background:'linear-gradient(90deg,#E8613A,#E8913A)', color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
            Trouver un médecin
          </button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {payments.map(p => {
            const st = STATUS[p.status] || STATUS.pending;
            const mt = METHOD[p.method] || { label: p.method, icon:'💳' };
            const isOpen = selected === p.id;
            return (
              <div key={p.id} style={{ background: DS.surface, borderRadius:12, border:`1px solid ${isOpen ? DS.primary : DS.outlineVariant}`, overflow:'hidden', transition:'border-color .2s' }}>
                {/* Row principal */}
                <div onClick={() => setSelected(isOpen ? null : p.id)}
                  style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px', cursor:'pointer' }}>
                  {/* Icône */}
                  <div style={{ width:44, height:44, borderRadius:12, background: DS.surfaceContainer, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                    <Receipt size={22} color={DS.primary} />
                  </div>
                  {/* Infos */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ margin:'0 0 3px', fontWeight:600, fontSize:14, color: DS.onSurface }}>
                      Consultation — {p.doctor || 'Médecin'}
                    </p>
                    <p style={{ margin:0, fontSize:12, color: DS.outline }}>
                      {mt.icon} {mt.label} · {p.date}
                    </p>
                  </div>
                  {/* Montant */}
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <p style={{ margin:'0 0 4px', fontWeight:700, fontSize:15, color: DS.onSurface }}>{p.amount}</p>
                    <span style={{ background: st.bg, color: st.color, padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:600 }}>{st.label}</span>
                  </div>
                  <ChevronRight size={16} color={DS.outline} style={{ flexShrink:0, transform: isOpen ? 'rotate(90deg)' : 'none', transition:'transform .2s' }} />
                </div>

                {/* Détail dépliable */}
                {isOpen && (
                  <div style={{ padding:'0 20px 20px', borderTop:`1px solid ${DS.outlineVariant}`, paddingTop:16 }}>
                    <div style={{ background: DS.surfaceLow, borderRadius:10, padding:14, marginBottom:14 }}>
                      {[
                        { label:'Référence',         value: p.transaction_id || 'DOK-' + p.id },
                        { label:'Méthode',           value: mt.icon + ' ' + mt.label },
                        { label:'Montant',           value: p.amount },
                        { label:'Date',              value: p.date },
                        { label:'Médecin',           value: p.doctor || 'Médecin' },
                        { label:'Statut',            value: st.label },
                      ].map((item, i) => (
                        <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom: i < 5 ? `1px solid ${DS.outlineVariant}` : 'none' }}>
                          <span style={{ fontSize:13, color: DS.outline }}>{item.label}</span>
                          <span style={{ fontSize:13, fontWeight:600, color: DS.onSurface }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                    {p.status === 'completed' && (
                      <button style={{ width:'100%', padding:'11px', background: DS.primary, color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                        <Download size={16} /> Télécharger le reçu PDF
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bouton nouveau paiement */}
      <div style={{ marginTop:24, padding:20, background: DS.surface, borderRadius:12, border:`1px solid ${DS.outlineVariant}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#E8613A,#E8913A)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <CreditCard size={22} color="#fff" />
          </div>
          <div>
            <p style={{ margin:0, fontWeight:600, fontSize:14, color: DS.onSurface }}>Nouvelle consultation</p>
            <p style={{ margin:0, fontSize:12, color: DS.outline }}>Trouvez un médecin et payez en ligne</p>
          </div>
        </div>
        <button onClick={() => navigate('/patient/doctors')}
          style={{ padding:'10px 18px', background:'linear-gradient(90deg,#E8613A,#E8913A)', color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', fontSize:13 }}>
          Consulter →
        </button>
      </div>
    </div>
  );
}