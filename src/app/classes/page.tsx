"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  BookOpen,
  Calendar,
  CheckCircle2,
  X,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useSchool } from "@/lib/school-store";
import type { SchoolClass } from "@/db/schema";

const CURRICULUM_OPTIONS = [
  "Kurikulum SMA Merdeka",
  "Kurikulum SMA 2013 MIPA",
  "Kurikulum SMA 2013 IPS",
] as const;

export default function ClassesPage() {
  const {
    classes,
    students,
    academicYears,
    activeAcademicYear,
    classHistory,
    addClass,
    updateClass,
    deleteClass,
    addAcademicYear,
    setActiveAcademicYear,
  } = useSchool();

  // Filter Tingkat Pendidikan
  const [gradeFilter, setGradeFilter] = useState<string>("ALL");

  const filteredClasses = useMemo(() => {
    if (gradeFilter === "ALL") return classes;
    return classes.filter((c) => String(c.gradeLevel) === gradeFilter);
  }, [classes, gradeFilter]);

  // Baris Rombel yang sedang dipilih pada tabel
  const [selectedClassId, setSelectedClassId] = useState<string>(
    classes[0]?.id || ""
  );

  useEffect(() => {
    if (
      filteredClasses.length > 0 &&
      !filteredClasses.some((c) => c.id === selectedClassId)
    ) {
      setSelectedClassId(filteredClasses[0].id);
    } else if (filteredClasses.length === 0) {
      setSelectedClassId("");
    }
  }, [filteredClasses, selectedClassId]);

  const selectedClass =
    classes.find((c) => c.id === selectedClassId) || null;

  // State Modal Form Tambah / Ubah Rombel
  const [formModalMode, setFormModalMode] = useState<"ADD" | "EDIT" | null>(
    null
  );
  const [formGradeLevel, setFormGradeLevel] = useState<number>(10);
  const [formCurriculum, setFormCurriculum] = useState<string>(
    CURRICULUM_OPTIONS[0]
  );
  const [formClassName, setFormClassName] = useState("");
  const [formHomeroomTeacher, setFormHomeroomTeacher] = useState("");

  // State Modal Tahun Ajaran, Anggota Rombel, & Konfirmasi Hapus Rombel
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [newYearName, setNewYearName] = useState("");
  const [viewingClass, setViewingClass] = useState<SchoolClass | null>(null);
  const [deletingClass, setDeletingClass] = useState<SchoolClass | null>(null);

  const openAddModal = () => {
    setFormGradeLevel(10);
    setFormCurriculum(CURRICULUM_OPTIONS[0]);
    setFormClassName("");
    setFormHomeroomTeacher("");
    setFormModalMode("ADD");
  };

  const openEditModal = () => {
    if (!selectedClass) return;
    setFormGradeLevel(selectedClass.gradeLevel);
    setFormCurriculum(selectedClass.curriculum || CURRICULUM_OPTIONS[0]);
    setFormClassName(selectedClass.name);
    setFormHomeroomTeacher(
      selectedClass.homeroomTeacher === "-"
        ? ""
        : selectedClass.homeroomTeacher || ""
    );
    setFormModalMode("EDIT");
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClassName.trim() || !formHomeroomTeacher.trim()) return;

    if (formModalMode === "ADD") {
      addClass({
        name: formClassName.trim(),
        gradeLevel: Number(formGradeLevel),
        curriculum: formCurriculum,
        homeroomTeacher: formHomeroomTeacher.trim(),
      });
    } else if (formModalMode === "EDIT" && selectedClass) {
      updateClass(selectedClass.id, {
        name: formClassName.trim(),
        gradeLevel: Number(formGradeLevel),
        curriculum: formCurriculum,
        homeroomTeacher: formHomeroomTeacher.trim(),
      });
    }

    setFormModalMode(null);
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
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Manajemen Rombongan Belajar (Kelas) & Tahun Ajaran
          </h2>
          <p className="text-xs text-slate-500">
            Kelola daftar kelas dan periode akademik sebagai dasar penempatan siswa & cetak presensi.
          </p>
        </div>

        {/* CARD TABEL ROMBEL BERGAYA DAPODIK */}
        <div className="rounded-xl bg-white shadow-xs border border-slate-200 overflow-hidden">
          {/* Top Action Navbar (Deretan Tombol Aksi Rombel & Tahun Ajaran) */}
          <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              {/* Tombol Tambah */}
              <button
                type="button"
                onClick={openAddModal}
                className="h-9 px-3.5 rounded-md bg-[#2399e5] hover:bg-[#1d84c7] text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-2xs transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah</span>
              </button>

              {/* Tombol Ubah */}
              <button
                type="button"
                onClick={openEditModal}
                disabled={!selectedClass}
                className="h-9 px-3.5 rounded-md bg-[#7b527c] hover:bg-[#684369] disabled:opacity-50 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-2xs transition"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Ubah</span>
              </button>

              {/* Tombol Hapus */}
              <button
                type="button"
                onClick={() => selectedClass && setDeletingClass(selectedClass)}
                disabled={!selectedClass}
                className="h-9 px-3.5 rounded-md bg-[#dc4444] hover:bg-[#c23838] disabled:opacity-50 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-2xs transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Hapus</span>
              </button>

              {/* Tombol Anggota Rombel */}
              <button
                type="button"
                onClick={() => selectedClass && setViewingClass(selectedClass)}
                disabled={!selectedClass}
                className="h-9 px-3.5 rounded-md bg-[#2399e5] hover:bg-[#1d84c7] disabled:opacity-50 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-2xs transition"
              >
                <Users className="h-3.5 w-3.5" />
                <span>Anggota Rombel</span>
              </button>

              {/* Tombol Tahun Ajaran di Navbar Rombel */}
              <button
                type="button"
                onClick={() => setIsYearModalOpen(true)}
                className="h-9 px-3.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-2xs transition"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Tahun Ajaran ({activeAcademicYear?.name})</span>
              </button>
            </div>

            {/* Filter Tingkat Rombel di Kanan */}
            <div className="w-full sm:w-52">
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="w-full h-9 px-3 rounded-md bg-white border border-slate-300 text-xs text-slate-700 focus:outline-hidden focus:border-sky-500"
              >
                <option value="ALL">Filter Tingkat Rombel...</option>
                <option value="10">Kelas 10</option>
                <option value="11">Kelas 11</option>
                <option value="12">Kelas 12</option>
              </select>
            </div>
          </div>

          {/* Tabel Data Rombel */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 divide-x divide-slate-200">
                  <th className="py-3 px-4 font-semibold">
                    Tingkat Pendidikan
                  </th>
                  <th className="py-3 px-4 font-semibold">Kurikulum</th>
                  <th className="py-3 px-4 font-semibold">Nama Rombel</th>
                  <th className="py-3 px-4 font-semibold">Wali/Guru Kelas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredClasses.length > 0 ? (
                  filteredClasses.map((cls, idx) => {
                    const isSelected = cls.id === selectedClassId;

                    return (
                      <tr
                        key={cls.id}
                        onClick={() => setSelectedClassId(cls.id)}
                        onDoubleClick={() => setViewingClass(cls)}
                        className={`cursor-pointer transition-colors divide-x divide-slate-200/70 ${
                          isSelected
                            ? "bg-sky-50/90 text-slate-900 font-medium"
                            : idx % 2 === 1
                            ? "bg-slate-50/50 hover:bg-slate-100/70 text-slate-700"
                            : "bg-white hover:bg-slate-100/70 text-slate-700"
                        }`}
                      >
                        <td className="py-2.5 px-4">
                          Kelas {cls.gradeLevel}
                        </td>
                        <td className="py-2.5 px-4">
                          {cls.curriculum || "Kurikulum SMA Merdeka"}
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-slate-800">
                          {cls.name}
                        </td>
                        <td className="py-2.5 px-4">
                          {cls.homeroomTeacher || "-"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-xs text-slate-400"
                    >
                      Belum ada data rombel untuk filter ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Card Form Tambah / Ubah Rombel */}
      {formModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    {formModalMode === "ADD"
                      ? "Tambah Rombongan Belajar (Rombel)"
                      : `Ubah Rombel — ${selectedClass?.name}`}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Lengkapi detail tingkat pendidikan, kurikulum, nama rombel, dan wali kelas.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormModalMode(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="p-6 space-y-4">
              {/* 1. Tingkat Pendidikan (10-12) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tingkat Pendidikan <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formGradeLevel}
                  onChange={(e) => setFormGradeLevel(Number(e.target.value))}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                >
                  <option value={10}>Kelas 10</option>
                  <option value={11}>Kelas 11</option>
                  <option value={12}>Kelas 12</option>
                </select>
              </div>

              {/* 2. Kurikulum */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kurikulum <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formCurriculum}
                  onChange={(e) => setFormCurriculum(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                >
                  {CURRICULUM_OPTIONS.map((cur) => (
                    <option key={cur} value={cur}>
                      {cur}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Nama Rombel */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Rombel <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: X A atau XII IPA"
                  value={formClassName}
                  onChange={(e) => setFormClassName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
              </div>

              {/* 4. Wali Kelas */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Wali Kelas <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama Lengkap Wali Kelas"
                  value={formHomeroomTeacher}
                  onChange={(e) => setFormHomeroomTeacher(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setFormModalMode(null)}
                  className="px-4 h-9 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1.5 transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Simpan Rombel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Card Tahun Ajaran */}
      {isYearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Manajemen Tahun Ajaran
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Tambah atau aktifkan periode Tahun Ajaran sekolah.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsYearModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <form
                onSubmit={handleAddYear}
                className="flex gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/70"
              >
                <input
                  type="text"
                  placeholder="Contoh: 2025/2026 Genap"
                  value={newYearName}
                  onChange={(e) => setNewYearName(e.target.value)}
                  className="flex-1 h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-800"
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

              <div className="space-y-2.5 max-h-64 overflow-y-auto">
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

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsYearModalOpen(false)}
                className="px-4 h-9 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

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
                    Kelas {viewingClass.gradeLevel} • {viewingClass.curriculum} • Wali Kelas:{" "}
                    {viewingClass.homeroomTeacher || "-"} • Total{" "}
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
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                std.gender === "M"
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
              (Kelas {deletingClass.gradeLevel})? Data siswa di Buku Induk
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
