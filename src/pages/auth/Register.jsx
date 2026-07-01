import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../../redux/slices/authSlice';
import logo from '../../assets/logo.png';

const EyeIcon = ({ show, onClick }) => (
    <button type="button" onClick={onClick} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6f797b', padding: 0, display: 'flex' }}>
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

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', phone: '', role: 'patient' });
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = (e) => {
        dispatch(clearError());
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(registerUser(form));
        if (registerUser.fulfilled.match(result)) {
            const role = result.payload.user.role;
            if (role === 'patient') navigate('/patient/dashboard');
            if (role === 'doctor')  navigate('/doctor/dashboard');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>

            {/* Panneau gauche */}
            <div style={{ width: '42%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 48, background: 'linear-gradient(135deg, #016472 0%, #004e5a 100%)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, background: '#E8613A', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.15 }} />
                <Link to="/"><img src={logo} alt="Dokita" style={{ height: 44 }} /></Link>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: 34, fontWeight: 800, color: 'white', lineHeight: 1.25, marginBottom: 16, letterSpacing: '-0.02em' }}>Rejoignez la<br />communauté Dokita 🏥</h2>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>Des milliers de camerounais font déjà confiance à Dokita.</p>
                    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.12)' }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Pourquoi nous choisir ?</p>
                        {[
                            '✅ Médecins vérifiés et certifiés',
                            '✅ Consultation dès 5 minutes',
                            '✅ Paiement 100% sécurisé FCFA',
                            '✅ Dossier médical numérique',
                        ].map((t, i) => (
                            <p key={i} style={{ color: 'white', fontSize: 14, margin: '0 0 10px', fontWeight: 500 }}>{t}</p>
                        ))}
                    </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>© 2026 Dokita — Télémédecine Camerounaise</p>
            </div>

            {/* Panneau droit */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9ff', padding: '32px', overflowY: 'auto' }}>
                <div style={{ width: '100%', maxWidth: 440, padding: '20px 0' }}>
                    <h2 style={{ fontSize: 26, fontWeight: 800, color: '#111c2d', margin: '0 0 6px', letterSpacing: '-0.01em' }}>Créer mon compte</h2>
                    <p style={{ color: '#3f484b', fontSize: 14, marginBottom: 28 }}>Rejoignez Dokita en moins de 2 minutes</p>

                    {error && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Rôle */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                            {[
                                { val: 'patient', label: '🧑‍🤝‍🧑 Je suis patient' },
                                { val: 'doctor',  label: '👨‍⚕️ Je suis médecin' },
                            ].map((r) => (
                                <button key={r.val} type="button" onClick={() => setForm({ ...form, role: r.val })}
                                    style={{ padding: '12px', borderRadius: 12, border: `2px solid ${form.role === r.val ? '#016472' : '#dde3f0'}`, background: form.role === r.val ? '#e7eeff' : 'white', color: form.role === r.val ? '#016472' : '#3f484b', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                                    {r.label}
                                </button>
                            ))}
                        </div>

                        {/* Nom */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={labelStyle}>Nom complet</label>
                            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Jean Dupont" required style={inputStyle} />
                        </div>

                        {/* Email */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={labelStyle}>Email</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="jean@exemple.com" required style={inputStyle} />
                        </div>

                        {/* Téléphone */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={labelStyle}>Téléphone <span style={{ color: '#6f797b', fontWeight: 400 }}>(optionnel)</span></label>
                            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+237 6XX XXX XXX" style={inputStyle} />
                        </div>

                        {/* Mot de passe */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={labelStyle}>Mot de passe</label>
                            <div style={{ position: 'relative' }}>
                                <input type={showPwd ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required style={{ ...inputStyle, paddingRight: 44 }} />
                                <EyeIcon show={showPwd} onClick={() => setShowPwd(!showPwd)} />
                            </div>
                        </div>

                        {/* Confirmer */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={labelStyle}>Confirmer le mot de passe</label>
                            <div style={{ position: 'relative' }}>
                                <input type={showConfirm ? 'text' : 'password'} name="password_confirmation" value={form.password_confirmation} onChange={handleChange} placeholder="••••••••" required style={{ ...inputStyle, paddingRight: 44 }} />
                                <EyeIcon show={showConfirm} onClick={() => setShowConfirm(!showConfirm)} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            style={{ width: '100%', padding: '15px', background: 'linear-gradient(90deg, #E8613A 0%, #E8913A 100%)', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(232,97,58,0.35)', transition: 'transform 0.15s' }}
                            onMouseEnter={e => !loading && (e.target.style.transform = 'scale(1.01)')}
                            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                        >
                            {loading ? 'Création du compte...' : 'Créer mon compte gratuitement'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: 14, color: '#3f484b', marginTop: 24 }}>
                        Déjà un compte ?{' '}
                        <Link to="/login" style={{ color: '#016472', fontWeight: 700, textDecoration: 'none' }}>Se connecter</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#111c2d', marginBottom: 6 };
const inputStyle = { width: '100%', border: '1.5px solid #dde3f0', borderRadius: 12, padding: '13px 16px', fontSize: 14, background: 'white', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };

export default Register;