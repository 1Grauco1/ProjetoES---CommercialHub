'use client';

import Link from 'next/link';
import { Building2, FileText, LayoutDashboard, LogOut, Menu, Search, WalletCards, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { usePerfil } from '@/src/lib/use-salas';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/faturamento', label: 'Faturamento', icon: WalletCards },
  { href: '/minhas-salas', label: 'Minhas salas', icon: Building2 },
  { href: '/contratos', label: 'Contratos', icon: FileText },
];

function initials(nome?: string | null) {
  if (!nome?.trim()) return 'U';

  const partes = nome.trim().split(/\s+/);

  return partes.length === 1
    ? partes[0].slice(0, 2).toUpperCase()
    : `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busca, setBusca] = useState('');
  const perfil = usePerfil();
  const ativo = pathname.startsWith('/perfil');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (busca.trim()) {
      router.push(`/busca-sala?q=${encodeURIComponent(busca)}`);
    } else {
      router.push('/busca-sala');
    }
  };

  const navigation = (
    <nav className="mt-12 space-y-3">
      {links.map(({ href, label, icon: Icon }) => (
        <Link 
          key={href} 
          href={href} 
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
            pathname === href 
              ? 'bg-[#D35400] text-white' 
              : 'text-slate-200 hover:bg-white/10'
          }`}
        >
          <Icon size={21} />
          {label}
        </Link>
      ))}
      <Link 
        href="/" 
        onClick={() => setOpen(false)} 
        className="mt-12 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10"
      >
        <LogOut size={21} />
        Sair
      </Link>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#1B263B]">
      {/* Sidebar Desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 bg-[#1B263B] px-8 py-10 lg:flex lg:flex-col">
        <Link href="/dashboard">
          <img src="/logo.svg" alt="Logo" className="h-[180px] w-auto" />
        </Link>
        {navigation}
      </aside>

      {/* Header */}
      <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b bg-white/95 px-5 backdrop-blur lg:ml-72 lg:px-10">
        <button 
          className="rounded-lg p-2 text-[#1B263B] transition-colors hover:bg-slate-100 lg:hidden" 
          onClick={() => setOpen(true)} 
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
        
        <form 
          onSubmit={handleSearch} 
          className="hidden items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-500 focus-within:ring-2 focus-within:ring-[#D35400] md:flex"
        >
          <button type="submit" aria-label="Realizar busca" className="transition-colors hover:text-[#D35400]">
            <Search size={18} />
          </button>
          <input
            type="text"
            placeholder="Buscar sala..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-48 bg-transparent text-[#1B263B] placeholder-slate-500 outline-none"
          />
        </form>

        <Link 
          href="/perfil" 
          className={`ml-auto flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors ${
            ativo ? 'bg-[#D35400] text-white' : 'hover:bg-slate-100'
          }`}
        >
          <div className={`grid size-10 place-items-center rounded-full font-bold ${
            ativo ? 'bg-white text-[#D35400]' : 'bg-orange-100 text-[#D35400]'
          }`}>
            {initials(perfil?.nome)}
          </div>
          <div className="hidden text-sm sm:block">
            <p className="font-semibold">{perfil?.nome ?? 'Carregando...'}</p>
            <p className={ativo ? 'text-xs text-white/80' : 'text-xs text-slate-500'}>
              {perfil?.email ?? 'Perfil'}
            </p>
          </div>
        </Link>
      </header>

      {/* Menu Mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button 
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" 
            onClick={() => setOpen(false)} 
            aria-label="Fechar menu" 
          />
          <aside className="relative flex h-full w-72 flex-col bg-[#1B263B] px-8 py-10 shadow-2xl">
            <button 
              className="absolute right-5 top-5 text-white transition-colors hover:text-[#D35400]" 
              onClick={() => setOpen(false)} 
              aria-label="Fechar"
            >
              <X size={22} />
            </button>
            <Link href="/dashboard" onClick={() => setOpen(false)}>
              <img src="/logo.svg" alt="Logo" className="h-[46px] w-auto" />
            </Link>
            {navigation}
          </aside>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="p-5 lg:ml-72 lg:p-10">{children}</main>
    </div>
  );
}