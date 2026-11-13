"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  CheckCircle2,
  Printer,
  Calendar,
  BookOpen,
  X,
  Users,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useSchool } from "@/lib/school-store";
import type { SchoolClass } from "@/db/schema";

export default function ClassesAndAcademicYearsPage() {
  const {
    classes,
    students,
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

  // State Modal Anggota Rombel & Konfirmasi Hapus Rombel
  const [viewingClass, setViewingClass] = useState<SchoolClass | null>(null);
  const [deletingClass, setDeletingClass] = useState<SchoolClass | null>(null);

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

  // Data siswa yang menjadi Anggota Rombel pada Tahun Ajaran Aktif
  const studentsInViewingClass = viewingClass
    ? classHistory
      .filter(
        (h) =>
          h.classId === viewingClass.id &&
          h.academicYearId === activeAcademicYear?.id
      )
      .map((h) => {
        const student = students.find((s) => s.id === h.studentId);
        return student
          ? {
            ...student,
            statusInClass: h.statusInClass,
          }
          : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
    : [];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Manajemen Rombongan Belajar (Kelas) & Tahun Ajaran
            </h2>
            <p className="text-xs text-slate-500">
              Kelola daftar kelas dan periode akademik sebagai dasar penempatan siswa & cetak presensi.
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

            {/* Daftar Rombel */}
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
                        Tingkat Kelas {cls.gradeLevel} • {count} Anggota Rombel
                        di TA {activeAcademicYear?.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Tombol Icon Anggota Rombel */}
                      <button
                        type="button"
                        onClick={() => setViewingClass(cls)}
                        title={`Anggota Rombel ${cls.name}`}
                        aria-label={`Anggota Rombel ${cls.name}`}
                        className="h-8 w-8 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 inline-flex items-center justify-center transition"
                      >
                        <Users className="h-4 w-4" />
                      </button>

                      {/* Tombol Cetak Presensi */}
                      <Link
                        href={`/print-attendance?classId=${cls.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        Cetak Presensi
                      </Link>

                      {/* Tombol Icon Hapus Rombel */}
                      <button
                        type="button"
                        onClick={() => setDeletingClass(cls)}
                        title={`Hapus Rombel ${cls.name}`}
                        aria-label={`Hapus Rombel ${cls.name}`}
                        className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 inline-flex items-center justify-center transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
                Tahun Ajaran
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
                  className={`p-3.5 rounded-xl border flex items-center justify-between ${yr.isActive
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

      {/* Modal Anggota Rombel (Hanya Menampilkan NISN, NAMA, dan JENIS KELAMIN) */}
      {viewingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-slate-100 overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-sky-500 text-white flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Anggota Rombel — Kelas {viewingClass.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Tingkat {viewingClass.gradeLevel} • Tahun Ajaran{" "}
                    {activeAcademicYear?.name} • Total{" "}
                    {studentsInViewingClass.length} Siswa
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingClass(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {studentsInViewingClass.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200">
                        <th className="py-2.5 px-4 font-bold w-12">No</th>
                        <th className="py-2.5 px-4 font-bold">NISN</th>
                        <th className="py-2.5 px-4 font-bold">Nama</th>
                        <th className="py-2.5 px-4 font-bold">Jenis Kelamin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentsInViewingClass.map((std, index) => (
                        <tr key={std.id} className="hover:bg-slate-50/80">
                          <td className="py-2.5 px-4 font-semibold text-slate-500">
                            {index + 1}
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-800">
                            {std.nisn}
                          </td>
                          <td className="py-2.5 px-4 font-bold text-slate-800">
                            {std.fullName}
                          </td>
                          <td className="py-2.5 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${std.gender === "M"
                                  ? "bg-sky-100 text-sky-700"
                                  : "bg-pink-100 text-pink-700"
                                }`}
                            >
                              {std.gender === "M" ? "Laki-Laki" : "Perempuan"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">
                  Belum ada anggota rombel di kelas{" "}
                  <strong>{viewingClass.name}</strong> pada Tahun Ajaran{" "}
                  <strong>{activeAcademicYear?.name}</strong>.
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setViewingClass(null)}
                className="px-4 h-9 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Konfirmasi Hapus Rombel */}
      {deletingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-800">
              Hapus Rombel {deletingClass.name}?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus kelas/rombel{" "}
              <strong className="text-slate-900">{deletingClass.name}</strong>{" "}
              (Tingkat {deletingClass.gradeLevel})? Data siswa di Buku Induk
              tetap aman dan hanya penempatan pada rombel ini yang akan dilepas.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingClass(null)}
                className="px-4 h-9 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteClass(deletingClass.id);
                  setDeletingClass(null);
                }}
                className="px-4 h-9 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Ya, Hapus Rombel
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
