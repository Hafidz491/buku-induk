"use client";

import React, { useEffect, useState } from "react";
import { Save, Users, UserCog, Lock, User as UserIcon } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useSchool } from "@/lib/school-store";

export default function SettingsPage() {
  const {
    personnelStats,
    updatePersonnelStats,
    currentUser,
    updateUserProfile,
  } = useSchool();

  // State Form Statistik Guru & Tendik
  const [statsForm, setStatsForm] = useState(personnelStats);
  const [statsSaved, setStatsSaved] = useState(false);

  // State Form Ubah Profil Staf TU (Nama, Username, Password)
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [password, setPassword] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    setName(currentUser.name);
    setUsername(currentUser.username);
  }, [currentUser.name, currentUser.username]);

  useEffect(() => {
    setStatsForm(personnelStats);
  }, [personnelStats]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      username,
      password: password.trim() ? password.trim() : undefined,
    });
    setPassword("");
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleStatsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePersonnelStats({
      ...statsForm,
      totalTeachers:
        Number(statsForm.teachersPns) + Number(statsForm.teachersHonorer),
      totalTendik:
        Number(statsForm.tendikTu) +
        Number(statsForm.tendikLaboran) +
        Number(statsForm.tendikOperasional),
    });
    setStatsSaved(true);
    setTimeout(() => setStatsSaved(false), 2500);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Pengaturan Tata Usaha (TU)
          </h2>
          <p className="text-xs text-slate-500">
            Ubah profil akun Staf TU (Nama, Username, Password) dan sesuaikan rekap jumlah Guru & Tendik pada Dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* KOLOM 1: Ubah Profil Akun Tunggal Staf TU */}
          <form
            onSubmit={handleProfileSubmit}
            className="rounded-2xl bg-white p-6 shadow-xs border border-slate-100 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <UserCog className="h-5 w-5 text-emerald-500" />
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Ubah Profil Staf TU
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Akun tunggal Super Admin Tata Usaha Sekolah
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap Staf TU"
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username login"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Password Baru
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kosongkan jika tidak ingin mengubah password"
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 w-full h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition"
            >
              <Save className="h-4 w-4" />
              <span>
                {profileSaved
                  ? "Profil Berhasil Diperbarui!"
                  : "Simpan Profil Staf TU"}
              </span>
            </button>
          </form>

          {/* KOLOM 2: Form Statistik Guru & Tendik */}
          <form
            onSubmit={handleStatsSubmit}
            className="rounded-2xl bg-white p-6 shadow-xs border border-slate-100 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-sky-500" />
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Data Jumlah Guru & Tendik
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Menyesuaikan angka pada kartu Total Guru & Total Tendik di Dashboard
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Guru ASN / PNS
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={statsForm.teachersPns}
                    onChange={(e) =>
                      setStatsForm({
                        ...statsForm,
                        teachersPns: Number(e.target.value),
                      })
                    }
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Guru Honorer / GTT
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={statsForm.teachersHonorer}
                    onChange={(e) =>
                      setStatsForm({
                        ...statsForm,
                        teachersHonorer: Number(e.target.value),
                      })
                    }
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Staf TU
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={statsForm.tendikTu}
                    onChange={(e) =>
                      setStatsForm({
                        ...statsForm,
                        tendikTu: Number(e.target.value),
                      })
                    }
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Laboran/Pustaka
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={statsForm.tendikLaboran}
                    onChange={(e) =>
                      setStatsForm({
                        ...statsForm,
                        tendikLaboran: Number(e.target.value),
                      })
                    }
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Operasional
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={statsForm.tendikOperasional}
                    onChange={(e) =>
                      setStatsForm({
                        ...statsForm,
                        tendikOperasional: Number(e.target.value),
                      })
                    }
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 w-full h-10 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition"
            >
              <Save className="h-4 w-4" />
              <span>
                {statsSaved
                  ? "Statistik Berhasil Disimpan!"
                  : "Simpan Jumlah Guru & Tendik"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
