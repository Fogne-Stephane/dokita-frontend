import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import logo from '../assets/logo.png';

// Hook pour détecter si un élément est visible
const useVisible = (ref) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.15 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return visible;
};

// Composant section animée slide-down
const SlideSection = ({ children, className }) => {
    const ref = useRef(null);
    const visible = useVisible(ref);
    return (
        <div ref={ref} className={className} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
            {children}
        </div>
    );
};

const Landing = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#f9f9ff', color: '#111c2d', overflowX: 'hidden' }}>

            {/* ── NAVBAR ── */}
            <header style={{
                position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 50,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0 24px', height: '60px',
                background: 'white',
                boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.1)' : '0 1px 4px rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.3s ease',
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                    <img src={logo} alt="Dokita" style={{ height: 40, width: 'auto' }} />
                </Link>
                <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
                    <button onClick={() => scrollTo('features')} style={navLinkStyle}>Fonctionnalités</button>
                    <button onClick={() => scrollTo('how')} style={navLinkStyle}>Comment ça marche</button>
                    <Link to="/login" style={btnOutlineStyle}>Se connecter</Link>
                    <Link to="/register" style={btnAccentStyle}>S'inscrire</Link>
                </nav>
            </header>

            <main style={{ paddingTop: 60 }}>

                {/* ── HERO ── */}
                <section style={{ background: 'linear-gradient(135deg, #016472 0%, #004e5a 100%)', padding: '80px 32px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, background: '#E8613A', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.15 }} />
                    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
                        {/* Texte */}
                        <div style={{ color: 'white' }}>
                            <span style={{ display: 'inline-block', background: '#ab3511', padding: '4px 14px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>
                                Santé pour tous au Cameroun
                            </span>
                            {/* TITRE DOKITA STYLE LOGO */}
                            <div style={{ marginBottom: 16 }}>
                              <img src={logo} alt="Dokita" style={{ height: 70, marginBottom: 8 }} />
                                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
                                    AFRICAN TELEMEDICINE PLATFORM
                                </p>
                            </div>
                            <h2 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>
                                La médecine de pointe,<br />partout, pour tous.
                            </h2>
                            <p style={{ fontSize: 17, opacity: 0.88, maxWidth: 460, lineHeight: 1.7, marginBottom: 28 }}>
                                Consultez les meilleurs médecins du Cameroun depuis votre canapé. Rapide, sécurisé et accessible à Douala, Yaoundé et au-delà.
                            </p>
                            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
                                <Link to="/register" style={{ ...btnAccentStyle, padding: '14px 28px', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                    Prendre RDV maintenant →
                                </Link>
                                <button onClick={() => scrollTo('how')} style={{ padding: '14px 28px', fontSize: 15, fontWeight: 600, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 12, color: 'white', cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'background 0.2s' }}
                                    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
                                    onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                >
                                    Comment ça marche
                                </button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0.8 }}>
                                {['D','M','A','K'].map((l, i) => (
                                    <div key={i} style={{ width: 34, height: 34, borderRadius: '50%', background: '#2e7d8c', border: '2px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13, marginLeft: i > 0 ? -10 : 0 }}>{l}</div>
                                ))}
                                <span style={{ fontSize: 13, marginLeft: 8 }}>+500 médecins certifiés</span>
                            </div>
                        </div>

                        {/* Carte flottante */}
                        <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24, padding: 28 }}>
                            {[
                                { icon: '👨‍⚕️', name: 'Dr. Kamga Pierre', spec: 'Cardiologue', available: true },
                                { icon: '👩‍⚕️', name: 'Dr. Mballa Sophie', spec: 'Pédiatre', available: true },
                                { icon: '👨‍⚕️', name: 'Dr. Fongang Luc', spec: 'Généraliste', available: false },
                            ].map((d, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: '12px 16px', marginBottom: i < 2 ? 12 : 0 }}>
                                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: i === 1 ? '#E8613A' : '#2e7d8c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{d.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ color: 'white', fontWeight: 600, fontSize: 13, margin: 0 }}>{d.name}</p>
                                        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, margin: 0 }}>{d.spec}</p>
                                    </div>
                                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.available ? '#4ade80' : '#94a3b8' }} />
                                </div>
                            ))}
                            <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontSize: 22 }}>🔒</span>
                                <div>
                                    <p style={{ color: 'white', fontWeight: 600, fontSize: 13, margin: 0 }}>100% Sécurisé</p>
                                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, margin: 0 }}>Données cryptées end-to-end</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── STATS ── */}
                <SlideSection style={{ padding: '40px 32px', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }}>
                        {[
                            { val: '+500', label: 'Médecins certifiés' },
                            { val: '+10k', label: 'Patients satisfaits' },
                            { val: '24/7', label: 'Disponibilité' },
                            { val: '5 min', label: 'Délai moyen RDV' },
                        ].map((s, i) => (
                            <div key={i}>
                                <p style={{ fontSize: 36, fontWeight: 800, color: '#016472', margin: 0 }}>{s.val}</p>
                                <p style={{ fontSize: 13, color: '#3f484b', marginTop: 4 }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </SlideSection>

                {/* ── FEATURES ── */}
                <section id="features" style={{ padding: '72px 32px', background: '#f0f3ff' }}>
                    <SlideSection>
                        <div style={{ textAlign: 'center', marginBottom: 48 }}>
                            <h3 style={{ fontSize: 32, fontWeight: 800, color: '#016472', margin: 0, letterSpacing: '-0.02em' }}>Une suite complète d'outils de santé</h3>
                            <p style={{ color: '#3f484b', marginTop: 12, fontSize: 16 }}>Tout ce dont vous avez besoin en un seul endroit.</p>
                        </div>
                    </SlideSection>
                    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                        {[
                            { icon: '🎥', title: 'Téléconsultation', desc: 'Consultez par vidéo sans vous déplacer. Évitez les embouteillages de Douala.' },
                            { icon: '📋', title: 'Ordonnances numériques', desc: 'Recevez vos ordonnances sur mobile, acceptées dans toutes les pharmacies partenaires.' },
                            { icon: '🤖', title: 'Dokita AI', desc: 'Posez vos questions à notre IA médicale entraînée sur des protocoles rigoureux.' },
                            { icon: '💳', title: 'Mobile Money', desc: 'Payez via Orange Money ou MTN MoMo en toute sécurité, en FCFA.' },
                            { icon: '🗂️', title: 'Dossier médical', desc: 'Accédez à tout votre historique médical, analyses et ordonnances.' },
                            { icon: '💬', title: 'Messagerie sécurisée', desc: 'Échangez avec votre médecin en temps réel, même après la consultation.' },
                        ].map((f, i) => (
                            <SlideSection key={i} style={{
                                background: 'white', padding: 24, borderRadius: 20,
                                border: '1px solid #dde3f0',
                                transition: 'box-shadow 0.25s, transform 0.25s',
                                cursor: 'default',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(1,100,114,0.12)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <div style={{ width: 52, height: 52, background: '#e7eeff', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>{f.icon}</div>
                                <h4 style={{ fontSize: 17, fontWeight: 700, color: '#111c2d', margin: '0 0 8px' }}>{f.title}</h4>
                                <p style={{ fontSize: 14, color: '#3f484b', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                            </SlideSection>
                        ))}
                    </div>
                </section>

                {/* ── COMMENT ÇA MARCHE ── */}
                <section id="how" style={{ padding: '72px 32px', background: 'white' }}>
                    <div style={{ maxWidth: 700, margin: '0 auto' }}>
                        <SlideSection>
                            <h3 style={{ fontSize: 32, fontWeight: 800, color: '#016472', marginBottom: 40, letterSpacing: '-0.02em' }}>Comment ça marche ?</h3>
                        </SlideSection>
                        {[
                            { n: '1', title: 'Inscription rapide', desc: 'Créez votre compte en 2 minutes avec votre numéro de téléphone camerounais.' },
                            { n: '2', title: 'Recherche de spécialiste', desc: 'Filtrez par spécialité, ville (Yaoundé, Douala, Bafoussam...) et tarifs en FCFA.' },
                            { n: '3', title: 'Consultation & Suivi', desc: 'Démarrez votre appel vidéo et recevez vos conclusions médicales instantanément.' },
                        ].map((s, i) => (
                            <SlideSection key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 28, animationDelay: `${i * 0.15}s` }}>
                                <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #E8613A, #E8913A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 18 }}>{s.n}</div>
                                <div style={{ paddingTop: 4 }}>
                                    <h5 style={{ fontSize: 18, fontWeight: 700, color: '#111c2d', margin: '0 0 6px' }}>{s.title}</h5>
                                    <p style={{ fontSize: 14, color: '#3f484b', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                                </div>
                            </SlideSection>
                        ))}
                        <SlideSection style={{ marginTop: 16 }}>
                            <Link to="/register" style={{ ...btnAccentStyle, display: 'inline-block', padding: '14px 32px', fontSize: 15 }}>
                                Commencer maintenant →
                            </Link>
                        </SlideSection>
                    </div>
                </section>

                {/* ── TÉMOIGNAGES ── */}
                <section style={{ padding: '72px 32px', background: '#f9f9ff' }}>
                    <SlideSection>
                        <h3 style={{ fontSize: 32, fontWeight: 800, color: '#016472', textAlign: 'center', marginBottom: 40, letterSpacing: '-0.02em' }}>Ce que disent nos patients</h3>
                    </SlideSection>
                    <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        {[
                            { name: 'Mme Eboa', city: 'Douala', text: '"Grâce à Dokita, j\'ai pu consulter un pédiatre pour mon fils en pleine nuit sans affronter les urgences. Le médecin était très à l\'écoute et rassurant."' },
                            { name: 'M. Talla', city: 'Yaoundé', text: '"Le service Dokita AI m\'a aidé à comprendre mes symptômes avant ma consultation. C\'est un outil révolutionnaire pour nous ici à Yaoundé."' },
                        ].map((t, i) => (
                            <SlideSection key={i} style={{ background: 'white', padding: 28, borderRadius: 20, border: '1px solid #dde3f0', position: 'relative' }}>
                                <span style={{ fontSize: 64, color: '#ab3511', opacity: 0.15, position: 'absolute', top: 12, right: 20, fontFamily: 'Georgia, serif', lineHeight: 1 }}>"</span>
                                <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #016472, #2e7d8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 18 }}>{t.name[0]}</div>
                                    <div>
                                        <p style={{ fontWeight: 700, color: '#111c2d', margin: 0 }}>{t.name}</p>
                                        <p style={{ fontSize: 13, color: '#3f484b', margin: 0 }}>{t.city}, Cameroun</p>
                                    </div>
                                </div>
                                <p style={{ fontSize: 14, color: '#3f484b', fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>{t.text}</p>
                            </SlideSection>
                        ))}
                    </div>
                </section>

                {/* ── CTA ── */}
                <section style={{ padding: '64px 32px', background: '#016472', textAlign: 'center' }}>
                    <SlideSection>
                        <h3 style={{ fontSize: 32, fontWeight: 800, color: 'white', margin: '0 0 12px', letterSpacing: '-0.02em' }}>Prêt à prendre soin de votre santé ?</h3>
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, marginBottom: 28 }}>Rejoignez des milliers de camerounais qui font confiance à Dokita.</p>
                        <Link to="/register" style={{ ...btnAccentStyle, display: 'inline-block', padding: '16px 40px', fontSize: 16, fontWeight: 700 }}>
                            Créer mon compte gratuit
                        </Link>
                    </SlideSection>
                </section>
            </main>

            {/* ── FOOTER ── */}
            <footer style={{ padding: '40px 32px', background: '#f0f3ff', borderTop: '1px solid #dde3f0', textAlign: 'center' }}>
                <img src={logo} alt="Dokita" style={{ height: 36, marginBottom: 16 }} />
                <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginBottom: 16, flexWrap: 'wrap' }}>
                    {['Mentions Légales', 'Disclaimer Médical', 'Aide', 'Contact'].map((l, i) => (
                        <a key={i} href="#" style={{ fontSize: 13, color: '#3f484b', textDecoration: 'none' }}>{l}</a>
                    ))}
                </div>
                <p style={{ fontSize: 13, color: '#6f797b', margin: 0 }}>© 2026 Dokita. Tous droits réservés.</p>
            </footer>
        </div>
    );
};

// Styles réutilisables
const navLinkStyle = {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 14, fontWeight: 600, color: '#3f484b',
    fontFamily: 'inherit', padding: '4px 0',
    transition: 'color 0.2s',
};
const btnOutlineStyle = {
    padding: '9px 20px', border: '1.5px solid #016472', borderRadius: 10,
    color: '#016472', fontSize: 14, fontWeight: 600,
    textDecoration: 'none', transition: 'all 0.2s',
};
const btnAccentStyle = {
    padding: '9px 20px', borderRadius: 10,
    background: 'linear-gradient(90deg, #E8613A 0%, #E8913A 100%)',
    color: 'white', fontSize: 14, fontWeight: 600,
    textDecoration: 'none', border: 'none', cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(232,97,58,0.35)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'inline-block',
};

export default Landing;