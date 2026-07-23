import { LogOut, X } from 'lucide-react';

const DS = {
  primary:'#016472', secondary:'#E8613A', surface:'#ffffff',
  outlineVariant:'#bec8cb', onSurface:'#111c2d', outline:'#6f797b',
};

export default function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={onCancel}>
      <div style={{ background: DS.surface, borderRadius:16, padding:32, width:'100%', maxWidth:380, position:'relative' }}
        onClick={e => e.stopPropagation()}>

        {/* Icône */}
        <div style={{ width:64, height:64, borderRadius:'50%', background:'#ffdad6', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
          <LogOut size={28} color="#ba1a1a" />
        </div>

        {/* Texte */}
        <h3 style={{ fontSize:18, fontWeight:700, color: DS.onSurface, textAlign:'center', margin:'0 0 8px', letterSpacing:'-0.01em' }}>
          Se déconnecter ?
        </h3>
        <p style={{ fontSize:14, color: DS.outline, textAlign:'center', margin:'0 0 28px', lineHeight:1.6 }}>
          Vous allez être déconnecté de votre espace Dokita. Vous pourrez vous reconnecter à tout moment.
        </p>

        {/* Boutons */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button onClick={onConfirm}
            style={{ width:'100%', padding:'13px', background:'#ba1a1a', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <LogOut size={16} /> Oui, me déconnecter
          </button>
          <button onClick={onCancel}
            style={{ width:'100%', padding:'13px', background:'transparent', color: DS.onSurface, border:`1px solid ${DS.outlineVariant}`, borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <X size={16} /> Annuler
          </button>
        </div>
      </div>
    </div>
  );
}