import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SIM Buku Induk Siswa — Tata Usaha Sekolah",
  description:
    "Sistem Informasi Manajemen Buku Induk Siswa & Cetak Presensi Fisik untuk Staf Tata Usaha (TU) Sekolah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

