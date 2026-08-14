export type StatusSala =
  | "Disponível"
  | "Reservada"
  | "Alugada"
  | "Manutenção";

export type TipoSala = "Comercial" | "Residencial";

export type Endereco = {
  id?: number;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
};

export type FotoItem = string | { id?: number; url: string };

export type Sala = {
  id: number;
  id_usuario?: number;
  id_endereco: number;
  titulo: string;
  tamanho: number;
  preco: number;
  status_ocupacao: StatusSala;
  fotos?: FotoItem[] | string | null;
  descricao: string;
  tipo: TipoSala;
  quartos: number;
  banheiros: number;
  vagas_garagem: number;
  ar_condicionado: boolean;
  elevador: boolean;
  portaria: boolean;
  mobiliada: boolean;
  internet: boolean;
  alarme: boolean;
  estacionamento: boolean;
  endereco?: Endereco | null;
  proprietario_whatsapp?: string | null;
};

export type CriarSalaPayload = {
  dados_sala: Pick<
    Sala,
    | "titulo"
    | "tamanho"
    | "preco"
    | "status_ocupacao"
    | "descricao"
    | "tipo"
    | "quartos"
    | "banheiros"
    | "vagas_garagem"
    | "ar_condicionado"
    | "elevador"
    | "portaria"
    | "mobiliada"
    | "internet"
    | "alarme"
    | "estacionamento"
  > & {
    id_usuario?: number;
    id_endereco: number;
    fotos?: FotoItem[] | string | null;
  };

  dados_endereco: Endereco;
};

export type AtualizarSalaPayload = {
  dados_sala?: Partial<CriarSalaPayload["dados_sala"]>;
  dados_endereco?: Partial<Endereco>;
};

export type SalaFilterSearch = {
  termo?: string;
  cidade?: string;
  estado?: string;
  bairro?: string;
  cep?: string;
  status_ocupacao?: StatusSala;
  tamanho_min?: number;
  tamanho_max?: number;
  preco_min?: number;
  preco_max?: number;
  tipo?: TipoSala;
  quartos_min?: number;
  banheiros_min?: number;
  vagas_garagem_min?: number;
  ar_condicionado?: boolean;
  elevador?: boolean;
  portaria?: boolean;
  mobiliada?: boolean;
  internet?: boolean;
  alarme?: boolean;
  estacionamento?: boolean;
};

function authHeaders(json = true) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function responseData(
  response: Response,
  fallback: string
) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    let errorMessage = data.message;

    if (!errorMessage && data.detail) {
      if (typeof data.detail === "string") {
        errorMessage = data.detail;
      } else if (
        Array.isArray(data.detail) &&
        data.detail.length > 0
      ) {
        const firstError = data.detail[0];

        errorMessage =
          firstError?.msg ||
          firstError?.message ||
          fallback;
      }
    }

    throw new Error(errorMessage ?? fallback);
  }

  return data;
}

async function enviarFotos(id: number, images: File[]): Promise<Sala> {
  const formData = new FormData();

  images.forEach((image) => {
    formData.append("foto", image);
  });

  const response = await fetch(`/api/salas/${id}/foto`, {
    method: "POST",
    headers: authHeaders(false),
    body: formData,
  });

  return (await responseData(
    response,
    "Sala salva, mas não foi possível enviar as imagens."
  )) as Sala;
}

export async function deletarFotoApi(
  salaId: number | string,
  fotoId: number | string
) {
  if (!salaId || !fotoId) {
    throw new Error(`IDs inválidos para exclusão: salaId=${salaId}, fotoId=${fotoId}`);
  }

  const response = await fetch(`/api/salas/${salaId}/foto/${fotoId}`, {
    method: "DELETE",
    headers: authHeaders(false),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || "Falha ao apagar a foto no servidor.");
  }

  return await response.json();
}

export async function criarSala(
  payload: CriarSalaPayload,
  images?: File[]
): Promise<Sala> {
  let sala = (await responseData(
    await fetch("/api/salas", {
      method: "POST",
      headers: authHeaders(true),
      body: JSON.stringify(payload),
    }),
    "Não foi possível cadastrar a sala."
  )) as Sala;

  if (images && images.length > 0) {
    sala = await enviarFotos(sala.id, images);
  }

  return sala;
}

export async function atualizarSala(
  id: number,
  payload: AtualizarSalaPayload,
  images?: File[]
): Promise<Sala> {
  let sala = (await responseData(
    await fetch(`/api/salas/${id}`, {
      method: "PATCH",
      headers: authHeaders(true),
      body: JSON.stringify(payload),
    }),
    "Não foi possível atualizar a sala."
  )) as Sala;

  if (images && images.length > 0) {
    sala = await enviarFotos(id, images);
  }

  return sala;
}

export async function buscarSalas(
  filtros: SalaFilterSearch
): Promise<Sala[]> {
  return (await responseData(
    await fetch("/api/salas/buscar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filtros),
    }),
    "Não foi possível buscar as salas."
  )) as Sala[];
}

export async function deletarSala(id: number) {
  await responseData(
    await fetch(`/api/salas/${id}`, {
    method: "DELETE",
    headers: authHeaders(false),
  }),
    "Não foi possível deletar a sala."
  );
}

export default {
  criarSala,
  atualizarSala,
  deletarSala,
  deletarFotoApi,
};
