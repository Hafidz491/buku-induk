import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SchoolProvider } from "@/lib/school-store";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Buku Induk SMA Bina Insan Mulia",
  description:
    "Sistem Informasi Manajemen Buku Induk SMA Bina Insan Mulia untuk Staf Tata Usaha (TU) Sekolah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <SchoolProvider>{children}</SchoolProvider>
      </body>
    </html>
  );
}
