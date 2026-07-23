import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Users, MessageSquare, User } from 'lucide-react';

const PATIENT_NAV = [
  { path:'/patient/dashboard',    icon: Home,          label:'Accueil' },
  { path:'/patient/appointments', icon: Calendar,      label:'RDV' },
  { path:'/patient/doctors',      icon: Users,         label:'Médecins' },
  { path:'/patient/messages',     icon: MessageSquare, label:'Messages' },
  { path:'/patient/profile',      icon: User,          label:'Profil' },
];

const DOCTOR_NAV = [
  { path:'/doctor/dashboard',    icon: Home,          label:'Accueil' },
  { path:'/doctor/agenda',       icon: Calendar,      label:'Agenda' },
  { path:'/doctor/patients',     icon: Users,         label:'Patients' },
  { path:'/doctor/messages',     icon: MessageSquare, label:'Messages' },
  { path:'/doctor/profile',      icon: User,          label:'Profil' },
];

export default function BottomNav({ role = 'patient' }) {
  const location = useLocation();
  const items = role === 'doctor' ? DOCTOR_NAV : PATIENT_NAV;

  return (
    <nav className="bottom-nav">
      {items.map(item => {
        const active = location.pathname === item.path;
        const Icon   = item.icon;
        return (
          <Link key={item.path} to={item.path}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, textDecoration:'none', flex:1, padding:'8px 4px' }}>
            <div style={{ width:32, height:32, borderRadius:8, background: active ? 'var(--surface-container)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'background .2s' }}>
              <Icon size={20} color={ active ? 'var(--primary)' : 'var(--outline)' } />
            </div>
            <span style={{ fontSize:11, fontWeight: active ? 600 : 400, color: active ? 'var(--primary)' : 'var(--outline)' }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}