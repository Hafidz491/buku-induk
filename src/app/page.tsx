import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="info">MVP Tahap 1 Aktif</Badge>
              <Badge variant="outline">Next.js 14 + Drizzle ORM + Supabase</Badge>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Sistem Informasi Buku Induk Siswa (SIM-BIS)
            </h1>
            <p className="text-sm text-slate-600">
              Aplikasi Administrasi Tata Usaha (TU) Sekolah — Pengelolaan Buku
              Induk & Cetak Presensi Fisik
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>1. Pondasi & Skema Database</CardTitle>
              <CardDescription>Tahap 1 — Selesai</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 space-y-1">
              <p>• 5 Tabel Utama PostgreSQL (Drizzle ORM)</p>
              <p>• Relasi Siswa, Kelas, & Tahun Ajaran</p>
              <p>• Konfigurasi Print CSS A4 Administrasi</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Autentikasi & RBAC TU</CardTitle>
              <CardDescription>Tahap 2 — Berikutnya</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 space-y-1">
              <p>• Integrasi Supabase Auth SSR</p>
              <p>• Role Admin TU & Staf TU</p>
              <p>• Layout Sidebar & Header Instansi</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Modul Buku Induk & Cetak</CardTitle>
              <CardDescription>Tahap 3 s/d 5 — Terjadwal</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 space-y-1">
              <p>• CRUD Data Siswa & Riwayat Kelas</p>
              <p>• Pencarian Instan & Filter Kelas/Tahun</p>
              <p>• Cetak Lembar Absensi Fisik Standar</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

