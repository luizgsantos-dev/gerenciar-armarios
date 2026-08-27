import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "uploads", "comprovantes");

export const ALLOWED_PROOF_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
];

export const MAX_PROOF_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
};

export async function saveProofFile(file: File) {
  await mkdir(UPLOADS_DIR, { recursive: true });

  const extension = EXTENSION_BY_MIME[file.type] ?? "";
  const storedName = `${randomUUID()}${extension}`;
  const destination = path.join(UPLOADS_DIR, storedName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(destination, buffer);

  return {
    storedName,
    originalName: file.name,
  };
}

export function resolveProofPath(storedName: string) {
  return path.join(UPLOADS_DIR, storedName);
}

/** Remove um comprovante já gravado quando a reserva acaba não sendo criada. */
export async function deleteProofFile(storedName: string) {
  try {
    await unlink(resolveProofPath(storedName));
  } catch {
    // Arquivo já ausente: nada a fazer.
  }
}
