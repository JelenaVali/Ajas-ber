import { prisma } from "@/lib/db";
import type { SessionStore } from "@/lib/sessions";

/** Kas viga on unikaalsuse rikkumine (Prisma kood P2002). */
function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "P2002"
  );
}

/** SessionStore liidese päris andmebaasi teostus. */
export const prismaSessionStore: SessionStore = {
  async isActiveActivity(id) {
    const found = await prisma.activity.findFirst({
      where: { id, isActive: true },
      select: { id: true },
    });
    return found !== null;
  },

  async isActiveAnimal(id) {
    const found = await prisma.animal.findFirst({
      where: { id, isActive: true },
      select: { id: true },
    });
    return found !== null;
  },

  async create(session) {
    try {
      await prisma.activitySession.create({ data: session });
      return "created";
    } catch (error) {
      // clientSessionId on andmebaasis unikaalne: sama taimerikorda ei saa
      // salvestada kaks korda, isegi kui kaks päringut jõuavad korraga.
      if (isUniqueViolation(error)) return "duplicate";
      throw error;
    }
  },

  async prune(deviceId, keep) {
    const extra = await prisma.activitySession.findMany({
      where: { deviceId },
      orderBy: { completedAt: "desc" },
      skip: keep,
      select: { id: true },
    });
    if (extra.length === 0) return;
    await prisma.activitySession.deleteMany({
      where: { id: { in: extra.map((row) => row.id) } },
    });
  },

  async list(deviceId, limit) {
    const rows = await prisma.activitySession.findMany({
      where: { deviceId },
      orderBy: { completedAt: "desc" },
      take: limit,
      select: {
        id: true,
        completedAt: true,
        durationSeconds: true,
        // Peidetud (isActive = false) tegevus ja loom jäävad ajaloos nähtavaks.
        activity: { select: { slug: true, name: true, color: true } },
        animal: { select: { slug: true, name: true } },
      },
    });
    return rows.map((row) => ({ ...row, completedAt: row.completedAt.toISOString() }));
  },

  async clear(deviceId) {
    const result = await prisma.activitySession.deleteMany({ where: { deviceId } });
    return result.count;
  },
};
