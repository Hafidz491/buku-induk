"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Printer,
  MapPin,
  Users,
  GraduationCap,
  Plus,
  Trash2,
  History,
  UserCheck,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { useSchool } from "@/lib/school-store";
import { formatTanggalIndo } from "@/lib/utils";
import { StudentFormModal } from "@/components/students/student-form-modal";

export default function StudentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {
    students,
    classes,
    academicYears,
    activeAcademicYear,
    classHistory,
    assignStudentToClass,
    removeStudentClassHistory,
  } = useSchool();

  const student = students.find((s) => s.id === params.id);

  // State Modal Edit Identitas Siswa
  const [editModalOpen, setEditModalOpen] = useState(false);

  // State Form Tambah / Update Riwayat Kelas (Kenaikan Kelas)
  const [selectedYearId, setSelectedYearId] = useState<string>(
    activeAcademicYear?.id || academicYears[0]?.id || ""
  );
  const [selectedClassId, setSelectedClassId] = useState<string>(
    classes[0]?.id || ""
  );
  const [selectedStatusInClass, setSelectedStatusInClass] = useState<
    "NEW" | "PROMOTED" | "RETAINED"
  >("PROMOTED");

  if (!student) {
    return (
      <AppShell>
        <div className="rounded-2xl bg-white p-10 text-center shadow-xs border border-slate-100 space-y-4">
          <p className="text-sm font-bold text-slate-700">
            Data siswa tidak ditemukan di Buku Induk.
          </p>
          <button
            type="button"
            onClick={() => router.push("/students")}
            className="px-4 h-9 rounded-xl bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Buku Induk
          </button>
        </div>
      </AppShell>
    );
  }

  // Ambil seluruh riwayat kelas siswa ini, diurutkan berdasarkan nama Tahun Ajaran
  const studentHistories = classHistory
    .filter((h) => h.studentId === student.id)
    .map((h) => {
      const cls = classes.find((c) => c.id === h.classId);
      const year = academicYears.find((y) => y.id === h.academicYearId);
      return {
        ...h,
        className: cls ? cls.name : "-",
        gradeLevel: cls ? cls.gradeLevel : 0,
        academicYearName: year ? year.name : "-",
        isYearActive: year ? year.isActive : false,
      };
    })
    .sort((a, b) => a.academicYearName.localeCompare(b.academicYearName));

  const currentActiveHistory = studentHistories.find((h) => h.isYearActive);

  const handleAddOrUpdateHistory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedYearId || !selectedClassId) return;
    assignStudentToClass({
      studentId: student.id,
      academicYearId: selectedYearId,
      classId: selectedClassId,
      statusInClass: selectedStatusInClass,
    });
  };

  const renderStatusBadge = (status: typeof student.status) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="success">AKTIF</Badge>;
      case "GRADUATED":
        return <Badge variant="info">LULUS / ALUMNI</Badge>;
      case "TRANSFERRED":
        return <Badge variant="warning">PINDAH / MUTASI</Badge>;
      case "DROPPED_OUT":
        return <Badge variant="destructive">KELUAR / DO</Badge>;
    }
  };

  const renderStatusLabel = (status: typeof student.status) => {
    switch (status) {
      case "ACTIVE":
        return "AKTIF";
      case "GRADUATED":
        return "LULUS";
      case "TRANSFERRED":
        return "PINDAH / MUTASI";
      case "DROPPED_OUT":
        return "KELUAR / DO";
    }
  };

  const renderStatusInClassBadge = (
    statusInClass: "NEW" | "PROMOTED" | "RETAINED"
  ) => {
    switch (statusInClass) {
      case "NEW":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-700">
            Siswa Baru
          </span>
        );
      case "PROMOTED":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
            Naik Kelas
          </span>
        );
      case "RETAINED":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">
            Tinggal Kelas
          </span>
        );
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 print-container">
        {/* Navigasi Atas & Tombol Aksi (Disembunyikan saat Print) */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/students"
              className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-2xs transition"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Detail Buku Induk Siswa
              </h2>
              <p className="text-xs text-slate-500">
                Lembar induk identitas permanen & riwayat kenaikan kelas siswa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setEditModalOpen(true)}
              className="h-9 px-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition"
            >
              <Pencil className="h-3.5 w-3.5 text-sky-500" />
              <span>Edit Data Siswa</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Cetak Lembar Buku Induk</span>
            </button>
          </div>
        </div>

        {/* KOP SURAT CETAK (Hanya tampil saat dicetak di kertas) */}
        <div className="hidden print:block mb-4 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kop-sekolah.jpg"
            alt="Kop Sekolah SMA Bina Insan Mulia Kota Metro"
            className="w-full h-auto max-h-32 object-contain mx-auto mb-2"
          />
          <h1 className="text-base font-bold uppercase tracking-wide underline">
            LEMBAR BUKU INDUK PESERTA DIDIK
          </h1>
          <p className="text-xs">
            Nomor Induk Siswa Nasional (NISN): {student.nisn} • Nomor Induk
            Sekolah (NIS): {student.nis}
          </p>
        </div>

        {/* KARTU PROFIL RINGKAS ATAS */}
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-sm no-print">
              {student.fullName
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-lg font-extrabold text-slate-900">
                  {student.fullName}
                </h3>
                {renderStatusBadge(student.status)}
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1">
                NISN: <strong className="text-slate-800">{student.nisn}</strong>{" "}
                • NIS: <strong className="text-slate-800">{student.nis}</strong>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Tahun Masuk (Angkatan):{" "}
                <strong className="text-slate-700">{student.entryYear}</strong>{" "}
                • Kelas Saat Ini:{" "}
                <strong className="text-emerald-600">
                  {currentActiveHistory
                    ? `${currentActiveHistory.className} (${currentActiveHistory.academicYearName})`
                    : "Belum Ditempatkan"}
                </strong>
              </p>
            </div>
          </div>
        </div>

        {/* GRID DETAIL IDENTITAS, ALAMAT, & ORANG TUA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* KIRI (7 Kolom): Identitas Diri, Alamat Lengkap, & Orang Tua */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Identitas Pribadi */}
            <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <UserCheck className="h-5 w-5 text-emerald-500 no-print" />
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  A. Keterangan Pribadi Siswa
                </h4>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
                <div>
                  <dt className="text-slate-400 font-medium">Nama Lengkap</dt>
                  <dd className="font-bold text-slate-800 mt-0.5">
                    {student.fullName}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Jenis Kelamin</dt>
                  <dd className="font-bold text-slate-800 mt-0.5">
                    {student.gender === "M" ? "Laki-Laki (L)" : "Perempuan (P)"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">NISN</dt>
                  <dd className="font-bold text-slate-800 font-mono mt-0.5">
                    {student.nisn}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">
                    NIS (Nomor Induk Sekolah)
                  </dt>
                  <dd className="font-bold text-slate-800 font-mono mt-0.5">
                    {student.nis}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Tempat Lahir</dt>
                  <dd className="font-bold text-slate-800 mt-0.5">
                    {student.birthPlace}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Tanggal Lahir</dt>
                  <dd className="font-bold text-slate-800 mt-0.5">
                    {formatTanggalIndo(student.birthDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">
                    Tahun Masuk Sekolah
                  </dt>
                  <dd className="font-bold text-slate-800 mt-0.5">
                    {student.entryYear}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">
                    Status Peserta Didik
                  </dt>
                  <dd className="font-bold text-slate-800 mt-0.5">
                    {renderStatusLabel(student.status)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* 2. Alamat Tempat Tinggal Terpisah */}
            <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <MapPin className="h-5 w-5 text-emerald-500 no-print" />
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  B. Keterangan Tempat Tinggal (Alamat Lengkap)
                </h4>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
                <div className="sm:col-span-2">
                  <dt className="text-slate-400 font-medium">
                    Alamat (Jalan / Gang / No. Rumah)
                  </dt>
                  <dd className="font-bold text-slate-800 mt-0.5">
                    {student.streetAddress}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">RT / RW</dt>
                  <dd className="font-bold text-slate-800 mt-0.5">
                    {student.rtRw}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">
                    Kelurahan / Desa
                  </dt>
                  <dd className="font-bold text-slate-800 mt-0.5">
                    {student.village}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Kecamatan</dt>
                  <dd className="font-bold text-slate-800 mt-0.5">
                    {student.district}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">
                    Kabupaten / Kota
                  </dt>
                  <dd className="font-bold text-slate-800 mt-0.5">
                    {student.city}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Provinsi</dt>
                  <dd className="font-bold text-slate-800 mt-0.5">
                    {student.province}
                  </dd>
                </div>
              </dl>
            </div>

            {/* 3. Data Orang Tua (Ayah & Ibu beserta No HP) */}
            <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Users className="h-5 w-5 text-sky-500 no-print" />
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  C. Keterangan Orang Tua Kandung
                </h4>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
                <div>
                  <dt className="text-slate-400 font-medium">
                    Nama Lengkap Ayah
                  </dt>
                  <dd className="font-bold text-slate-800 mt-0.5">
                    {student.fatherName}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">
                    No. HP / Telepon Ayah
                  </dt>
                  <dd className="font-bold text-slate-800 mt-0.5">
                    {student.fatherPhone ? student.fatherPhone : "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">
                    Nama Lengkap Ibu
                  </dt>
                  <dd className="font-bold text-slate-800 mt-0.5">
                    {student.motherName}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">
                    No. HP / Telepon Ibu
                  </dt>
                  <dd className="font-bold text-slate-800 mt-0.5">
                    {student.motherPhone ? student.motherPhone : "-"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* KANAN (5 Kolom): Riwayat Kelas / Kenaikan Kelas (`student_class_history`) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-100 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-emerald-500 no-print" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                      D. Riwayat Kelas / Rombel
                    </h4>
                    <p className="text-[11px] text-slate-400 no-print">
                      Rekam jejak penempatan & kenaikan kelas tiap tahun ajaran
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Tambah / Update Riwayat Kelas Siswa Ini (Disembunyikan saat Print) */}
              <form
                onSubmit={handleAddOrUpdateHistory}
                className="no-print rounded-xl bg-slate-50 p-4 border border-slate-200/70 space-y-3"
              >
                <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-emerald-500" />
                  <span>Catat Penempatan / Kenaikan Kelas</span>
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Tahun Ajaran
                    </label>
                    <select
                      value={selectedYearId}
                      onChange={(e) => setSelectedYearId(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs"
                    >
                      {academicYears.map((ay) => (
                        <option key={ay.id} value={ay.id}>
                          {ay.name} {ay.isActive ? "(Aktif)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Kelas / Rombel
                      </label>
                      <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs"
                      >
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name} (Tingkat {cls.gradeLevel})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Status di Kelas
                      </label>
                      <select
                        value={selectedStatusInClass}
                        onChange={(e) =>
                          setSelectedStatusInClass(
                            e.target.value as "NEW" | "PROMOTED" | "RETAINED"
                          )
                        }
                        className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs"
                      >
                        <option value="NEW">Siswa Baru</option>
                        <option value="PROMOTED">Naik Kelas</option>
                        <option value="RETAINED">Tinggal Kelas</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-9 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Simpan Riwayat Kelas</span>
                </button>
              </form>

              {/* Daftar Riwayat Kelas Siswa */}
              {studentHistories.length > 0 ? (
                <div className="space-y-3">
                  {studentHistories.map((hist, idx) => (
                    <div
                      key={hist.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                        hist.isYearActive
                          ? "bg-emerald-50/40 border-emerald-200"
                          : "bg-white border-slate-200/80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-800">
                              Kelas {hist.className}
                            </p>
                            {hist.isYearActive && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                                TA Aktif
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            Tahun Ajaran: <strong>{hist.academicYearName}</strong>{" "}
                            • Tingkat {hist.gradeLevel}
                          </p>
                          <div className="mt-1.5">
                            {renderStatusInClassBadge(hist.statusInClass)}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeStudentClassHistory(hist.id)}
                        title="Hapus Riwayat Kelas Ini"
                        className="no-print p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  Siswa ini belum memiliki riwayat penempatan kelas (`student_class_history`).
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit Siswa */}
      <StudentFormModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        editingStudent={student}
      />
    </AppShell>
  );
}

