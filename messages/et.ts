// Kõik kasutajale nähtavad eestikeelsed tekstid.
// Uue keele lisamiseks tee sama kujuga fail (nt en.ts) ja lisa see lib/i18n.ts-i.

export const et = {
  app: {
    name: "Ajasõber",
    greeting: "Teeme koos ära!",
    description:
      "Mänguline taimer, mis aitab lastel igapäevaseid tegevusi ajastada.",
  },
  home: {
    chooseActivity: "Vali tegevus",
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
