"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/src/services/auth.service';

export function useAuth() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (username: string, password: string) => {
        setError(null);
        setLoading(true);
        try {
            const resp = await authService.login({ username, password });
            const token = resp.access_token ?? resp.token;
            if (!token) throw new Error('Token não retornado');
            if (typeof window !== 'undefined') localStorage.setItem('token', token);
            router.push('/dashboard');
            return resp;
        } catch (err) {
            setError('Falha no login');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: {
        name: string;
        email: string;
        password: string;
        phone: string;
    }) => {
        setError(null);
        setLoading(true);
        try {
            const resp = await authService.register(data);
            router.push('/login');
            return resp;
        } catch (err) {
            setError('Falha no cadastro');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { login, register, loading, error };
}

export default useAuth;
