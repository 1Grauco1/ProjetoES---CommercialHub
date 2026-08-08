'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { loginSchema } from '@/src/validators/auth';
import type { LoginFormValues } from '@/src/types/auth';
import { authService } from '@/src/services/auth.service';

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
    });

    const onSubmit = async (values: LoginFormValues) => {
        setSubmitError(null);
        setIsSubmitting(true);

        try {
            const response = await authService.login({
                username: values.email,
                password: values.password,
            });
            const token = response.access_token ?? response.token;
            if (!token) throw new Error('A API não retornou um token de acesso.');
            localStorage.setItem('token', token);
            router.push('/dashboard');
        } catch {
            setSubmitError('Não foi possível entrar. Verifique as credenciais e tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F8F9FA] text-[#1B263B]">
            <div className="mx-auto flex min-h-screen  flex-col lg:flex-row items-stretch">
                <section className="hidden lg:flex lg:w-[55%] flex-col  rounded-br-[30px] rounded-tr-[30px] justify-center px-8 xl:px-16 py-12 bg-cover bg-center" style={{ backgroundImage: "url('/Bglogin.svg')" }}>
                    <div className="max-w-2xl rounded-3xl text-white p-8 ">
                        <h1 className="text-5xl xl:text-8xl font-semibold leading-tight  uppercase">
                            COMMERCIAL
                            HUB
                        </h1>
                        <p className="mt-6 text-2xl font-semibold ">Conectando você a espaços do tamanho do seu negócio.</p>
                        <p className="mt-4 text-lg leading-8">Encontre salas comerciais, escritórios e espaços corporativos que atendem às necessidades da sua empresa, com praticidade, segurança e as melhores oportunidades.</p>
                    </div>
                </section>

                <section className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
                    <div className="w-full max-w-145 rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:p-8 lg:p-10">

                        <img src="/logo.svg" alt="Logo" className="h-[40px] justify-center w-full  md:h-[150px] " />
                        <h2 className="text-center text-3xl font-bold text-[#1B263B]">Faça seu login</h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#1B263B]">Email</label>
                                <input
                                    type="email"
                                    {...register('email')}
                                    className="w-full rounded-xl border border-gray-300 bg-[#ACACAC] px-4 py-3 text-[#1B263B] outline-none focus:border-[#D35400]"
                                    placeholder="seu@email.com"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#1B263B]">Senha</label>
                                <div className="flex items-center rounded-xl border border-gray-300 bg-[#ACACAC] px-4 py-3">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password')}
                                        className="w-full bg-transparent outline-none text-[#1B263B]"
                                        placeholder="********"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-3 text-[#1B263B]">
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                            </div>

                            <div className="text-right">
                                <button type="button" className="text-sm font-semibold text-[#1B263B] hover:text-[#D35400]">
                                    Esqueceu sua senha?
                                </button>
                            </div>

                            {submitError && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-full bg-[#AC4501] px-4 py-3 text-lg font-semibold text-white transition hover:bg-[#8F3A00] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSubmitting ? 'Entrando...' : 'Login'}
                            </button>

                            <div className="pt-2 text-center">
                                <Link href="/cadastro" className="text-base font-semibold text-[#1B263B] underline-offset-4 hover:text-[#D35400] hover:underline">
                                    Crie sua conta
                                </Link>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </main>
    );
}
