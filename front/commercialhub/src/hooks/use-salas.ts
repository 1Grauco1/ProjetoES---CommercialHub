"use client";

import { useEffect, useState } from "react";
import { normalizarFotos } from '@/src/utils/media';
import { buscarSalas } from '@/src/services/salas.service';
import type { Sala } from '@/src/services/salas.service';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export type FotoItem = string | { id?: number; url: string };

export type Perfil = {
  id: number;
  nome: string;
  email: string;
  telefone?: string | null;
};

async function get<T>(path: string): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const response = await fetch(path, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(
      data.message ?? data.detail ?? "Não foi possível carregar os dados.",
    );
  return data;
}

export function useSalas() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    get<Sala[]>('/api/salas')
      .then((data)=>{
        const salasComFotosTratadas = normalizarFotos(data, BACKEND_URL);
        setSalas(salasComFotosTratadas);
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);
  return { salas, loading, error };
}

export function useSalasPublicas() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    buscarSalas({ status_ocupacao: "Disponível" })
      .then(setSalas)
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);
  return { salas, loading, error };
}

export function usePerfil() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  useEffect(() => {
    get<Perfil>('/api/perfil')
      .then(setPerfil)
      .catch(() => setPerfil(null));
  }, []);
  return perfil;
}

export function useSala(id: string) {
  const [sala, setSala] = useState<Sala | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    get<Sala>(`/api/salas/${id}`)
      .then(setSala)
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [id]);
  return { sala, loading, error };
}

export default useSalas;
