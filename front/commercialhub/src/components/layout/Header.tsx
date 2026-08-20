'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
    const [menuAberto, setMenuAberto] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-40 w-full h-17 md:h-19 bg-[#D9D9D9]/95 border-b border-[#1B263B] px-4 sm:px-6 md:px-20 lg:px-30 py-2 flex items-center justify-between backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Logo" className="h-[40px] md:h-[46px] w-auto" />
                </div>

                <nav className="hidden xl:flex items-center gap-8 lg:gap-10">

                    <Link
                        href="/login"
                        className="flex h-12 items-center justify-center px-7 bg-[#D35400] text-white rounded-[10px] font-medium text-lg shadow-md hover:bg-[#D35400]/90 hover:scale-[1.02] transition-all"
                    >
                        Logar
                    </Link>
                </nav>

                <button
                    type="button"
                    onClick={() => setMenuAberto(!menuAberto)}
                    className="xl:hidden p-2 text-[#1B263B] hover:text-[#D35400] transition-colors"
                    aria-label="Abrir menu"
                >
                    {menuAberto ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>
            </header>

            {menuAberto && (
                <div className="fixed inset-0 z-50 xl:hidden flex">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMenuAberto(false)} />
                    <nav className="relative ml-auto w-64 max-w-xs h-full bg-[#D9D9D9] shadow-2xl p-6 flex flex-col gap-6 font-semibold animate-in slide-in-from-right duration-200">
                        <button type="button" onClick={() => setMenuAberto(false)} className="self-end p-2 mb-4" aria-label="Fechar menu">
                            <X className="w-6 h-6" />
                        </button>
                        <a href="#proprietario" onClick={() => setMenuAberto(false)} className="text-xl border-b border-gray-300 pb-2 hover:text-[#D35400]">
                            Propietario
                        </a>
                        <a href="#empreendedor" onClick={() => setMenuAberto(false)} className="text-xl border-b border-gray-300 pb-2 hover:text-[#D35400]">
                            Empreendedor
                        </a>
                        <Link href="/login" onClick={() => setMenuAberto(false)} className="mt-4 flex w-full items-center justify-center py-3 bg-[#D35400] text-white rounded-lg shadow">
                            Logar
                        </Link>
                    </nav>
                </div>
            )}
        </>
    );
}
