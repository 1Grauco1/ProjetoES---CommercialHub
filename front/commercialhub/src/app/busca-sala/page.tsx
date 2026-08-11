"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  LoaderCircle, 
  Search, 
  MapPin, 
  Star, 
  Heart, 
  ChevronDown, 
  Building2, 
  ArrowLeft 
} from "lucide-react"; 
import Header from "@/src/components/layout/Header";
import { useTodasSalas } from "@/src/lib/use-salas";
import { salaSlug } from "@/src/lib/sala-slug";
import { formatCurrency } from "@/src/lib/rooms";

type Filter = "Todas" | "Disponível" | "Alugada" | "Reservada" | "Manutenção";

interface SalaEndereco {
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

interface Sala {
  id: number | string;
  titulo?: string;
  descricao?: string;
  tipo?: string;
  tamanho?: number;
  preco?: number;
  status_ocupacao?: string;
  fotos?: string | null;
  endereco?: SalaEndereco | null;
}

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  "Disponível": { bg: "bg-emerald-100", text: "text-emerald-700", label: "Disponível" },
  "Alugada": { bg: "bg-orange-100", text: "text-[#d35400]", label: "Alugada" },
  "Reservada": { bg: "bg-blue-100", text: "text-blue-700", label: "Reservada" },
  "Manutenção": { bg: "bg-amber-100", text: "text-amber-700", label: "Manutenção" },
  "Todas": { bg: "bg-slate-100", text: "text-slate-700", label: "Todas" },
};

function RoomCard({ sala }: Readonly<{ sala: Sala }>) {
  const [liked, setLiked] = useState(false);
  const statusAtual = sala.status_ocupacao || "Todas";
  const badge = STATUS_BADGE[statusAtual] || STATUS_BADGE["Todas"];
  const available = statusAtual === "Disponível";

  const locationText = sala.endereco?.bairro && sala.endereco?.estado
    ? `${sala.endereco.bairro}, ${sala.endereco.estado}`
    : "Endereço não informado";

  const districtText = sala.endereco?.cidade || "Local não informado";
  
  const tipoFormatado = (sala.tipo || "").toLowerCase();
  let typeEmoji = "🏢";

  if (tipoFormatado.includes("residencial")) {
    typeEmoji = "🏠";
  } else if (tipoFormatado.includes("coworking")) {
    typeEmoji = "💻";
  }

  const tituloSeguro = sala.titulo || "Sala sem título";

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06)]">
      <div className="relative h-40 shrink-0 overflow-hidden bg-slate-800 flex items-center justify-center">
        {sala.fotos ? (
          <img src={sala.fotos} alt={tituloSeguro} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 text-slate-400">
            <Building2 size={36} />
            <span className="text-[10px] font-medium uppercase tracking-wider">Espaço Comercial</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.1)] via-transparent to-[rgba(0,0,0,0.7)] pointer-events-none" />

        <button
          type="button"
          onClick={() => setLiked(!liked)}
          className="absolute left-2.5 top-2.5 z-10 flex size-7 items-center justify-center rounded-full bg-[rgba(255,255,255,0.9)] transition-colors hover:bg-white"
        >
          <Heart size={15} className={liked ? "fill-[#d35400] text-[#d35400]" : "text-[#979797]"} />
        </button>

        <span className={`absolute right-2.5 top-2.5 z-10 rounded-full px-2 py-[2px] text-[10px] font-semibold leading-[15px] ${badge.bg} ${badge.text}`}>
          {badge.label}
        </span>

        <span className="absolute right-2.5 top-9 z-10 rounded-full bg-[rgba(0,0,0,0.4)] px-2 py-[2px] text-[10px] font-medium leading-[15px] text-white">
          {typeEmoji} {sala.tipo || "Comercial"}
        </span>

        <div className="absolute bottom-0 left-0 z-10 flex w-full flex-col gap-0.5 px-3 pb-2.5">
          <div className="flex items-center gap-1">
            <MapPin size={10} className="text-white/70" />
            <span className="w-full truncate text-[9px] font-medium leading-[13.5px] text-[rgba(255,255,255,0.7)]">{locationText}</span>
          </div>
          <p className="w-full truncate text-sm font-bold leading-[18px] tracking-[-0.2px] text-white">{tituloSeguro}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-3.5 py-3">
        <div className="flex items-center gap-1.5">
          <Star size={12} className="fill-[#F5A623] text-[#F5A623]" />
          <span className="text-xs font-semibold leading-[18px] text-[#1b263b]">5.0</span>
          <span className="text-[11px] leading-[16.5px] text-[#979797]">(novo)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#737791]">{sala.tamanho || 0} m²</span>
          <span className="text-base text-[#d9d9d9]">·</span>
          <span className="truncate text-[11px] text-[#737791]">{districtText}</span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[#f0f0f2] pt-[9px]">
          <div>
            <p className="text-base font-bold leading-5 text-[#d35400]">{formatCurrency(sala.preco || 0)}</p>
            <p className="text-[10px] leading-[15px] text-[#979797]">por mês</p>
          </div>
          {available ? (
            <Link 
              href={sala.id ? `/anuncio/${salaSlug(tituloSeguro, Number(sala.id))}?from=busca` : "#"}
              className="flex h-8 items-center justify-center rounded-[10px] bg-[#d35400] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#b84800]"
            >
              Ver Detalhes
            </Link>
          ) : (
            <button type="button" disabled className="flex h-8 cursor-not-allowed items-center rounded-[10px] bg-[#ececec] px-4 text-xs font-semibold leading-[18px] text-[#979797]">
              {statusAtual}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function BuscaSalaPageContent() {
  const searchParams = useSearchParams();
  const termoInicial = searchParams?.get("q") || "";
  
  const { salas, loading, error } = useTodasSalas();

  const [activeFilter, setActiveFilter] = useState<Filter>("Todas");
  const [searchName, setSearchName] = useState(termoInicial);
  const [searchLocation, setSearchLocation] = useState("");
  const [sortBy, setSortBy] = useState("Relevância");
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    if (termoInicial) setSearchName(termoInicial);
  }, [termoInicial]);

  const filtered = (salas || []).filter((s) => {
    const matchFilter = activeFilter === "Todas" || s.status_ocupacao === activeFilter;
    
    const tituloValido = s.titulo || "";
    const tipoValido = s.tipo || "";
    
    const matchName = 
      tituloValido.toLowerCase().includes(searchName.toLowerCase()) || 
      tipoValido.toLowerCase().includes(searchName.toLowerCase());
      
    const locLower = searchLocation.toLowerCase();
    const matchLoc = !searchLocation || (s.endereco && (
      (s.endereco.bairro?.toLowerCase().includes(locLower)) ||
      (s.endereco.cidade?.toLowerCase().includes(locLower)) ||
      (s.endereco.estado?.toLowerCase().includes(locLower))
    ));
    
    return matchFilter && matchName && matchLoc;
  });

  const sorted = [...filtered].sort((a, b) => {
    const precoA = a.preco || 0;
    const precoB = b.preco || 0;

    if (sortBy === "Menor preço") return precoA - precoB;
    if (sortBy === "Maior preço") return precoB - precoA;
    return 0;
  });

  const SORT_OPTIONS = ["Relevância", "Menor preço", "Maior preço"];

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5] text-[#1b263b]">
      <Header />

      <div className="relative shrink-0 bg-[#1b263b] z-10">
        <Link
          href="/dashboard"
          className="absolute left-5 top-6 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/25 shadow-sm"
        >
          <ArrowLeft size={16} />
          Voltar ao dashboard
        </Link>

        <div className="absolute -top-24 right-[180px] size-72 rounded-full bg-[#d35400] opacity-10 pointer-events-none" />
        <div className="absolute left-32 top-16 size-48 rounded-full bg-[#d35400] opacity-7 pointer-events-none" />

        <div className="flex flex-col items-center justify-center gap-5 px-8 py-20 lg:px-16">
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs font-medium uppercase tracking-[1.2px] text-[#d35400]">Encontre seu espaço ideal</p>
            <h1 className="text-center text-2xl font-bold text-white lg:text-3xl">
              Busque salas comerciais em <span className="text-[#d35400]">todo o Brasil</span>
            </h1>
          </div>

          <div className="mt-4 flex w-full max-w-3xl items-center gap-2 rounded-2xl bg-white p-2 shadow-[0px_25px_25px_rgba(0,0,0,0.25)]">
            <div className="flex h-12 flex-1 min-w-0 items-center gap-3 rounded-xl bg-[#f5f5f7] px-4">
              <Search size={18} className="shrink-0 text-[#979797]" />
              <input
                type="text"
                placeholder="Nome da sala ou tipo..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full bg-transparent text-sm text-[#333] placeholder-[#979797] outline-none"
              />
            </div>

            <div className="my-2 h-full w-px self-stretch bg-[#e8e8e8] shrink-0" />

            <div className="flex h-12 flex-1 min-w-0 items-center gap-3 rounded-xl bg-[#f5f5f7] px-4">
              <MapPin size={18} className="shrink-0 text-[#979797]" />
              <input
                type="text"
                placeholder="Bairro ou cidade..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full bg-transparent text-sm text-[#333] placeholder-[#979797] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative shrink-0 border-b border-[#ececec] bg-white z-30">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-5 lg:px-8">
          <div className="flex flex-1 items-center gap-3 overflow-x-auto pr-4">
            {(["Todas", "Disponível", "Alugada", "Manutenção"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`h-8 shrink-0 rounded-full border px-[17px] py-px text-[13px] font-medium leading-[19.5px] whitespace-nowrap transition-colors ${
                  activeFilter === f
                    ? "border-[#d35400] bg-[#d35400] text-white"
                    : "border-[#d9d9d9] bg-white text-[#333] hover:border-[#d35400] hover:text-[#d35400]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative ml-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowSort(!showSort)}
              className="flex h-8 w-[147px] items-center justify-between rounded-full border border-[#d9d9d9] bg-white px-[17px] py-px transition-colors hover:border-[#d35400]"
            >
              <span className="truncate text-[13px] font-medium text-black">{sortBy}</span>
              <ChevronDown size={14} className="shrink-0 text-[#333]" />
            </button>

            {showSort && (
              <div className="absolute right-0 top-10 z-50 min-w-[147px] overflow-hidden rounded-xl border border-[#d9d9d9] bg-white py-1 shadow-lg">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => { setSortBy(opt); setShowSort(false); }}
                    className={`w-full px-4 py-2 text-left text-[13px] transition-colors hover:bg-[#f5f5f7] ${opt === sortBy ? "font-semibold text-[#d35400]" : "text-[#333]"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="z-10 mx-auto flex flex-1 flex-col w-full max-w-7xl px-5 py-8 sm:px-8">
        {(() => {
          if (loading) {
            return (
              <div className="m-auto flex flex-col items-center justify-center gap-4 py-20 text-center">
                <LoaderCircle className="animate-spin text-[#d35400]" size={42} />
                <p className="text-lg font-semibold text-[#1b263b]">Carregando salas disponíveis...</p>
              </div>
            );
          }

          if (error) {
            return (
              <div className="m-auto flex flex-col items-center justify-center gap-3 py-20 text-center">
                <p className="text-lg font-semibold text-red-600">Erro ao carregar as salas</p>
                <p className="text-sm text-[#737791]">{error}</p>
              </div>
            );
          }

          return (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#1b263b]">Salas Disponíveis</h2>
                <p className="text-sm text-[#737791]">
                  {sorted.length} {sorted.length === 1 ? "sala encontrada" : "salas encontradas"}
                </p>
              </div>

              {sorted.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {sorted.map((sala, index) => (
                    <RoomCard key={sala.id || index} sala={sala} />
                  ))}
                </div>
              ) : (
                <div className="m-auto flex flex-col items-center justify-center gap-3 py-20 text-center">
                  <p className="text-4xl">🔍</p>
                  <p className="text-lg font-semibold text-[#1b263b]">Nenhuma sala encontrada</p>
                  <p className="text-sm text-[#737791]">Tente ajustar os filtros ou a busca.</p>
                </div>
              )}
            </>
          );
        })()}
      </main>
    </div>
  );
}

export default function BuscaSalaPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
        <LoaderCircle className="animate-spin text-[#d35400]" size={42} />
      </div>
    }>
      <BuscaSalaPageContent />
    </Suspense>
  );
}