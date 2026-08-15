"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Header from "@/src/components/layout/Header";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import { isPublicPath } from "@/src/utils/routes";

export default function AppHeader() {
  const pathname = usePathname();
  const { status } = useSession();

  if (status !== "authenticated") return <Header />;

  return <DashboardHeader hasSidebar={!isPublicPath(pathname)} />;
}
