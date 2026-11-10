import { NextResponse } from "next/server";
import { clearSessions, listSessions, saveCompletedSession } from "@/lib/sessions";
import { prismaSessionStore } from "@/lib/sessionStore";

export const dynamic = "force-dynamic";

// Seadme anonüümne tunnus tuleb päises, mitte aadressis, et see ei jääks
// brauseri ajalukku ega serveri aadressilogidesse.
const DEVICE_HEADER = "x-device-id";

const invalid = () => NextResponse.json({ error: "invalid" }, { status: 400 });

// Vea üksikasjad lähevad ainult serveri logisse, mitte kasutajale.
function serverError(action: string, error: unknown) {
  console.error(`Ajalugu: ${action} ebaõnnestus:`, error);
  return NextResponse.json({ error: "server" }, { status: 500 });
}

/** Seadme lõpetatud tegevused, uuemad eespool. */
export async function GET(request: Request) {
  try {
    const sessions = await listSessions(
      prismaSessionStore,
      request.headers.get(DEVICE_HEADER),
    );
    if (sessions === null) return invalid();
    return NextResponse.json({ sessions });
  } catch (error) {
    return serverError("laadimine", error);
  }
}

/** Salvestab lõpuni tehtud tegevuse. Korduv päring ei tekita uut kirjet. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return invalid();
  }

  try {
    const result = await saveCompletedSession(
      prismaSessionStore,
      request.headers.get(DEVICE_HEADER),
      body,
      Date.now(),
    );
    if (!result.ok) return invalid();
    return NextResponse.json(
      { status: result.status },
      { status: result.status === "created" ? 201 : 200 },
    );
  } catch (error) {
    return serverError("salvestamine", error);
  }
}

/** Tühjendab ainult selle seadme ajaloo. */
export async function DELETE(request: Request) {
  try {
    const deleted = await clearSessions(
      prismaSessionStore,
      request.headers.get(DEVICE_HEADER),
    );
    if (deleted === null) return invalid();
    return NextResponse.json({ deleted });
  } catch (error) {
    return serverError("tühjendamine", error);
  }
}
