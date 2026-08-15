"use client";

import DashboardShell from "@/src/components/dashboard/DashboardShell";
import PageHeader from "@/src/components/dashboard/PageHeader";
import {
  listarContratos,
  formatarData,
  type Contrato,
  type StatusContrato,
} from "@/src/services/contratos.service";
import { useEffect, useState } from "react";

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const statusLabel: Record<StatusContrato, string> = {
  Ativo: "Ativo",
  Encerrado: "Encerrado",
  Cancelado: "Cancelado",
  Pendente: "Pendente",
};

function StatusBadge({ status }: { status: StatusContrato }) {
  const classes: Record<StatusContrato, string> = {
    Ativo: "bg-emerald-100 text-emerald-700",
    Encerrado: "bg-slate-100 text-slate-600",
    Cancelado: "bg-red-100 text-red-700",
    Pendente: "bg-amber-100 text-amber-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${classes[status]}`}
    >
      {statusLabel[status]}
    </span>
  );
}

export default function ContratosPage() {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listarContratos()
      .then(setContratos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const ativos = contratos.filter((c) => c.status === "Ativo");
  const encerrados = contratos.filter((c) => c.status === "Encerrado");
  const faturamento = ativos.reduce((total, c) => total + c.valor, 0);

  const cards = [
    { label: "Total de contratos", value: String(contratos.length) },
    { label: "Em andamento", value: String(ativos.length) },
    { label: "Encerrados", value: String(encerrados.length) },
    { label: "Faturamento ativo", value: money.format(faturamento) },
  ];

  return (
    <DashboardShell>
      <PageHeader
        title="Contratos"
        description="Gerencie todos os seus contratos e locatários."
      />
      {error && (
        <p className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value }) => (
          <article
            key={label}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-bold">
              {loading ? "—" : value}
            </p>
          </article>
        ))}
      </section>
      <section className="mt-7 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-100 p-6">
          <h2 className="font-bold">Todos os contratos</h2>
        </div>
        {loading ? (
          <p className="p-6 text-sm text-slate-500">Carregando contratos...</p>
        ) : contratos.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            Nenhum contrato cadastrado ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  {["ID", "Sala", "Início", "Término", "Valor", "Status"].map(
                    (head) => (
                      <th className="px-6 py-4 font-semibold" key={head}>
                        {head}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {contratos.map((contrato) => (
                  <tr
                    key={contrato.id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-6 py-5 font-semibold">
                      {contrato.id}
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-medium">
                        Sala #{contrato.id_sala}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-500">
                      {formatarData(contrato.data_inicio)}
                    </td>
                    <td className="px-6 py-5 text-slate-500">
                      {formatarData(contrato.data_termino)}
                    </td>
                    <td className="px-6 py-5 font-semibold">
                      {money.format(contrato.valor)}
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={contrato.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
