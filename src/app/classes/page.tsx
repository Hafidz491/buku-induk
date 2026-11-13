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
  RotateCcw,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  UserPlus,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useSchool } from "@/lib/school-store";
import type { SchoolClass } from "@/db/schema";

const CURRICULUM_OPTIONS = [
  "Kurikulum SMA Merdeka",
  "Kurikulum SMA 2013 MIPA",
  "Kurikulum SMA 2013 IPS",
] as const;

function formatBirthDateSlash(dateStr: string): string {
  if (!dateStr) return "-";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

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
    assignStudentToClass,
    removeStudentClassHistory,
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

  // State untuk Modal Edit Anggota Rombel (Kiri: Anggota Rombel, Kanan: Siswa Belum Masuk Rombel)
  const [selectedLeftHistoryIds, setSelectedLeftHistoryIds] = useState<
    string[]
  >([]);
  const [selectedRightStudentIds, setSelectedRightStudentIds] = useState<
    string[]
  >([]);
  const [unassignedSearch, setUnassignedSearch] = useState("");

  useEffect(() => {
    setSelectedLeftHistoryIds([]);
    setSelectedRightStudentIds([]);
    setUnassignedSearch("");
  }, [viewingClass, activeAcademicYear?.id]);

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

  // Data siswa yang menjadi Anggota Rombel (KIRI) pada Tahun Ajaran Aktif
  const studentsInViewingClass = useMemo(() => {
    if (!viewingClass) return [];
    return classHistory
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
              historyId: h.id,
              statusInClass: h.statusInClass,
            }
          : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  }, [viewingClass, classHistory, activeAcademicYear?.id, students]);

  // Data siswa aktif yang BELUM masuk rombel sama sekali pada Tahun Ajaran Aktif (KANAN)
  const unassignedStudents = useMemo(() => {
    const assignedStudentIdsInActiveYear = new Set(
      classHistory
        .filter((h) => h.academicYearId === activeAcademicYear?.id)
        .map((h) => h.studentId)
    );

    const q = unassignedSearch.trim().toLowerCase();

    return students
      .filter(
        (s) =>
          s.status === "ACTIVE" && !assignedStudentIdsInActiveYear.has(s.id)
      )
      .filter((s) => {
        if (!q) return true;
        return (
          s.fullName.toLowerCase().includes(q) ||
          s.nisn.toLowerCase().includes(q) ||
          s.nis.toLowerCase().includes(q)
        );
      })
      .map((s) => {
        // Cari kelas di periode/tahun ajaran sebelumnya jika ada
        const prevHist = classHistory.find(
          (h) =>
            h.studentId === s.id && h.academicYearId !== activeAcademicYear?.id
        );
        const prevClass = prevHist
          ? classes.find((c) => c.id === prevHist.classId)?.name || "-"
          : "-";
        return {
          ...s,
          previousClassName: prevClass,
        };
      })
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  }, [
    students,
    classHistory,
    activeAcademicYear?.id,
    unassignedSearch,
    classes,
  ]);

  const toggleLeftSelection = (historyId: string) => {
    setSelectedLeftHistoryIds((prev) =>
      prev.includes(historyId)
        ? prev.filter((id) => id !== historyId)
        : [...prev, historyId]
    );
  };

  const toggleRightSelection = (studentId: string) => {
    setSelectedRightStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleRemoveSelectedFromRombel = () => {
    if (selectedLeftHistoryIds.length === 0) return;
    selectedLeftHistoryIds.forEach((historyId) => {
      removeStudentClassHistory(historyId);
    });
    setSelectedLeftHistoryIds([]);
  };

  const handleAddSelectedToRombel = () => {
    if (
      !viewingClass ||
      !activeAcademicYear ||
      selectedRightStudentIds.length === 0
    )
      return;
    selectedRightStudentIds.forEach((studentId) => {
      assignStudentToClass({
        studentId,
        classId: viewingClass.id,
        academicYearId: activeAcademicYear.id,
        statusInClass: viewingClass.gradeLevel === 10 ? "NEW" : "PROMOTED",
      });
    });
    setSelectedRightStudentIds([]);
  };

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

      {/* Modal Edit Anggota Rombel (Split 2 Kolom: Kiri Anggota Rombel, Kanan Siswa Belum Masuk Rombel) */}
      {viewingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-2xs p-2 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-[1260px] rounded-lg bg-white shadow-2xl border border-slate-400 overflow-hidden my-4">
            {/* Header Bar Bergaya Dapodik */}
            <div className="px-4 py-2.5 bg-[#455a64] text-white flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-semibold tracking-wide">
                Edit Anggota Rombel {viewingClass.name} Angkatan{" "}
                {activeAcademicYear?.name}
              </h3>
              <button
                type="button"
                onClick={() => setViewingClass(null)}
                className="p-1 rounded-sm text-white/80 hover:text-white hover:bg-white/10 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body 2 Kolom: Kiri (Anggota Rombel) & Kanan (Siswa Belum Masuk Rombel) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-300">
              {/* ================= KOLOM KIRI: DATA ANGGOTA ROMBEL ================= */}
              <div className="flex flex-col bg-white">
                {/* Toolbar Kiri */}
                <div className="p-2.5 border-b border-slate-200 flex items-center justify-between gap-2 bg-white">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRemoveSelectedFromRombel}
                      disabled={selectedLeftHistoryIds.length === 0}
                      className="h-8 px-3 rounded-sm bg-[#e74c3c] hover:bg-[#c0392b] disabled:opacity-50 text-white text-xs font-medium inline-flex items-center gap-1.5 shadow-2xs transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>
                        Keluarkan dari Rombel
                        {selectedLeftHistoryIds.length > 0
                          ? ` (${selectedLeftHistoryIds.length})`
                          : ""}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Tabel Kiri (Anggota Rombel) */}
                <div className="h-[420px] overflow-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead className="sticky top-0 z-10 bg-slate-50 text-slate-700 border-b border-slate-300">
                      <tr className="divide-x divide-slate-200">
                        <th className="py-2 px-2.5 w-8 text-center">
                          <input
                            type="checkbox"
                            checked={
                              studentsInViewingClass.length > 0 &&
                              selectedLeftHistoryIds.length ===
                                studentsInViewingClass.length
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedLeftHistoryIds(
                                  studentsInViewingClass.map((s) => s.historyId)
                                );
                              } else {
                                setSelectedLeftHistoryIds([]);
                              }
                            }}
                            className="rounded border-slate-300"
                          />
                        </th>
                        <th className="py-2 px-3 font-semibold">
                          Peserta Didik ↑
                        </th>
                        <th className="py-2 px-3 font-semibold w-28">NISN</th>
                        <th className="py-2 px-3 font-semibold w-24">NIS</th>
                        <th className="py-2 px-2.5 font-semibold w-12 text-center">
                          JK
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {studentsInViewingClass.length > 0 ? (
                        studentsInViewingClass.map((std, idx) => {
                          const isChecked = selectedLeftHistoryIds.includes(
                            std.historyId
                          );
                          return (
                            <tr
                              key={std.id}
                              onClick={() => toggleLeftSelection(std.historyId)}
                              className={`cursor-pointer divide-x divide-slate-200/70 transition-colors ${
                                isChecked
                                  ? "bg-rose-50/90 text-slate-900 font-medium"
                                  : idx % 2 === 1
                                  ? "bg-slate-50/70 hover:bg-slate-100/80 text-slate-700"
                                  : "bg-white hover:bg-slate-100/80 text-slate-700"
                              }`}
                            >
                              <td
                                className="py-1.5 px-2.5 text-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() =>
                                    toggleLeftSelection(std.historyId)
                                  }
                                  className="rounded border-slate-300"
                                />
                              </td>
                              <td className="py-1.5 px-3 uppercase font-medium text-slate-800">
                                {std.fullName}
                              </td>
                              <td className="py-1.5 px-3 font-mono text-slate-700">
                                {std.nisn}
                              </td>
                              <td className="py-1.5 px-3 font-mono text-slate-700">
                                {std.nis}
                              </td>
                              <td className="py-1.5 px-2.5 text-center font-semibold">
                                {std.gender === "M" ? "L" : "P"}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-16 text-center text-xs text-slate-400"
                          >
                            Belum ada anggota rombel di kelas{" "}
                            <strong>{viewingClass.name}</strong>. Pilih siswa
                            dari tabel sebelah kanan untuk dimasukkan ke rombel
                            ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer Kiri */}
                <div className="px-3 py-2 bg-slate-50 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <ChevronsLeft className="h-3.5 w-3.5 text-slate-400" />
                    <ChevronLeft className="h-3.5 w-3.5 text-slate-400" />
                    <span className="mx-1">Page</span>
                    <input
                      type="text"
                      readOnly
                      value="1"
                      className="w-8 h-5 text-center bg-white border border-slate-300 rounded-xs text-[11px]"
                    />
                    <span className="mx-1">of 1</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    <ChevronsRight className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <div>
                    Menampilkan baris{" "}
                    {studentsInViewingClass.length > 0 ? 1 : 0} -{" "}
                    {studentsInViewingClass.length} dari{" "}
                    {studentsInViewingClass.length}
                  </div>
                </div>
              </div>

              {/* ================= KOLOM KANAN: SISWA BELUM MASUK ROMBEL ================= */}
              <div className="flex flex-col bg-white">
                {/* Toolbar Kanan */}
                <div className="p-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-white">
                  <input
                    type="text"
                    placeholder="Cari Peserta Didik... (Nama / NISN)"
                    value={unassignedSearch}
                    onChange={(e) => setUnassignedSearch(e.target.value)}
                    className="h-8 px-2.5 w-48 sm:w-56 rounded-sm bg-white border border-slate-300 text-xs text-slate-700 focus:outline-hidden focus:border-sky-500"
                  />

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleAddSelectedToRombel}
                      disabled={selectedRightStudentIds.length === 0}
                      className="h-8 px-3 rounded-sm bg-[#2399e5] hover:bg-[#1d84c7] disabled:opacity-50 text-white text-xs font-medium inline-flex items-center gap-1.5 shadow-2xs transition"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>
                        Masukkan ke Rombel
                        {selectedRightStudentIds.length > 0
                          ? ` (${selectedRightStudentIds.length})`
                          : ""}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUnassignedSearch("")}
                      className="h-8 px-2.5 rounded-sm bg-[#67b8ef] hover:bg-[#4da8e8] text-white text-xs font-medium inline-flex items-center gap-1 shadow-2xs transition"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Tampilkan Semua</span>
                    </button>
                  </div>
                </div>

                {/* Tabel Kanan (Siswa Belum Masuk Rombel Sama Sekali) */}
                <div className="h-[420px] overflow-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead className="sticky top-0 z-10 bg-slate-50 text-slate-700 border-b border-slate-300">
                      <tr className="divide-x divide-slate-200">
                        <th className="py-2 px-2.5 w-8 text-center">
                          <input
                            type="checkbox"
                            checked={
                              unassignedStudents.length > 0 &&
                              selectedRightStudentIds.length ===
                                unassignedStudents.length
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRightStudentIds(
                                  unassignedStudents.map((s) => s.id)
                                );
                              } else {
                                setSelectedRightStudentIds([]);
                              }
                            }}
                            className="rounded border-slate-300"
                          />
                        </th>
                        <th className="py-2 px-3 font-semibold">Nama</th>
                        <th className="py-2 px-3 font-semibold w-28">NISN</th>
                        <th className="py-2 px-3 font-semibold w-24">
                          Tgl Lahir
                        </th>
                        <th className="py-2 px-3 font-semibold">
                          Kelas di Semester Kemarin
                        </th>
                        <th className="py-2 px-2.5 font-semibold w-12 text-center">
                          JK
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {unassignedStudents.length > 0 ? (
                        unassignedStudents.map((std, idx) => {
                          const isChecked = selectedRightStudentIds.includes(
                            std.id
                          );
                          return (
                            <tr
                              key={std.id}
                              onClick={() => toggleRightSelection(std.id)}
                              className={`cursor-pointer divide-x divide-slate-200/70 transition-colors ${
                                isChecked
                                  ? "bg-sky-50/90 text-slate-900 font-medium"
                                  : idx % 2 === 1
                                  ? "bg-slate-50/70 hover:bg-slate-100/80 text-slate-700"
                                  : "bg-white hover:bg-slate-100/80 text-slate-700"
                              }`}
                            >
                              <td
                                className="py-1.5 px-2.5 text-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleRightSelection(std.id)}
                                  className="rounded border-slate-300"
                                />
                              </td>
                              <td className="py-1.5 px-3 uppercase font-medium text-slate-800">
                                {std.fullName}
                              </td>
                              <td className="py-1.5 px-3 font-mono text-slate-700">
                                {std.nisn}
                              </td>
                              <td className="py-1.5 px-3 font-mono text-slate-700">
                                {formatBirthDateSlash(std.birthDate)}
                              </td>
                              <td className="py-1.5 px-3 text-slate-700">
                                {std.previousClassName}
                              </td>
                              <td className="py-1.5 px-2.5 text-center font-semibold">
                                {std.gender === "M" ? "L" : "P"}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-16 text-center text-xs text-slate-400"
                          >
                            Semua siswa aktif sudah ditempatkan ke dalam rombel
                            pada Tahun Ajaran{" "}
                            <strong>{activeAcademicYear?.name}</strong>.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer Kanan */}
                <div className="px-3 py-2 bg-slate-50 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <ChevronsLeft className="h-3.5 w-3.5 text-slate-400" />
                    <ChevronLeft className="h-3.5 w-3.5 text-slate-400" />
                    <span className="mx-1">Page</span>
                    <input
                      type="text"
                      readOnly
                      value="1"
                      className="w-8 h-5 text-center bg-white border border-slate-300 rounded-xs text-[11px]"
                    />
                    <span className="mx-1">of 1</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    <ChevronsRight className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <div>
                    Displaying data {unassignedStudents.length > 0 ? 1 : 0} -{" "}
                    {unassignedStudents.length} of {unassignedStudents.length}
                  </div>
                </div>
              </div>
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
