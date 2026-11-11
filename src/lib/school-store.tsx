"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type {
  User,
  AcademicYear,
  SchoolClass,
  Student,
  StudentClassHistory,
} from "@/db/schema";

export interface SchoolPersonnelStats {
  totalTeachers: number;
  teachersPns: number;
  teachersHonorer: number;
  totalTendik: number;
  tendikTu: number;
  tendikLaboran: number;
  tendikOperasional: number;
}

// Hanya ada 1 user tunggal: Staf TU (Super Admin)
const INITIAL_SINGLE_USER: User = {
  id: "u-staff-tu-01",
  name: "Mahmud Sulaiman",
  username: "staftu",
  email: "staf.tu@sman1nusantara.sch.id",
  passwordHash: "admin123",
  role: "STAFF_TU",
  createdAt: new Date("2024-01-10T08:00:00Z"),
};

const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  {
    id: "ay-2023-2024",
    name: "2023/2024",
    isActive: false,
  },
  {
    id: "ay-2024-2025",
    name: "2024/2025",
    isActive: false,
  },
  {
    id: "ay-2025-2026",
    name: "2025/2026 Ganjil",
    isActive: true,
  },
];

const INITIAL_CLASSES: SchoolClass[] = [
  { id: "cls-x-ipa-1", name: "X IPA 1", gradeLevel: 10 },
  { id: "cls-x-ipa-2", name: "X IPA 2", gradeLevel: 10 },
  { id: "cls-x-ips-1", name: "X IPS 1", gradeLevel: 10 },
  { id: "cls-xi-ipa-1", name: "XI IPA 1", gradeLevel: 11 },
  { id: "cls-xi-ips-1", name: "XI IPS 1", gradeLevel: 11 },
  { id: "cls-xii-ipa-1", name: "XII IPA 1", gradeLevel: 12 },
  { id: "cls-xii-ips-1", name: "XII IPS 1", gradeLevel: 12 },
];

const INITIAL_STUDENTS: Student[] = [
  {
    id: "std-01",
    nisn: "0094812001",
    nis: "252610001",
    fullName: "Aditya Pratama Putra",
    gender: "M",
    birthPlace: "Bandung",
    birthDate: "2009-04-12",
    address: "Jl. Merdeka No. 12, RT 02/RW 05, Kec. Coblong, Kota Bandung",
    parentName: "Budi Santoso",
    parentPhone: "081234567801",
    entryYear: 2025,
    status: "ACTIVE",
    createdAt: new Date("2025-07-10T08:00:00Z"),
    updatedAt: new Date("2025-07-10T08:00:00Z"),
  },
  {
    id: "std-02",
    nisn: "0094812002",
    nis: "252610002",
    fullName: "Aisyah Putri Maharani",
    gender: "F",
    birthPlace: "Jakarta",
    birthDate: "2009-08-23",
    address: "Jl. Diponegoro No. 88, Kec. Bandung Wetan, Kota Bandung",
    parentName: "Hendra Wijaya",
    parentPhone: "081234567802",
    entryYear: 2025,
    status: "ACTIVE",
    createdAt: new Date("2025-07-10T08:15:00Z"),
    updatedAt: new Date("2025-07-10T08:15:00Z"),
  },
  {
    id: "std-03",
    nisn: "0094812003",
    nis: "252610003",
    fullName: "Bagas Satrio Wibowo",
    gender: "M",
    birthPlace: "Surabaya",
    birthDate: "2010-01-15",
    address: "Komp. Griya Asri Blok C4 No. 7, Kec. Sukasari, Kota Bandung",
    parentName: "Eko Wibowo",
    parentPhone: "081234567803",
    entryYear: 2025,
    status: "ACTIVE",
    createdAt: new Date("2025-07-11T09:00:00Z"),
    updatedAt: new Date("2025-07-11T09:00:00Z"),
  },
  {
    id: "std-04",
    nisn: "0094812004",
    nis: "252610004",
    fullName: "Citra Kirana Dewi",
    gender: "F",
    birthPlace: "Yogyakarta",
    birthDate: "2009-11-04",
    address: "Jl. Cihampelas No. 142, Kec. Coblong, Kota Bandung",
    parentName: "Dedi Kurniawan",
    parentPhone: "081234567804",
    entryYear: 2025,
    status: "ACTIVE",
    createdAt: new Date("2025-07-11T09:30:00Z"),
    updatedAt: new Date("2025-07-11T09:30:00Z"),
  },
  {
    id: "std-05",
    nisn: "0083711005",
    nis: "242510005",
    fullName: "Dimas Anggara Saputra",
    gender: "M",
    birthPlace: "Semarang",
    birthDate: "2008-05-19",
    address: "Jl. Buah Batu No. 54, Kec. Lengkong, Kota Bandung",
    parentName: "Agus Saputra",
    parentPhone: "081234567805",
    entryYear: 2024,
    status: "ACTIVE",
    createdAt: new Date("2024-07-12T08:00:00Z"),
    updatedAt: new Date("2025-07-10T08:00:00Z"),
  },
  {
    id: "std-06",
    nisn: "0083711006",
    nis: "242510006",
    fullName: "Fadhilah Nur Azizah",
    gender: "F",
    birthPlace: "Bandung",
    birthDate: "2008-09-28",
    address: "Jl. Dago Asri II No. 19, Kec. Coblong, Kota Bandung",
    parentName: "Ridwan Hakim",
    parentPhone: "081234567806",
    entryYear: 2024,
    status: "ACTIVE",
    createdAt: new Date("2024-07-12T08:20:00Z"),
    updatedAt: new Date("2025-07-10T08:00:00Z"),
  },
  {
    id: "std-07",
    nisn: "0072610007",
    nis: "232410007",
    fullName: "Gilang Ramadhan Hakim",
    gender: "M",
    birthPlace: "Bogor",
    birthDate: "2007-10-08",
    address: "Jl. Setiabudi No. 210, Kec. Sukasari, Kota Bandung",
    parentName: "Lukman Hakim",
    parentPhone: "081234567807",
    entryYear: 2023,
    status: "ACTIVE",
    createdAt: new Date("2023-07-14T08:00:00Z"),
    updatedAt: new Date("2025-07-10T08:00:00Z"),
  },
  {
    id: "std-08",
    nisn: "0072610008",
    nis: "232410008",
    fullName: "Hana Sofia Nabila",
    gender: "F",
    birthPlace: "Garut",
    birthDate: "2007-12-02",
    address: "Jl. Pasirkaliki No. 73, Kec. Cicendo, Kota Bandung",
    parentName: "Taufik Hidayat",
    parentPhone: "081234567808",
    entryYear: 2023,
    status: "ACTIVE",
    createdAt: new Date("2023-07-14T08:30:00Z"),
    updatedAt: new Date("2025-07-10T08:00:00Z"),
  },
  {
    id: "std-09",
    nisn: "0061509009",
    nis: "222310009",
    fullName: "Irfan Maulana Hakim",
    gender: "M",
    birthPlace: "Cimahi",
    birthDate: "2006-03-21",
    address: "Jl. Gatot Subroto No. 31, Kota Bandung",
    parentName: "Surya Maulana",
    parentPhone: "081234567809",
    entryYear: 2022,
    status: "GRADUATED",
    createdAt: new Date("2022-07-15T08:00:00Z"),
    updatedAt: new Date("2025-05-20T08:00:00Z"),
  },
  {
    id: "std-10",
    nisn: "0083711010",
    nis: "242510010",
    fullName: "Keysha Aurelia Putri",
    gender: "F",
    birthPlace: "Bekasi",
    birthDate: "2008-07-14",
    address: "Jl. Soekarno Hatta No. 402, Kota Bandung",
    parentName: "Wahyu Nugroho",
    parentPhone: "081234567810",
    entryYear: 2024,
    status: "TRANSFERRED",
    createdAt: new Date("2024-07-12T09:00:00Z"),
    updatedAt: new Date("2025-01-15T08:00:00Z"),
  },
];

const INITIAL_CLASS_HISTORY: StudentClassHistory[] = [
  {
    id: "sch-01",
    studentId: "std-01",
    classId: "cls-x-ipa-1",
    academicYearId: "ay-2025-2026",
    statusInClass: "NEW",
  },
  {
    id: "sch-02",
    studentId: "std-02",
    classId: "cls-x-ipa-1",
    academicYearId: "ay-2025-2026",
    statusInClass: "NEW",
  },
  {
    id: "sch-03",
    studentId: "std-03",
    classId: "cls-x-ipa-1",
    academicYearId: "ay-2025-2026",
    statusInClass: "NEW",
  },
  {
    id: "sch-04",
    studentId: "std-04",
    classId: "cls-x-ips-1",
    academicYearId: "ay-2025-2026",
    statusInClass: "NEW",
  },
  {
    id: "sch-05-old",
    studentId: "std-05",
    classId: "cls-x-ipa-1",
    academicYearId: "ay-2024-2025",
    statusInClass: "NEW",
  },
  {
    id: "sch-05-cur",
    studentId: "std-05",
    classId: "cls-xi-ipa-1",
    academicYearId: "ay-2025-2026",
    statusInClass: "PROMOTED",
  },
  {
    id: "sch-06-old",
    studentId: "std-06",
    classId: "cls-x-ipa-1",
    academicYearId: "ay-2024-2025",
    statusInClass: "NEW",
  },
  {
    id: "sch-06-cur",
    studentId: "std-06",
    classId: "cls-xi-ipa-1",
    academicYearId: "ay-2025-2026",
    statusInClass: "PROMOTED",
  },
  {
    id: "sch-07-y1",
    studentId: "std-07",
    classId: "cls-x-ipa-1",
    academicYearId: "ay-2023-2024",
    statusInClass: "NEW",
  },
  {
    id: "sch-07-y2",
    studentId: "std-07",
    classId: "cls-xi-ipa-1",
    academicYearId: "ay-2024-2025",
    statusInClass: "PROMOTED",
  },
  {
    id: "sch-07-y3",
    studentId: "std-07",
    classId: "cls-xii-ipa-1",
    academicYearId: "ay-2025-2026",
    statusInClass: "PROMOTED",
  },
  {
    id: "sch-08-y2",
    studentId: "std-08",
    classId: "cls-xi-ipa-1",
    academicYearId: "ay-2024-2025",
    statusInClass: "PROMOTED",
  },
  {
    id: "sch-08-y3",
    studentId: "std-08",
    classId: "cls-xii-ipa-1",
    academicYearId: "ay-2025-2026",
    statusInClass: "PROMOTED",
  },
];

const INITIAL_PERSONNEL_STATS: SchoolPersonnelStats = {
  totalTeachers: 48,
  teachersPns: 34,
  teachersHonorer: 14,
  totalTendik: 16,
  tendikTu: 8,
  tendikLaboran: 5,
  tendikOperasional: 3,
};

interface UpdateProfilePayload {
  name: string;
  username: string;
  password?: string;
}

export type StudentFormInput = Omit<
  Student,
  "id" | "createdAt" | "updatedAt"
> & {
  classId?: string;
  academicYearId?: string;
  statusInClass?: "NEW" | "PROMOTED" | "RETAINED";
};

interface SchoolContextValue {
  currentUser: User;
  updateUserProfile: (payload: UpdateProfilePayload) => void;
  academicYears: AcademicYear[];
  activeAcademicYear: AcademicYear;
  classes: SchoolClass[];
  students: Student[];
  classHistory: StudentClassHistory[];
  personnelStats: SchoolPersonnelStats;
  updatePersonnelStats: (stats: SchoolPersonnelStats) => void;
  addAcademicYear: (payload: Omit<AcademicYear, "id">) => void;
  setActiveAcademicYear: (id: string) => void;
  addClass: (payload: Omit<SchoolClass, "id">) => void;
  deleteClass: (id: string) => void;
  addStudent: (payload: StudentFormInput) => Student;
  updateStudent: (id: string, payload: StudentFormInput) => void;
  deleteStudent: (id: string) => void;
  assignStudentToClass: (payload: Omit<StudentClassHistory, "id">) => void;
  removeStudentClassHistory: (historyId: string) => void;
}

const SchoolContext = createContext<SchoolContextValue | null>(null);

const STORAGE_KEY = "sim_buku_induk_state_v2";

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_SINGLE_USER);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(
    INITIAL_ACADEMIC_YEARS
  );
  const [classes, setClasses] = useState<SchoolClass[]>(INITIAL_CLASSES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [classHistory, setClassHistory] = useState<StudentClassHistory[]>(
    INITIAL_CLASS_HISTORY
  );
  const [personnelStats, setPersonnelStats] = useState<SchoolPersonnelStats>(
    INITIAL_PERSONNEL_STATS
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.currentUser) {
          setCurrentUser({
            ...INITIAL_SINGLE_USER,
            ...parsed.currentUser,
            role: "STAFF_TU",
            createdAt: new Date(
              parsed.currentUser.createdAt || INITIAL_SINGLE_USER.createdAt
            ),
          });
        }
        if (parsed.academicYears) setAcademicYears(parsed.academicYears);
        if (parsed.classes) setClasses(parsed.classes);
        if (parsed.students) {
          setStudents(
            parsed.students.map((s: Student) => ({
              ...s,
              createdAt: new Date(s.createdAt),
              updatedAt: new Date(s.updatedAt),
            }))
          );
        }
        if (parsed.classHistory) setClassHistory(parsed.classHistory);
        if (parsed.personnelStats) setPersonnelStats(parsed.personnelStats);
      }
    } catch {
      // Gunakan default state jika gagal baca localStorage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentUser,
          academicYears,
          classes,
          students,
          classHistory,
          personnelStats,
        })
      );
    } catch {
      // Abaikan jika storage penuh
    }
  }, [
    hydrated,
    currentUser,
    academicYears,
    classes,
    students,
    classHistory,
    personnelStats,
  ]);

  const updateUserProfile = ({
    name,
    username,
    password,
  }: UpdateProfilePayload) => {
    setCurrentUser((prev) => ({
      ...prev,
      name: name.trim() || prev.name,
      username: username.trim() || prev.username,
      passwordHash:
        password && password.trim().length > 0
          ? password.trim()
          : prev.passwordHash,
    }));
  };

  const activeAcademicYear =
    academicYears.find((y) => y.isActive) || academicYears[0];

  const addAcademicYear = (payload: Omit<AcademicYear, "id">) => {
    const newId = `ay-${Date.now()}`;
    setAcademicYears((prev) => {
      const updated = payload.isActive
        ? prev.map((item) => ({ ...item, isActive: false }))
        : prev;
      return [...updated, { ...payload, id: newId }];
    });
  };

  const setActiveAcademicYear = (id: string) => {
    setAcademicYears((prev) =>
      prev.map((item) => ({
        ...item,
        isActive: item.id === id,
      }))
    );
  };

  const addClass = (payload: Omit<SchoolClass, "id">) => {
    const newId = `cls-${Date.now()}`;
    setClasses((prev) => [...prev, { ...payload, id: newId }]);
  };

  const deleteClass = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  const updatePersonnelStats = (stats: SchoolPersonnelStats) => {
    setPersonnelStats(stats);
  };

  // CRUD Siswa Buku Induk
  const addStudent = (payload: StudentFormInput): Student => {
    const now = new Date();
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      nisn: payload.nisn.trim(),
      nis: payload.nis.trim(),
      fullName: payload.fullName.trim(),
      gender: payload.gender,
      birthPlace: payload.birthPlace.trim(),
      birthDate: payload.birthDate,
      address: payload.address.trim(),
      parentName: payload.parentName.trim(),
      parentPhone: payload.parentPhone.trim(),
      entryYear: Number(payload.entryYear),
      status: payload.status,
      createdAt: now,
      updatedAt: now,
    };

    setStudents((prev) => [newStudent, ...prev]);

    if (payload.classId) {
      const targetYearId = payload.academicYearId || activeAcademicYear.id;
      setClassHistory((prev) => [
        ...prev,
        {
          id: `sch-${Date.now()}`,
          studentId: newStudent.id,
          classId: payload.classId!,
          academicYearId: targetYearId,
          statusInClass: payload.statusInClass || "NEW",
        },
      ]);
    }

    return newStudent;
  };

  const updateStudent = (id: string, payload: StudentFormInput) => {
    const now = new Date();
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              nisn: payload.nisn.trim(),
              nis: payload.nis.trim(),
              fullName: payload.fullName.trim(),
              gender: payload.gender,
              birthPlace: payload.birthPlace.trim(),
              birthDate: payload.birthDate,
              address: payload.address.trim(),
              parentName: payload.parentName.trim(),
              parentPhone: payload.parentPhone.trim(),
              entryYear: Number(payload.entryYear),
              status: payload.status,
              updatedAt: now,
            }
          : s
      )
    );

    if (payload.classId) {
      const targetYearId = payload.academicYearId || activeAcademicYear.id;
      setClassHistory((prev) => {
        const existingIndex = prev.findIndex(
          (h) => h.studentId === id && h.academicYearId === targetYearId
        );
        if (existingIndex >= 0) {
          const copy = [...prev];
          copy[existingIndex] = {
            ...copy[existingIndex],
            classId: payload.classId!,
            statusInClass:
              payload.statusInClass || copy[existingIndex].statusInClass,
          };
          return copy;
        }
        return [
          ...prev,
          {
            id: `sch-${Date.now()}`,
            studentId: id,
            classId: payload.classId!,
            academicYearId: targetYearId,
            statusInClass: payload.statusInClass || "NEW",
          },
        ];
      });
    }
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setClassHistory((prev) => prev.filter((h) => h.studentId !== id));
  };

  const assignStudentToClass = (payload: Omit<StudentClassHistory, "id">) => {
    setClassHistory((prev) => {
      const existingIdx = prev.findIndex(
        (h) =>
          h.studentId === payload.studentId &&
          h.academicYearId === payload.academicYearId
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          classId: payload.classId,
          statusInClass: payload.statusInClass,
        };
        return updated;
      }
      return [
        ...prev,
        {
          ...payload,
          id: `sch-${Date.now()}`,
        },
      ];
    });
  };

  const removeStudentClassHistory = (historyId: string) => {
    setClassHistory((prev) => prev.filter((h) => h.id !== historyId));
  };

  return (
    <SchoolContext.Provider
      value={{
        currentUser,
        updateUserProfile,
        academicYears,
        activeAcademicYear,
        classes,
        students,
        classHistory,
        personnelStats,
        updatePersonnelStats,
        addAcademicYear,
        setActiveAcademicYear,
        addClass,
        deleteClass,
        addStudent,
        updateStudent,
        deleteStudent,
        assignStudentToClass,
        removeStudentClassHistory,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const ctx = useContext(SchoolContext);
  if (!ctx) {
    throw new Error("useSchool harus digunakan di dalam SchoolProvider");
  }
  return ctx;
}
