import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../../api/services';

const SPECIALTIES = ['Toutes', 'Généraliste', 'Cardiologue', 'Pédiatre', 'Dermatologue', 'Neurologue', 'Gynécologue'];

const PatientDoctors = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors]         = useState([]);
    const [loading, setLoading]         = useState(true);
    const [search, setSearch]           = useState('');
    const [specialty, setSpecialty]     = useState('Toutes');
    const [onlyAvailable, setOnlyAvailable] = useState(false);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                const res = await doctorService.getAll();
                setDoctors(res.data);
            } catch (err) {
                console.error('Erreur chargement médecins:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const filtered = doctors.filter(d => {
        const matchSearch   = d.name?.toLowerCase().includes(search.toLowerCase()) ||
                              d.specialty?.toLowerCase().includes(search.toLowerCase());
        const matchSpec     = specialty === 'Toutes' || d.specialty === specialty;
        const matchAvail    = !onlyAvailable || d.is_available;
        return matchSearch && matchSpec && matchAvail;
    });

    const getInitials = (name) => {
        const parts = (name || '').split(' ');
        return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, fontFamily: "'Inter', sans-serif" }}>
            <p style={{ color: '#6f797b' }}>Chargement des médecins...</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Inter', sans-serif" }}>

            {/* Header */}
            <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111c2d' }}>Nos Médecins</h2>
                <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>
                    {filtered.length} médecin{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}
                </p>
            </div>

            {/* Filtres */}
            <div style={{ background: 'white', borderRadius: 16, padding: 20, border: '1px solid #e7eeff', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="🔍  Rechercher un médecin ou spécialité..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ flex: 1, minWidth: 200, border: '1.5px solid #dde3f0', borderRadius: 12, padding: '11px 16px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                />
                <select
                    value={specialty}
                    onChange={e => setSpecialty(e.target.value)}
                    style={{ border: '1.5px solid #dde3f0', borderRadius: 12, padding: '11px 16px', fontSize: 14, fontFamily: 'inherit', outline: 'none', background: 'white', color: '#111c2d' }}>
                    {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                </select>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#3f484b', cursor: 'pointer', fontWeight: 500 }}>
                    <input
                        type="checkbox"
                        checked={onlyAvailable}
                        onChange={e => setOnlyAvailable(e.target.checked)}
                        style={{ width: 16, height: 16, accentColor: '#016472' }}
                    />
                    Disponibles uniquement
                </label>
            </div>

            {/* Cards */}
            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 48, background: 'white', borderRadius: 16, border: '1px solid #e7eeff' }}>
                    <p style={{ fontSize: 40, margin: '0 0 12px' }}>🔍</p>
                    <p style={{ color: '#6f797b', fontWeight: 600 }}>Aucun médecin trouvé</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    {filtered.map(doc => (
                        <div key={doc.id}
                            style={{ background: 'white', borderRadius: 18, padding: 22, border: `2px solid ${doc.is_available ? '#016472' : '#e7eeff'}`, display: 'flex', flexDirection: 'column', gap: 14, transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'pointer' }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(1,100,114,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            {/* Avatar + dispo */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #016472, #2e7d8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 20 }}>
                                    {getInitials(doc.name).toUpperCase()}
                                </div>
                                <span style={{
                                    background: doc.is_available ? '#dcfce7' : '#fee2e2',
                                    color: doc.is_available ? '#16a34a' : '#dc2626',
                                    padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700
                                }}>
                                    {doc.is_available ? '● Disponible' : '○ Indisponible'}
                                </span>
                            </div>

                            {/* Infos */}
                            <div>
                                <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 16, color: '#111c2d' }}>{doc.name}</p>
                                <p style={{ margin: '0 0 8px', fontSize: 13, color: '#016472', fontWeight: 600 }}>{doc.specialty}</p>
                                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                    {doc.city && (
                                        <span style={{ fontSize: 12, color: '#6f797b' }}>📍 {doc.city}</span>
                                    )}
                                    {doc.experience_years > 0 && (
                                        <span style={{ fontSize: 12, color: '#6f797b' }}>🏆 {doc.experience_years} ans</span>
                                    )}
                                </div>
                            </div>

                            {/* Rating + tarif */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #f0f3ff' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <span style={{ color: '#f59e0b', fontSize: 14 }}>★</span>
                                    <span style={{ fontWeight: 700, fontSize: 14, color: '#111c2d' }}>
                                        {doc.rating || '4.9'}
                                    </span>
                                    <span style={{ fontSize: 12, color: '#6f797b' }}>
                                        ({doc.reviews_count || 0} avis)
                                    </span>
                                </div>
                                <span style={{ fontWeight: 700, fontSize: 14, color: '#016472' }}>
                                    {doc.consultation_fee > 0
                                        ? Number(doc.consultation_fee).toLocaleString() + ' XAF'
                                        : 'Tarif à définir'
                                    }
                                </span>
                            </div>

                            {/* Bouton */}
                            <button
                                onClick={() => navigate(`/patient/doctors/${doc.id}`)}
                                style={{
                                    width: '100%', padding: '12px', border: 'none', borderRadius: 12,
                                    background: 'linear-gradient(135deg, #016472, #2e7d8c)',
                                    color: 'white', fontWeight: 700, fontSize: 14,
                                    cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.2s'
                                }}>
                                Voir le profil →
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientDoctors;