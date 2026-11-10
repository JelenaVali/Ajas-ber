import { Flow } from "@/components/Flow";
import { getActiveActivities, getActiveAnimals } from "@/lib/catalog";
import { getMessages } from "@/lib/i18n";
import type { ActivityItem, AnimalItem } from "@/lib/types";

// Tegevused ja loomad tulevad andmebaasist, seega lehte ei ehitata ette valmis.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const messages = getMessages();

  let catalog: { activities: ActivityItem[]; animals: AnimalItem[] } | null = null;
  try {
    const [activities, animals] = await Promise.all([
      getActiveActivities(),
      getActiveAnimals(),
    ]);
    if (activities.length > 0 && animals.length > 0) {
      catalog = { activities, animals };
    }
  } catch (error) {
    console.error("Tegevuste ja loomade laadimine ebaõnnestus:", error);
  }

  if (!catalog) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-6 px-4 py-8 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-lavender-deep">
          {messages.app.name}
        </h1>
        <section role="alert" className="w-full rounded-3xl bg-pink-soft p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-pink-deep">{messages.errors.loadTitle}</h2>
          <p className="mt-2 text-lg">{messages.errors.loadBody}</p>
          {/* Tavaline link: lehe uuesti laadimine proovib andmebaasi uuesti. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="mt-6 inline-flex min-h-16 items-center rounded-full bg-white px-8 text-xl font-bold text-pink-deep shadow"
          >
            {messages.errors.retry}
          </a>
        </section>
      </main>
    );
  }

  return <Flow activities={catalog.activities} animals={catalog.animals} />;
}
