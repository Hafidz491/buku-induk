import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.includes("[YOUR-PROJECT-REF]")) {
    console.error(
      "❌ DATABASE_URL belum dikonfigurasi dengan benar di .env / .env.local"
    );
    process.exit(1);
  }

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  console.log("🌱 Memulai proses seeding database Buku Induk Siswa...");

  // 1. Seed User Tunggal (Staf TU - Super Admin)
  const insertedUsers = await db
    .insert(schema.users)
    .values([
      {
        name: "Mahmud Sulaiman",
        username: "staftu",
        email: "staf.tu@sekolah.sch.id",
        passwordHash: "admin123",
        role: "STAFF_TU",
      },
    ])
    .onConflictDoNothing()
    .returning();

  console.log(`✅ User Staf TU seeded (${insertedUsers.length} akun)`);

  // 2. Seed Tahun Ajaran
  const insertedYears = await db
    .insert(schema.academicYears)
    .values([
      { name: "2024/2025 Genap", isActive: false },
      { name: "2025/2026 Ganjil", isActive: true },
    ])
    .onConflictDoNothing()
    .returning();

  console.log(`✅ Tahun Ajaran seeded (${insertedYears.length} periode)`);

  // 3. Seed Kelas
  const insertedClasses = await db
    .insert(schema.classes)
    .values([
      { name: "X IPA 1", gradeLevel: 10 },
      { name: "X IPS 1", gradeLevel: 10 },
      { name: "XI IPA 1", gradeLevel: 11 },
      { name: "XI IPS 1", gradeLevel: 11 },
      { name: "XII IPA 1", gradeLevel: 12 },
    ])
    .onConflictDoNothing()
    .returning();

  console.log(`✅ Kelas seeded (${insertedClasses.length} rombel)`);

  // 4. Seed Data Siswa Buku Induk
  const insertedStudents = await db
    .insert(schema.students)
    .values([
      {
        nisn: "0081234501",
        nis: "242510001",
        fullName: "Aditya Pratama Putra",
        gender: "M",
        birthPlace: "Bandung",
        birthDate: "2009-04-12",
        streetAddress: "Jl. Merdeka No. 12",
        rtRw: "002/005",
        village: "Dago",
        district: "Coblong",
        city: "Kota Bandung",
        province: "Jawa Barat",
        fatherName: "Budi Santoso",
        fatherPhone: "081234567801",
        motherName: "Rina Wulandari",
        motherPhone: "081298765401",
        entryYear: 2024,
        status: "ACTIVE",
      },
      {
        nisn: "0081234502",
        nis: "242510002",
        fullName: "Aisyah Putri Maharani",
        gender: "F",
        birthPlace: "Jakarta",
        birthDate: "2009-08-23",
        streetAddress: "Jl. Diponegoro No. 88",
        rtRw: "004/002",
        village: "Citarum",
        district: "Bandung Wetan",
        city: "Kota Bandung",
        province: "Jawa Barat",
        fatherName: "Hendra Wijaya",
        fatherPhone: "081234567802",
        motherName: "Dewi Sartika",
        motherPhone: "081298765402",
        entryYear: 2024,
        status: "ACTIVE",
      },
    ])
    .onConflictDoNothing()
    .returning();

  console.log(`✅ Siswa seeded (${insertedStudents.length} siswa)`);

  await client.end();
  console.log("🎉 Seeding selesai!");
}

main().catch((err) => {
  console.error("Gagal menjalankan seed:", err);
  process.exit(1);
});
