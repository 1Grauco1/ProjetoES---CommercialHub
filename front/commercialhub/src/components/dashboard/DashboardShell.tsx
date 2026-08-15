'use client';

import Link from 'next/link';
import { Building2, FileText, LayoutDashboard, LogOut, WalletCards, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useDashboardUI } from '@/src/context/dashboard-ui';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/faturamento', label: 'Faturamento', icon: WalletCards },
  { href: '/minhas-salas', label: 'Minhas salas', icon: Building2 },
  { href: '/contratos', label: 'Contratos', icon: FileText },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { open, closeSidebar } = useDashboardUI();

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const navigation = (
    <nav className="mt-12 space-y-3">
      {links.map(({ href, label, icon: Icon }) => (
        <Link 
          key={href} 
          href={href} 
          onClick={closeSidebar}
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
      <button 
        type="button" 
        onClick={handleLogout} 
        className="mt-12 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10"
      >
        <LogOut size={21} />
        Sair
      </button>
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

      {/* Menu Mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button 
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" 
            onClick={closeSidebar} 
            aria-label="Fechar menu" 
          />
          <aside className="relative flex h-full w-72 flex-col bg-[#1B263B] px-8 py-10 shadow-2xl">
            <button 
              className="absolute right-5 top-5 text-white transition-colors hover:text-[#D35400]" 
              onClick={closeSidebar} 
              aria-label="Fechar"
            >
              <X size={22} />
            </button>
            <Link href="/dashboard" onClick={closeSidebar}>
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
