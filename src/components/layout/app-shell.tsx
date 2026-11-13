"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  BookOpen,
  Printer,
  Settings,
  LogOut,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSchool } from "@/lib/school-store";

interface AppShellProps {
  children: React.ReactNode;
}

function getWibGreeting(): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const parts = formatter.formatToParts(new Date());
    const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
    const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
    const totalMinutes = hour * 60 + minute;

    // 00.01 - 10.30 WIB -> Selamat Pagi
    if (totalMinutes >= 1 && totalMinutes <= 10 * 60 + 30) {
      return "Selamat Pagi";
    }
    // 10.31 - 15.00 WIB -> Selamat Siang
    if (totalMinutes >= 10 * 60 + 31 && totalMinutes <= 15 * 60) {
      return "Selamat Siang";
    }
    // 15.01 - 18.00 WIB -> Selamat Sore
    if (totalMinutes >= 15 * 60 + 1 && totalMinutes <= 18 * 60) {
      return "Selamat Sore";
    }
    // 18.01 - 23.59 WIB -> Selamat Malam
    return "Selamat Malam";
  } catch {
    return "Selamat Pagi";
  }
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { currentUser, students, activeAcademicYear } = useSchool();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [greeting, setGreeting] = useState<string>("Selamat Pagi");

  useEffect(() => {
    setGreeting(getWibGreeting());
    const timer = setInterval(() => {
      setGreeting(getWibGreeting());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const activeStudentsCount = students.filter(
    (s) => s.status === "ACTIVE"
  ).length;

  const navItems = [
    {
      label: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      label: "Buku Induk",
      href: "/students",
      icon: Users,
      badge: activeStudentsCount,
    },
    {
      label: "Kelas & Rombel",
      href: "/classes",
      icon: BookOpen,
    },
    {
      label: "Cetak Absensi",
      href: "/print-attendance",
      icon: Printer,
    },
    {
      label: "Pengaturan TU",
      href: "/settings",
      icon: Settings,
    },
  ];

  const firstName = currentUser.name
    .replace(/^(Drs\.|H\.|Ir\.|S\.Pd\.)\s*/gi, "")
    .split(" ")[0];

  return (
    <div className="min-h-screen bg-[#F5F7FA] print:bg-white text-slate-800">
      {/* OVERLAY MOBILE */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden no-print"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR KIRI FIXED (Tidak bergerak saat dashboard di-scroll) */}
      <aside
        className={cn(
          "no-print fixed inset-y-0 left-0 z-50 w-64 h-screen bg-white border-r border-slate-100 flex flex-col justify-between overflow-y-auto transition-transform duration-200 lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          {/* Brand Logo */}
          <div className="h-20 px-7 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1 select-none">
              <span className="text-2xl font-extrabold tracking-tight text-slate-800">
                buku
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-emerald-500">
                induk
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Menu Utama */}
          <nav className="mt-2 space-y-1.5 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "relative group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "text-emerald-600 bg-emerald-50/70 font-semibold"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  )}
                >
                  {/* Indikator Garis Hijau di Kiri */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-emerald-500 rounded-r-full" />
                  )}

                  <div className="flex items-center gap-3.5">
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive
                          ? "text-emerald-500"
                          : "text-slate-400 group-hover:text-slate-600"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  {typeof item.badge === "number" && (
                    <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bagian Bawah Sidebar: Hanya Tombol Logout */}
        <div className="p-4 border-t border-slate-100">
          <Link
            href="/login"
            className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50/60 transition-colors"
          >
            <LogOut className="h-5 w-5 text-slate-400" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* KONTEN UTAMA KANAN */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* TOP HEADER: Hanya Ditampilkan di Halaman Dashboard ("/") */}
        {pathname === "/" ? (
          <header className="no-print h-20 px-6 lg:px-8 flex items-center justify-between gap-4 bg-[#F5F7FA]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-600"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
                    {greeting}, {firstName}! <span className="text-xl">👋</span>
                  </h1>
                  <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-700 border border-emerald-200">
                    TA {activeAcademicYear?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Kanan: Logo User Biasa (Statis, Tidak Bisa Diklik) */}
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 shadow-2xs select-none">
                <UserIcon className="h-5 w-5" />
              </div>
            </div>
          </header>
        ) : (
          /* Tombol Menu Mobile Saja pada Halaman Selain Dashboard */
          <div className="no-print lg:hidden px-6 pt-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* ISI HALAMAN */}
        <main
          className={cn(
            "flex-1 px-6 lg:px-8 pb-10",
            pathname === "/" ? "" : "pt-6 lg:pt-8"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
