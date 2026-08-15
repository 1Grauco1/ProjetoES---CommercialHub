'use client';

import { Suspense, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  Bed,
  Bell,
  Building2,
  Building2Icon,
  CalendarDays,
  Car,
  Home,
  HomeIcon,
  LoaderCircle,
  MapPin,
  ShieldCheck,
  ShowerHead,
  Snowflake,
  Wifi,
  Wind,
} from "lucide-react";
import { formatCurrency } from "@/src/utils/format";import { useSala } from "@/src/hooks/use-salas";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { salaIdFromSlug } from "@/src/utils/slug";


const API_URL = "http://localhost:8000";

function numeroWhatsApp(numero?: string | null): string | null {
  if (!numero) return null;

  const digitos = numero.replace(/\D/g, "").replace(/^0+/, "");

  if (!digitos) return null;

  if (digitos.length >= 12 && digitos.startsWith("55")) return digitos;

  if (digitos.length >= 10 && digitos.length <= 11) return `55${digitos}`;

  return digitos;
}

function AnuncioContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const slug = params?.id;
  const salaId = salaIdFromSlug(slug);
  const origem = searchParams.get("from");
  
  let voltarHref = "/dashboard";
  let textoVoltar = "Voltar para o dashboard";

  if (origem === "busca") {
    voltarHref = "/busca-sala";
    textoVoltar = "Voltar para a busca";
  } else if (origem === "minhas-salas") {
    voltarHref = "/minhas-salas";
    textoVoltar = "Voltar para minhas salas";
  }

  const { sala, loading, error } = useSala(salaId ? String(salaId) : "0");

  const [fotoSelecionada, setFotoSelecionada] = useState<string | null>(null);

  if (!salaId)
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <p className="mx-auto max-w-7xl px-5 py-10 font-semibold text-red-700">
          Link de anúncio inválido.
        </p>
      </div>
    );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <p className="mx-auto max-w-7xl px-5 py-10 text-[#737791]">
          Carregando anúncio...
        </p>
      </div>
    );
  }

  if (error || !sala) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <p className="mx-auto max-w-7xl px-5 py-10 font-semibold text-red-700">
          {error ?? "Anúncio não encontrado."}
        </p>
      </div>
    );
  }

  const endereco = sala.endereco
    ? `${sala.endereco.rua}, ${sala.endereco.numero} · ${sala.endereco.cidade}, ${sala.endereco.estado}`
    : "Endereço não informado";

  const amenidades = [
    { label: "Ar condicionado", enabled: sala.ar_condicionado, Icon: Wind },
    { label: "Elevador", enabled: sala.elevador, Icon: ArrowUp },
    { label: "Portaria", enabled: sala.portaria, Icon: ShieldCheck },
    { label: "Mobiliada", enabled: sala.mobiliada, Icon: Home },
    { label: "Internet", enabled: sala.internet, Icon: Wifi },
    { label: "Alarme", enabled: sala.alarme, Icon: Bell },
    { label: "Estacionamento", enabled: sala.estacionamento, Icon: Car },
  ].filter((item) => item.enabled);

  const listaFotos: string[] = Array.isArray(sala.fotos)
    ? sala.fotos
        .map((item: any) => {
          let caminhoRelativo =
            typeof item === "string" ? item : item?.caminho || item?.url || "";

          if (!caminhoRelativo) return "";

          if (caminhoRelativo.startsWith("http")) return caminhoRelativo;

          if (!caminhoRelativo.startsWith("/")) {
            caminhoRelativo = `/${caminhoRelativo}`;
          }

          // 4. Retorna a URL pronta
          return `${API_URL}${caminhoRelativo}`;
        })
        .filter(Boolean) // Remove eventuais caminhos vazios
    : typeof sala.fotos === "string" && sala.fotos
      ? [
          sala.fotos.startsWith("http")
            ? sala.fotos
            : `${API_URL}${sala.fotos.startsWith("/") ? sala.fotos : `/${sala.fotos}`}`,
        ]
      : [];

  const fotoExibida = fotoSelecionada || listaFotos[0];

  const redirecionarWhatsApp = (tipo: "alugar" | "visita") => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");

    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent(`/anuncio/${slug}`)}`);
      return;
    }

    const numero = numeroWhatsApp(sala.proprietario_whatsapp);

    if (!numero) {
      window.alert(
        "O proprietário desta sala ainda não cadastrou um WhatsApp.",
      );
      return;
    }

    const mensagem =
      tipo === "alugar"
        ? `Olá! Tenho interesse em alugar a sala "${sala.titulo}" por ${formatCurrency(
            sala.preco,
          )}/mês, anunciada no CommercialHub. Pode me passar mais informações?`
        : `Olá! Gostaria de agendar uma visita à sala "${sala.titulo}", anunciada no CommercialHub.`;

    window.open(
      `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1b263b]">
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <Link
          href={voltarHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#737791] transition-colors hover:text-[#1b263b]"
        >
          <ArrowLeft size={17} />
          {textoVoltar}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.45fr_.75fr]">
          <div>
            <div className="relative h-80 overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#1b263b,#d35400)] sm:h-110">
              {fotoExibida ? (
                <img
                  src={fotoExibida}
                  alt={sala.titulo}
                  className="h-full w-full object-cover transition-all duration-300"
                />
              ) : (
                <div className="absolute inset-0 bg-[url('/landingPageBg.svg')] bg-cover bg-center opacity-35" />
              )}
            </div>

            {listaFotos.length > 1 && (
              <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2">
                {listaFotos.map((urlFoto, index) => (
                  <button
                    key={index}
                    onClick={() => setFotoSelecionada(urlFoto)}
                    className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      fotoExibida === urlFoto
                        ? "border-[#d35400] scale-105"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={urlFoto}
                      alt={`Foto ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <p className="mt-6 text-sm font-semibold text-[#d35400]">
              {sala.status_ocupacao?.toUpperCase() || "STATUS INDISPONÍVEL"}
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
              <p className="mt-4 whitespace-pre-wrap leading-7 text-[#4f5565]">
                {sala.descricao}
              </p>
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
                {sala.quartos > 0 && (
                  <div className="rounded-xl bg-[#f5f5f7] p-4">
                    <Bed size={20} className="text-[#d35400]" />
                    <strong className="mt-3 block text-sm">
                      {sala.quartos}
                    </strong>
                    <span className="text-xs text-[#737791]">Quartos</span>
                  </div>
                )}

                {sala.banheiros > 0 && (
                  <div className="rounded-xl bg-[#f5f5f7] p-4">
                    <ShowerHead size={20} className="text-[#d35400]" />
                    <strong className="mt-3 block text-sm">
                      {sala.banheiros}
                    </strong>
                    <span className="text-xs text-[#737791]">Banheiros</span>
                  </div>
                )}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {sala.vagas_garagem > 0 && (
                  <div className="rounded-xl bg-[#f5f5f7] p-4">
                    <Car size={20} className="text-[#d35400]" />
                    <strong className="mt-3 block text-sm">
                      {sala.vagas_garagem}
                    </strong>
                    <span className="text-xs text-[#737791]">Vagas</span>
                  </div>
                )}

                <div className="rounded-xl bg-[#f5f5f7] p-4">
                  {sala.tipo === "Residencial" ?( <HomeIcon size={20} className="text-[#d35400]" />):( <Building2Icon size={20} className="text-[#d35400]" />)}
                 
                  <strong className="mt-3 block text-sm">{sala.tipo}</strong>
                  <span className="text-xs text-[#737791]">Tipo do imóvel</span>
                </div>
              </div>
              {amenidades.length > 0 && (
                <div className="mt-6 rounded-2xl bg-[#f5f5f7] p-4">
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {amenidades.map(({ label, Icon }) => (
                      <div
                        key={label}
                        className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
                      >
                        <Icon size={20} className="text-[#d35400]" />
                        <span className="text-sm text-[#374151]">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              onClick={() => redirecionarWhatsApp("alugar")}
              disabled={sala.status_ocupacao !== "Disponível"}
              className="w-full rounded-xl bg-[#d35400] px-4 py-3.5 font-semibold text-white transition-colors hover:bg-[#b04600] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#d35400]"
            >
              {sala.status_ocupacao === "Disponível"
                ? "Quero alugar esta sala"
                : "Sala indisponível"}
            </button>
            <button
              onClick={() => redirecionarWhatsApp("visita")}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#d35400] px-4 py-3 font-semibold text-[#d35400] transition-colors hover:bg-[#fff4ed]"
            >
              <CalendarDays size={18} />
              Agendar visita gratuita
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default function AnuncioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
          <LoaderCircle className="animate-spin text-[#d35400]" size={42} />
        </div>
      }
    >
      <AnuncioContent />
    </Suspense>
  );
}