type FotoItem = Record<string, unknown>;

export function urlDaFoto(item: unknown, backendUrl: string): string {
  if (!item) return "";

  let caminhoRelativo = "";
  if (typeof item === "string") {
    caminhoRelativo = item;
  } else if (typeof item === "object" && item !== null) {
    const obj = item as FotoItem;
    const caminho = obj.caminho ?? obj.url;
    caminhoRelativo = typeof caminho === "string" ? caminho : "";
  }

  if (!caminhoRelativo) return "";

  if (/^(https?:|data:|blob:)/i.test(caminhoRelativo)) {
    return caminhoRelativo;
  }

  const caminhoFormatado = caminhoRelativo.startsWith("/")
    ? caminhoRelativo
    : `/${caminhoRelativo}`;

  return `${backendUrl}${caminhoFormatado}`;
}

function normalizarFotoItem(item: unknown, backendUrl: string): unknown {
  if (!item) return item;

  if (typeof item === "string") {
    return item;
  }

  if (typeof item === "object" && item !== null) {
    const obj = item as FotoItem;
    const url = urlDaFoto(item, backendUrl);

    if (!url) return item;

    return {
      id: typeof obj.id === "number" ? obj.id : undefined,
      url,
    };
  }

  return item;
}

export function normalizarFotos<T>(data: T, backendUrl: string): T {
  const normalizarItem = (item: unknown): unknown => {
    if (!item) return item;

    if (typeof item !== "object") return item;

    const obj = item as FotoItem;

    if (Array.isArray(obj.fotos)) {
      return {
        ...obj,
        fotos: obj.fotos
          .map((fotoItem) => normalizarFotoItem(fotoItem, backendUrl))
          .filter(Boolean),
      };
    }

    if (obj.fotos) {
      return {
        ...obj,
        fotos: [normalizarFotoItem(obj.fotos, backendUrl)].filter(Boolean),
      };
    }

    return item;
  };

  if (Array.isArray(data)) {
    return data.map(normalizarItem) as T;
  }

  if (data && typeof data === "object") {
    return normalizarItem(data) as T;
  }

  return data;
}
