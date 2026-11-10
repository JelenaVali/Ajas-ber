import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Tervisekontroll: kinnitab, et rakendus töötab ja andmebaas vastab.
// Ei väljasta ühenduse aadressi ega vea üksikasju.
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", database: "ok" });
  } catch (error) {
    console.error("Tervisekontroll: andmebaas ei vasta:", error);
    return NextResponse.json(
      { status: "error", database: "unavailable" },
      { status: 503 },
    );
  }
}
