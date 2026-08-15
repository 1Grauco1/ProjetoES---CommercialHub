"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { isAuthPage, isPublicPath } from "@/src/utils/routes";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();

  const isLoggedIn = status === "authenticated";
  const isPending = status === "loading";

  const blocked = status === "unauthenticated" && !isPublicPath(pathname);
  const onAuthPage = isLoggedIn && isAuthPage(pathname);

  useEffect(() => {
    if (status === "loading") return;

    if (blocked) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (onAuthPage) {
      router.replace("/dashboard");
    }
  }, [blocked, onAuthPage, pathname, router, status]);

  if (blocked || onAuthPage) return null;

  return <>{isPending ? null : children}</>;
}
