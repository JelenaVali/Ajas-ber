// Kõik kasutajale nähtavad eestikeelsed tekstid.
// Uue keele lisamiseks tee sama kujuga fail (nt en.ts) ja lisa see lib/i18n.ts-i.

export const et = {
  app: {
    name: "Ajasõber",
    greeting: "Teeme koos ära!",
    description:
      "Mänguline taimer, mis aitab lastel igapäevaseid tegevusi ajastada.",
  },
  footer: {
    text: "© 2026 Ajas-ber. Built with Claude Code",
  },
  home: {
    chooseActivity: "Vali tegevus",
    history: "Minu tegevused",
  },
  steps: {
    chooseAnimal: "Vali sõber",
    chooseTime: "Vali aeg",
    back: "Tagasi",
  },
  time: {
    minuteOne: "minut",
    minuteMany: "minutit",
    less: "Vähem aega",
    more: "Rohkem aega",
    selected: "Valitud aeg",
    start: "Start!",
  },
  timer: {
    timeLeft: "Aega jäänud",
    pause: "Paus",
    resume: "Jätka",
    restart: "Alusta uuesti",
    finish: "Lõpeta",
    paused: "Paus",
  },
  done: {
    praises: ["Tubli!", "Sa said hakkama!", "Väga hästi tehtud!"],
    next: "Vali järgmine tegevus",
  },
  sound: {
    on: "Heli on sees. Vajuta, et välja lülitada.",
    off: "Heli on väljas. Vajuta, et sisse lülitada.",
  },
  history: {
    title: "Minu tegevused",
    loading: "Laadin tegevusi…",
    today: "Täna",
    yesterday: "Eile",
    emptyTitle: "Siin pole veel midagi",
    emptyBody: "Kui taimer saab täis, ilmub tegevus siia.",
    chooseActivity: "Vali tegevus",
    loadError: "Tegevusi ei saanud praegu laadida.",
    clear: "Tühjenda ajalugu",
    confirmTitle: "Kas kustutame kõik tegevused?",
    confirmBody: "Kustutatud tegevusi ei saa tagasi.",
    keep: "Jäta alles",
    remove: "Kustuta",
    clearError: "Kustutamine ei õnnestunud. Ajalugu jäi alles.",
  },
  errors: {
    loadTitle: "Oih, midagi läks viltu",
    loadBody: "Tegevusi ei saanud praegu laadida.",
    retry: "Proovi uuesti",
  },
  // Tegevuste ja loomade nimed tulevad andmebaasist. Siia saab slug-i järgi
  // lisada tõlke, mis andmebaasi nime üle kirjutab.
  activityNames: {} as Record<string, string>,
  animalNames: {} as Record<string, string>,
};

export type Messages = typeof et;
