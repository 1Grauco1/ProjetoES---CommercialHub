"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, Search } from "lucide-react";
import { usePerfil } from "@/src/hooks/use-salas";
import { useDashboardUI } from "@/src/context/dashboard-ui";

function initials(nome?: string | null) {
  if (!nome?.trim()) return "U";

  const partes = nome.trim().split(/\s+/);

  return partes.length === 1
    ? partes[0].slice(0, 2).toUpperCase()
    : `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

export default function DashboardHeader({
  hasSidebar,
}: {
  hasSidebar: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { openSidebar } = useDashboardUI();
  const [busca, setBusca] = useState("");
  const perfil = usePerfil();
  const ativo = pathname.startsWith("/perfil");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      busca.trim()
        ? `/busca-sala?q=${encodeURIComponent(busca)}`
        : "/busca-sala",
    );
  };

  return (
    <header
      className={`sticky top-0 z-30 flex h-18 items-center justify-between border-b bg-white/95 px-5 backdrop-blur lg:px-10 ${
        hasSidebar ? "lg:ml-72" : ""
      }`}
    >
      {hasSidebar && (
        <button
          className="rounded-lg p-2 text-[#1B263B] transition-colors hover:bg-slate-100 lg:hidden"
          onClick={openSidebar}
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
      )}

      <form
        onSubmit={handleSearch}
        className="hidden items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-500 focus-within:ring-2 focus-within:ring-[#D35400] md:flex"
      >
        <button
          type="submit"
          aria-label="Realizar busca"
          className="transition-colors hover:text-[#D35400]"
        >
          <Search size={18} />
        </button>
        <input
          type="text"
          placeholder="Buscar sala..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-48 bg-transparent text-[#1B263B] placeholder-slate-500 outline-none"
        />
      </form>

      <Link
        href="/perfil"
        className={`ml-auto flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors ${
          ativo ? "bg-[#D35400] text-white" : "hover:bg-slate-100"
        }`}
      >
        <div
          className={`grid size-10 place-items-center rounded-full font-bold ${
            ativo ? "bg-white text-[#D35400]" : "bg-orange-100 text-[#D35400]"
          }`}
        >
          {initials(perfil?.nome)}
        </div>
        <div className="hidden text-sm sm:block">
          <p className="font-semibold">{perfil?.nome ?? "Carregando..."}</p>
          <p
            className={
              ativo ? "text-xs text-white/80" : "text-xs text-slate-500"
            }
          >
            {perfil?.email ?? "Perfil"}
          </p>
        </div>
      </Link>
    </header>
  );
}
