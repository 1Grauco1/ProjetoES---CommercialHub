"use client";

import DashboardShell from "@/src/components/dashboard/DashboardShell";
import PageHeader from "@/src/components/dashboard/PageHeader";
import { useSalas } from "@/src/hooks/use-salas";
import {
  Building2,
  CalendarCheck,
  Trash,
  TrendingUp,
  WalletCards,
} from "lucide-react";

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
export default function DashboardPage() {
  const { salas, loading, error } = useSalas();
  const rented = salas.filter((sala) => sala.status_ocupacao === "Alugada");
  const monthlyRevenue = rented.reduce((total, sala) => total + sala.preco, 0);
  const occupancy = salas.length
    ? Math.round((rented.length / salas.length) * 100)
    : 0;
  const cards = [
    {
      label: "Receita mensal",
      value: money.format(monthlyRevenue),
      note: `${rented.length} ${rented.length === 1 ? "sala alugada" : "salas alugadas"}`,
      icon: WalletCards,
    },
    {
      label: "Imóveis cadastrados",
      value: String(salas.length),
      note: `${salas.filter((sala) => sala.status_ocupacao === "Disponível").length} disponíveis para locação`,
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
      note: `${salas.length} imóveis no total`,
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
                const count = salas.filter(
                  (sala) => sala.status_ocupacao === status,
                ).length;
                const height = salas.length
                  ? Math.max((count / salas.length) * 100, count ? 12 : 0)
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
            {salas.length === 0 && !loading ? (
              <p className="mt-5 text-sm text-slate-500">
                Nenhum imóvel cadastrado.
              </p>
            ) : (
              salas
                .slice(-3)
                .reverse()
                .map((sala) => (
                  <div
                    key={sala.id}
                    className="flex gap-3 border-b border-slate-100 py-5 last:border-0"
                  >
                    <span className="mt-1 size-2 rounded-full bg-[#D35400]" />
                    <div>
                      <p className="text-sm font-medium">
                        Sala comercial #{sala.id}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {sala.tamanho} m² · {money.format(sala.preco)}/mês
                      </p>
                      <button><Trash className="text-red-600" size={16} /></button>
                    </div>
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
