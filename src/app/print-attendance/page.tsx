"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Printer, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useSchool } from "@/lib/school-store";
import { formatTanggalIndo } from "@/lib/utils";

const INDONESIAN_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function PrintAttendanceContent() {
  const searchParams = useSearchParams();
  const queryClassId = searchParams.get("classId");

  const { classes, academicYears, activeAcademicYear, classHistory, students } =
    useSchool();

  const [selectedYearId, setSelectedYearId] = useState<string>(
    activeAcademicYear?.id || academicYears[0]?.id || ""
  );
  const [selectedClassId, setSelectedClassId] = useState<string>(
    queryClassId || classes[0]?.id || ""
  );

  // Filter Absensi Khusus Per Bulan
  const [selectedMonth, setSelectedMonth] = useState<number>(10); // November
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  // Opsi Tampilkan Nama Wali Kelas dari Detail Rombel
  const [showHomeroomTeacher, setShowHomeroomTeacher] = useState<"SHOW" | "HIDE">("SHOW");

  useEffect(() => {
    if (queryClassId && classes.some((c) => c.id === queryClassId)) {
      setSelectedClassId(queryClassId);
    }
  }, [queryClassId, classes]);

  useEffect(() => {
    if (!selectedYearId && activeAcademicYear) {
      setSelectedYearId(activeAcademicYear.id);
    }
  }, [activeAcademicYear, selectedYearId]);

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const selectedAcademicYear = academicYears.find(
    (y) => y.id === selectedYearId
  );

  // Tarik daftar siswa otomatis dari student_class_history berdasarkan Kelas & Tahun Ajaran
  const classStudents = useMemo(() => {
    return classHistory
      .filter(
        (h) =>
          h.classId === selectedClassId && h.academicYearId === selectedYearId
      )
      .map((h) => students.find((s) => s.id === h.studentId))
      .filter(
        (s): s is NonNullable<typeof s> =>
          Boolean(s) && s!.status === "ACTIVE"
      )
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  }, [classHistory, selectedClassId, selectedYearId, students]);

  // Hitung kolom tanggal sesuai jumlah hari pada bulan & tahun terpilih
  const dateColumns = useMemo(() => {
    const daysInMonth = new Date(
      selectedYear,
      selectedMonth + 1,
      0
    ).getDate();
    const cols: number[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      cols.push(d);
    }
    return cols;
  }, [selectedMonth, selectedYear]);

  const monthLabel = `${INDONESIAN_MONTHS[selectedMonth]} ${selectedYear}`;

  const todayFormatted = formatTanggalIndo(
    new Date().toISOString().slice(0, 10)
  );

  return (
    <div className="space-y-6">
      {/* PANEL PENGATURAN CETAK (Disembunyikan saat Print) */}
      <div className="no-print space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Cetak Lembar Absensi Fisik
            </h2>
            <p className="text-xs text-slate-500">
              Pilih Kelas dan Bulan untuk mencetak lembar daftar hadir.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="h-10 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md transition self-start sm:self-auto"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak Lembar Presensi</span>
          </button>
        </div>

        {/* Filter Kelas, Tahun Ajaran, & Bulan */}
        <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <SlidersHorizontal className="h-4 w-4 text-emerald-500" />
            <span>Parameter Cetak Daftar Hadir Bulanan</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Pilih Tahun Ajaran */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tahun Ajaran
              </label>
              <select
                value={selectedYearId}
                onChange={(e) => setSelectedYearId(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800"
              >
                {academicYears.map((ay) => (
                  <option key={ay.id} value={ay.id}>
                    {ay.name} {ay.isActive ? "(Aktif)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Pilih Kelas / Rombel */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Kelas / Rombel
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    Kelas {cls.name} (Tingkat {cls.gradeLevel})
                  </option>
                ))}
              </select>
            </div>

            {/* Pilih Bulan */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Bulan
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800"
              >
                {INDONESIAN_MONTHS.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Pilih Tahun */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tahun
              </label>
              <input
                type="number"
                min={2020}
                max={2099}
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800"
              />
            </div>

            {/* Tampilkan Nama Wali Kelas atau Tidak */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tampilkan Nama Wali Kelas
              </label>
              <select
                value={showHomeroomTeacher}
                onChange={(e) =>
                  setShowHomeroomTeacher(e.target.value as "SHOW" | "HIDE")
                }
                className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800"
              >
                <option value="SHOW">Tampilkan</option>
                <option value="HIDE">Tidak Ditampilkan</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          LEMBAR CETAK FISIK A4 POTRET (SIAP CETAK / PRINT-FRIENDLY)
         ============================================================== */}
      <div className="print-container mx-auto max-w-[210mm] rounded-2xl bg-white p-5 sm:p-7 shadow-sm border border-slate-200 text-black overflow-x-auto">
        {/* KOP SEKOLAH RESMI (YAYASAN KHOIRUL HUDA METRO - SMA BINA INSAN MULIA KOTA METRO) */}
        <div className="mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kop-sekolah.jpg"
            alt="Kop Sekolah SMA Bina Insan Mulia Kota Metro"
            className="w-full h-auto max-h-32 object-contain mx-auto"
          />
        </div>

        {/* JUDUL DOKUMEN (Tanpa Tulisan Presensi Harian) */}
        <div className="text-center my-3">
          <h3 className="text-sm sm:text-base font-bold uppercase tracking-wide underline">
            DAFTAR HADIR PESERTA DIDIK
          </h3>
        </div>

        {/* INFORMASI KELAS, TAHUN AJARAN, & BULAN (Tanpa Jumlah Siswa) */}
        <div className="grid grid-cols-2 gap-4 text-xs mb-3">
          <div className="space-y-1">
            <div className="flex">
              <span className="w-28 font-semibold">Kelas / Rombel</span>
              <span>: {selectedClass ? selectedClass.name : "-"}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-semibold">Tahun Ajaran</span>
              <span>
                : {selectedAcademicYear ? selectedAcademicYear.name : "-"}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex">
              <span className="w-28 font-semibold">Bulan</span>
              <span>: {monthLabel}</span>
            </div>
          </div>
        </div>

        {/* TABEL PRESENSI FISIK BULANAN DENGAN GARIS PEMISAH TEGAS & TANPA PARAF/KET */}
        <table className="print-table w-full border-collapse text-[10px]">
          <thead>
            <tr>
              <th rowSpan={2} className="w-6 text-center border border-slate-800">
                No
              </th>
              <th rowSpan={2} className="w-20 text-center border border-slate-800">
                NISN
              </th>
              <th rowSpan={2} className="text-left px-1.5 min-w-[125px] border border-slate-800">
                Nama Siswa
              </th>
              <th rowSpan={2} className="w-6 text-center border border-slate-800">
                L/P
              </th>
              <th
                colSpan={dateColumns.length}
                className="text-center border border-slate-800 py-1"
              >
                Tanggal ({monthLabel})
              </th>
              <th colSpan={3} className="text-center border border-slate-800">
                Ket.
              </th>
            </tr>
            <tr>
              {dateColumns.map((day) => (
                <th
                  key={day}
                  className="text-center text-[8.5px] font-bold px-0.5 w-4 border border-slate-800"
                >
                  {day}
                </th>
              ))}
              <th className="w-5 text-center text-[8.5px] font-bold border border-slate-800">
                S
              </th>
              <th className="w-5 text-center text-[8.5px] font-bold border border-slate-800">
                I
              </th>
              <th className="w-5 text-center text-[8.5px] font-bold border border-slate-800">
                A
              </th>
            </tr>
          </thead>

          <tbody>
            {classStudents.length > 0 ? (
              classStudents.map((student, idx) => (
                <tr key={student.id}>
                  <td className="text-center font-medium border border-slate-800">
                    {idx + 1}
                  </td>
                  <td className="text-center font-mono text-[9.5px] border border-slate-800">
                    {student.nisn}
                  </td>
                  <td className="font-medium px-1.5 border border-slate-800">
                    {student.fullName}
                  </td>
                  <td className="text-center font-semibold border border-slate-800">
                    {student.gender === "M" ? "L" : "P"}
                  </td>
                  {dateColumns.map((day) => (
                    <td
                      key={day}
                      className="h-5 text-center border border-slate-800"
                    />
                  ))}
                  <td className="text-center border border-slate-800" />
                  <td className="text-center border border-slate-800" />
                  <td className="text-center border border-slate-800" />
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={dateColumns.length + 7}
                  className="py-8 text-center text-slate-500 border border-slate-800"
                >
                  Belum ada siswa aktif yang terdaftar di Kelas{" "}
                  <strong>{selectedClass?.name || "-"}</strong> pada Tahun
                  Ajaran <strong>{selectedAcademicYear?.name || "-"}</strong>.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* CATATAN KETERANGAN & BLOK TANDA TANGAN */}
        <div className="mt-6 flex items-start justify-between text-xs">
          <div className="space-y-1 text-[11px]">
            <p className="font-bold">Keterangan Pengisian:</p>
            <p>• ✓ : Hadir</p>
            <p>• S : Sakit</p>
            <p>• I : Izin</p>
            <p>• A : Tanpa Keterangan (Alfa)</p>
          </div>

          <div className="text-center min-w-[200px]">
            <p>Kota Metro, {todayFormatted}</p>
            <p className="font-semibold mt-0.5">
              Wali Kelas,
            </p>
            <div className="h-14" />
            <p className="font-bold underline">
              {showHomeroomTeacher === "SHOW" &&
              selectedClass?.homeroomTeacher &&
              selectedClass.homeroomTeacher !== "-"
                ? selectedClass.homeroomTeacher
                : ".................................................."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PrintAttendancePage() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-slate-500">
            Memuat halaman cetak presensi...
          </div>
        }
      >
        <PrintAttendanceContent />
      </Suspense>
    </AppShell>
  );
}
