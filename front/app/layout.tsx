import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"; // 1. Importe aqui

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Help Desk Pro",
  description: "Sistema de chamados profissional",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {/* 2. Coloque o Toaster aqui, fora do children */}
        <Toaster theme="dark" position="top-right" richColors closeButton />
        {children}
      </body>
    </html>
  );
}