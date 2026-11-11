"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Printer, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useSchool } from "@/lib/school-store";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const {
    students,
    classes,
    activeAcademicYear,
    classHistory,
    personnelStats,
  } = useSchool();

  const [selectedGradeTab, setSelectedGradeTab] = useState<
    "ALL" | 10 | 11 | 12
  >("ALL");

  // Filter Rombel berdasarkan Tab
  const filteredClasses = classes.filter((cls) => {
    if (selectedGradeTab !== "ALL" && cls.gradeLevel !== selectedGradeTab) {
      return false;
    }
    return true;
  });

  // Hitung jumlah siswa per kelas di Tahun Ajaran Aktif
  const getStudentCountByClass = (classId: string) => {
    return classHistory.filter(
      (h) =>
        h.classId === classId && h.academicYearId === activeAcademicYear?.id
    ).length;
  };

  // Hitung Persentase Jumlah Siswa Laki-Laki (M) dan Perempuan (F)
  const totalStudentsCount = students.length;
  const maleCount = students.filter((s) => s.gender === "M").length;
  const femaleCount = students.filter((s) => s.gender === "F").length;

  const malePercentage =
    totalStudentsCount > 0
      ? Math.round((maleCount / totalStudentsCount) * 100)
      : 0;
  const femalePercentage =
    totalStudentsCount > 0 ? 100 - malePercentage : 0;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* ==============================================================
            4 KARTU UTAMA ATAS (HANYA JUDUL DAN JUMLAH SAJA)
            1. Total Murid | 2. Total Guru | 3. Total Tendik | 4. Jumlah Rombel
           ============================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* CARD 1: TOTAL MURID */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#05B96B] to-[#049B58] text-white p-6 shadow-md flex items-center justify-between min-h-[140px]">
            <div>
              <p className="text-sm font-medium text-emerald-50/95">
                Total Murid
              </p>
              <h2 className="mt-2 text-4xl font-extrabold tracking-tight">
                {students.length}
              </h2>
            </div>

            <div className="text-white/85 pr-1">
              <svg
                className="w-14 h-14"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="32"
                  cy="18"
                  r="9"
                  fill="currentColor"
                  fillOpacity="0.85"
                />
                <path
                  d="M14 34C14 30.6863 16.6863 28 20 28H30V52L16.5 46.5C14.98 45.88 14 44.4 14 42.76V34Z"
                  fill="currentColor"
                  fillOpacity="0.65"
                />
                <path
                  d="M50 34C50 30.6863 47.3137 28 44 28H34V52L47.5 46.5C49.02 45.88 50 44.4 50 42.76V34Z"
                  fill="currentColor"
                  fillOpacity="0.9"
                />
              </svg>
            </div>
          </div>

          {/* CARD 2: TOTAL GURU */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B99E8] to-[#0277BD] text-white p-6 shadow-md flex items-center justify-between min-h-[140px]">
            <div>
              <p className="text-sm font-medium text-sky-100">Total Guru</p>
              <h2 className="mt-2 text-4xl font-extrabold tracking-tight">
                {personnelStats.totalTeachers}
              </h2>
            </div>

            <div className="text-white/85 pr-1">
              <svg
                className="w-14 h-14"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="34"
                  cy="17"
                  r="8"
                  fill="currentColor"
                  fillOpacity="0.9"
                />
                <path
                  d="M22 36C22 30.4772 26.4772 26 32 26H36C41.5228 26 46 30.4772 46 36V42H22V36Z"
                  fill="currentColor"
                  fillOpacity="0.7"
                />
                <rect
                  x="12"
                  y="42"
                  width="40"
                  height="6"
                  rx="2"
                  fill="currentColor"
                  fillOpacity="0.9"
                />
                <path
                  d="M16 32L24 38"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* CARD 3: TOTAL TENDIK */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#9353F5] to-[#7935E5] text-white p-6 shadow-md flex items-center justify-between min-h-[140px]">
            <div>
              <p className="text-sm font-medium text-purple-100">
                Total Tendik
              </p>
              <h2 className="mt-2 text-4xl font-extrabold tracking-tight">
                {personnelStats.totalTendik}
              </h2>
            </div>

            <div className="text-white/85 pr-1">
              <svg
                className="w-14 h-14"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="12"
                  y="16"
                  width="40"
                  height="36"
                  rx="6"
                  fill="currentColor"
                  fillOpacity="0.85"
                />
                <rect
                  x="20"
                  y="10"
                  width="5"
                  height="10"
                  rx="2.5"
                  fill="currentColor"
                />
                <rect
                  x="39"
                  y="10"
                  width="5"
                  height="10"
                  rx="2.5"
                  fill="currentColor"
                />
                <circle cx="24" cy="32" r="2.5" fill="#7935E5" />
                <circle cx="32" cy="32" r="2.5" fill="#7935E5" />
                <circle cx="40" cy="32" r="2.5" fill="#7935E5" />
                <circle cx="24" cy="41" r="2.5" fill="#7935E5" />
                <circle cx="32" cy="41" r="2.5" fill="#7935E5" />
                <circle cx="40" cy="41" r="2.5" fill="#7935E5" />
              </svg>
            </div>
          </div>

          {/* CARD 4: JUMLAH ROMBEL */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FF6A1A] to-[#F23B14] text-white p-6 shadow-md flex items-center justify-between min-h-[140px]">
            <div>
              <p className="text-sm font-medium text-orange-100">
                Jumlah Rombel
              </p>
              <h2 className="mt-2 text-4xl font-extrabold tracking-tight">
                {classes.length}
              </h2>
            </div>

            <div className="text-white/85 pr-1">
              <svg
                className="w-14 h-14"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="12"
                  y="20"
                  width="40"
                  height="30"
                  rx="5"
                  fill="currentColor"
                  fillOpacity="0.85"
                />
                <rect
                  x="18"
                  y="13"
                  width="28"
                  height="5"
                  rx="2.5"
                  fill="currentColor"
                  fillOpacity="0.6"
                />
                <path d="M28 29L38 35L28 41V29Z" fill="#F23B14" />
              </svg>
            </div>
          </div>
        </div>

        {/* ==============================================================
            BARIS UTAMA: DAFTAR ROMBEL (KIRI) & DIAGRAM LINGKARAN LAKI-LAKI VS PEREMPUAN (KANAN)
           ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* KIRI (7 Kolom): Daftar Rombongan Belajar (Rombel) */}
          <div className="lg:col-span-7 relative rounded-2xl bg-white p-6 shadow-xs border border-slate-100">
            {/* Garis Aksen Hijau di Kanan Atas */}
            <span className="hidden sm:block absolute right-0 top-6 h-24 w-1.5 bg-emerald-500 rounded-l-full" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-800">
                Rombongan Belajar (Rombel)
              </h3>
              <div className="flex items-center gap-2">
                <Link
                  href="/print-attendance"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Cetak Lembar Absensi
                </Link>
              </div>
            </div>

            {/* Tab Filter Tingkat Kelas */}
            <div className="mt-4 flex items-center gap-6 border-b border-slate-100 text-xs font-semibold">
              {[
                { key: "ALL" as const, label: "Semua Kelas" },
                { key: 10 as const, label: "Kelas X" },
                { key: 11 as const, label: "Kelas XI" },
                { key: 12 as const, label: "Kelas XII" },
              ].map((tab) => {
                const active = selectedGradeTab === tab.key;
                return (
                  <button
                    key={String(tab.key)}
                    type="button"
                    onClick={() => setSelectedGradeTab(tab.key)}
                    className={cn(
                      "pb-3 relative transition-colors",
                      active
                        ? "text-emerald-600 font-bold"
                        : "text-slate-400 hover:text-slate-700"
                    )}
                  >
                    {tab.label}
                    {active && (
                      <span className="absolute left-0 right-0 -bottom-[1px] h-0.5 bg-emerald-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Daftar Rombel */}
            <div className="mt-4 divide-y divide-slate-100">
              {filteredClasses.slice(0, 5).map((cls, idx) => {
                const count = getStudentCountByClass(cls.id);
                const badgeColors = [
                  "from-amber-400 to-orange-500",
                  "from-emerald-400 to-teal-600",
                  "from-sky-400 to-blue-600",
                  "from-purple-400 to-indigo-600",
                ];
                return (
                  <div
                    key={cls.id}
                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 px-2 rounded-xl transition"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={cn(
                          "h-11 w-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0",
                          badgeColors[idx % badgeColors.length]
                        )}
                      >
                        {cls.gradeLevel}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">
                          Kelas {cls.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Tingkat {cls.gradeLevel} • TA{" "}
                          {activeAcademicYear?.name}
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:block text-xs text-slate-500 font-medium">
                      Tingkat {cls.gradeLevel} SMA
                    </div>

                    <div className="text-xs text-slate-500 font-medium">
                      {count} Murid Terdaftar
                    </div>

                    <div>
                      {count > 0 ? (
                        <span className="text-xs font-bold text-emerald-500">
                          Siap Cetak
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400">
                          Belum Terisi
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/print-attendance?classId=${cls.id}`}
                      title="Cetak Absensi Kelas Ini"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* KANAN (5 Kolom): Persentase Jumlah Siswa (Laki-Laki & Perempuan) Diagram Lingkaran 2 Warna */}
          <div className="lg:col-span-5 rounded-2xl bg-white p-6 shadow-xs border border-slate-100 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Persentase Jumlah Siswa
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Perbandingan siswa Laki-Laki dan Perempuan di Buku Induk
              </p>
            </div>

            {/* Diagram Lingkaran 2 Warna (Biru = Laki-Laki, Pink/Rose = Perempuan) */}
            <div className="my-6 flex flex-col items-center justify-center">
              <div className="relative h-48 w-48 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="h-48 w-48 -rotate-90">
                  {/* Lingkaran Dasar: Warna Perempuan (#EC4899 - Pink/Rose) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="#EC4899"
                    strokeWidth="3.8"
                  />
                  {/* Segmen Atas: Warna Laki-Laki (#0EA5E9 - Biru) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="#0EA5E9"
                    strokeWidth="3.8"
                    strokeDasharray={`${malePercentage} ${100 - malePercentage}`}
                    strokeDashoffset="0"
                  />
                </svg>

                {/* Teks Tengah Lingkaran */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <Users className="h-5 w-5 text-slate-400 mb-0.5" />
                  <span className="text-2xl font-extrabold text-slate-800">
                    {totalStudentsCount}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    Total Siswa
                  </span>
                </div>
              </div>
            </div>

            {/* Keterangan / Legend 2 Warna */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div className="rounded-xl bg-sky-50/70 border border-sky-100 p-3 flex items-center gap-3">
                <span className="h-3.5 w-3.5 rounded-full bg-[#0EA5E9] shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-600">
                    Laki-Laki (L)
                  </p>
                  <p className="text-sm font-extrabold text-slate-800">
                    {malePercentage}%{" "}
                    <span className="text-xs font-medium text-slate-500">
                      ({maleCount} siswa)
                    </span>
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-pink-50/70 border border-pink-100 p-3 flex items-center gap-3">
                <span className="h-3.5 w-3.5 rounded-full bg-[#EC4899] shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-600">
                    Perempuan (P)
                  </p>
                  <p className="text-sm font-extrabold text-slate-800">
                    {femalePercentage}%{" "}
                    <span className="text-xs font-medium text-slate-500">
                      ({femaleCount} siswa)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
