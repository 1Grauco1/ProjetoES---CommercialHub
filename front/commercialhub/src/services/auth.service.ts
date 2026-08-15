import api from './api';

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    phone: string;
}

export const authService = {
    register: async (payload: RegisterPayload) => {
        const response = await api.post('/auth/criar_conta', {
            nome: payload.name,
            email: payload.email,
            senha: payload.password,
            telefone: payload.phone
        });
        return response.data;
    }
};

export default authService;
