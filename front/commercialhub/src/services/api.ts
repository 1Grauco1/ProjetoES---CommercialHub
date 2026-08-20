import axios from 'axios';
import { BACKEND_URL } from '@/src/config';

const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;
