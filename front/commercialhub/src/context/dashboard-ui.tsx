"use client";

import { createContext, useContext, useState } from "react";

interface DashboardUIContextValue {
  open: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const DashboardUIContext = createContext<DashboardUIContextValue | null>(null);

export function DashboardUIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <DashboardUIContext.Provider
      value={{
        open,
        openSidebar: () => setOpen(true),
        closeSidebar: () => setOpen(false),
      }}
    >
      {children}
    </DashboardUIContext.Provider>
  );
}

export function useDashboardUI() {
  const context = useContext(DashboardUIContext);
  if (!context) {
    throw new Error(
      "useDashboardUI deve ser usado dentro de DashboardUIProvider",
    );
  }
  return context;
}
