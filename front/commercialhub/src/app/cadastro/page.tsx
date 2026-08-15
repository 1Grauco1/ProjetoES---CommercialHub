'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { registerSchema } from '@/src/validators/auth';
import type { RegisterFormValues } from '@/src/types/auth';
import { authService } from '@/src/services/auth.service';



export default function CadastroPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: 'onBlur',
    });

    const onSubmit = async (values: RegisterFormValues) => {
        setSubmitError(null);
        setIsSubmitting(true);

        try {
            await authService.register({
                name: values.name,
                email: values.email,
                password: values.password,
                phone: values.phone,
            });
            router.push('/login');
        } catch {
            setSubmitError('Não foi possível concluir o cadastro. Tente novamente mais tarde.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F8F9FA] ">
            <div className="mx-auto flex h-screen  flex-col overflow-hidden  bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] lg:flex-row">
                <section className="flex flex-1 w-full items-center justify-center bg-cover bg-center px-4 py-10 sm:px-6 lg:px-10" style={{ backgroundImage: "url('/cadastroBG.svg')" }}>
                    <div className="w-full max-w-190 rounded-3xl bg-white/90 p-6 shadow-xl backdrop-blur-sm sm:p-8">
                        <h2 className="text-center text-3xl font-bold text-[#1B263B] sm:text-4xl">Faça seu cadastro</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-5">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-black">Nome Completo</label>
                                <input
                                    type="text"
                                    {...register('name')}
                                    className="w-full rounded-xl border border-gray-300 bg-[#D9D9D9] px-4 py-3 text-[#1B263B] outline-none focus:border-[#D35400]"
                                    placeholder="Seu nome completo"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#1B263B]">Email</label>
                                <input
                                    type="email"
                                    {...register('email')}
                                    className="w-full rounded-xl border border-gray-300 bg-[#D9D9D9] px-4 text-[#1B263B] py-3 outline-none focus:border-[#D35400]"
                                    placeholder="seu@email.com"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#1B263B]">Senha</label>
                                    <div className="flex items-center rounded-xl border border-gray-300 text-[#1B263B] bg-[#D9D9D9] px-4 py-3">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            {...register('password')}
                                            className="w-full bg-transparent outline-none"
                                            placeholder="********"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-3 text-[#1B263B]">
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#1B263B]">Confirmar senha</label>
                                    <div className="flex items-center rounded-xl border border-gray-300 text-[#1B263B] bg-[#D9D9D9] px-4 py-3">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            {...register('confirmPassword')}
                                            className="w-full bg-transparent outline-none"
                                            placeholder="********"
                                        />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="ml-3 text-[#1B263B]">
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
                                </div>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#1B263B]">Telefone</label>
                                    <input
                                        type="text"
                                        {...register('phone')}
                                        className="w-full rounded-xl border border-gray-300 bg-[#D9D9D9] px-4 py-3 text-[#1B263B] outline-none focus:border-[#D35400]"
                                        placeholder="(83) 99999-9999"
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                                </div>
                            </div>

                            {submitError && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-full bg-[#AC4501] px-4 py-3 text-lg font-semibold text-white transition hover:bg-[#8F3A00] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                            </button>

                            <div className="text-center">
                                <Link href="/login" className="text-base font-semibold text-[#1B263B] underline-offset-4 hover:text-[#D35400] hover:underline">
                                    Já tem conta ?
                                    Faça seu login aqui
                                </Link>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </main>
    );
}
