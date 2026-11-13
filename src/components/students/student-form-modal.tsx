"use client";

import React, { useEffect, useState } from "react";
import { X, Save, UserPlus, MapPin, Users } from "lucide-react";
import type { Student } from "@/db/schema";
import { useSchool, type StudentFormInput } from "@/lib/school-store";

interface StudentFormModalProps {
  open: boolean;
  onClose: () => void;
  editingStudent?: Student | null;
}

export function StudentFormModal({
  open,
  onClose,
  editingStudent,
}: StudentFormModalProps) {
  const {
    students,
    addStudent,
    updateStudent,
  } = useSchool();

  const [nisn, setNisn] = useState("");
  const [nis, setNis] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<"M" | "F">("M");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthDate, setBirthDate] = useState("2009-01-01");

  // State Alamat Terpisah (Jalan, RT&RW, Kelurahan, Kecamatan, Kabupaten/Kota, Provinsi)
  const [streetAddress, setStreetAddress] = useState("");
  const [rtRw, setRtRw] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");

  // State Orang Tua (Nama Ayah + No HP Ayah, Nama Ibu + No HP Ibu)
  const [fatherName, setFatherName] = useState("");
  const [fatherPhone, setFatherPhone] = useState("");
  const [motherName, setMotherName] = useState("");
  const [motherPhone, setMotherPhone] = useState("");

  const [entryYear, setEntryYear] = useState<number>(2025);
  const [status, setStatus] = useState<
    "ACTIVE" | "GRADUATED" | "DROPPED_OUT" | "TRANSFERRED"
  >("ACTIVE");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setErrorMsg(null);
    if (editingStudent) {
      setNisn(editingStudent.nisn);
      setNis(editingStudent.nis);
      setFullName(editingStudent.fullName);
      setGender(editingStudent.gender);
      setBirthPlace(editingStudent.birthPlace);
      setBirthDate(editingStudent.birthDate);
      setStreetAddress(editingStudent.streetAddress);
      setRtRw(editingStudent.rtRw);
      setVillage(editingStudent.village);
      setDistrict(editingStudent.district);
      setCity(editingStudent.city);
      setProvince(editingStudent.province);
      setFatherName(editingStudent.fatherName);
      setFatherPhone(editingStudent.fatherPhone);
      setMotherName(editingStudent.motherName);
      setMotherPhone(editingStudent.motherPhone);
      setEntryYear(editingStudent.entryYear);
      setStatus(editingStudent.status);
    } else {
      setNisn("");
      setNis("");
      setFullName("");
      setGender("M");
      setBirthPlace("");
      setBirthDate("2009-05-10");
      setStreetAddress("");
      setRtRw("");
      setVillage("");
      setDistrict("");
      setCity("");
      setProvince("");
      setFatherName("");
      setFatherPhone("");
      setMotherName("");
      setMotherPhone("");
      setEntryYear(2025);
      setStatus("ACTIVE");
    }
  }, [editingStudent, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const duplicateNisn = students.find(
      (s) =>
        s.nisn.trim() === nisn.trim() &&
        (!editingStudent || s.id !== editingStudent.id)
    );
    if (duplicateNisn) {
      setErrorMsg(
        `NISN ${nisn} sudah terdaftar atas nama ${duplicateNisn.fullName}.`
      );
      return;
    }

    const duplicateNis = students.find(
      (s) =>
        s.nis.trim() === nis.trim() &&
        (!editingStudent || s.id !== editingStudent.id)
    );
    if (duplicateNis) {
      setErrorMsg(
        `NIS ${nis} sudah terdaftar atas nama ${duplicateNis.fullName}.`
      );
      return;
    }

    const payload: StudentFormInput = {
      nisn,
      nis,
      fullName,
      gender,
      birthPlace,
      birthDate,
      streetAddress,
      rtRw,
      village,
      district,
      city,
      province,
      fatherName,
      fatherPhone,
      motherName,
      motherPhone,
      entryYear: Number(entryYear),
      status,
    };

    if (editingStudent) {
      updateStudent(editingStudent.id, payload);
    } else {
      addStudent(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl border border-slate-100 overflow-hidden my-8">
        {/* Header Modal */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {editingStudent
                  ? "Edit Data Buku Induk Siswa"
                  : "Tambah Siswa Baru ke Buku Induk"}
              </h3>
              <p className="text-[11px] text-slate-500">
                Lengkapi identitas siswa, alamat rinci, serta data Ayah & Ibu
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 max-h-[82vh] overflow-y-auto"
        >
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {errorMsg}
            </div>
          )}

          {/* BAGIAN 1: IDENTITAS UTAMA SISWA */}
          <div className="space-y-3.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Identitas Siswa
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NISN (Nasional) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={20}
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value)}
                  placeholder="Contoh: 0094812011"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIS (Nomor Induk Sekolah){" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={20}
                  value={nis}
                  onChange={(e) => setNis(e.target.value)}
                  placeholder="Contoh: 252610011"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-8">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Sesuai Ijazah / Akta Kelahiran"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenis Kelamin <span className="text-rose-500">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as "M" | "F")}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                >
                  <option value="M">Laki-Laki (L)</option>
                  <option value="F">Perempuan (P)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tempat Lahir <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder="Contoh: Bandung"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Lahir <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* BAGIAN 2: ALAMAT TERPISAH (Jalan, RT&RW, Kelurahan, Kecamatan, Kab/Kota, Provinsi) */}
          <div className="rounded-xl bg-slate-50/80 border border-slate-200/70 p-4 space-y-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <MapPin className="h-4 w-4 text-emerald-500" />
              <span>2. Alamat Tempat Tinggal Siswa</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat (Jalan / Gang / No. Rumah){" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Contoh: Jl. Merdeka No. 12"
                  className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  RT & RW <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={rtRw}
                  onChange={(e) => setRtRw(e.target.value)}
                  placeholder="Contoh: 002/005"
                  className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kelurahan / Desa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Contoh: Dago"
                  className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kecamatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Contoh: Coblong"
                  className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kabupaten / Kota <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Contoh: Kota Bandung"
                  className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Provinsi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="Contoh: Jawa Barat"
                  className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* BAGIAN 3: DATA ORANG TUA (AYAH & IBU BESERTA NO HP KEDUANYA) */}
          <div className="rounded-xl bg-sky-50/50 border border-sky-100 p-4 space-y-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Users className="h-4 w-4 text-sky-500" />
              <span>3. Data Orang Tua Kandung (Ayah & Ibu)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Ayah <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="Nama lengkap Ayah"
                  className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  No. HP / WhatsApp Ayah{" "}
                  <span className="text-[11px] font-normal text-slate-400">
                    (Opsional)
                  </span>
                </label>
                <input
                  type="text"
                  value={fatherPhone}
                  onChange={(e) => setFatherPhone(e.target.value)}
                  placeholder="Kosongkan jika tidak ada"
                  className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Ibu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  placeholder="Nama lengkap Ibu"
                  className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  No. HP / WhatsApp Ibu{" "}
                  <span className="text-[11px] font-normal text-slate-400">
                    (Opsional)
                  </span>
                </label>
                <input
                  type="text"
                  value={motherPhone}
                  onChange={(e) => setMotherPhone(e.target.value)}
                  placeholder="Kosongkan jika tidak ada"
                  className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* BAGIAN 4: TAHUN MASUK, STATUS, & PENEMPATAN KELAS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tahun Masuk Sekolah <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={2000}
                max={2099}
                value={entryYear}
                onChange={(e) => setEntryYear(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status Keaktifan Siswa <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as
                      | "ACTIVE"
                      | "GRADUATED"
                      | "DROPPED_OUT"
                      | "TRANSFERRED"
                  )
                }
                className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              >
                <option value="ACTIVE">AKTIF</option>
                <option value="GRADUATED">LULUS</option>
                <option value="TRANSFERRED">PINDAH / MUTASI</option>
                <option value="DROPPED_OUT">KELUAR / DO</option>
              </select>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-9 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition"
            >
              <Save className="h-3.5 w-3.5" />
              <span>
                {editingStudent ? "Simpan Perubahan" : "Simpan Data Siswa"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
