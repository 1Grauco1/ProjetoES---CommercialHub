'use client';

import DashboardShell from '@/src/components/dashboard/DashboardShell';
import { usePerfil } from '@/src/lib/use-salas';
import { Mail, Phone, User, Pencil, LoaderCircle } from 'lucide-react';
import Link from 'next/link';

export default function PerfilPage() {
  const perfil = usePerfil();

  if (!perfil) {
    return (
      <DashboardShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <LoaderCircle size={32} className="animate-spin text-[#D35400]" />
        </div>
      </DashboardShell>
    );
  }

  const dados = perfil as typeof perfil & {
    tipoConta?: string;
    foto?: string | null;
  };

  return (
    <DashboardShell>
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meu perfil</h1>
            <p className="mt-1 text-slate-500">Visualize suas informações pessoais.</p>
          </div>

          <Link
            href="/perfil/editar"
            className="flex items-center gap-2 rounded-xl bg-[#D35400] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-950/15 hover:bg-[#b94700]"
          >
            <Pencil size={17} />
            Editar perfil
          </Link>
        </div>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="flex flex-col items-center gap-5 border-b border-slate-100 pb-8 sm:flex-row">
            <div className="flex size-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#D35400] shadow-md">
              {dados.foto ? (
                <img src={dados.foto} alt={perfil.nome} className="size-full object-cover" />
              ) : (
                <User size={48} className="text-white" />
              )}
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">{perfil.nome}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {dados.tipoConta || 'Usuário'}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Info icon={<User size={18} />} label="Nome completo" value={perfil.nome} />
            <Info icon={<Mail size={18} />} label="E-mail" value={perfil.email} />
            <Info icon={<Phone size={18} />} label="Telefone" value={perfil.telefone || 'Não informado'} />
            <Info icon={<User size={18} />} label="Tipo de conta" value={dados.tipoConta || 'Não informado'} />
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
      <div className="mt-2 flex items-center gap-3">
        <span className="text-[#D35400]">{icon}</span>
        <span className="font-medium">{value}</span>
      </div>
    </div>
  );
}