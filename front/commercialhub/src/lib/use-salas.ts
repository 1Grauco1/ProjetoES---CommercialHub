'use client';

import { useEffect, useState } from 'react';

export type Sala = { id: number; titulo: string; descricao: string; tipo: 'Comercial' | 'Residencial'; tamanho: number; preco: number; status_ocupacao: 'Disponível' | 'Reservada' | 'Alugada' | 'Manutenção'; fotos?: string | null; endereco?: { rua: string; numero: string; bairro: string; cidade: string; estado: string; cep: string } | null };
export type Perfil = { id: number; nome: string; email: string; telefone?: string | null };

async function get<T>(path: string): Promise<T> {
  const token = localStorage.getItem('token');
  const response = await fetch(path, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? data.detail ?? 'Não foi possível carregar os dados.');
  return data;
}

export function useSalas() {
  const [salas, setSalas] = useState<Sala[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  useEffect(() => { get<Sala[]>('/api/salas').then(setSalas).catch(error => setError(error.message)).finally(() => setLoading(false)); }, []);
  return { salas, loading, error };
}

export function usePerfil() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  useEffect(() => { get<Perfil>('/api/perfil').then(setPerfil).catch(() => setPerfil(null)); }, []);
  return perfil;
}

export function useSala(id: string) {
  const [sala, setSala] = useState<Sala | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    get<Sala>(`/api/salas/${id}`).then(setSala).catch(error => setError(error.message)).finally(() => setLoading(false));
  }, [id]);
  return { sala, loading, error };
}
