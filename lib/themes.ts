// Tegevuste värviteemad. Andmebaasi Activity.color viitab siinsele võtmele.
// Klassinimed on täispikkuses välja kirjutatud, et Tailwind need üles leiaks.

export type Theme = {
  /** Pehme taustavärv kaardile ja taimeri ekraanile. */
  card: string;
  /** Tume tekstivärv, mis on pehmel taustal hästi loetav. */
  text: string;
  /** Tume taust põhinupule (valge tekstiga). */
  solid: string;
};

const themes: Record<string, Theme> = {
  sky: { card: "bg-sky-soft", text: "text-sky-deep", solid: "bg-sky-deep" },
  mint: { card: "bg-mint-soft", text: "text-mint-deep", solid: "bg-mint-deep" },
  yellow: { card: "bg-yellow-soft", text: "text-yellow-deep", solid: "bg-yellow-deep" },
  lavender: { card: "bg-lavender-soft", text: "text-lavender-deep", solid: "bg-lavender-deep" },
  pink: { card: "bg-pink-soft", text: "text-pink-deep", solid: "bg-pink-deep" },
  peach: { card: "bg-peach-soft", text: "text-peach-deep", solid: "bg-peach-deep" },
};

export function getTheme(color: string): Theme {
  return themes[color] ?? themes.sky;
}
