// Algandmete skript. Seda võib käivitada korduvalt: kirjed lisatakse või
// uuendatakse slug-i järgi, ajalugu ei puudutata ja duplikaate ei teki.
import { PrismaClient } from "@prisma/client";
import { activities, animals } from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  for (const [index, animal] of animals.entries()) {
    const data = {
      name: animal.name,
      // Illustratsioon on rakenduse sees (components/AnimalFigure.tsx).
      imagePath: `builtin:${animal.slug}`,
      sortOrder: index,
    };
    await prisma.animal.upsert({
      where: { slug: animal.slug },
      update: data,
      create: { slug: animal.slug, ...data },
    });
  }

  for (const [index, activity] of activities.entries()) {
    const data = {
      name: activity.name,
      description: activity.description,
      // Illustratsioon on rakenduse sees (components/ActivityProp.tsx).
      imagePath: `builtin:${activity.slug}`,
      color: activity.color,
      sortOrder: index,
    };
    await prisma.activity.upsert({
      where: { slug: activity.slug },
      update: data,
      create: { slug: activity.slug, ...data },
    });
  }

  console.log(
    `Algandmed olemas: ${animals.length} looma, ${activities.length} tegevust.`,
  );
}

main()
  .catch((error) => {
    console.error("Algandmete lisamine ebaõnnestus:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
