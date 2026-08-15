import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');

            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

interface LoginResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

interface RegisterResponse {
    success: boolean;
    message: string;
}

export const authApi = {
    login: async (payload: { username: string; password: string }) => {
        const params = new URLSearchParams();
        params.append('username', payload.username);
        params.append('password', payload.password);

        const response = await api.post('/auth/login', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    },

    register: async (payload: { name: string; email: string; password: string; phone: string; nivel_acesso: string }) => {
        const response = await api.post('/auth/criar_conta', {
            nome: payload.name,
            email: payload.email,
            senha: payload.password,
            telefone: payload.phone,
            nivel_acesso: payload.nivel_acesso
        });
        return response.data;
    }
};

export default api;