import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '../../redux/slices/authSlice';
import { useSessionTimeout } from '../../hooks/useSessionTimeout';
import LogoutModal from '../ui/LogoutModal';
import NotificationPanel from '../doctor/NotificationPanel';
import BottomNav from './BottomNav';
import logo from '../../assets/logo.png';
import {
  Home, Calendar, Users, FileText, MessageSquare, CreditCard,
  User, ChevronLeft, ChevronRight, Bell, LogOut, Circle
} from 'lucide-react';

const NAV_ITEMS = [
  { path:'/doctor/dashboard',     icon: Home,          label:'Accueil' },
  { path:'/doctor/agenda',        icon: Calendar,      label:'Agenda' },
  { path:'/doctor/patients',      icon: Users,         label:'Mes Patients' },
  { path:'/doctor/prescriptions', icon: FileText,      label:'Prescriptions' },
  { path:'/doctor/payments',      icon: CreditCard,    label:'Paiements' },
  { path:'/doctor/profile',       icon: User,          label:'Mon Profil' },
];

export default function DoctorLayout({ children }) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { user }  = useSelector(s => s.auth);
  const [open, setOpen]             = useState(true);
  const [showLogout, setShowLogout] = useState(false);

  useSessionTimeout();

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate('/login');
  };

  const currentLabel = NAV_ITEMS.find(n => n.path === location.pathname)?.label || 'Dashboard';

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--background)', fontFamily:"'Inter',sans-serif" }}>

      {/* ── SIDEBAR ── */}
<aside
  className={`sidebar${open ? '' : ' closed'}`}
  style={{
    // Supprime width d'ici — géré par CSS
    flexShrink:0,
    background:'var(--surface)',
    borderRight:'1px solid var(--outline-variant)',
    display:'flex', flexDirection:'column',
    transition:'width 0.25s ease',
    position:'fixed', top:0, left:0,
    height:'100vh', zIndex:40,
    overflow:'hidden',
  }}>

        {/* Logo */}
        <div style={{ height:64, display:'flex', alignItems:'center', justifyContent: open ? 'space-between' : 'center', padding: open ? '0 16px' : '0 12px', borderBottom:'1px solid var(--outline-variant)', flexShrink:0 }}>
          {open && (
            <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none' }}>
              <div style={{ width:32, height:32, borderRadius:'50%', overflow:'hidden' }}>
                <img src={logo} alt="Dokita" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
              <span style={{ fontSize:18, fontWeight:700, color:'var(--primary)' }}>Dokita</span>
            </Link>
          )}
          <button onClick={() => setOpen(!open)}
            style={{ width:32, height:32, borderRadius:8, border:'1px solid var(--outline-variant)', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--outline)' }}>
            {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Badge médecin */}
        {open && (
          <div style={{ margin:'12px 8px 4px', background:'var(--surface-low)', borderRadius:8, padding:'10px 12px', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,var(--secondary),#E8913A)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:14, flexShrink:0 }}>
              {user?.name?.[0]?.toUpperCase() || 'D'}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ margin:0, fontSize:13, fontWeight:600, color:'var(--on-surface)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                Dr. {user?.name}
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                <Circle size={8} fill="#22c55e" color="#22c55e" />
                <p style={{ margin:0, fontSize:11, color:'#16a34a' }}>Disponible</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex:1, padding:'8px 8px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            const Icon   = item.icon;
            return (
              <Link key={item.path} to={item.path}
                style={{
                  display:'flex', alignItems:'center', gap:12,
                  padding: open ? '10px 12px' : '10px',
                  justifyContent: open ? 'flex-start' : 'center',
                  borderRadius:8, textDecoration:'none',
                  background: active ? 'var(--surface-container)' : 'transparent',
                  color: active ? 'var(--primary)' : 'var(--on-surface-variant)',
                  fontWeight: active ? 600 : 400, fontSize:14,
                  transition:'all 0.15s', whiteSpace:'nowrap',
                }}
                onMouseEnter={e => !active && (e.currentTarget.style.background = 'var(--surface-low)')}
                onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
                title={!open ? item.label : ''}>
                <Icon size={20} style={{ flexShrink:0 }} />
                {open && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding:'12px 8px', borderTop:'1px solid var(--outline-variant)', flexShrink:0 }}>
          <button onClick={() => setShowLogout(true)}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding: open ? '10px 12px' : '10px', justifyContent: open ? 'flex-start' : 'center', borderRadius:8, border:'none', background:'transparent', color:'var(--error)', cursor:'pointer', fontFamily:'inherit', fontSize:14, fontWeight:500, transition:'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--error-container)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <LogOut size={20} style={{ flexShrink:0 }} />
            {open && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* ── CONTENU ── */}
<div className={`main-content${open ? '' : ' sidebar-closed'}`}
  style={{
    flex:1,
    display:'flex', flexDirection:'column',
    minHeight:'100vh',
  }}>       <header style={{
  position:'sticky', top:0, zIndex:30,
  background:'var(--surface)',
  borderBottom:'1px solid var(--outline-variant)',
  height: 'var(--header-h)',
  display:'flex', alignItems:'center',
  justifyContent:'space-between',
  padding:'0 clamp(12px, 3vw, 24px)',
}}>
  <div>
    <p style={{ fontSize:11, fontWeight:600, color:'var(--outline)', margin:0, textTransform:'uppercase', letterSpacing:'0.08em' }}>
      Espace Medecin
    </p>
    <h1 style={{ fontSize:'clamp(15px,2.5vw,18px)', fontWeight:700, color:'var(--primary)', margin:0 }}>
      {currentLabel}
    </h1>
  </div>
  <div style={{ display:'flex', alignItems:'center', gap:'clamp(8px,2vw,12px)' }}>
    {/* Notification — cachée sur très petit écran */}
    <NotificationPanel />
    {/* Avatar — version compacte sur mobile */}
    <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--surface-low)', padding:'6px clamp(8px,2vw,14px) 6px 6px', borderRadius:8 }}>
      <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,var(--primary),#2e7d8c)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:13, flexShrink:0 }}>
        {user?.name?.[0]?.toUpperCase() || 'P'}
      </div>
      {/* Nom caché sur mobile */}
      <div className="hide-mobile">
        <p style={{ margin:0, fontSize:13, fontWeight:600, color:'var(--on-surface)', lineHeight:1.2 }}>{user?.name}</p>
        <p style={{ margin:0, fontSize:11, color:'var(--outline)', lineHeight:1.2 }}>Patient</p>
      </div>
    </div>
  </div>
</header>
        <main style={{
  flex:1,
  padding:'clamp(12px, 3vw, 24px)',
}}>
          {children}
        </main>
      </div>

      <BottomNav role="doctor" />

      {showLogout && <LogoutModal onConfirm={handleLogout} onCancel={() => setShowLogout(false)} />}
    </div>
  );
}