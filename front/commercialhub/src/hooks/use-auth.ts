"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { authService } from '@/src/services/auth.service';

export function useAuth() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (username: string, password: string) => {
        setError(null);
        setLoading(true);
        try {
            const result = await signIn('credentials', {
                username,
                password,
                redirect: false,
            });
            if (result?.error) throw new Error(result.error);
            const redirect =
                typeof window !== 'undefined'
                    ? new URLSearchParams(window.location.search).get('redirect') ?? '/dashboard'
                    : '/dashboard';
            router.push(redirect);
            return result;
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
