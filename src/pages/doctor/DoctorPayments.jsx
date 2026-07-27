import { useState, useEffect } from 'react';
import { Receipt, ChevronRight } from 'lucide-react';
import api from '../../api/axios';

const DS = {
  primary:'#016472', secondary:'#E8613A', surface:'#ffffff',
  surfaceLow:'#f0f3ff', surfaceContainer:'#e7eeff',
  onSurface:'#111c2d', outline:'#6f797b', outlineVariant:'#bec8cb',
};

const STATUS = {
  completed: { label:'Reçu',      bg:'#e1f5ee', color:'#016472' },
  pending:   { label:'En cours',  bg:'#fff8e7', color:'#884b00' },
  failed:    { label:'Échoué',    bg:'#ffdad6', color:'#ba1a1a' },
};

const METHOD = {
  mtn_momo:     { label:'MTN MoMo',     icon:'🟡' },
  orange_money: { label:'Orange Money', icon:'🟠' },
};

export default function DoctorPayments() {
  const [payments, setPayments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/doctor/payments')
      .then(res => setPayments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => {
      const n = parseFloat(String(p.amount).replace(/[^0-9.]/g, '')) || 0;
      return sum + n;
    }, 0);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300, fontFamily:"'Inter',sans-serif" }}>
      <p style={{ color: DS.outline }}>Chargement...</p>
    </div>
  );

  return (
    <div style={{ fontFamily:"'Inter',sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:'clamp(18px,3vw,24px)', fontWeight:700, color: DS.onSurface, margin:'0 0 4px', letterSpacing:'-0.02em' }}>
          Revenus & Paiements
        </h1>
        <p style={{ fontSize:14, color: DS.outline, margin:0 }}>Paiements reçus de vos patients</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:24 }}>
        {[
          { label:'Total reçu',         value: total.toLocaleString('fr') + ' XAF', icon:'💰', color: DS.primary },
          { label:'Consultations payées', value: payments.filter(p=>p.status==='completed').length, icon:'✅', color:'#16a34a' },
          { label:'En attente',          value: payments.filter(p=>p.status==='pending').length,   icon:'⏳', color:'#884b00' },
        ].map((s,i) => (
          <div key={i} style={{ background: DS.surface, borderRadius:12, padding:16, border:`1px solid ${DS.outlineVariant}` }}>
            <p style={{ fontSize:22, margin:'0 0 4px' }}>{s.icon}</p>
            <p style={{ fontSize:20, fontWeight:700, color: s.color, margin:'0 0 2px' }}>{s.value}</p>
            <p style={{ fontSize:12, color: DS.outline, margin:0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Liste */}
      {payments.length === 0 ? (
        <div style={{ textAlign:'center', padding:48, background: DS.surface, borderRadius:12, border:`1px solid ${DS.outlineVariant}` }}>
          <Receipt size={40} color={DS.outlineVariant} style={{ margin:'0 auto 12px' }}/>
          <p style={{ color: DS.outline, fontWeight:600 }}>Aucun paiement reçu</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {payments.map(p => {
            const st = STATUS[p.status] || STATUS.pending;
            const mt = METHOD[p.method] || { label: p.method, icon:'💳' };
            const isOpen = selected === p.id;
            return (
              <div key={p.id} style={{ background: DS.surface, borderRadius:12, border:`1px solid ${isOpen ? DS.primary : DS.outlineVariant}`, overflow:'hidden', transition:'border-color .2s' }}>
                <div onClick={() => setSelected(isOpen ? null : p.id)}
                  style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', cursor:'pointer' }}>
                  <div style={{ width:42, height:42, borderRadius:10, background: DS.surfaceContainer, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Receipt size={20} color={DS.primary}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ margin:'0 0 3px', fontWeight:600, fontSize:14, color: DS.onSurface }}>
                      {p.patient}
                    </p>
                    <p style={{ margin:0, fontSize:12, color: DS.outline }}>
                      {mt.icon} {mt.label} · {p.date}
                    </p>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <p style={{ margin:'0 0 4px', fontWeight:700, fontSize:15, color: DS.onSurface }}>{p.amount}</p>
                    <span style={{ background: st.bg, color: st.color, padding:'2px 8px', borderRadius:999, fontSize:11, fontWeight:600 }}>{st.label}</span>
                  </div>
                  <ChevronRight size={16} color={DS.outline} style={{ flexShrink:0, transform: isOpen ? 'rotate(90deg)' : 'none', transition:'transform .2s' }}/>
                </div>
                {isOpen && (
                  <div style={{ padding:'0 18px 16px', borderTop:`1px solid ${DS.outlineVariant}`, paddingTop:14 }}>
                    <div style={{ background: DS.surfaceLow, borderRadius:10, padding:14 }}>
                      {[
                        { label:'Référence',  value: p.transaction_id || 'DOK-' + p.id },
                        { label:'Patient',    value: p.patient },
                        { label:'Méthode',   value: mt.icon + ' ' + mt.label },
                        { label:'Montant',   value: p.amount },
                        { label:'Date',      value: p.date },
                        { label:'Statut',    value: st.label },
                      ].map((item, i) => (
                        <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom: i < 5 ? `1px solid ${DS.outlineVariant}` : 'none' }}>
                          <span style={{ fontSize:13, color: DS.outline }}>{item.label}</span>
                          <span style={{ fontSize:13, fontWeight:600, color: DS.onSurface }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}