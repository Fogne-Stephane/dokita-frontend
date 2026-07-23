import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const makeEcho = () => {
    const token = sessionStorage.getItem('dokita_token');
    return new Echo({
        broadcaster: 'reverb',
        key: 'dokita-key',
        wsHost: 'localhost',
        wsPort: 8082,
        wssPort: 8082,
        forceTLS: false,
        enabledTransports: ['ws', 'wss'],
        authEndpoint: 'http://dokita-backend.test/broadcasting/auth',
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        },
    });
};

let echoInstance = makeEcho();

export const resetEcho = () => {
    try { echoInstance.disconnect(); } catch (e) {}
    echoInstance = makeEcho();
};

export const getEcho = () => echoInstance;

export default echoInstance;