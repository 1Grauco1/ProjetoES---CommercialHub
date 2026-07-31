'use client';

import Link from 'next/link';
import { Building2, FileText, LayoutDashboard, LogOut, Menu, Search, WalletCards, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { usePerfil } from '@/src/lib/use-salas';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/faturamento', label: 'Faturamento', icon: WalletCards },
  { href: '/minhas-salas', label: 'Minhas salas', icon: Building2 },
  { href: '/contratos', label: 'Contratos', icon: FileText },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const perfil = usePerfil();
  const initials = perfil?.nome.split(' ').map(nome => nome[0]).slice(0, 2).join('').toUpperCase() ?? '...';
  const navigation = (
    <nav className="mt-12 space-y-3">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${active ? 'bg-[#D35400] text-white shadow-lg shadow-orange-950/20' : 'text-slate-200 hover:bg-white/10'}`}><Icon size={21} />{label}</Link>;
      })}
      <Link href="/" className="mt-12 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10"><LogOut size={21} />Sair</Link>
    </nav>
  );

  return <div className="min-h-screen bg-[#F7F8FA] text-[#1B263B]">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-[#1B263B] px-8 py-10 lg:flex">
      <Link href="/dashboard" className="flex items-center gap-3 text-2xl font-bold text-white"><span className="grid size-[180px] place-items-center rounded-xl"><img src="/logo.svg" alt="Logo" className="h-[180px] md:h-[180px] w-auto" /></span></Link>{navigation}
    </aside>
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur lg:ml-72 lg:px-10">
      <button className="rounded-lg p-2 text-[#1B263B] lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu"><Menu /></button>
      <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-500 md:flex"><Search size={18} />Buscar sala, contrato...</div>
      <div className="ml-auto flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-full bg-orange-100 font-bold text-[#D35400]">{initials}</div>
        <div className="hidden text-sm sm:block"><p className="font-semibold">{perfil?.nome ?? 'Carregando...'}
        </p><p className="text-xs text-slate-500">{perfil?.email  ?? 'Perfil'}</p></div></div>
    </header>
    {open && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Fechar menu" className="absolute inset-0 bg-slate-950/40" onClick={() => setOpen(false)} />
      <aside className="relative flex h-full w-72 flex-col bg-[#1B263B] px-8 py-10">
        <button className="absolute right-5 top-5 text-white" onClick={() => setOpen(false)} aria-label="Fechar"><X /></button><Link href="/dashboard" className="flex items-center gap-3 text-xl font-bold text-white">
          <img src="/logo.svg" alt="Logo" className="h-[40px] md:h-[46px] w-auto" /></Link>{navigation}
      </aside>
    </div>}
    <main className="p-5 lg:ml-72 lg:p-10">{children}</main>
  </div>;
}
