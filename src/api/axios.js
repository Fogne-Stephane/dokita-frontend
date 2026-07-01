import axios from 'axios';

const api = axios.create({
    baseURL: 'http://dokita-backend.test/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Intercepteur requête — ajoute le token à chaque appel
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('dokita_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Intercepteur réponse — gère les erreurs globalement
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Ne déconnecte QUE si c'est une vraie expiration de session
        // ET que ce n'est pas déjà la page de login
        if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
            console.warn('Session expirée — déconnexion.');
            localStorage.removeItem('dokita_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;