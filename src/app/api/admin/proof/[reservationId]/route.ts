import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resolveProofPath } from "@/lib/uploads";

const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reservationId: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { reservationId } = await params;
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation) {
    return NextResponse.json(
      { error: "Reserva não encontrada." },
      { status: 404 }
    );
  }

  try {
    const filePath = resolveProofPath(reservation.proofPath);
    const buffer = await readFile(filePath);
    const extension = reservation.proofPath.slice(
      reservation.proofPath.lastIndexOf(".")
    );
    const contentType =
      CONTENT_TYPE_BY_EXTENSION[extension] ?? "application/octet-stream";

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${encodeURIComponent(reservation.proofFileName)}"`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Arquivo não encontrado." },
      { status: 404 }
    );
  }
}
