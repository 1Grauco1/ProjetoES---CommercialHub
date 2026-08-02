'use client';

import DashboardShell from '@/src/components/dashboard/DashboardShell';
import { criarSala } from '@/src/lib/salas-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight, ImagePlus, LoaderCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  // Campos da Sala
  titulo: z.string().min(3, 'Informe um título para o anúncio.'),
  descricao: z.string().min(5, 'Informe uma descrição.'),
  tipo: z.enum(['Comercial', 'Residencial']),
  tamanho: z.coerce.number().positive('Informe uma metragem válida.'),
  preco: z.coerce.number().positive('Informe um preço válido.'),
  status_ocupacao: z.enum(['Disponível', 'Reservada', 'Alugada', 'Manutenção']),

  // Campos de Endereço
  rua: z.string().min(3, 'Informe a rua.'),
  numero: z.string().min(1, 'Informe o número.'),
  bairro: z.string().min(2, 'Informe o bairro.'),
  cidade: z.string().min(2, 'Informe a cidade.'),
  estado: z
    .string()
    .length(2, 'Use a sigla do estado (ex.: PE).')
    .transform((value) => value.toUpperCase()),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, 'Informe um CEP válido.'),
});

type FormValues = z.input<typeof schema>;

const inputStyle =
  'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D35400] focus:ring-4 focus:ring-orange-100 disabled:bg-slate-100 disabled:cursor-not-allowed';

export default function CadastrarImovelPage() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status_ocupacao: 'Disponível',
      tipo: 'Comercial',
    },
    mode: 'onBlur',
  });

  const handleCepBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const rawCep = event.target.value.replace(/\D/g, '');

    if (rawCep.length !== 8) return;

    setLoadingCep(true);
    setMessage(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setMessage('CEP não encontrado.');
        return;
      }

      setValue('rua', data.logradouro, { shouldValidate: true });
      setValue('bairro', data.bairro, { shouldValidate: true });
      setValue('cidade', data.localidade, { shouldValidate: true });
      setValue('estado', data.uf, { shouldValidate: true });
    } catch {
      setMessage('Erro ao buscar o CEP. Preencha o endereço manualmente.');
    } finally {
      setLoadingCep(false);
    }
  };

  const pickImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
        setMessage('Escolha apenas imagens de até 5 MB.');
        return;
      }

      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setMessage(null);

    setImages((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);

    // Se ainda não houver uma imagem sendo exibida,
    // começa pela primeira imagem adicionada.
    if (previews.length === 0) {
      setCurrentIndex(0);
    }

    // Permite selecionar novamente o mesmo arquivo.
    event.target.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    const previewToRemove = previews[indexToRemove];

    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove);
    }

    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setPreviews((prev) => prev.filter((_, index) => index !== indexToRemove));

    if (currentIndex >= previews.length - 1) {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const nextImage = () => {
    if (previews.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % previews.length);
    }
  };

  const prevImage = () => {
    if (previews.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + previews.length) % previews.length);
    }
  };

  const submit = async (values: FormValues) => {
    setMessage(null);
    setLoading(true);

    try {
      await criarSala(
        {
          dados_sala: {
            id_proprietario: 0,
            id_endereco: 0,
            titulo: values.titulo,
            descricao: values.descricao,
            tipo: values.tipo,
            tamanho: Number(values.tamanho),
            preco: Number(values.preco),
            status_ocupacao: values.status_ocupacao,
            fotos: null,
          },
          dados_endereco: {
            rua: values.rua,
            numero: values.numero,
            bairro: values.bairro,
            cidade: values.cidade,
            estado: values.estado,
            cep: values.cep,
          },
        },

        // Envia todas as imagens selecionadas.
        // Se nenhuma imagem foi selecionada, não envia imagens.
        images.length > 0 ? images : undefined
      );

      router.push('/minhas-salas');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar a sala.'
      );
    } finally {
      setLoading(false);
    }
  };

  const error = (key: keyof FormValues) => {
    if (!errors[key]) return null;

    return (
      <p className="mt-1 text-xs font-medium text-red-600">
        {errors[key]?.message as string}
      </p>
    );
  };

  const { onBlur: cepOnBlur, ...cepRegister } = register('cep');

  return (
    <DashboardShell>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Cadastrar imóvel</h1>
          <p className="mt-1 text-slate-500">
            Preencha as informações para anunciar sua sala comercial.
          </p>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          {/* Seção Imagem */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <h2 className="text-xl font-bold">Imagem do imóvel</h2>
            <p className="mt-1 text-sm text-slate-500">
              Adicione imagens para destacar o seu anúncio.
            </p>

            <div className="mt-5 flex flex-col gap-5 sm:flex-row">
              <div className="relative h-40 w-full overflow-hidden rounded-xl bg-slate-100 sm:w-56">
                {previews.length > 0 ? (
                  <>
                    <img
                      src={previews[currentIndex]}
                      alt={`Prévia do imóvel ${currentIndex + 1}`}
                      className="h-full w-full object-cover"
                    />

                    {previews.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={prevImage}
                          className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={nextImage}
                          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight size={16} />
                        </button>

                        <span className="absolute bottom-1 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                          {currentIndex + 1} / {previews.length}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <div className="grid h-full w-full place-items-center">
                    <ImagePlus className="text-slate-400" size={36} />
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-[#D35400] px-5 py-3 text-sm font-semibold text-[#D35400] hover:bg-orange-50 transition-colors">
                  <ImagePlus size={18} className="mr-2" />
                  Enviar imagem

                  <input
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp"
                    onChange={pickImage}
                    className="hidden"
                  />
                </label>

                <p className="mt-2 text-xs text-slate-400">
                  PNG, JPG ou WEBP — máximo de 5 MB por arquivo
                </p>

                {previews.length > 0 && (
                  <button
                    type="button"
                    onClick={() => removeImage(currentIndex)}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    <X size={14} />
                    Remover imagem atual
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Seção Informações Básicas (Título e Descrição) */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <h2 className="text-xl font-bold">Informações Gerais</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold sm:col-span-2">
                <span>Título do Anúncio</span>

                <input
                  {...register('titulo')}
                  className={inputStyle}
                  placeholder="Ex: Sala comercial no centro com ótimo acabamento"
                />

                {error('titulo')}
              </label>

              <label className="text-sm font-semibold sm:col-span-2">
                <span>Descrição</span>

                <textarea
                  {...register('descricao')}
                  rows={4}
                  className={inputStyle}
                  placeholder="Descreva detalhes adicionais, infraestrutura do prédio, etc."
                />

                {error('descricao')}
              </label>
            </div>
          </section>

          {/* Seção Endereço */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <h2 className="text-xl font-bold">Endereço</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span>CEP</span>

                  {loadingCep && (
                    <span className="flex items-center gap-1 text-xs text-[#D35400]">
                      <LoaderCircle className="animate-spin" size={12} />
                      Buscando CEP...
                    </span>
                  )}
                </div>

                <input
                  {...cepRegister}
                  onBlur={(e) => {
                    cepOnBlur(e);
                    handleCepBlur(e);
                  }}
                  className={inputStyle}
                  placeholder="50000-000"
                />

                {error('cep')}
              </label>

              <label className="text-sm font-semibold sm:col-span-2">
                <span className="mb-2 block">Rua</span>

                <input
                  {...register('rua')}
                  disabled={loadingCep}
                  className={inputStyle}
                  placeholder="Rua das Flores"
                />

                {error('rua')}
              </label>

              <label className="text-sm font-semibold">
                <span className="mb-2 block">Número</span>

                <input
                  {...register('numero')}
                  className={inputStyle}
                  placeholder="123"
                />

                {error('numero')}
              </label>

              <label className="text-sm font-semibold">
                <span className="mb-2 block">Bairro</span>

                <input
                  {...register('bairro')}
                  disabled={loadingCep}
                  className={inputStyle}
                  placeholder="Centro"
                />

                {error('bairro')}
              </label>

              <label className="text-sm font-semibold">
                <span className="mb-2 block">Cidade</span>

                <input
                  {...register('cidade')}
                  disabled={loadingCep}
                  className={inputStyle}
                  placeholder="Recife"
                />

                {error('cidade')}
              </label>

              <label className="text-sm font-semibold">
                <span className="mb-2 block">Estado</span>

                <input
                  {...register('estado')}
                  disabled={loadingCep}
                  maxLength={2}
                  className={inputStyle}
                  placeholder="PE"
                />

                {error('estado')}
              </label>
            </div>
          </section>

          {/* Seção Características */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <h2 className="text-xl font-bold">Características</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 sm:md:grid-cols-4">
              <label className="text-sm font-semibold">
                <span className="mb-2 block">Tipo</span>

                <select
                  {...register('tipo')}
                  className={inputStyle}
                >
                  <option value="Comercial">Comercial</option>
                  <option value="Residencial">Residencial</option>
                </select>

                {error('tipo')}
              </label>

              <label className="text-sm font-semibold">
                <span className="mb-2 block">Tamanho (m²)</span>

                <input
                  type="number"
                  step="0.01"
                  {...register('tamanho')}
                  className={inputStyle}
                  placeholder="45"
                />

                {error('tamanho')}
              </label>

              <label className="text-sm font-semibold">
                <span className="mb-2 block">Preço mensal (R$)</span>

                <input
                  type="number"
                  step="0.01"
                  {...register('preco')}
                  className={inputStyle}
                  placeholder="4500"
                />

                {error('preco')}
              </label>

              <label className="text-sm font-semibold">
                <span className="mb-2 block">Situação</span>

                <select
                  {...register('status_ocupacao')}
                  className={inputStyle}
                >
                  <option value="Disponível">Disponível</option>
                  <option value="Reservada">Reservada</option>
                  <option value="Alugada">Alugada</option>
                  <option value="Manutenção">Manutenção</option>
                </select>

                {error('status_ocupacao')}
              </label>
            </div>
          </section>

          {message && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {message}
            </p>
          )}

          <button
            disabled={loading}
            className="ml-auto flex items-center gap-2 rounded-xl bg-[#D35400] px-6 py-3 font-semibold text-white shadow-lg shadow-orange-950/15 disabled:cursor-not-allowed disabled:opacity-70 transition-colors"
          >
            {loading && <LoaderCircle className="animate-spin" size={18} />}
            {loading ? 'Salvando...' : 'Salvar informações'}
          </button>
        </form>
      </div>
    </DashboardShell>
  );
}