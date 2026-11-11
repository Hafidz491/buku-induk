"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User as UserIcon, ArrowRight } from "lucide-react";
import { useSchool } from "@/lib/school-store";

export default function LoginPage() {
  const router = useRouter();
  const { currentUser } = useSchool();
  const [username, setUsername] = useState(currentUser.username);
  const [password, setPassword] = useState(currentUser.passwordHash);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (
      username.trim() === currentUser.username &&
      password === currentUser.passwordHash
    ) {
      router.push("/");
      return;
    }

    setErrorMsg("Username atau password Staf TU tidak sesuai.");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-slate-100">
        {/* Brand */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1 select-none">
            <span className="text-3xl font-extrabold tracking-tight text-slate-800">
              buku
            </span>
            <span className="text-3xl font-extrabold tracking-tight text-emerald-500">
              induk
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Login Akun Staf Tata Usaha (TU) Sekolah
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Username Staf TU
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username Staf TU"
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
          >
            <span>Masuk ke Dashboard Staf TU</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
