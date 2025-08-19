import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { PaymentProofProvider } from "@/context/PaymentProofContext";

export const metadata: Metadata = {
  title: "Alex 2.0 - Conteúdo Premium +18",
  description: "Plataforma de conteúdo premium exclusivo para maiores de 18 anos. Acesso via Telegram.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <SiteConfigProvider>
          <PaymentProofProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </PaymentProofProvider>
        </SiteConfigProvider>
      </body>
    </html>
  );
}
