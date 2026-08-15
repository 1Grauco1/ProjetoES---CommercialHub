type SalaComFoto = { fotos?: unknown };

function urlDaFoto(foto: unknown, backendUrl: string) {
  if (typeof foto !== "string" || !foto) return foto;
  if (/^(https?:|data:|blob:)/i.test(foto)) return foto;

  return new URL(foto.replace(/^\/?/, "/"), backendUrl).toString();
}

export function normalizarFotos<T>(data: T, backendUrl: string): T {
  const normalizar = (item: SalaComFoto) => ({
    ...item,
    fotos: urlDaFoto(item.fotos, backendUrl),
  });

  if (Array.isArray(data)) return data.map((item) => normalizar(item as SalaComFoto)) as T;
  if (data && typeof data === "object") return normalizar(data as SalaComFoto) as T;
  return data;
}
