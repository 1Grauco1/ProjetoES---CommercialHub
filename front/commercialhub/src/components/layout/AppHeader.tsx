"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/src/components/layout/Header";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import { isPublicPath } from "@/src/utils/routes";

export default function AppHeader() {
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const check = () =>
      setToken(
        typeof window !== "undefined" ? localStorage.getItem("token") : null,
      );

    check();
    window.addEventListener("storage", check);
    window.addEventListener("auth-change", check);

    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("auth-change", check);
    };
  }, [pathname]);

  if (!token) return <Header />;

  return <DashboardHeader hasSidebar={!isPublicPath(pathname)} />;
}
