import type { StudentFormInput } from "./school-store";

export interface ImportedStudentRow extends StudentFormInput {
  className?: string;
}

export const EXCEL_TEMPLATE_COLUMNS = [
  { key: "nisn", header: "NISN", example: "0094812015", required: true },
  { key: "nis", header: "NIS", example: "252610015", required: true },
  {
    key: "fullName",
    header: "Nama Lengkap",
    example: "Rizky Pratama Nugraha",
    required: true,
  },
  {
    key: "gender",
    header: "Jenis Kelamin (L/P)",
    example: "L",
    required: true,
  },
  {
    key: "birthPlace",
    header: "Tempat Lahir",
    example: "Bandung",
    required: true,
  },
  {
    key: "birthDate",
    header: "Tanggal Lahir (YYYY-MM-DD)",
    example: "2009-06-18",
    required: true,
  },
  {
    key: "streetAddress",
    header: "Alamat (Jalan)",
    example: "Jl. Sukajadi No. 45",
    required: true,
  },
  { key: "rtRw", header: "RT/RW", example: "003/007", required: true },
  {
    key: "village",
    header: "Kelurahan",
    example: "Pasteur",
    required: true,
  },
  {
    key: "district",
    header: "Kecamatan",
    example: "Sukajadi",
    required: true,
  },
  {
    key: "city",
    header: "Kabupaten/Kota",
    example: "Kota Bandung",
    required: true,
  },
  {
    key: "province",
    header: "Provinsi",
    example: "Jawa Barat",
    required: true,
  },
  {
    key: "fatherName",
    header: "Nama Ayah",
    example: "Hendra Nugraha",
    required: true,
  },
  {
    key: "fatherPhone",
    header: "No HP Ayah",
    example: "081234560015",
    required: false,
  },
  {
    key: "motherName",
    header: "Nama Ibu",
    example: "Siti Aminah",
    required: true,
  },
  {
    key: "motherPhone",
    header: "No HP Ibu",
    example: "081298760015",
    required: false,
  },
  {
    key: "entryYear",
    header: "Tahun Masuk",
    example: "2025",
    required: true,
  },
  {
    key: "className",
    header: "Kelas",
    example: "X IPA 1",
    required: false,
  },
];

const SAMPLE_ROWS = [
  [
    "0094812015",
    "252610015",
    "Rizky Pratama Nugraha",
    "L",
    "Bandung",
    "2009-06-18",
    "Jl. Sukajadi No. 45",
    "003/007",
    "Pasteur",
    "Sukajadi",
    "Kota Bandung",
    "Jawa Barat",
    "Hendra Nugraha",
    "081234560015",
    "Siti Aminah",
    "081298760015",
    "2025",
    "X IPA 1",
  ],
  [
    "0094812016",
    "252610016",
    "Nadia Safitri Ramadhani",
    "P",
    "Cimahi",
    "2009-09-05",
    "Jl. Antapani Lama No. 19",
    "001/004",
    "Antapani Kidul",
    "Antapani",
    "Kota Bandung",
    "Jawa Barat",
    "Dadan Ramadhani",
    "081234560016",
    "Lina Marlina",
    "081298760016",
    "2025",
    "X IPS 1",
  ],
];

/**
 * Download Template Excel (.xls SpreadsheetML yang langsung terbuka rapi di Microsoft Excel)
 */
export function downloadExcelTemplate() {
  const headers = EXCEL_TEMPLATE_COLUMNS.map((c) => c.header);

  const xmlRows = [
    `<Row ss:StyleID="Header">${headers
      .map((h) => `<Cell><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`)
      .join("")}</Row>`,
    ...SAMPLE_ROWS.map(
      (row) =>
        `<Row>${row
          .map(
            (cell) =>
              `<Cell><Data ss:Type="String">${escapeXml(cell)}</Data></Cell>`
          )
          .join("")}</Row>`
    ),
  ].join("\n");

  const workbookXml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Font ss:FontName="Calibri" ss:Size="11"/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#059669" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Template Buku Induk">
  <Table>
   ${xmlRows}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([workbookXml], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Template_Import_Buku_Induk_Siswa.xls";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download Template CSV (.csv)
 */
export function downloadCsvTemplate() {
  const headers = EXCEL_TEMPLATE_COLUMNS.map((c) => c.header).join(",");
  const rows = SAMPLE_ROWS.map((r) =>
    r.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")
  ).join("\n");

  const csvContent = "\uFEFF" + headers + "\n" + rows;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Template_Import_Buku_Induk_Siswa.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Parse file Excel (.xlsx, .xls) atau CSV (.csv) menjadi array ImportedStudentRow
 */
export async function parseStudentImportFile(
  file: File
): Promise<ImportedStudentRow[]> {
  const fileName = file.name.toLowerCase();

  let rawGrid: string[][] = [];

  if (fileName.endsWith(".xlsx")) {
    rawGrid = await parseXlsxFile(file);
  } else {
    const text = await file.text();
    if (text.trim().startsWith("<?xml") || text.includes("<Workbook")) {
      rawGrid = parseXmlSpreadsheet(text);
    } else {
      rawGrid = parseCsvText(text);
    }
  }

  if (rawGrid.length < 2) {
    throw new Error(
      "File kosong atau tidak memiliki baris data di bawah baris judul (header)."
    );
  }

  // Abaikan baris pertama (header) dan konversi baris berikutnya
  const dataRows = rawGrid.slice(1).filter((r) =>
    r.some((cell) => cell && cell.trim().length > 0)
  );

  return dataRows.map((cols) => {
    const getCol = (idx: number) => (cols[idx] || "").trim();
    const rawGender = getCol(3).toUpperCase();
    const gender: "M" | "F" =
      rawGender === "P" || rawGender === "F" || rawGender.startsWith("PEREMPUAN")
        ? "F"
        : "M";

    const parsedYear = parseInt(getCol(16), 10);

    return {
      nisn: getCol(0),
      nis: getCol(1),
      fullName: getCol(2),
      gender,
      birthPlace: getCol(4) || "-",
      birthDate: normalizeDateString(getCol(5)),
      streetAddress: getCol(6) || "-",
      rtRw: getCol(7) || "001/001",
      village: getCol(8) || "-",
      district: getCol(9) || "-",
      city: getCol(10) || "-",
      province: getCol(11) || "-",
      fatherName: getCol(12) || "-",
      fatherPhone: getCol(13) || "",
      motherName: getCol(14) || "-",
      motherPhone: getCol(15) || "",
      entryYear: isNaN(parsedYear) ? new Date().getFullYear() : parsedYear,
      status: "ACTIVE",
      className: getCol(17) || "",
    };
  });
}

function normalizeDateString(input: string): string {
  if (!input) return "2009-01-01";
  // Jika sudah YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
  // Jika DD/MM/YYYY atau DD-MM-YYYY
  const dmy = input.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) {
    const day = dmy[1].padStart(2, "0");
    const month = dmy[2].padStart(2, "0");
    return `${dmy[3]}-${month}-${day}`;
  }
  // Jika serial date Excel (misal 40000)
  if (/^\d{5}$/.test(input)) {
    const serial = parseInt(input, 10);
    const utcDays = Math.floor(serial - 25569);
    const date = new Date(utcDays * 86400 * 1000);
    if (!isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10);
    }
  }
  return "2009-01-01";
}

function parseXmlSpreadsheet(xmlText: string): string[][] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "text/xml");
  const rows = Array.from(doc.getElementsByTagName("Row"));
  return rows.map((row) => {
    const cells = Array.from(row.getElementsByTagName("Cell"));
    return cells.map((c) => (c.textContent || "").trim());
  });
}

function parseCsvText(text: string): string[][] {
  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((l) => l.trim().length > 0);

  if (lines.length === 0) return [];

  // Deteksi delimiter: titik koma (;) atau koma (,)
  const firstLine = lines[0];
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  const delimiter = semicolonCount > commaCount ? ";" : ",";

  return lines.map((line) => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === delimiter && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  });
}

/**
 * Ekstraksi file .xlsx menggunakan Web API DecompressionStream bawaan browser
 */
async function parseXlsxFile(file: File): Promise<string[][]> {
  const buffer = await file.arrayBuffer();
  const entries = await unzipXlsxEntries(buffer);

  const parser = new DOMParser();
  const sharedStrings: string[] = [];

  if (entries["xl/sharedStrings.xml"]) {
    const ssDoc = parser.parseFromString(
      entries["xl/sharedStrings.xml"],
      "text/xml"
    );
    const siNodes = Array.from(ssDoc.getElementsByTagName("si"));
    siNodes.forEach((si) => {
      const tNodes = Array.from(si.getElementsByTagName("t"));
      sharedStrings.push(tNodes.map((t) => t.textContent || "").join(""));
    });
  }

  const sheetXml =
    entries["xl/worksheets/sheet1.xml"] ||
    Object.keys(entries)
      .filter((k) => k.startsWith("xl/worksheets/sheet"))
      .map((k) => entries[k])[0];

  if (!sheetXml) {
    throw new Error("Worksheet tidak ditemukan di dalam file .xlsx");
  }

  const sheetDoc = parser.parseFromString(sheetXml, "text/xml");
  const rowNodes = Array.from(sheetDoc.getElementsByTagName("row"));

  return rowNodes.map((rowNode) => {
    const cellNodes = Array.from(rowNode.getElementsByTagName("c"));
    const rowValues: string[] = [];

    cellNodes.forEach((cell) => {
      const ref = cell.getAttribute("r") || "";
      const colLetters = ref.replace(/[0-9]/g, "");
      const colIdx = columnLettersToIndex(colLetters);
      const type = cell.getAttribute("t");
      const vNode = cell.getElementsByTagName("v")[0];
      const isNode = cell.getElementsByTagName("is")[0];

      let val = "";
      if (type === "s" && vNode?.textContent) {
        const idx = parseInt(vNode.textContent, 10);
        val = sharedStrings[idx] ?? "";
      } else if (type === "inlineStr" && isNode) {
        val = isNode.textContent || "";
      } else if (vNode?.textContent) {
        val = vNode.textContent;
      }

      while (rowValues.length <= colIdx) {
        rowValues.push("");
      }
      rowValues[colIdx] = val.trim();
    });

    return rowValues;
  });
}

function columnLettersToIndex(letters: string): number {
  let idx = 0;
  for (let i = 0; i < letters.length; i++) {
    idx = idx * 26 + (letters.charCodeAt(i) - 64);
  }
  return Math.max(0, idx - 1);
}

async function unzipXlsxEntries(
  buffer: ArrayBuffer
): Promise<Record<string, string>> {
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  const entries: Record<string, string> = {};
  const decoder = new TextDecoder("utf-8");

  let offset = 0;
  while (offset + 30 <= buffer.byteLength) {
    const signature = view.getUint32(offset, true);
    if (signature !== 0x04034b50) break;

    const compression = view.getUint16(offset + 8, true);
    const compressedSize = view.getUint32(offset + 18, true);
    const fileNameLen = view.getUint16(offset + 26, true);
    const extraLen = view.getUint16(offset + 28, true);

    const fileName = decoder.decode(
      bytes.subarray(offset + 30, offset + 30 + fileNameLen)
    );
    const dataStart = offset + 30 + fileNameLen + extraLen;
    const compressedData = bytes.subarray(
      dataStart,
      dataStart + compressedSize
    );

    if (
      fileName === "xl/sharedStrings.xml" ||
      fileName.startsWith("xl/worksheets/sheet")
    ) {
      if (compression === 0) {
        entries[fileName] = decoder.decode(compressedData);
      } else if (compression === 8 && typeof DecompressionStream !== "undefined") {
        const ds = new DecompressionStream("deflate-raw");
        const writer = ds.writable.getWriter();
        writer.write(compressedData);
        writer.close();
        const decompressedBuf = await new Response(ds.readable).arrayBuffer();
        entries[fileName] = decoder.decode(decompressedBuf);
      }
    }

    offset = dataStart + compressedSize;
  }

  return entries;
}

