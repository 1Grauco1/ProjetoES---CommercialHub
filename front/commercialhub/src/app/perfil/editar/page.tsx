'use client';

import DashboardShell from '@/src/components/dashboard/DashboardShell';
import { atualizarPerfil } from '@/src/lib/perfil-api';
import { usePerfil } from '@/src/lib/use-salas';
import {
  LoaderCircle,
  Mail,
  Phone,
  Save,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const inputStyle =
  'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#1B263B] outline-none transition focus:border-[#D35400] focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-100';

export default function EditarPerfilPage() {
  const router = useRouter();
  const perfil = usePerfil();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipoConta, setTipoConta] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!perfil) return;

    const perfilComTipoConta = perfil as typeof perfil & {
      tipoConta?: string;
    };

    setNome(perfil.nome ?? '');
    setEmail(perfil.email ?? '');
    setTelefone(perfil.telefone ?? '');
    setTipoConta(perfilComTipoConta.tipoConta ?? '');
  }, [perfil]);

  const salvar = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!perfil?.id) {
      setMessage('Não foi possível identificar o usuário.');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await atualizarPerfil(perfil.id, {
        nomeCompleto: nome,
        email,
        telefone,
      });

      router.push('/perfil');
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível atualizar o perfil.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!perfil) {
    return (
      <DashboardShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <LoaderCircle
            size={32}
            className="animate-spin text-[#D35400]"
          />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Editar perfil</h1>

          <p className="mt-1 text-slate-500">
            Atualize suas informações pessoais.
          </p>
        </div>

        <form onSubmit={salvar} className="space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <h2 className="text-xl font-bold">
              Informações pessoais
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Altere as informações cadastradas na sua conta.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field
                label="Nome completo"
                icon={<User size={17} />}
                value={nome}
                onChange={setNome}
                className="sm:col-span-2"
                disabled={loading}
              />

              <Field
                label="E-mail"
                icon={<Mail size={17} />}
                type="email"
                value={email}
                onChange={setEmail}
                disabled={loading}
              />

              <Field
                label="Telefone"
                icon={<Phone size={17} />}
                value={telefone}
                onChange={setTelefone}
                disabled={loading}
              />

              <label className="text-sm font-semibold sm:col-span-2">
                <span>Tipo de conta</span>

                <select
                  value={tipoConta}
                  onChange={(event) =>
                    setTipoConta(event.target.value)
                  }
                  className={inputStyle}
                  disabled={loading}
                >
                  <option value="">Selecione</option>
                  <option value="Proprietário">Proprietário</option>
                  <option value="Empreendedor">Empreendedor</option>
                </select>
              </label>
            </div>
          </section>

          {message && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {message}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/perfil')}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold hover:bg-slate-50 disabled:opacity-70"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#D35400] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-950/15 hover:bg-[#b94700] disabled:opacity-70"
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Salvar alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}

function Field({
  label,
  icon,
  value,
  onChange,
  type = 'text',
  className = '',
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <label className={`text-sm font-semibold ${className}`}>
      <span>{label}</span>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D35400]">
          {icon}
        </span>

        <input
          type={type}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={`${inputStyle} pl-11`}
          disabled={disabled}
        />
      </div>
    </label>
  );
}

