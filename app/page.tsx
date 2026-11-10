import { getActiveActivities } from "@/lib/catalog";
import { activityName, getMessages } from "@/lib/i18n";
import { getTheme } from "@/lib/themes";

// Tegevused tulevad andmebaasist, seega lehte ei ehitata ette valmis.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const messages = getMessages();

  let activities: Awaited<ReturnType<typeof getActiveActivities>> | null = null;
  try {
    activities = await getActiveActivities();
  } catch (error) {
    console.error("Tegevuste laadimine ebaõnnestus:", error);
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <header className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-lavender-deep sm:text-6xl">
          {messages.app.name}
        </h1>
        <p className="mt-3 text-2xl font-semibold sm:text-3xl">
          {messages.app.greeting}
        </p>
      </header>

      {activities === null ? (
        <section
          role="alert"
          className="rounded-3xl bg-pink-soft p-8 text-center shadow-sm"
        >
          <h2 className="text-2xl font-bold text-pink-deep">
            {messages.errors.loadTitle}
          </h2>
          <p className="mt-2 text-lg">{messages.errors.loadBody}</p>
          {/* Tavaline link: lehe uuesti laadimine proovib andmebaasi uuesti. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="mt-6 inline-block rounded-full bg-white px-8 py-4 text-xl font-bold text-pink-deep shadow"
          >
            {messages.errors.retry}
          </a>
        </section>
      ) : (
        <section aria-labelledby="choose-activity">
          <h2 id="choose-activity" className="sr-only">
            {messages.home.chooseActivity}
          </h2>
          <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
            {activities.map((activity) => {
              const theme = getTheme(activity.color);
              return (
                <li
                  key={activity.id}
                  className={`flex min-h-36 items-center justify-center rounded-3xl p-5 text-center shadow-sm ${theme.card}`}
                >
                  <span className={`text-xl font-bold sm:text-2xl ${theme.text}`}>
                    {activityName(activity, messages)}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </main>
  );
}
