"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  MapPin,
  Snowflake,
} from "lucide-react";
import Header from "@/src/components/layout/Header";
import { formatCurrency } from "@/src/lib/rooms";
import { useSala } from "@/src/lib/use-salas";
import { useParams } from "next/navigation";
import { salaIdFromSlug } from "@/src/lib/sala-slug";

export default function AnuncioPage() {
  const { id: slug } = useParams<{ id: string }>();
  const salaId = salaIdFromSlug(slug);
  const { sala, loading, error } = useSala(salaId ? String(salaId) : "0");
  if (!salaId)
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Header />
        <p className="mx-auto max-w-7xl px-5 py-10 text-red-700">
          Link de anúncio inválido.
        </p>
      </div>
    );
  if (loading)
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Header />
        <p className="mx-auto max-w-7xl px-5 py-10">Carregando anúncio...</p>
      </div>
    );
  if (error || !sala)
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Header />
        <p className="mx-auto max-w-7xl px-5 py-10 text-red-700">
          {error ?? "Anúncio não encontrado."}
        </p>
      </div>
    );
  const endereco = sala.endereco
    ? `${sala.endereco.rua}, ${sala.endereco.numero} · ${sala.endereco.cidade}, ${sala.endereco.estado}`
    : "Endereço não informado";
  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1b263b]">
      <Header />
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <Link
          href="/minhas-salas"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#737791]"
        >
          <ArrowLeft size={17} />
          Voltar para meus anúncios
        </Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.45fr_.75fr]">
          <div>
            <div className="relative h-80 overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#1b263b,#d35400)] sm:h-110">
              {sala.fotos ? (
                <img
                  src={sala.fotos}
                  alt={sala.titulo}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-[url('/landingPageBg.svg')] bg-cover bg-center opacity-35" />
              )}
            </div>
            <p className="mt-6 text-sm font-semibold text-[#d35400]">
              {sala.status_ocupacao.toUpperCase()}
            </p>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
              {sala.titulo}
            </h1>
            <p className="mt-2 text-sm text-[#737791]">
              Anúncio #{sala.id} · {sala.tipo}
            </p>
            <p className="mt-3 flex items-center gap-2 text-[#737791]">
              <MapPin size={18} />
              {endereco}
            </p>
            <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Sobre o imóvel</h2>
              <p className="mt-4 leading-7 text-[#4f5565]">{sala.descricao}</p>
              <h2 className="mt-8 text-xl font-bold">
                Características da sala
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-[#f5f5f7] p-4">
                  <Building2 size={20} className="text-[#d35400]" />
                  <strong className="mt-3 block text-sm">
                    {sala.tamanho} m²
                  </strong>
                  <span className="text-xs text-[#737791]">Área</span>
                </div>
                <div className="rounded-xl bg-[#f5f5f7] p-4">
                  <Snowflake size={20} className="text-[#d35400]" />
                  <strong className="mt-3 block text-sm">{sala.tipo}</strong>
                  <span className="text-xs text-[#737791]">Tipo do imóvel</span>
                </div>
              </div>
            </section>
          </div>
          <aside className="h-fit rounded-2xl bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,.14)] lg:sticky lg:top-24">
            <p className="text-sm text-[#737791]">Valor mensal</p>
            <p className="mt-1 text-3xl font-bold">
              {formatCurrency(sala.preco)}
              <span className="text-base font-normal text-[#737791]">/mês</span>
            </p>
            <hr className="my-6 border-[#ececec]" />
            <button
              disabled={sala.status_ocupacao !== "Disponível"}
              className="w-full rounded-xl bg-[#d35400] px-4 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sala.status_ocupacao === "Disponível"
                ? "Quero alugar esta sala"
                : "Sala indisponível"}
            </button>
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#d35400] px-4 py-3 font-semibold text-[#d35400]">
              <CalendarDays size={18} />
              Agendar visita gratuita
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}
