"use client";

import DashboardShell from "@/src/components/dashboard/DashboardShell";
import PageHeader from "@/src/components/dashboard/PageHeader";
import { useSalas } from "@/src/hooks/use-salas";
import { deletarSala } from "@/src/services/salas.service";
import {
  MapPin,
  Pencil,
  Search,
  SquareDashedBottom,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { salaSlug } from "@/src/utils/slug";

const statusClass: Record<string, string> = {
  Disponível: "bg-emerald-100 text-emerald-700",
  Alugada: "bg-orange-100 text-[#D35400]",
  Reservada: "bg-blue-100 text-blue-700",
  Manutenção: "bg-amber-100 text-amber-700",
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function SalasPage() {
  const { salas, loading, error } = useSalas();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const termo = searchName.trim().toLowerCase();
  const local = searchLocation.trim().toLowerCase();

  const visibleSalas = salas.filter((sala) => {
    if (deletedIds.includes(sala.id)) return false;

    const tituloValido = (sala.titulo || "").toLowerCase();
    const tipoValido = (sala.tipo || "").toLowerCase();

    const matchName =
      !termo || tituloValido.includes(termo) || tipoValido.includes(termo);

    const endereco = sala.endereco;
    const matchLocation =
      !local ||
      (endereco &&
        ((endereco.bairro || "").toLowerCase().includes(local) ||
          (endereco.cidade || "").toLowerCase().includes(local) ||
          (endereco.estado || "").toLowerCase().includes(local)));

    return matchName && matchLocation;
  });

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

  return (
    <DashboardShell>
      <PageHeader
        title="Minhas salas"
        description={
          loading
            ? "Carregando salas..."
            : `${visibleSalas.length} ${visibleSalas.length === 1 ? "sala cadastrada" : "salas cadastradas"}`
        }
        action
      />
      <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-slate-100 px-4">
          <Search size={18} className="text-slate-400" />
          <input
            className="h-12 w-full bg-transparent text-sm outline-none"
            placeholder="Nome da sala ou tipo..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-slate-100 px-4">
          <MapPin size={18} className="text-slate-400" />
          <input
            className="h-12 w-full bg-transparent text-sm outline-none"
            placeholder="Bairro ou cidade..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
        </div>
      </div>
      {(error || actionError) && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error ?? actionError}
        </p>
      )}
      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-96 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      ) : visibleSalas.length === 0 ? (
        <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <div>
            <SquareDashedBottom className="mx-auto text-slate-400" size={42} />
            <h2 className="mt-4 text-lg font-bold">Nenhuma sala cadastrada</h2>
            <p className="mt-1 text-sm text-slate-500">
              Quando você anunciar um imóvel, ele aparecerá aqui.
            </p>
          </div>
        </div>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleSalas.map((sala) => (
            <article
              key={sala.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 flex flex-col"
            >
              <div className="flex h-36 items-center justify-center bg-gradient-to-br from-slate-200 to-slate-100 relative overflow-hidden">
                {sala.fotos ? (
                  <img
                    className="h-full w-full object-cover"
                    src={(() => {
                      const foto = Array.isArray(sala.fotos)
                        ? sala.fotos[0]
                        : sala.fotos;
                      return typeof foto === "object" && foto !== null
                        ? foto.url || ""
                        : foto;
                    })()}
                    alt={`Sala ${sala.id}`}
                  />
                ) : (
                  <SquareDashedBottom className="text-slate-400" size={44} />
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${statusClass[sala.status_ocupacao || "Disponível"] || "bg-slate-100 text-slate-700"}`}
                >
                  {sala.status_ocupacao || "Disponível"}
                </span>
                <h2 className="mt-4 font-bold">
                  {sala.titulo || "Sala sem título"} #{sala.id}
                </h2>
                <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
                  <MapPin size={15} />
                  {sala.endereco
                    ? `${sala.endereco.bairro} — ${sala.endereco.cidade}, ${sala.endereco.estado}`
                    : "Endereço não informado"}
                </p>
                <p className="mt-4 text-lg font-bold text-[#D35400]">
                  {currency.format(sala.preco || 0)}/mês
                </p>
                <div className="mt-1 text-sm text-slate-500">
                  {sala.tamanho || 0} m²
                </div>
                <div className="mt-auto pt-5 grid grid-cols-3 gap-3">
                  <Link
                    href={`/anuncio/${salaSlug(sala.titulo || "sala", sala.id)}?from=minhas-salas`}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Ver anúncio
                  </Link>
                  <Link
                    href={`/minhas-salas/${sala.id}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#D35400] py-2.5 text-sm font-semibold text-[#D35400] hover:bg-orange-50"
                  >
                    <Pencil size={15} />
                    Editar
                  </Link>
                  <button
                    type="button"
                    disabled={deletingId === sala.id}
                    onClick={() => excluirSala(sala.id)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={15} />
                    {deletingId === sala.id ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </DashboardShell>
  );
}