import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { loginUser, clearError } from '../../redux/slices/authSlice';
import logo from '../../assets/logo.png';

const EyeIcon = ({ show, onClick }) => (
    <button type="button" onClick={onClick} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#6f797b', padding:0, display:'flex' }}>
        {show ? (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
        ) : (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        )}
    </button>
);

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const timedOut = searchParams.get('reason') === 'timeout';
    const { loading, error } = useSelector(s => s.auth);
    const [form, setForm] = useState({ email:'', password:'' });
    const [showPassword, setShowPassword] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useState(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleChange = (e) => {
        dispatch(clearError());
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(loginUser(form));
        if (loginUser.fulfilled.match(result)) {
            const role = result.payload.user.role;
            if (role === 'patient') navigate('/patient/dashboard');
            if (role === 'doctor')  navigate('/doctor/dashboard');
            if (role === 'admin')   navigate('/admin/dashboard');
        }
    };

    return (
        <div style={{ minHeight:'100vh', display:'flex', flexDirection: isMobile ? 'column' : 'row', fontFamily:"'Inter',sans-serif" }}>

            {/* ── Panneau gauche / Header mobile ── */}
            <div style={{
                width: isMobile ? '100%' : '48%',
                minHeight: isMobile ? 'auto' : '100vh',
                padding: isMobile ? '28px 24px' : 48,
                background:'linear-gradient(135deg, #016472 0%, #004e5a 100%)',
                display:'flex', flexDirection:'column',
                justifyContent: isMobile ? 'center' : 'space-between',
                position:'relative', overflow:'hidden',
            }}>
                <div style={{ position:'absolute', top:-80, right:-80, width:250, height:250, background:'#E8613A', borderRadius:'50%', filter:'blur(80px)', opacity:0.15, pointerEvents:'none' }} />

                {/* Logo */}
                <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:10, textDecoration:'none', marginBottom: isMobile ? 0 : 0 }}>
                    <img src={logo} alt="Dokita" style={{ height: isMobile ? 36 : 44 }} />
                </Link>

                {/* Texte — caché sur mobile */}
                {!isMobile && (
                    <div style={{ position:'relative', zIndex:1 }}>
                        <h2 style={{ fontSize:'clamp(26px,3vw,36px)', fontWeight:800, color:'white', lineHeight:1.25, marginBottom:16, letterSpacing:'-0.02em' }}>
                            Bon retour sur<br />Dokita 👋
                        </h2>
                        <p style={{ color:'rgba(255,255,255,0.75)', fontSize:15, marginBottom:32, lineHeight:1.6 }}>
                            Accédez à vos consultations, dossiers médicaux et bien plus.
                        </p>
                        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                            {[
                                { icon:'🎥', text:'Téléconsultation vidéo HD' },
                                { icon:'📋', text:'Ordonnances numériques' },
                                { icon:'💳', text:'Paiement Orange Money & MTN' },
                            ].map((f,i) => (
                                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(255,255,255,0.1)', borderRadius:12, padding:'12px 16px' }}>
                                    <span style={{ fontSize:20 }}>{f.icon}</span>
                                    <span style={{ color:'white', fontSize:14, fontWeight:500 }}>{f.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!isMobile && (
                    <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12 }}>© 2026 Dokita — Télémédecine Camerounaise</p>
                )}
            </div>

            {/* ── Panneau droit / Formulaire ── */}
            <div style={{
                flex:1,
                display:'flex', alignItems:'center', justifyContent:'center',
                background:'#f9f9ff',
                padding: isMobile ? '28px 20px 40px' : 32,
                overflowY:'auto',
            }}>
                <div style={{ width:'100%', maxWidth:420 }}>
                    <h2 style={{ fontSize:'clamp(20px,3vw,26px)', fontWeight:800, color:'#111c2d', margin:'0 0 6px', letterSpacing:'-0.01em' }}>
                        Connexion
                    </h2>
                    <p style={{ color:'#3f484b', fontSize:14, marginBottom:24 }}>
                        Connectez-vous à votre espace Dokita
                    </p>

                    {timedOut && (
                        <div style={{ background:'#fff8e7', border:'1px solid #f59e0b', color:'#884b00', borderRadius:10, padding:'12px 16px', marginBottom:16, fontSize:14, display:'flex', alignItems:'center', gap:8 }}>
                            ⏰ Session expirée après 30 minutes d'inactivité.
                        </div>
                    )}

                    {error && (
                        <div style={{ background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', borderRadius:10, padding:'12px 16px', marginBottom:20, fontSize:14 }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                        <div>
                            <label style={lbl}>Email</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange}
                                placeholder="jean@exemple.com" required style={inp}
                                onFocus={e => e.target.style.borderColor='#016472'}
                                onBlur={e => e.target.style.borderColor='#dde3f0'}
                            />
                        </div>
                        <div>
                            <label style={lbl}>Mot de passe</label>
                            <div style={{ position:'relative' }}>
                                <input type={showPassword ? 'text' : 'password'} name="password"
                                    value={form.password} onChange={handleChange}
                                    placeholder="••••••••" required style={{ ...inp, paddingRight:44 }}
                                    onFocus={e => e.target.style.borderColor='#016472'}
                                    onBlur={e => e.target.style.borderColor='#dde3f0'}
                                />
                                <EyeIcon show={showPassword} onClick={() => setShowPassword(!showPassword)} />
                            </div>
                        </div>
                        <div style={{ textAlign:'right', marginTop:-8 }}>
                            <Link to="/forgot-password" style={{ fontSize:13, color:'#016472', fontWeight:600, textDecoration:'none' }}>
                                Mot de passe oublié ?
                            </Link>
                        </div>
                        <button type="submit" disabled={loading}
                            style={{ width:'100%', padding:'clamp(12px,2vw,15px)', background:'linear-gradient(135deg,#016472,#004e5a)', color:'white', border:'none', borderRadius:12, fontSize:'clamp(14px,2vw,15px)', fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, fontFamily:'inherit', transition:'transform 0.15s, opacity 0.15s', marginTop:4 }}
                            onMouseEnter={e => !loading && (e.currentTarget.style.transform='scale(1.01)')}
                            onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                        >
                            {loading ? 'Connexion en cours...' : 'Se connecter'}
                        </button>
                    </form>

                    <div style={{ display:'flex', alignItems:'center', gap:12, margin:'24px 0' }}>
                        <div style={{ flex:1, height:1, background:'#dde3f0' }} />
                        <span style={{ fontSize:13, color:'#6f797b' }}>ou</span>
                        <div style={{ flex:1, height:1, background:'#dde3f0' }} />
                    </div>

                    <p style={{ textAlign:'center', fontSize:14, color:'#3f484b', margin:0 }}>
                        Pas encore de compte ?{' '}
                        <Link to="/register" style={{ color:'#016472', fontWeight:700, textDecoration:'none' }}>
                            S'inscrire gratuitement
                        </Link>
                    </p>

                    {isMobile && (
                        <p style={{ textAlign:'center', fontSize:11, color:'#9ca3af', marginTop:32 }}>
                            © 2026 Dokita — Télémédecine Camerounaise
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const lbl = { display:'block', fontSize:13, fontWeight:600, color:'#111c2d', marginBottom:6 };
const inp = { width:'100%', border:'1.5px solid #dde3f0', borderRadius:12, padding:'13px 16px', fontSize:14, background:'white', outline:'none', boxSizing:'border-box', fontFamily:'inherit', transition:'border-color 0.2s' };

export default Login;