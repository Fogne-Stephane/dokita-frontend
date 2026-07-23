import axios from 'axios';

const api = axios.create({
    baseURL: 'http://dokita-backend.test/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('dokita_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Ne déconnecte QUE si c'est /me qui retourne 401
        // — pas les autres routes
        const isAuthRoute = error.config?.url?.includes('/me');
        if (error.response?.status === 401 && isAuthRoute) {
            sessionStorage.removeItem('dokita_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;