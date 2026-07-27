import { Link, useLocation } from 'react-router-dom';
import {
  Home, Calendar, Stethoscope, MessageSquare, User, CreditCard
} from 'lucide-react';

const PATIENT_NAV = [
  { path:'/patient/dashboard',  icon: Home,        label:'Accueil'  },
  { path:'/patient/rdv',        icon: Calendar,    label:'RDV'      },
  { path:'/patient/doctors',    icon: Stethoscope, label:'Médecins' },
  { path:'/patient/payments',   icon: CreditCard,  label:'Paiements'},
  { path:'/patient/profile',    icon: User,        label:'Profil'   },
];

const DOCTOR_NAV = [
  { path:'/doctor/dashboard',  icon: Home,        label:'Accueil'  },
  { path:'/doctor/agenda',     icon: Calendar,    label:'Agenda'   },
  { path:'/doctor/patients',   icon: Stethoscope, label:'Patients' },
  { path:'/doctor/payments',   icon: CreditCard,  label:'Paiements'},
  { path:'/doctor/profile',    icon: User,        label:'Profil'   },
];

export default function BottomNav({ role = 'patient' }) {
  const { pathname } = useLocation();
  const items = role === 'doctor' ? DOCTOR_NAV : PATIENT_NAV;

  return (
    <nav className="bottom-nav" aria-label="Navigation principale">
      {items.map(item => {
        const active = pathname === item.path || pathname.startsWith(item.path + '/');
        const Icon   = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display:'flex', flexDirection:'column', alignItems:'center',
              gap:2, textDecoration:'none', flex:1,
              padding:'6px 4px',
              WebkitTapHighlightColor:'transparent',
            }}>
            {/* Pill indicator */}
            <div style={{
              width: active ? 56 : 40,
              height: 32,
              borderRadius: 999,
              background: active ? 'var(--surface-container)' : 'transparent',
              display:'flex', alignItems:'center', justifyContent:'center',
              transition:'all 0.2s ease',
            }}>
              <Icon
                size={22}
                color={ active ? 'var(--primary)' : 'var(--outline)' }
                strokeWidth={ active ? 2.5 : 1.8 }
              />
            </div>
            <span style={{
              fontSize:10, fontWeight: active ? 600 : 400,
              color: active ? 'var(--primary)' : 'var(--outline)',
              letterSpacing:'0.01em',
              lineHeight:1,
            }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}