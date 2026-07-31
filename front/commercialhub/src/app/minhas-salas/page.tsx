'use client';

import DashboardShell from '@/src/components/dashboard/DashboardShell';
import PageHeader from '@/src/components/dashboard/PageHeader';
import { useSalas } from '@/src/lib/use-salas';
import { deletarSala } from '@/src/lib/salas-api';
import { MapPin, Pencil, Search, SquareDashedBottom, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { salaSlug } from '@/src/lib/sala-slug';

const statusClass = { 'Disponível': 'bg-emerald-100 text-emerald-700', 'Alugada': 'bg-orange-100 text-[#D35400]', 'Reservada': 'bg-blue-100 text-blue-700', 'Manutenção': 'bg-amber-100 text-amber-700' };
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function SalasPage() {
  const { salas, loading, error } = useSalas();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);
  const visibleSalas = salas.filter((sala) => !deletedIds.includes(sala.id));

  const excluirSala = async (id: number) => {
    if (!window.confirm('Deseja excluir este imóvel? Esta ação não pode ser desfeita.')) return;

    setActionError(null);
    setDeletingId(id);
    try {
      await deletarSala(id);
      setDeletedIds((current) => [...current, id]);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Não foi possível excluir a sala.');
    } finally {
      setDeletingId(null);
    }
  };

  return <DashboardShell><PageHeader title="Minhas salas" description={loading ? 'Carregando salas...' : `${visibleSalas.length} ${visibleSalas.length === 1 ? 'sala cadastrada' : 'salas cadastradas'}`} action />
    <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:flex-row"><div className="flex flex-1 items-center gap-2 rounded-xl bg-slate-100 px-4"><Search size={18} className="text-slate-400"/><input className="h-12 w-full bg-transparent text-sm outline-none" placeholder="Buscar sala..." /></div><button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold">Filtros</button></div>
    {(error || actionError) && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error ?? actionError}</p>}
    {loading ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[1,2,3].map(item => <div key={item} className="h-96 animate-pulse rounded-2xl bg-slate-200" />)}</div> : visibleSalas.length === 0 ? <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><div><SquareDashedBottom className="mx-auto text-slate-400" size={42}/><h2 className="mt-4 text-lg font-bold">Nenhuma sala cadastrada</h2><p className="mt-1 text-sm text-slate-500">Quando você anunciar um imóvel, ele aparecerá aqui.</p></div></div> : <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visibleSalas.map(sala => <article key={sala.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"><div className="flex h-36 items-center justify-center bg-gradient-to-br from-slate-200 to-slate-100">{sala.fotos ? <img className="h-full w-full object-cover" src={sala.fotos} alt={`Sala ${sala.id}`} /> : <SquareDashedBottom className="text-slate-400" size={44}/>}</div><div className="p-5"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass[sala.status_ocupacao]}`}>{sala.status_ocupacao}</span><h2 className="mt-4 font-bold">{sala.titulo} #{sala.id}</h2><p className="mt-2 flex items-center gap-1 text-sm text-slate-500"><MapPin size={15}/>{sala.endereco ? `${sala.endereco.bairro} — ${sala.endereco.cidade}, ${sala.endereco.estado}` : 'Endereço não informado'}</p><p className="mt-4 text-lg font-bold text-[#D35400]">{currency.format(sala.preco)}/mês</p><div className="mt-4 text-sm text-slate-500">{sala.tamanho} m²</div><div className="mt-5 grid grid-cols-3 gap-3"><Link href={`/anuncio/${salaSlug(sala.titulo, sala.id)}`} className="inline-flex items-center justify-center rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Ver anúncio</Link><Link href={`/minhas-salas/${sala.id}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D35400] py-2.5 text-sm font-semibold text-[#D35400] hover:bg-orange-50"><Pencil size={16} />Editar</Link><button type="button" disabled={deletingId === sala.id} onClick={() => excluirSala(sala.id)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"><Trash2 size={16} />{deletingId === sala.id ? 'Excluindo...' : 'Excluir'}</button></div></div></article>)}</section>}</DashboardShell>;
}
