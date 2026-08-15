"use client";

import DashboardShell from "@/src/components/dashboard/DashboardShell";
import { atualizarSala } from "@/src/lib/salas-api";
import { useSala } from "@/src/lib/use-salas";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const inputStyle =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D35400] focus:ring-4 focus:ring-orange-100";

export default function EditarSalaPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { sala, loading, error } = useSala(params.id);
  const [form, setForm] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (sala)
      queueMicrotask(() =>
        setForm({
          tamanho: String(sala.tamanho),
          preco: String(sala.preco),
          status_ocupacao: sala.status_ocupacao,
          titulo: sala.titulo,
          descricao: sala.descricao,
          tipo: sala.tipo,
          rua: sala.endereco?.rua ?? "",
          numero: sala.endereco?.numero ?? "",
          bairro: sala.endereco?.bairro ?? "",
          cidade: sala.endereco?.cidade ?? "",
          estado: sala.endereco?.estado ?? "",
          cep: sala.endereco?.cep ?? "",
        }),
      );
  }, [sala]);
  const change =
    (key: string) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((current) => ({ ...current, [key]: event.target.value }));

  const buscarCep = async () => {
    const cep = form.cep?.replace(/\D/g, "");
    if (!cep || cep.length !== 8) return;

    setLoadingCep(true);
    setMessage(null);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const endereco = await response.json();

      if (!response.ok || endereco.erro) {
        setMessage("CEP não encontrado. Preencha o endereço manualmente.");
        return;
      }

      setForm((current) => ({
        ...current,
        rua: endereco.logradouro ?? current.rua,
        bairro: endereco.bairro ?? current.bairro,
        cidade: endereco.localidade ?? current.cidade,
        estado: endereco.uf ?? current.estado,
      }));
    } catch {
      setMessage("Não foi possível consultar o CEP. Preencha o endereço manualmente.");
    } finally {
      setLoadingCep(false);
    }
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!sala) return;
    setSaving(true);
    setMessage(null);
    try {
      await atualizarSala(sala.id, {
        dados_sala: {
          titulo: form.titulo,
          descricao: form.descricao,
          tipo: form.tipo as typeof sala.tipo,
          tamanho: Number(form.tamanho),
          preco: Number(form.preco),
          status_ocupacao: form.status_ocupacao as typeof sala.status_ocupacao,
    
        },
        dados_endereco: {
          rua: form.rua,
          numero: form.numero,
          bairro: form.bairro,
          cidade: form.cidade,
          estado: form.estado.toUpperCase(),
          cep: form.cep,
        },
      }, image ?? undefined);
      router.push("/minhas-salas");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a sala.",
      );
    } finally {
      setSaving(false);
    }
  };
  if (loading)
    return (
      <DashboardShell>
        <p>Carregando sala...</p>
      </DashboardShell>
    );
  if (error || !sala)
    return (
      <DashboardShell>
        <p className="rounded-xl bg-red-50 p-4 text-red-700">
          {error ?? "Sala não encontrada."}
        </p>
      </DashboardShell>
    );
  return (
    <DashboardShell>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">Editar sala #{sala.id}</h1>
        <p className="mt-1 text-slate-500">Atualize os dados do seu anúncio.</p>
        <form onSubmit={submit} className="mt-8 space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold">Imagem do anúncio</h2>
            <p className="mt-1 text-sm text-slate-500">Envie uma nova imagem para substituir a imagem atual.</p>
            <div className="mt-5 flex flex-col gap-5 sm:flex-row">
              <div className="grid h-40 w-full place-items-center overflow-hidden rounded-xl bg-slate-100 sm:w-56">
                {preview || sala.fotos ? <img src={preview ?? sala.fotos ?? ""} alt="Imagem da sala" className="h-full w-full object-cover" /> : <ImagePlus className="text-slate-400" size={36} />}
              </div>
              <div className="flex flex-col justify-center gap-3">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-[#D35400] px-5 py-3 text-sm font-semibold text-[#D35400] hover:bg-orange-50">
                  <ImagePlus size={18} className="mr-2" />
                  {image ? "Trocar imagem escolhida" : "Escolher nova imagem"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
                        setMessage("Escolha uma imagem PNG, JPG ou WEBP de até 5 MB.");
                        return;
                      }
                      setMessage(null);
                      setImage(file);
                      setPreview(URL.createObjectURL(file));
                    }}
                  />
                </label>
                {image && <button type="button" onClick={() => { setImage(null); setPreview(null); }} className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-slate-600"><X size={16} />Remover imagem escolhida</button>}
              </div>
            </div>
          </section>
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold">Características</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <label className="text-sm font-semibold sm:col-span-3">
                Título do anúncio
                <input
                  required
                  value={form.titulo ?? ""}
                  onChange={change("titulo")}
                  className={inputStyle}
                />
              </label>
              <label className="text-sm font-semibold">
                Tamanho (m²)
                <input
                  required
                  type="number"
                  step="0.01"
                  value={form.tamanho ?? ""}
                  onChange={change("tamanho")}
                  className={inputStyle}
                />
              </label>
              <label className="text-sm font-semibold">
                Preço mensal (R$)
                <input
                  required
                  type="number"
                  step="0.01"
                  value={form.preco ?? ""}
                  onChange={change("preco")}
                  className={inputStyle}
                />
              </label>
              <label className="text-sm font-semibold">
                Situação
                <select
                  value={form.status_ocupacao ?? ""}
                  onChange={change("status_ocupacao")}
                  className={inputStyle}
                >
                  <option>Disponível</option>
                  <option>Reservada</option>
                  <option>Alugada</option>
                  <option>Manutenção</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                Tipo
                <select
                  value={form.tipo ?? ""}
                  onChange={change("tipo")}
                  className={inputStyle}
                >
                  <option>Comercial</option>
                  <option>Residencial</option>
                </select>
              </label>
              <label className="sm:col-span-2 text-sm font-semibold">
                Descrição
                <textarea
                  required
                  rows={3}
                  value={form.descricao ?? ""}
                  onChange={change("descricao")}
                  className={inputStyle}
                />
              </label>
            </div>
          </section>
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold">Endereço</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {(
                ["rua", "numero", "bairro", "cidade", "estado", "cep"] as const
              ).map((key) => (
                <label
                  className={
                    key === "rua"
                      ? "sm:col-span-2 text-sm font-semibold capitalize"
                      : "text-sm font-semibold capitalize"
                  }
                  key={key}
                >
                  {key}
                  <input
                    required
                    maxLength={key === "estado" ? 2 : undefined}
                    value={form[key] ?? ""}
                    onChange={change(key)}
                    onBlur={key === "cep" ? buscarCep : undefined}
                    disabled={loadingCep && key !== "cep"}
                    className={inputStyle}
                  />
                  {key === "cep" && loadingCep && (
                    <span className="mt-1 block text-xs font-medium text-[#D35400]">
                      Buscando CEP...
                    </span>
                  )}
                </label>
              ))}
            </div>
          </section>
          {message && (
            <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {message}
            </p>
          )}
          <button
            disabled={saving}
            className="ml-auto flex items-center gap-2 rounded-xl bg-[#D35400] px-6 py-3 font-semibold text-white disabled:opacity-70"
          >
            {saving && <LoaderCircle className="animate-spin" size={18} />}
            Salvar alterações
          </button>
        </form>
      </div>
    </DashboardShell>
  );
}
