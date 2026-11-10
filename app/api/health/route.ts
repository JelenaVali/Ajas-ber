import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Tervisekontroll: kinnitab, et rakendus töötab, andmebaas vastab ja
// tabelid on olemas (migratsioonid rakendatud). Kui see ebaõnnestub, ei lase
// Railway uut versiooni käiku ja töötama jääb eelmine.
// Ei väljasta ühenduse aadressi ega vea üksikasju.
export async function GET() {
  try {
    await prisma.activity.count();
    return NextResponse.json({ status: "ok", database: "ok" });
  } catch (error) {
    console.error("Tervisekontroll: andmebaas ei vasta:", error);
    return NextResponse.json(
      { status: "error", database: "unavailable" },
      { status: 503 },
    );
  }
}
