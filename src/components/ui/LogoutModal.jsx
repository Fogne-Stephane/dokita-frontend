import { LogOut, X } from 'lucide-react';

export default function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(16px,4vw,24px)', WebkitTapHighlightColor:'transparent' }}
      onClick={onCancel}>
      <div
        style={{ background:'var(--surface)', borderRadius:'var(--r-xl)', padding:'clamp(20px,5vw,32px)', width:'100%', maxWidth:360, position:'relative' }}
        onClick={e => e.stopPropagation()}>

        <div style={{ width:60, height:60, borderRadius:'50%', background:'var(--error-container)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
          <LogOut size={26} color="var(--error)" />
        </div>

        <h3 style={{ fontSize:'clamp(16px,3vw,18px)', fontWeight:700, color:'var(--on-surface)', textAlign:'center', margin:'0 0 8px' }}>
          Se déconnecter ?
        </h3>
        <p style={{ fontSize:14, color:'var(--outline)', textAlign:'center', margin:'0 0 24px', lineHeight:1.5 }}>
          Vous allez être déconnecté de votre espace Dokita.
        </p>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button
            onClick={onConfirm}
            className="btn btn-full"
            style={{ background:'var(--error)', color:'#fff', border:'none', borderRadius:'var(--r-md)', padding:'13px', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <LogOut size={16} /> Oui, me déconnecter
          </button>
          <button
            onClick={onCancel}
            style={{ width:'100%', padding:'13px', background:'transparent', color:'var(--on-surface)', border:'1.5px solid var(--outline-variant)', borderRadius:'var(--r-md)', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <X size={16} /> Annuler
          </button>
        </div>
      </div>
    </div>
  );
}