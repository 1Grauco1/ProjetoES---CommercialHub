export function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;

  return ["/login", "/cadastro", "/busca-sala", "/anuncio","/busca-sala"].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isAuthPage(pathname: string): boolean {
  return pathname === "/login" || pathname === "/cadastro";
}
