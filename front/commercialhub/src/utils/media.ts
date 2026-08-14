export function urlDaFoto(item: unknown, backendUrl: string): string {
  if (!item) return "";

  let caminhoRelativo = "";
  if (typeof item === "string") {
    caminhoRelativo = item;
  } else if (typeof item === "object" && item !== null) {
    const obj = item as Record<string, any>;
    caminhoRelativo = obj.caminho || obj.url || "";
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

function normalizarFotoItem(item: unknown, backendUrl: string) {
  if (!item) return item;

  if (typeof item === "string") {
    return item;
  }

  if (typeof item === "object" && item !== null) {
    const obj = item as Record<string, any>;
    const url = urlDaFoto(item, backendUrl);

    if (!url) return item;

    return {
      id: obj.id,
      url,
    };
  }

  return item;
}

export function normalizarFotos<T>(data: T, backendUrl: string): T {
  const normalizarItem = (item: any) => {
    if (!item) return item;

    if (Array.isArray(item.fotos)) {
      return {
        ...item,
        fotos: item.fotos
          .map((fotoItem: any) => normalizarFotoItem(fotoItem, backendUrl))
          .filter(Boolean),
      };
    }

    if (item.fotos) {
      return {
        ...item,
        fotos: [normalizarFotoItem(item.fotos, backendUrl)].filter(Boolean),
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
