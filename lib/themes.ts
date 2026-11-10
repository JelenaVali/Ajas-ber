// Tegevuskaartide värviteemad. Andmebaasi Activity.color viitab siinsele võtmele.
// Klassinimed on täispikkuses välja kirjutatud, et Tailwind need üles leiaks.

export type Theme = { card: string; text: string };

const themes: Record<string, Theme> = {
  sky: { card: "bg-sky-soft", text: "text-sky-deep" },
  mint: { card: "bg-mint-soft", text: "text-mint-deep" },
  yellow: { card: "bg-yellow-soft", text: "text-yellow-deep" },
  lavender: { card: "bg-lavender-soft", text: "text-lavender-deep" },
  pink: { card: "bg-pink-soft", text: "text-pink-deep" },
  peach: { card: "bg-peach-soft", text: "text-peach-deep" },
};

export function getTheme(color: string): Theme {
  return themes[color] ?? themes.sky;
}
