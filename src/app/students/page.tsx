"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  Search,
  UserPlus,
  FileSpreadsheet,
  Eye,
  Pencil,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Filter,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useSchool } from "@/lib/school-store";
import type { Student } from "@/db/schema";
import { formatTanggalIndo } from "@/lib/utils";
import { StudentFormModal } from "@/components/students/student-form-modal";
import { StudentImportModal } from "@/components/students/student-import-modal";

interface EnrichedStudent extends Student {
  currentClassName: string;
  currentClassId: string;
}

export default function StudentsBukuIndukPage() {
  const {
    students,
    classes,
    academicYears,
    activeAcademicYear,
    classHistory,
    deleteStudent,
  } = useSchool();

  // State Pencarian Instan & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYearId, setSelectedYearId] = useState<string>(
    activeAcademicYear?.id || "ALL"
  );
  const [selectedClassId, setSelectedClassId] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // State Modal Tambah / Edit, Import Excel, & Konfirmasi Hapus
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  // State Sorting TanStack Table
  const [sorting, setSorting] = useState<SortingState>([]);

  // Gabungkan data siswa dengan kelas pada Tahun Ajaran terpilih
  const enrichedStudents = useMemo<EnrichedStudent[]>(() => {
    const targetYearId =
      selectedYearId === "ALL" ? activeAcademicYear?.id : selectedYearId;

    return students.map((std) => {
      const historyRecord = classHistory.find(
        (h) =>
          h.studentId === std.id &&
          (targetYearId ? h.academicYearId === targetYearId : true)
      );
      const cls = historyRecord
        ? classes.find((c) => c.id === historyRecord.classId)
        : undefined;

      return {
        ...std,
        currentClassName: cls ? cls.name : "",
        currentClassId: cls ? cls.id : "",
      };
    });
  }, [students, classHistory, classes, selectedYearId, activeAcademicYear]);

  // Filter instan berdasarkan Search, Kelas, Tahun Ajaran, dan Status
  const filteredData = useMemo(() => {
    return enrichedStudents.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSearch =
          item.fullName.toLowerCase().includes(q) ||
          item.nisn.toLowerCase().includes(q) ||
          item.nis.toLowerCase().includes(q) ||
          item.fatherName.toLowerCase().includes(q) ||
          item.motherName.toLowerCase().includes(q) ||
          item.streetAddress.toLowerCase().includes(q) ||
          item.village.toLowerCase().includes(q) ||
          item.district.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          item.birthPlace.toLowerCase().includes(q);
        if (!matchSearch) return false;
      }

      if (selectedYearId !== "ALL" && selectedClassId !== "ALL") {
        const inYearAndClass = classHistory.some(
          (h) =>
            h.studentId === item.id &&
            h.academicYearId === selectedYearId &&
            h.classId === selectedClassId
        );
        if (!inYearAndClass) return false;
      } else if (selectedClassId !== "ALL") {
        if (item.currentClassId !== selectedClassId) return false;
      }

      if (selectedStatus !== "ALL" && item.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [
    enrichedStudents,
    searchQuery,
    selectedYearId,
    selectedClassId,
    selectedStatus,
    classHistory,
  ]);

  const statusBadge = (status: Student["status"]) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="success">Aktif</Badge>;
      case "GRADUATED":
        return <Badge variant="info">Lulus</Badge>;
      case "TRANSFERRED":
        return <Badge variant="warning">Pindah</Badge>;
      case "DROPPED_OUT":
        return <Badge variant="destructive">Keluar / DO</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Definisi Kolom Shadcn UI Data Table (@tanstack/react-table)
  const columns = useMemo<ColumnDef<EnrichedStudent>[]>(
    () => [
      {
        id: "no",
        header: "No",
        cell: ({ row }) => (
          <span className="text-xs font-semibold text-slate-500">
            {row.index + 1}
          </span>
        ),
      },
      {
        accessorKey: "nisn",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1 hover:text-slate-900"
          >
            <span>NISN / NIS</span>
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        ),
        cell: ({ row }) => (
          <div>
            <p className="text-xs font-bold text-slate-800 font-mono">
              {row.original.nisn}
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              NIS: {row.original.nis}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "fullName",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1 hover:text-slate-900"
          >
            <span>Nama & Alamat Siswa</span>
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        ),
        cell: ({ row }) => {
          const s = row.original;
          return (
            <div>
              <Link
                href={`/students/${s.id}`}
                className="text-xs font-bold text-slate-800 hover:text-emerald-600 transition"
              >
                {s.fullName}
              </Link>
              <p className="text-[11px] text-slate-500 truncate max-w-[240px]">
                {s.streetAddress}, RT/RW {s.rtRw}, Kel. {s.village}
              </p>
              <p className="text-[10px] text-slate-400 truncate max-w-[240px]">
                Kec. {s.district}, {s.city}, {s.province}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: "gender",
        header: "L/P",
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
              row.original.gender === "M"
                ? "bg-sky-100 text-sky-700"
                : "bg-pink-100 text-pink-700"
            }`}
          >
            {row.original.gender === "M" ? "L" : "P"}
          </span>
        ),
      },
      {
        accessorKey: "birthDate",
        header: "Tempat, Tgl Lahir",
        cell: ({ row }) => (
          <div>
            <p className="text-xs font-medium text-slate-700">
              {row.original.birthPlace}
            </p>
            <p className="text-[11px] text-slate-400">
              {formatTanggalIndo(row.original.birthDate)}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "motherName",
        header: "Nama Ibu",
        cell: ({ row }) => (
          <p className="text-xs font-semibold text-slate-700">
            {row.original.motherName}
          </p>
        ),
      },
      {
        accessorKey: "currentClassName",
        header: "Kelas / Rombel",
        cell: ({ row }) => (
          <div>
            {row.original.currentClassId ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-800">
                {row.original.currentClassName}
              </span>
            ) : (
              <span className="text-xs text-slate-400">-</span>
            )}
            <p className="text-[10px] text-slate-400 mt-0.5">
              Angkatan {row.original.entryYear}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => statusBadge(row.original.status),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Aksi</div>,
        cell: ({ row }) => {
          const std = row.original;
          return (
            <div className="flex items-center justify-end gap-1.5">
              <Link
                href={`/students/${std.id}`}
                title="Lihat Detail & Riwayat Kelas"
                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
              >
                <Eye className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setEditingStudent(std);
                  setModalOpen(true);
                }}
                title="Edit Data Siswa"
                className="p-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeletingStudent(std)}
                title="Hapus Data Siswa"
                className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedYearId(activeAcademicYear?.id || "ALL");
    setSelectedClassId("ALL");
    setSelectedStatus("ALL");
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Halaman & Tombol Import Excel + Tambah Siswa */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Buku Induk Siswa
            </h2>
            <p className="text-xs text-slate-500">
              Kelola data identitas permanen siswa (`students`), import massal dari Excel, pencarian instan, dan filter kelas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setImportModalOpen(true)}
              className="h-10 px-4 rounded-xl bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-bold text-xs inline-flex items-center gap-2 shadow-2xs transition"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              <span>Import Excel / CSV</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingStudent(null);
                setModalOpen(true);
              }}
              className="h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm transition"
            >
              <UserPlus className="h-4 w-4" />
              <span>Tambah Siswa Baru</span>
            </button>
          </div>
        </div>

        {/* Bar Pencarian Instan & Filter Kelas / Tahun Ajaran / Status */}
        <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Filter className="h-4 w-4 text-emerald-500" />
            <span>Pencarian Instan & Filter Buku Induk</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Input Search Instan */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari NISN, NIS, Nama Siswa, Ayah/Ibu, atau Alamat..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>

            {/* Filter Tahun Ajaran */}
            <div className="md:col-span-2">
              <select
                value={selectedYearId}
                onChange={(e) => setSelectedYearId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="ALL">Semua Tahun Ajaran</option>
                {academicYears.map((ay) => (
                  <option key={ay.id} value={ay.id}>
                    TA {ay.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Kelas / Rombel */}
            <div className="md:col-span-2">
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="ALL">Semua Kelas</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    Kelas {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Status Keaktifan */}
            <div className="md:col-span-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="ALL">Semua Status</option>
                <option value="ACTIVE">Aktif</option>
                <option value="GRADUATED">Lulus</option>
                <option value="TRANSFERRED">Pindah / Mutasi</option>
                <option value="DROPPED_OUT">Keluar / DO</option>
              </select>
            </div>

            {/* Tombol Reset */}
            <div className="md:col-span-1">
              <button
                type="button"
                onClick={resetFilters}
                title="Reset Filter"
                className="w-full h-10 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Shadcn UI Data Table */}
        <div className="rounded-2xl bg-white shadow-xs border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-28 text-center text-xs text-slate-400"
                  >
                    Tidak ada data siswa yang cocok dengan pencarian / filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Footer Pagination Data Table */}
          <div className="px-5 py-3.5 bg-slate-50/60 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Menampilkan{" "}
              <strong className="text-slate-700">
                {table.getRowModel().rows.length}
              </strong>{" "}
              dari{" "}
              <strong className="text-slate-700">{filteredData.length}</strong>{" "}
              siswa (Total Buku Induk: {students.length} siswa)
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 inline-flex items-center gap-1 font-semibold text-slate-700"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Sebelumnya
              </button>
              <span className="px-2 font-semibold text-slate-700">
                Hal {table.getState().pagination.pageIndex + 1} /{" "}
                {Math.max(1, table.getPageCount())}
              </span>
              <button
                type="button"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 inline-flex items-center gap-1 font-semibold text-slate-700"
              >
                Berikutnya
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah / Edit Siswa */}
      <StudentFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingStudent(null);
        }}
        editingStudent={editingStudent}
      />

      {/* Modal Import Data Siswa dari Excel / CSV */}
      <StudentImportModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
      />

      {/* Dialog Konfirmasi Hapus Siswa */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-800">
              Hapus Siswa dari Buku Induk?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus data{" "}
              <strong className="text-slate-900">
                {deletingStudent.fullName}
              </strong>{" "}
              (NISN: {deletingStudent.nisn}) beserta seluruh riwayat kelasnya?
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                className="px-4 h-9 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteStudent(deletingStudent.id);
                  setDeletingStudent(null);
                }}
                className="px-4 h-9 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
