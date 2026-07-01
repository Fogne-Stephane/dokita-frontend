import { useState,useEffect } from 'react';
import { doctorService } from '../../api/services';

const SPECIALTIES = ['Toutes', 'Généraliste', 'Cardiologue', 'Pédiatre', 'Dermatologue', 'Neurologue', 'Gynécologue'];

const PatientDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [specialty, setSpecialty] = useState('Toutes');
    const [onlyAvailable, setOnlyAvailable] = useState(false);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
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
        const matchSearch = d.name?.toLowerCase().includes(search.toLowerCase()) || d.specialty?.toLowerCase().includes(search.toLowerCase());
        const matchSpec = specialty === 'Toutes' || d.specialty === specialty;
        const matchAvail = !onlyAvailable || d.is_available;
        return matchSearch && matchSpec && matchAvail;
    });

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
            <p style={{ color: '#6f797b', fontFamily: "'Inter', sans-serif" }}>Chargement des médecins...</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Inter', sans-serif" }}>

            {/* Header */}
            <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111c2d' }}>Nos Médecins</h2>
                <p style={{ margin: 0, fontSize: 13, color: '#6f797b' }}>Trouvez le spécialiste qu'il vous faut</p>
            </div>

            {/* Filtres */}
            <div style={{ background: 'white', borderRadius: 16, padding: 20, border: '1px solid #e7eeff', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    type="text" placeholder="🔍  Rechercher un médecin ou spécialité..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    style={{ flex: 1, minWidth: 220, border: '1.5px solid #dde3f0', borderRadius: 12, padding: '11px 16px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                />
                <select value={specialty} onChange={e => setSpecialty(e.target.value)}
                    style={{ border: '1.5px solid #dde3f0', borderRadius: 12, padding: '11px 16px', fontSize: 14, fontFamily: 'inherit', outline: 'none', background: 'white', color: '#111c2d' }}>
                    {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                </select>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#3f484b', cursor: 'pointer', fontWeight: 500 }}>
                    <input type="checkbox" checked={onlyAvailable} onChange={e => setOnlyAvailable(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#016472' }} />
                    Disponibles uniquement
                </label>
            </div>

            {/* Résultats */}
            <p style={{ margin: 0, fontSize: 13, color: '#6f797b', fontWeight: 500 }}>{filtered.length} médecin{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}</p>

            {/* Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {filtered.map(doc => (
                    <div key={doc.id} style={{ background: 'white', borderRadius: 18, padding: 22, border: '1px solid #e7eeff', display: 'flex', flexDirection: 'column', gap: 14, transition: 'box-shadow 0.2s, transform 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(1,100,114,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        {/* Avatar + dispo */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(135deg, #016472, #2e7d8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{doc.avatar}</div>
                            <span style={{ background: doc.available ? '#dcfce7' : '#fee2e2', color: doc.available ? '#16a34a' : '#dc2626', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>
                                {doc.available ? '● Disponible' : '○ Indisponible'}
                            </span>
                        </div>

                        {/* Infos */}
                        <div>
                            <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 15, color: '#111c2d' }}>{doc.name}</p>
                            <p style={{ margin: '0 0 6px', fontSize: 13, color: '#016472', fontWeight: 600 }}>{doc.spec}</p>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 12, color: '#6f797b' }}>📍 {doc.city}</span>
                                <span style={{ fontSize: 12, color: '#6f797b' }}>🏆 {doc.exp} ans d'expérience</span>
                            </div>
                        </div>

                        {/* Rating + tarif */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #f0f3ff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <span style={{ color: '#f59e0b', fontSize: 14 }}>★</span>
                                <span style={{ fontWeight: 700, fontSize: 14, color: '#111c2d' }}>{doc.rating}</span>
                                <span style={{ fontSize: 12, color: '#6f797b' }}>({doc.reviews} avis)</span>
                            </div>
                            <span style={{ fontWeight: 700, fontSize: 14, color: '#016472' }}>{doc.fee} XAF</span>
                        </div>

                        {/* Bouton */}
                        <button disabled={!doc.available} style={{ width: '100%', padding: '11px', border: 'none', borderRadius: 12, background: doc.available ? 'linear-gradient(90deg, #016472, #2e7d8c)' : '#f0f3ff', color: doc.available ? 'white' : '#9ca3af', fontWeight: 700, fontSize: 14, cursor: doc.available ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'opacity 0.2s' }}>
                            {doc.available ? 'Prendre rendez-vous' : 'Indisponible'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientDoctors;