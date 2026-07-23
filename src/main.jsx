import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store';
import AppRouter from './routes/AppRouter';
import './index.css';
import './styles/dokita-theme.css';

// Charger l'utilisateur depuis /me au démarrage si token présent
import api from './api/axios';
import { loginUser } from './redux/slices/authSlice';

const initApp = async () => {
    const token = sessionStorage.getItem('dokita_token');

    if (token) {
        try {
            const res = await api.get('/me');
            // Mettre à jour Redux avec le vrai utilisateur du token
            store.dispatch({
                type: 'auth/login/fulfilled',
                payload: {
                    token: token,
                    user:  res.data.user,
                },
            });
        } catch (err) {
            // Token invalide — nettoyer
            localStorage.removeItem('dokita_token');
        }
    }

    createRoot(document.getElementById('root')).render(
        <StrictMode>
            <Provider store={store}>
                <AppRouter />
            </Provider>
        </StrictMode>
    );
};

initApp();