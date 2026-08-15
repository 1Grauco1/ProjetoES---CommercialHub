export type StatusContrato = "Ativo" | "Encerrado" | "Cancelado" | "Pendente";

export type Contrato = {
  id: number;
  id_sala: number;
  id_usuario: number;
  data_inicio: string;
  data_termino: string;
  valor: number;
  status: StatusContrato;
};

async function responseData<T>(response: Response, fallback: string): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail ?? data.message ?? fallback);
  }

  return data as T;
}

export async function listarContratos(): Promise<Contrato[]> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const response = await fetch("/api/contratos", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store",
  });

  return responseData<Contrato[]>(
    response,
    "Não foi possível carregar os contratos."
  );
}

export const formatarData = (data: string) =>
  new Date(data).toLocaleDateString("pt-BR");

export default {
  listarContratos,
  formatarData,
};
