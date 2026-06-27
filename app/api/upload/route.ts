// app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const section = formData.get("section") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipo de archivo no permitido. Permitidos: ${allowedTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const maxSize = file.type.startsWith("video/") ? 100 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `El archivo excede el tamaño máximo de ${maxSize / (1024 * 1024)}MB` },
        { status: 413 } // 413 Payload Too Large
      );
    }

    const ext = path.extname(file.name);
    const fileName = `${uuidv4()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filePath = path.join(uploadDir, fileName);

    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const url = `/uploads/${fileName}`;
    return NextResponse.json({ url, fileName, section });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: `Error al subir: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}