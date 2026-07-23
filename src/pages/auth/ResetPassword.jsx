import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import logo from '../../assets/logo.png';

const EyeIcon = ({ show, onClick }) => (
    <button type="button" onClick={onClick} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6f797b', padding: 0 }}>
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

const ResetPassword = () => {
    const [searchParams]          = useSearchParams();
    const navigate                = useNavigate();
    const [form, setForm]         = useState({ password: '', password_confirmation: '' });
    const [showPwd, setShowPwd]   = useState(false);
    const [showConf, setShowConf] = useState(false);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState('');
    const [success, setSuccess]   = useState(false);

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.password_confirmation) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/reset-password', {
                email,
                token,
                password:              form.password,
                password_confirmation: form.password_confirmation,
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9ff', padding: 20, fontFamily: "'Inter', sans-serif" }}>
            <div style={{ width: '100%', maxWidth: 420, background: 'white', borderRadius: 24, padding: 40, boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>

                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px' }}>
                        <img src={logo} alt="Dokita" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111c2d', margin: '0 0 6px' }}>Nouveau mot de passe</h1>
                    <p style={{ fontSize: 14, color: '#6f797b', margin: 0 }}>Choisissez un nouveau mot de passe sécurisé</p>
                </div>

                {success ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 20px' }}>✅</div>
                        <h3 style={{ fontWeight: 800, color: '#111c2d', margin: '0 0 8px' }}>Mot de passe modifié !</h3>
                        <p style={{ color: '#6f797b', fontSize: 14, margin: 0 }}>Redirection vers la connexion dans 3 secondes...</p>
                    </div>
                ) : (
                    <>
                        {(!token || !email) && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>
                                ⚠️ Lien invalide. Refaites une demande de réinitialisation.
                            </div>
                        )}
                        {error && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>
                                ⚠️ {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#111c2d', marginBottom: 6 }}>Nouveau mot de passe</label>
                                <div style={{ position: 'relative' }}>
                                    <input type={showPwd ? 'text' : 'password'} value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        placeholder="••••••••" required minLength={8}
                                        style={{ width: '100%', border: '1.5px solid #dde3f0', borderRadius: 12, padding: '13px 44px 13px 16px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                    <EyeIcon show={showPwd} onClick={() => setShowPwd(!showPwd)} />
                                </div>
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#111c2d', marginBottom: 6 }}>Confirmer le mot de passe</label>
                                <div style={{ position: 'relative' }}>
                                    <input type={showConf ? 'text' : 'password'} value={form.password_confirmation}
                                        onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
                                        placeholder="••••••••" required
                                        style={{ width: '100%', border: '1.5px solid #dde3f0', borderRadius: 12, padding: '13px 44px 13px 16px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                    <EyeIcon show={showConf} onClick={() => setShowConf(!showConf)} />
                                </div>
                            </div>

                            {/* Indicateur force mot de passe */}
                            {form.password && (
                                <div style={{ marginBottom: 20 }}>
                                    <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                                        {[1,2,3,4].map(i => {
                                            const strength = form.password.length >= 12 ? 4 : form.password.length >= 10 ? 3 : form.password.length >= 8 ? 2 : 1;
                                            return <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= strength ? (strength >= 3 ? '#22c55e' : strength === 2 ? '#f59e0b' : '#ef4444') : '#e7eeff' }} />;
                                        })}
                                    </div>
                                    <p style={{ fontSize: 12, color: '#6f797b', margin: 0 }}>
                                        {form.password.length < 8 ? '⚠️ Trop court' : form.password.length < 10 ? '🟡 Acceptable' : form.password.length < 12 ? '🟢 Bon' : '🔒 Excellent'}
                                    </p>
                                </div>
                            )}

                            <button type="submit" disabled={loading || !token || !email}
                                style={{ width: '100%', padding: '13px', background: 'linear-gradient(90deg, #E8613A, #E8913A)', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}>
                                {loading ? 'Modification...' : 'Modifier mon mot de passe'}
                            </button>
                        </form>
                        <p style={{ textAlign: 'center', fontSize: 14, color: '#6f797b', marginTop: 20 }}>
                            <Link to="/login" style={{ color: '#016472', fontWeight: 600, textDecoration: 'none' }}>← Retour à la connexion</Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;