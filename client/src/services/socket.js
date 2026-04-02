import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'http://localhost:5001';
const socket = io(socketUrl, {
    autoConnect: true,
});

export default socket;
