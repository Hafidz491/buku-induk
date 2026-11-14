"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
  ChevronDown,
  UserCheck,
  GraduationCap,
  UserX,
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

function BukuIndukSubMenu({
  onNavigate,
}: {
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { students } = useSchool();

  const currentCategory = searchParams.get("category") || "active";
  const isOnStudentsList = pathname === "/students";

  const activeCount = students.filter((s) => s.status === "ACTIVE").length;
  const graduatedCount = students.filter((s) => s.status === "GRADUATED").length;
  const leftCount = students.filter(
    (s) => s.status === "TRANSFERRED" || s.status === "DROPPED_OUT"
  ).length;

  const subItems = [
    {
      label: "Siswa Aktif",
      href: "/students?category=active",
      category: "active",
      icon: UserCheck,
      count: activeCount,
      isDanger: false,
    },
    {
      label: "Siswa Lulus",
      href: "/students?category=graduated",
      category: "graduated",
      icon: GraduationCap,
      count: graduatedCount,
      isDanger: false,
    },
    {
      label: "Siswa Keluar",
      href: "/students?category=left",
      category: "left",
      icon: UserX,
      count: leftCount,
      isDanger: true,
    },
  ];

  return (
    <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-100 space-y-1">
      {subItems.map((sub) => {
        const SubIcon = sub.icon;
        const isSubActive =
          isOnStudentsList && currentCategory === sub.category;

        return (
          <Link
            key={sub.category}
            href={sub.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all",
              isSubActive
                ? sub.isDanger
                  ? "bg-rose-50 text-rose-600 font-bold"
                  : "bg-emerald-50/80 text-emerald-600 font-bold"
                : sub.isDanger
                ? "text-rose-500 hover:bg-rose-50/60 hover:text-rose-600"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            )}
          >
            <div className="flex items-center gap-2.5">
              <SubIcon
                className={cn(
                  "h-4 w-4",
                  isSubActive
                    ? sub.isDanger
                      ? "text-rose-600"
                      : "text-emerald-500"
                    : sub.isDanger
                    ? "text-rose-400"
                    : "text-slate-400"
                )}
              />
              <span>{sub.label}</span>
            </div>

            <span
              className={cn(
                "inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] font-bold",
                isSubActive
                  ? sub.isDanger
                    ? "bg-rose-500 text-white"
                    : "bg-emerald-500 text-white"
                  : sub.isDanger
                  ? "bg-rose-100 text-rose-600"
                  : "bg-slate-100 text-slate-600"
              )}
            >
              {sub.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { currentUser, activeAcademicYear } = useSchool();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [greeting, setGreeting] = useState<string>("Selamat Pagi");

  const isBukuIndukSection = pathname.startsWith("/students");
  const [bukuIndukOpen, setBukuIndukOpen] = useState<boolean>(
    isBukuIndukSection
  );

  useEffect(() => {
    if (isBukuIndukSection) {
      setBukuIndukOpen(true);
    }
  }, [isBukuIndukSection]);

  useEffect(() => {
    setGreeting(getWibGreeting());
    const timer = setInterval(() => {
      setGreeting(getWibGreeting());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

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
            {/* 1. Dashboard */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "relative group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                pathname === "/"
                  ? "text-emerald-600 bg-emerald-50/70 font-semibold"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              )}
            >
              {pathname === "/" && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-emerald-500 rounded-r-full" />
              )}
              <div className="flex items-center gap-3.5">
                <Home
                  className={cn(
                    "h-5 w-5 transition-colors",
                    pathname === "/"
                      ? "text-emerald-500"
                      : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                <span>Dashboard</span>
              </div>
            </Link>

            {/* 2. Buku Induk (Dropdown: Siswa Aktif, Siswa Lulus, Siswa Keluar) */}
            <div>
              <button
                type="button"
                onClick={() => setBukuIndukOpen((prev) => !prev)}
                className={cn(
                  "w-full relative group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isBukuIndukSection
                    ? "text-emerald-600 bg-emerald-50/70 font-semibold"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                )}
              >
                {isBukuIndukSection && (
                  <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-emerald-500 rounded-r-full" />
                )}
                <div className="flex items-center gap-3.5">
                  <Users
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isBukuIndukSection
                        ? "text-emerald-500"
                        : "text-slate-400 group-hover:text-slate-600"
                    )}
                  />
                  <span>Buku Induk</span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    bukuIndukOpen ? "rotate-180" : "rotate-0",
                    isBukuIndukSection ? "text-emerald-600" : "text-slate-400"
                  )}
                />
              </button>

              {bukuIndukOpen && (
                <Suspense fallback={null}>
                  <BukuIndukSubMenu
                    onNavigate={() => setMobileMenuOpen(false)}
                  />
                </Suspense>
              )}
            </div>

            {/* 3. Kelas & Rombel */}
            <Link
              href="/classes"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "relative group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                pathname.startsWith("/classes")
                  ? "text-emerald-600 bg-emerald-50/70 font-semibold"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              )}
            >
              {pathname.startsWith("/classes") && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-emerald-500 rounded-r-full" />
              )}
              <div className="flex items-center gap-3.5">
                <BookOpen
                  className={cn(
                    "h-5 w-5 transition-colors",
                    pathname.startsWith("/classes")
                      ? "text-emerald-500"
                      : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                <span>Kelas & Rombel</span>
              </div>
            </Link>

            {/* 4. Cetak Absensi */}
            <Link
              href="/print-attendance"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "relative group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                pathname.startsWith("/print-attendance")
                  ? "text-emerald-600 bg-emerald-50/70 font-semibold"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              )}
            >
              {pathname.startsWith("/print-attendance") && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-emerald-500 rounded-r-full" />
              )}
              <div className="flex items-center gap-3.5">
                <Printer
                  className={cn(
                    "h-5 w-5 transition-colors",
                    pathname.startsWith("/print-attendance")
                      ? "text-emerald-500"
                      : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                <span>Cetak Absensi</span>
              </div>
            </Link>

            {/* 5. Pengaturan TU */}
            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "relative group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                pathname.startsWith("/settings")
                  ? "text-emerald-600 bg-emerald-50/70 font-semibold"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              )}
            >
              {pathname.startsWith("/settings") && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-emerald-500 rounded-r-full" />
              )}
              <div className="flex items-center gap-3.5">
                <Settings
                  className={cn(
                    "h-5 w-5 transition-colors",
                    pathname.startsWith("/settings")
                      ? "text-emerald-500"
                      : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                <span>Pengaturan TU</span>
              </div>
            </Link>
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
