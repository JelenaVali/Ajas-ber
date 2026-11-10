// Algandmed. Uue looma või tegevuse lisamiseks lisa siia rida
// (ja vastav illustratsioon); järgmine juurutus viib selle andmebaasi.

export type SeedAnimal = {
  slug: string;
  name: string;
};

export type SeedActivity = {
  slug: string;
  name: string;
  description: string;
  color: string;
};

export const animals: SeedAnimal[] = [
  { slug: "karu", name: "Karu" },
  { slug: "janes", name: "Jänes" },
  { slug: "kass", name: "Kass" },
  { slug: "koer", name: "Koer" },
  { slug: "rebane", name: "Rebane" },
  { slug: "siil", name: "Siil" },
  { slug: "panda", name: "Panda" },
  { slug: "lovi", name: "Lõvi" },
  { slug: "elevant", name: "Elevant" },
  { slug: "kaelkirjak", name: "Kaelkirjak" },
  { slug: "pingviin", name: "Pingviin" },
  { slug: "konn", name: "Konn" },
];

export const activities: SeedActivity[] = [
  {
    slug: "hambapesu",
    name: "Hambapesu",
    description: "Peseme hambad puhtaks.",
    color: "sky",
  },
  {
    slug: "riietumine",
    name: "Riietumine",
    description: "Paneme riided selga.",
    color: "yellow",
  },
  {
    slug: "vannis-pesemine",
    name: "Vannis pesemine",
    description: "Peseme end vannis puhtaks.",
    color: "mint",
  },
  {
    slug: "mangimine",
    name: "Mängimine",
    description: "Mängime koos.",
    color: "peach",
  },
  {
    slug: "koristamine",
    name: "Mänguasjade koristamine",
    description: "Paneme mänguasjad kasti.",
    color: "pink",
  },
  {
    slug: "pidzaama",
    name: "Pidžaama selgapanek",
    description: "Paneme pidžaama selga.",
    color: "lavender",
  },
];
