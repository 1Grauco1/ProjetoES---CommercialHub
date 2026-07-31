export function salaSlug(titulo: string, id: number) {
  const texto = titulo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${texto || "sala"}-${id}`;
}

export function salaIdFromSlug(slug: string) {
  const match = slug.match(/(?:^|-)\d+$/);
  return match ? Number(match[0].replace("-", "")) : null;
}
