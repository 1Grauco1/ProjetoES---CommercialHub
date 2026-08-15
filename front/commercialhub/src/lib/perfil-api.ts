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

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();

  let data: unknown = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const erro =
      typeof data === "string"
        ? data
        : (data as { detail?: string; message?: string } | null);
    const mensagem =
      typeof erro === "string" ? erro : erro?.detail ?? erro?.message;

    throw new Error(
      mensagem ??
        `Erro ${response.status}: não foi possível realizar a operação.`
    );
  }

  return data as T;
}

export async function obterPerfil(): Promise<Perfil> {
  return request<Perfil>('/usuario/me');
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

  /*
   * FOTO DO USUÁRIO
   *
   * O backend ainda não aceita foto.
   * Quando a API estiver pronta, a implementação poderá
   * ser adicionada aqui sem alterar a página de edição.
   */

  return request<Perfil>(`/usuario/editar/${idPessoa}`, {
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