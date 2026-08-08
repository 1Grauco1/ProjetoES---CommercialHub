import api from './api';

interface LoginPayload {
    username: string;
    password: string;
}

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    phone: string;
    nivel_acesso: string;
}

export const authService = {
    login: async (payload: LoginPayload) => {
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

    register: async (payload: RegisterPayload) => {
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

export default authService;
