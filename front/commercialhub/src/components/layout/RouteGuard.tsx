"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthPage, isPublicPath } from "@/src/utils/routes";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("auth-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("auth-change", callback);
  };
}

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const token = useSyncExternalStore(subscribe, getToken, () => null);

  const blocked = !token && !isPublicPath(pathname);
  const onAuthPage = Boolean(token) && isAuthPage(pathname);

  useEffect(() => {
    if (blocked) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (onAuthPage) {
      router.replace("/dashboard");
    }
  }, [blocked, onAuthPage, pathname, router]);

  if (blocked || onAuthPage) return null;

  return children;
}
