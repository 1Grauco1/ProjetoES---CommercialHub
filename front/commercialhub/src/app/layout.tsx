import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import { DashboardUIProvider } from "@/src/context/dashboard-ui";
import AuthProvider from "@/src/components/auth/SessionProvider";
import AppHeader from "@/src/components/layout/AppHeader";
import RouteGuard from "@/src/components/layout/RouteGuard";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CommercialHub",
  description: "Gestão de imóveis comerciais",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DashboardUIProvider>
          <AuthProvider>
            <AppHeader />
            <RouteGuard>{children}</RouteGuard>
          </AuthProvider>
        </DashboardUIProvider>
      </body>
    </html>
  );
}
