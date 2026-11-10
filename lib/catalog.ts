import { prisma } from "@/lib/db";

/** Aktiivsed tegevused avalehe jaoks, kuvamise järjekorras. */
export function getActiveActivities() {
  return prisma.activity.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, slug: true, name: true, description: true, color: true },
  });
}

/** Aktiivsed loomad valiku jaoks, kuvamise järjekorras. */
export function getActiveAnimals() {
  return prisma.animal.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, slug: true, name: true },
  });
}
