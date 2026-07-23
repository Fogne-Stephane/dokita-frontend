import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import logo from '../../assets/logo.png';

const ForgotPassword = () => {
    const [email, setEmail]     = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError]     = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/forgot-password', { email });
            setSuccess(true);
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
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111c2d', margin: '0 0 6px' }}>Mot de passe oublié ?</h1>
                    <p style={{ fontSize: 14, color: '#6f797b', margin: 0 }}>Entrez votre email pour recevoir un lien de réinitialisation</p>
                </div>

                {success ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 20px' }}>✅</div>
                        <h3 style={{ fontWeight: 800, color: '#111c2d', margin: '0 0 8px' }}>Email envoyé !</h3>
                        <p style={{ color: '#6f797b', fontSize: 14, margin: '0 0 24px' }}>
                            Vérifiez votre boîte mail et cliquez sur le lien pour réinitialiser votre mot de passe.
                        </p>
                        <Link to="/login" style={{ display: 'block', padding: '13px', background: '#016472', color: 'white', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                            Retour à la connexion
                        </Link>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>
                                ⚠️ {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#111c2d', marginBottom: 6 }}>Adresse email</label>
                                <input
                                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="jean@exemple.com" required
                                    style={{ width: '100%', border: '1.5px solid #dde3f0', borderRadius: 12, padding: '13px 16px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                            <button type="submit" disabled={loading}
                                style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #016472, #004e5a)', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}>
                                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
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

export default ForgotPassword;