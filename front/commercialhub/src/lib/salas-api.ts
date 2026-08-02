export type StatusSala =
  | "Disponível"
  | "Reservada"
  | "Alugada"
  | "Manutenção";

export type TipoSala = "Comercial" | "Residencial";

export type Endereco = {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
};

export type Sala = {
  id: number;
  id_proprietario: number;
  id_endereco: number;
  titulo: string;
  tamanho: number;
  preco: number;
  status_ocupacao: StatusSala;
  fotos?: string[] | null;
  descricao: string;
  tipo: TipoSala;
  endereco?: Endereco | null;
};

export async function criarSala(
  payload: CriarSalaPayload,
  images?: File[]
) {
  const sala = (await responseData(
    await fetch("/api/salas", {
      method: "POST",
      headers: authHeaders(true),
      body: JSON.stringify(payload),
    }),
    "Não foi possível cadastrar a sala."
  )) as Sala;

  if (images && images.length > 0) {
    await enviarFotos(sala.id, sala, images);
  }

  return sala;
}

async function enviarFoto(id: number, sala: Sala, image: File) {
  const formData = new FormData();
  formData.append("foto", image);
  formData.append("dados_sala", JSON.stringify(sala));

  await responseData(
    await fetch(`/api/salas/${id}/foto`, {
      method: "POST",
      headers: authHeaders(false),
      body: formData,
    }),
    "Sala salva, mas não foi possível enviar a imagem."
  );
}

async function enviarFotos(id: number, sala: Sala, images: File[]) {
  for (const image of images) {
    await enviarFoto(id, sala, image);
  }
}

export type CriarSalaPayload = {
  dados_sala: Pick<
    Sala,
    | "titulo"
    | "tamanho"
    | "preco"
    | "status_ocupacao"
    | "fotos"
    | "descricao"
    | "tipo"
  > & {
    id_proprietario: number;
    id_endereco: number;
  };

  dados_endereco: Endereco;
};

export type AtualizarSalaPayload = {
  dados_sala?: Partial<CriarSalaPayload["dados_sala"]>;
  dados_endereco?: Partial<Endereco>;
};

function authHeaders(json = true) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  return {
    ...(json
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {}),
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

export async function atualizarSala(
  id: number,
  payload: AtualizarSalaPayload,
  images?: File[]
) {
  const sala = (await responseData(
    await fetch(`/api/salas/${id}`, {
      method: "PATCH",
      headers: authHeaders(true),
      body: JSON.stringify(payload),
    }),
    "Não foi possível atualizar a sala."
  )) as Sala;

  if (images && images.length > 0) {
    await enviarFotos(id, sala, images);
  }

  return sala;
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

