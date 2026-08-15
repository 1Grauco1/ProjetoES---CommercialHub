export type Perfil = {
  id: number;
  nome: string;
  email: string;
  telefone?: string | null;
  foto?: string | null;
};

export type AtualizarPerfil = {
  nomeCompleto?: string;
  email?: string;
  telefone?: string;
};

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();

  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(
      data?.detail ??
        data?.message ??
        `Erro ${response.status}: não foi possível realizar a operação.`
    );
  }

  return data as T;
}

export async function obterPerfil(): Promise<Perfil> {
  return request<Perfil>('/api/perfil', { cache: 'no-store' });
}

export async function atualizarPerfil(
  idPessoa: number,
  dados: AtualizarPerfil
): Promise<Perfil> {
  const payload: Record<string, string> = {};

  if (dados.nomeCompleto !== undefined) {
    payload.nome = dados.nomeCompleto;
  }

  if (dados.email !== undefined) {
    payload.email = dados.email;
  }

  if (dados.telefone !== undefined) {
    payload.telefone = dados.telefone;
  }

  return request<Perfil>(`/api/perfil?id=${idPessoa}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function getInitials(nome?: string | null): string {
  if (!nome?.trim()) return 'U';

  const partes = nome.trim().split(/\s+/);

  if (partes.length === 1) {
    return partes[0].substring(0, 2).toUpperCase();
  }

  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

export default {
  obterPerfil,
  atualizarPerfil,
  getInitials,
};
