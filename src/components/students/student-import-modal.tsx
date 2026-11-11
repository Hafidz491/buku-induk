"use client";

import React, { useState } from "react";
import {
  X,
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  EXCEL_TEMPLATE_COLUMNS,
  downloadExcelTemplate,
  downloadCsvTemplate,
  parseStudentImportFile,
  type ImportedStudentRow,
} from "@/lib/excel-utils";
import { useSchool } from "@/lib/school-store";

interface StudentImportModalProps {
  open: boolean;
  onClose: () => void;
}

export function StudentImportModal({ open, onClose }: StudentImportModalProps) {
  const { bulkImportStudents } = useSchool();
  const [parsedRows, setParsedRows] = useState<ImportedStudentRow[]>([]);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{
    importedCount: number;
    skippedCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrorMsg(null);
    setImportResult(null);
    setSelectedFileName(file.name);

    try {
      const rows = await parseStudentImportFile(file);
      setParsedRows(rows);
    } catch (err) {
      setParsedRows([]);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Gagal membaca file Excel/CSV. Pastikan sesuai format template."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (parsedRows.length === 0) return;
    const res = bulkImportStudents(parsedRows);
    setImportResult(res);
    setParsedRows([]);
  };

  const handleResetAndClose = () => {
    setParsedRows([]);
    setSelectedFileName("");
    setErrorMsg(null);
    setImportResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl border border-slate-100 overflow-hidden my-8">
        {/* Header Modal */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Import Data Siswa dari File Excel / CSV
              </h3>
              <p className="text-[11px] text-slate-500">
                Unggah data siswa secara massal tanpa perlu input satu per satu
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Langkah 1: Unduh & Lihat Format Kolom Excel */}
          <div className="rounded-xl bg-emerald-50/60 border border-emerald-200/80 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-emerald-950">
                  1. Format Kolom File Excel (18 Kolom Berurutan A s/d R)
                </h4>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Unduh template resmi di bawah ini, isi di Microsoft Excel, lalu unggah kembali.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={downloadExcelTemplate}
                  className="px-3.5 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Template Excel (.xls)</span>
                </button>
                <button
                  type="button"
                  onClick={downloadCsvTemplate}
                  className="px-3 h-9 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold inline-flex items-center gap-1.5 transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Format .CSV</span>
                </button>
              </div>
            </div>

            {/* Tabel Rincian Format Kolom Excel */}
            <div className="overflow-x-auto rounded-lg border border-emerald-200 bg-white">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-emerald-100/70 text-emerald-950 border-b border-emerald-200">
                    <th className="py-2 px-2.5 font-bold">Kolom</th>
                    <th className="py-2 px-2.5 font-bold">Nama Header Excel</th>
                    <th className="py-2 px-2.5 font-bold">Contoh Pengisian</th>
                    <th className="py-2 px-2.5 font-bold">Sifat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {EXCEL_TEMPLATE_COLUMNS.map((col, index) => (
                    <tr key={col.key} className="hover:bg-slate-50">
                      <td className="py-1.5 px-2.5 font-mono font-bold text-slate-500">
                        Kolom {String.fromCharCode(65 + index)}
                      </td>
                      <td className="py-1.5 px-2.5 font-bold text-slate-800">
                        {col.header}
                      </td>
                      <td className="py-1.5 px-2.5 text-slate-600 font-mono">
                        {col.example}
                      </td>
                      <td className="py-1.5 px-2.5">
                        {col.required ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold text-[10px]">
                            Wajib
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium text-[10px]">
                            Opsional (Boleh Dikosongkan)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Langkah 2: Area Upload File */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700">
              2. Pilih File Excel (`.xlsx`, `.xls`) atau `.csv` yang Sudah Diisi
            </h4>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 bg-slate-50/70 hover:bg-emerald-50/20 cursor-pointer transition">
              <Upload className="h-7 w-7 text-emerald-500 mb-2" />
              <span className="text-xs font-bold text-slate-700">
                {selectedFileName
                  ? `File Terpilih: ${selectedFileName}`
                  : "Klik untuk memilih file Excel (.xlsx / .xls) atau .csv"}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                Mendukung Microsoft Excel (.xlsx, .xls) maupun CSV (.csv)
              </span>
              <input
                type="file"
                accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {loading && (
            <p className="text-xs text-slate-500 font-medium text-center">
              Sedang membaca baris data dari file...
            </p>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs font-semibold text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {importResult && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-emerald-900">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">
                    Import Selesai! {importResult.importedCount} data siswa baru
                    berhasil ditambahkan ke Buku Induk.
                  </p>
                  {importResult.skippedCount > 0 && (
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      ({importResult.skippedCount} baris dilewati karena NISN/NIS
                      sudah terdaftar atau kosong).
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 h-8 rounded-lg bg-emerald-600 text-white text-xs font-bold"
              >
                Selesai
              </button>
            </div>
          )}

          {/* Pratinjau Baris Siswa Sebelum Diimport */}
          {parsedRows.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800">
                  Pratinjau Data yang Akan Diimport ({parsedRows.length} Baris)
                </h4>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-52">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <th className="py-2 px-2.5">No</th>
                      <th className="py-2 px-2.5">NISN / NIS</th>
                      <th className="py-2 px-2.5">Nama Lengkap</th>
                      <th className="py-2 px-2.5">L/P</th>
                      <th className="py-2 px-2.5">TTL</th>
                      <th className="py-2 px-2.5">Alamat Lengkap</th>
                      <th className="py-2 px-2.5">Ayah & Ibu</th>
                      <th className="py-2 px-2.5">Kelas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-1.5 px-2.5 font-semibold text-slate-500">
                          {i + 1}
                        </td>
                        <td className="py-1.5 px-2.5 font-mono">
                          <span className="font-bold text-slate-800">
                            {r.nisn}
                          </span>{" "}
                          / {r.nis}
                        </td>
                        <td className="py-1.5 px-2.5 font-bold text-slate-800">
                          {r.fullName}
                        </td>
                        <td className="py-1.5 px-2.5">
                          {r.gender === "M" ? "L" : "P"}
                        </td>
                        <td className="py-1.5 px-2.5 text-slate-600">
                          {r.birthPlace}, {r.birthDate}
                        </td>
                        <td className="py-1.5 px-2.5 text-slate-600">
                          {r.streetAddress}, RT/RW {r.rtRw}, {r.village},{" "}
                          {r.district}, {r.city}, {r.province}
                        </td>
                        <td className="py-1.5 px-2.5 text-slate-600">
                          Ayah: {r.fatherName} ({r.fatherPhone})<br />
                          Ibu: {r.motherName} ({r.motherPhone})
                        </td>
                        <td className="py-1.5 px-2.5 font-semibold text-emerald-700">
                          {r.className || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleResetAndClose}
            className="px-4 h-9 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Tutup
          </button>
          {parsedRows.length > 0 && (
            <button
              type="button"
              onClick={handleConfirmImport}
              className="px-5 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Import {parsedRows.length} Siswa Sekarang</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

