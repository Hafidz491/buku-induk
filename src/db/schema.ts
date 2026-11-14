import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  date,
  timestamp,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==========================================
// ENUMS
// ==========================================

export const userRoleEnum = pgEnum("user_role", ["STAFF_TU"]);

export const genderEnum = pgEnum("gender", ["M", "F"]);

export const studentStatusEnum = pgEnum("student_status", [
  "ACTIVE",
  "GRADUATED",
  "DROPPED_OUT",
  "TRANSFERRED",
]);

export const statusInClassEnum = pgEnum("status_in_class", [
  "PROMOTED",
  "RETAINED",
  "NEW",
]);

// ==========================================
// 1. TABEL USERS (Akun Tunggal Staf TU - Super Admin)
// ==========================================
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").default("STAFF_TU").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ==========================================
// 2. TABEL ACADEMIC_YEARS (Tahun Ajaran)
// ==========================================
export const academicYears = pgTable("academic_years", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  isActive: boolean("is_active").default(false).notNull(),
});

// ==========================================
// 3. TABEL CLASSES (Kelas / Rombel)
// ==========================================
export const classes = pgTable("classes", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  gradeLevel: integer("grade_level").notNull(),
  curriculum: varchar("curriculum", { length: 100 })
    .default("Kurikulum SMA Merdeka")
    .notNull(),
  homeroomTeacher: varchar("homeroom_teacher", { length: 150 })
    .default("")
    .notNull(),
});

// ==========================================
// 4. TABEL STUDENTS (Buku Induk Siswa - Data Utama)
// ==========================================
export const students = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(),
  nisn: varchar("nisn", { length: 20 }).notNull().unique(),
  nis: varchar("nis", { length: 20 }).notNull().unique(),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  gender: genderEnum("gender").notNull(),
  studentPhone: varchar("student_phone", { length: 30 }).default("").notNull(),
  birthPlace: varchar("birth_place", { length: 100 }).notNull(),
  birthDate: date("birth_date", { mode: "string" }).notNull(),
  // Alamat Terstruktur (Jalan, RT/RW, Kelurahan, Kecamatan, Kab/Kota, Provinsi)
  streetAddress: text("street_address").notNull(),
  rtRw: varchar("rt_rw", { length: 30 }).notNull(),
  village: varchar("village", { length: 100 }).notNull(),
  district: varchar("district", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  province: varchar("province", { length: 100 }).notNull(),
  // Data Orang Tua (Ayah & Ibu beserta No. HP masing-masing yang bersifat opsional)
  fatherName: varchar("father_name", { length: 200 }).notNull(),
  fatherPhone: varchar("father_phone", { length: 30 }).default("").notNull(),
  motherName: varchar("mother_name", { length: 200 }).notNull(),
  motherPhone: varchar("mother_phone", { length: 30 }).default("").notNull(),
  entryYear: integer("entry_year").notNull(),
  status: studentStatusEnum("status").default("ACTIVE").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ==========================================
// 5. TABEL STUDENT_CLASS_HISTORY (Riwayat Kelas / Kenaikan Kelas)
// ==========================================
export const studentClassHistory = pgTable(
  "student_class_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "restrict" }),
    academicYearId: uuid("academic_year_id")
      .notNull()
      .references(() => academicYears.id, { onDelete: "restrict" }),
    statusInClass: statusInClassEnum("status_in_class")
      .default("NEW")
      .notNull(),
  },
  (table) => ({
    studentAcademicYearUnique: uniqueIndex("student_academic_year_unique").on(
      table.studentId,
      table.academicYearId
    ),
  })
);

// ==========================================
// RELATIONS
// ==========================================

export const studentsRelations = relations(students, ({ many }) => ({
  classHistories: many(studentClassHistory),
}));

export const classesRelations = relations(classes, ({ many }) => ({
  studentHistories: many(studentClassHistory),
}));

export const academicYearsRelations = relations(academicYears, ({ many }) => ({
  studentHistories: many(studentClassHistory),
}));

export const studentClassHistoryRelations = relations(
  studentClassHistory,
  ({ one }) => ({
    student: one(students, {
      fields: [studentClassHistory.studentId],
      references: [students.id],
    }),
    classRoom: one(classes, {
      fields: [studentClassHistory.classId],
      references: [classes.id],
    }),
    academicYear: one(academicYears, {
      fields: [studentClassHistory.academicYearId],
      references: [academicYears.id],
    }),
  })
);

// ==========================================
// TYPESCRIPT INFERRED TYPES
// ==========================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type AcademicYear = typeof academicYears.$inferSelect;
export type NewAcademicYear = typeof academicYears.$inferInsert;

export type SchoolClass = typeof classes.$inferSelect;
export type NewSchoolClass = typeof classes.$inferInsert;

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;

export type StudentClassHistory = typeof studentClassHistory.$inferSelect;
export type NewStudentClassHistory = typeof studentClassHistory.$inferInsert;
