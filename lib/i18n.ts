import { et, type Messages } from "@/messages/et";

// Praegu on ainult eesti keel. Uue keele lisamiseks lisa see siia.
const dictionaries = { et } satisfies Record<string, Messages>;

export type Locale = keyof typeof dictionaries;
export const defaultLocale: Locale = "et";

export function getMessages(locale: Locale = defaultLocale): Messages {
  return dictionaries[locale];
}

/** Kestus sõnadega, näiteks „1 minut" või „3 minutit". */
export function minutesLabel(
  minutes: number,
  messages: Messages = getMessages(),
): string {
  const word = minutes === 1 ? messages.time.minuteOne : messages.time.minuteMany;
  return `${minutes} ${word}`;
}

/** Tegevuse nimi: tõlkefailist slug-i järgi, muidu andmebaasi põhinimi. */
export function activityName(
  activity: { slug: string; name: string },
  messages: Messages = getMessages(),
): string {
  return messages.activityNames[activity.slug] ?? activity.name;
}

/** Looma nimi: tõlkefailist slug-i järgi, muidu andmebaasi põhinimi. */
export function animalName(
  animal: { slug: string; name: string },
  messages: Messages = getMessages(),
): string {
  return messages.animalNames[animal.slug] ?? animal.name;
}
