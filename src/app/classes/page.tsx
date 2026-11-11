"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  CheckCircle2,
  Trash2,
  Printer,
  Calendar,
  BookOpen,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useSchool } from "@/lib/school-store";

export default function ClassesAndAcademicYearsPage() {
  const {
    classes,
    academicYears,
    activeAcademicYear,
    classHistory,
    addClass,
    deleteClass,
    addAcademicYear,
    setActiveAcademicYear,
  } = useSchool();

  const [newClassName, setNewClassName] = useState("");
  const [newGradeLevel, setNewGradeLevel] = useState<number>(10);
  const [newYearName, setNewYearName] = useState("");

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    addClass({
      name: newClassName.trim(),
      gradeLevel: Number(newGradeLevel),
    });
    setNewClassName("");
  };

  const handleAddYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearName.trim()) return;
    addAcademicYear({
      name: newYearName.trim(),
      isActive: false,
    });
    setNewYearName("");
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Manajemen Rombongan Belajar (Kelas) & Tahun Ajaran
            </h2>
            <p className="text-xs text-slate-500">
              Kelola daftar kelas (`classes`) dan periode akademik (`academic_years`) sebagai dasar penempatan siswa & cetak presensi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* KOLOM KIRI (7): Daftar Kelas / Rombel */}
          <div className="lg:col-span-7 rounded-2xl bg-white p-6 shadow-xs border border-slate-100 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-800">
                  Daftar Kelas / Rombel ({classes.length})
                </h3>
              </div>
            </div>

            {/* Form Tambah Kelas */}
            <form
              onSubmit={handleAddClass}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70"
            >
              <div className="sm:col-span-6">
                <input
                  type="text"
                  placeholder="Nama Kelas (misal: X IPA 3)"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs"
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <select
                  value={newGradeLevel}
                  onChange={(e) => setNewGradeLevel(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs font-medium"
                >
                  <option value={10}>Tingkat 10 (X)</option>
                  <option value={11}>Tingkat 11 (XI)</option>
                  <option value={12}>Tingkat 12 (XII)</option>
                </select>
              </div>
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full h-9 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs inline-flex items-center justify-center gap-1.5 transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Tambah Rombel
                </button>
              </div>
            </form>

            {/* Tabel Kelas */}
            <div className="divide-y divide-slate-100">
              {classes.map((cls) => {
                const count = classHistory.filter(
                  (h) =>
                    h.classId === cls.id &&
                    h.academicYearId === activeAcademicYear?.id
                ).length;

                return (
                  <div
                    key={cls.id}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {cls.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        Tingkat Kelas {cls.gradeLevel} • {count} Siswa di TA{" "}
                        {activeAcademicYear?.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/print-attendance?classId=${cls.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        Cetak Presensi
                      </Link>
                      {count === 0 && (
                        <button
                          type="button"
                          onClick={() => deleteClass(cls.id)}
                          title="Hapus Rombel Kosong"
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* KOLOM KANAN (5): Tahun Ajaran */}
          <div className="lg:col-span-5 rounded-2xl bg-white p-6 shadow-xs border border-slate-100 space-y-5">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-sky-500" />
              <h3 className="text-base font-bold text-slate-800">
                Tahun Ajaran (`academic_years`)
              </h3>
            </div>

            <form
              onSubmit={handleAddYear}
              className="flex gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70"
            >
              <input
                type="text"
                placeholder="Contoh: 2025/2026 Genap"
                value={newYearName}
                onChange={(e) => setNewYearName(e.target.value)}
                className="flex-1 h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs"
                required
              />
              <button
                type="submit"
                className="px-3.5 h-9 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs inline-flex items-center gap-1 shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah
              </button>
            </form>

            <div className="space-y-2.5">
              {academicYears.map((yr) => (
                <div
                  key={yr.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    yr.isActive
                      ? "bg-emerald-50/60 border-emerald-200"
                      : "bg-white border-slate-200/80"
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {yr.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {yr.isActive
                        ? "Tahun Ajaran Aktif Saat Ini"
                        : "Arsip Periode Akademik"}
                    </p>
                  </div>

                  {yr.isActive ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Aktif
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveAcademicYear(yr.id)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                    >
                      Set Aktif
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
