"use client";

import DashboardShell from "@/src/components/dashboard/DashboardShell";
import PageHeader from "@/src/components/dashboard/PageHeader";
import { useSalas } from "@/src/hooks/use-salas";
import { deletarSala } from "@/src/services/salas.service";
import {
  Building2,
  CalendarCheck,
  Trash,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { useState } from "react";

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
export default function DashboardPage() {
  const { salas, loading, error } = useSalas();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);

  const visibleSalas = salas.filter((sala) => !deletedIds.includes(sala.id));
  const rented = visibleSalas.filter((sala) => sala.status_ocupacao === "Alugada");
  const monthlyRevenue = rented.reduce((total, sala) => total + sala.preco, 0);
  const occupancy = visibleSalas.length
    ? Math.round((rented.length / visibleSalas.length) * 100)
    : 0;
  const excluirSala = async (id: number) => {
    if (
      !window.confirm(
        "Deseja excluir este imóvel? Esta ação não pode ser desfeita.",
      )
    )
      return;

    setActionError(null);
    setDeletingId(id);
    try {
      await deletarSala(id);
      setDeletedIds((current) => [...current, id]);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a sala.",
      );
    } finally {
      setDeletingId(null);
    }
  };
  const cards = [
    {
      label: "Receita mensal",
      value: money.format(monthlyRevenue),
      note: `${rented.length} ${rented.length === 1 ? "sala alugada" : "salas alugadas"}`,
      icon: WalletCards,
    },
    {
      label: "Imóveis cadastrados",
      value: String(visibleSalas.length),
      note: `${visibleSalas.filter((sala) => sala.status_ocupacao === "Disponível").length} disponíveis para locação`,
      icon: Building2,
    },
    {
      label: "Salas alugadas",
      value: String(rented.length),
      note: "Contratos em andamento",
      icon: CalendarCheck,
    },
    {
      label: "Taxa de ocupação",
      value: `${occupancy}%`,
      note: `${visibleSalas.length} imóveis no total`,
      icon: TrendingUp,
    },
  ];
  return (
    <section>
      <DashboardShell>
        <PageHeader
          title="Dashboard"
          description="Acompanhe o desempenho dos seus imóveis."
          action
        />
        {error && (
          <p className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ label, value, note, icon: Icon }) => (
            <article
              key={label}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <span className="rounded-xl bg-orange-50 p-3 text-[#D35400]">
                  <Icon size={21} />
                </span>
              </div>
              <p className="text-2xl font-bold">{loading ? "—" : value}</p>
              <p className="mt-2 text-xs font-medium text-emerald-600">
                {loading ? "Carregando dados..." : note}
              </p>
            </article>
          ))}
        </section>
        <section className="mt-7 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="font-bold">Resumo da ocupação</h2>
            <p className="mt-1 text-sm text-slate-500">
              Distribuição dos imóveis cadastrados
            </p>
            <div className="mt-8 flex h-52 items-end justify-between gap-4">
              {(
                ["Disponível", "Reservada", "Alugada", "Manutenção"] as const
              ).map((status) => {
                const count = visibleSalas.filter(
                  (sala) => sala.status_ocupacao === status,
                ).length;
                const height = visibleSalas.length
                  ? Math.max((count / visibleSalas.length) * 100, count ? 12 : 0)
                  : 0;
                return (
                  <div
                    className="flex flex-1 flex-col items-center gap-2"
                    key={status}
                  >
                    <div
                      className="w-full rounded-t-lg bg-[#D35400]"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-center text-xs text-slate-400">
                      {status}
                    </span>
                    <span className="text-xs font-semibold">{count}</span>
                  </div>
                );
              })}
            </div>
          </article>
          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="font-bold">Últimos imóveis</h2>
            {actionError && (
              <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {actionError}
              </p>
            )}
            {visibleSalas.length === 0 && !loading ? (
              <p className="mt-5 text-sm text-slate-500">
                Nenhum imóvel cadastrado.
              </p>
            ) : (
              visibleSalas
                .slice(-3)
                .reverse()
                .map((sala) => (
                  <div
                    key={sala.id}
                    className="flex items-center justify-between gap-3 border-b border-slate-100 py-5 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="size-2 rounded-full bg-[#D35400]" />
                      <div>
                        <p className="text-sm font-medium">
                          Sala comercial #{sala.id}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {sala.tamanho} m² · {money.format(sala.preco)}/mês
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => excluirSala(sala.id)}
                      disabled={deletingId === sala.id}
                      aria-label={`Excluir sala ${sala.id}`}
                      className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))
            )}
          </article>
        </section>
      </DashboardShell>
      ;
    </section>
  );
}
