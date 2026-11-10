# Ajasõber

Mänguline taimer 2–6-aastastele lastele. Laps valib tegevuse (näiteks hambapesu), loomast sõbra ja aja. Loom teeb tegevust taimeri ajal kaasa ja kiidab lõpus.

Rakendus töötab aadressil <https://ajas-ber-production.up.railway.app>.

## Mida rakendus teeb

- Kuus tegevust: hambapesu, riietumine, vannis pesemine, mängimine, mänguasjade koristamine, pidžaama selgapanek.
- Kaksteist looma, kelle seast laps valib pildi järgi.
- Aeg 1–5 minutit nuppudega või 1–10 minutit pluss- ja miinusnupuga.
- Taimer suurte numbrite ja tühjeneva ringiga. Nupud „Paus"/„Jätka", „Alusta uuesti" ja „Lõpeta".
- Aja lõpus rõõmustav loom, kiitus ja soovi korral lühike heli.
- Vaade „Minu tegevused" lõpuni tehtud tegevustega.

## Mida peab teadma andmete kohta

- Kasutajakontosid ei ole. Rakendus ei küsi ega salvesta nime, e-posti ega muid isikuandmeid.
- **Ajalugu on seadmepõhine.** Brauser loob esimesel kasutamisel juhusliku tunnuse ja hoiab seda oma mälus. Iga seade näeb ja saab tühjendada ainult oma tegevusi.
- Sama pere telefon ja tahvel näevad seetõttu eraldi ajalugu.
- Kui brauseri andmed kustutatakse, saab seade uue tunnuse ja vana ajalugu enam ei näe.
- Tunnus ei ole parool. Kes teab seadme tunnust, saab selle seadme ajalugu lugeda. Ajaloos on ainult tegevus, loom, kestus ja kellaaeg.
- Ajalukku lähevad ainult lõpuni tehtud tegevused. Seadme kohta hoitakse kuni 200 viimast kirjet.
- Brauseris hoitakse peale tunnuse ainult heli seadistust. Küpsiseid ega analüütikat ei ole.

## Tehnoloogia

| Osa | Tehnoloogia |
|---|---|
| Rakendus | Next.js (App Router), React, TypeScript |
| Kujundus | Tailwind CSS, Lucide ikoonid |
| Andmebaas | PostgreSQL, Prisma ORM |
| Majutus | Railway, automaatne juurutus GitHubi `main` harust |
| Testid | Vitest |

## Kaustad

| Kaust | Sisu |
|---|---|
| `app/` | Lehed ja API marsruudid (`/`, `/ajalugu`, `/api/sessions`, `/api/health`) |
| `components/` | Kasutajaliidese osad: loomad, tegevuste rekvisiidid, taimeri ekraan, ajalugu |
| `lib/` | Taimeri loogika, valideerimine, andmebaasiühendus, heli, testid |
| `messages/` | Kõik kasutajale nähtavad tekstid (`et.ts`) |
| `prisma/` | Andmebaasi skeem, migratsioonid ja algandmed |

## Juurutamine Railway's

Projekt on mõeldud töötama Railway's, mitte arendaja arvutis.

### Esmakordne seadistus

1. Lisa kood GitHubi repositooriumisse:
   ```bash
   git remote add origin https://github.com/KASUTAJA/REPO.git
   git push -u origin main
   ```
2. Loo Railway's uus projekt ja vali **Deploy from GitHub repo**. Vali see repositoorium ja haru `main`.
3. Lisa samasse projekti andmebaas: **New → Database → PostgreSQL**.
4. Ava rakenduse teenuse **Variables** ja lisa muutuja:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```
   See on viide andmebaasi teenusele. Parooli ei pea kuhugi kopeerima.
5. Loo avalik aadress: **Settings → Networking → Generate Domain**.

### Mis juurutusel juhtub

Iga `main` harusse lükatud muudatus käivitab uue juurutuse. Seadistus on failis `railway.json`.

1. Railway paigaldab paketid ja käivitab `npm run build`.
2. Käivituskäsk `npm run start:prod` teeb järjest kolm asja:
   - `prisma migrate deploy` rakendab veel rakendamata migratsioonid,
   - algandmete skript lisab või uuendab tegevused ja loomad,
   - `next start` käivitab rakenduse Railway antud pordil (`PORT`).
3. Railway kontrollib aadressi `/api/health`. Uus versioon läheb käiku alles siis, kui rakendus töötab ja andmebaasi tabelid on olemas. Muidu jääb tööle eelmine versioon.

Algandmete skripti võib käivitada korduvalt: see ei puuduta ajalugu ega tekita duplikaate.

### Keskkonnamuutujad

| Muutuja | Selgitus |
|---|---|
| `DATABASE_URL` | PostgreSQL-i ühenduse aadress. Railway's viide `${{Postgres.DATABASE_URL}}`. |
| `PORT` | Railway määrab selle ise. |

Näidis on failis `.env.example`. Päris `.env` fail on `.gitignore`-s ja saladusi GitHubi ei lisata.

## Andmebaasi muutmine

Andmebaasile pääseb ligi ainult Railway seest, seega migratsioonid luuakse ilma andmebaasita.

1. Muuda faili `prisma/schema.prisma`.
2. Loo migratsiooni SQL. Esimene migratsioon loodi nii:
   ```bash
   npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script --output prisma/migrations/20261110000000_init/migration.sql
   ```
   Järgmiste muudatuste jaoks võrdle olemasolevaid migratsioone uue skeemiga. See vajab ajutist tühja PostgreSQL-i andmebaasi (`--shadow-database-url`):
   ```bash
   npx prisma migrate diff --from-migrations prisma/migrations --to-schema-datamodel prisma/schema.prisma --shadow-database-url "postgresql://..." --script --output prisma/migrations/KUUPAEV_nimi/migration.sql
   ```
3. Lükka muudatus `main` harusse. Railway rakendab migratsiooni järgmisel juurutusel.

### Uue looma või tegevuse lisamine

1. Lisa rida faili `prisma/seed-data.ts`.
2. Lisa illustratsioon: looma jaoks kirje `components/AnimalFigure.tsx` tabelisse `SPECS`, tegevuse jaoks kiht faili `components/ActivityProp.tsx`.
3. Lükka `main` harusse.

Ilma illustratsioonita loom saab üldise lilla tegelase ja ilma kihita tegevus lihtsalt lehvitava looma, nii et midagi katki ei lähe.

Looma või tegevuse peitmiseks pane andmebaasis `isActive` väärtuseks `false`. Vanad ajalookirjed jäävad alles.

### Uue keele lisamine

Tee failist `messages/et.ts` sama kujuga koopia (näiteks `en.ts`) ja lisa see faili `lib/i18n.ts`. Tegevuste ja loomade nimed saab tõlkida `activityNames` ja `animalNames` all tunnuse (`slug`) järgi. Keelevaliku nuppu praegu ei ole.

## Arendamine

Enne iga lükkamist:

```bash
npm install
```
```bash
npm test
```
```bash
npm run typecheck
```
```bash
npm run lint
```
```bash
npm run build
```

Ükski neist ei vaja andmebaasi. Testid katavad taimeri loogika, aja valideerimise, lõpetatud tegevuse salvestamise, katkestatud tegevuse mittesalvestamise ja duplikaatide vältimise.

### Kohalik käivitamine (valikuline)

Selle projekti tavaline töövoog kohalikku serverit ega andmebaasi ei kasuta: muudatusi proovitakse Railway aadressil. Kui soovid rakendust siiski oma arvutis käivitada, on vaja oma PostgreSQL-i andmebaasi.

1. Kopeeri `.env.example` failiks `.env` ja kirjuta sinna oma andmebaasi aadress.
2. Loo tabelid ja algandmed:
   ```bash
   npm run db:deploy
   ```
3. Käivita arendusserver:
   ```bash
   npm run dev
   ```

## Käsud

| Käsk | Mida teeb |
|---|---|
| `npm run dev` | Arendusserver |
| `npm run build` | Genereerib Prisma kliendi ja ehitab rakenduse |
| `npm run start` | Käivitab ehitatud rakenduse |
| `npm run start:prod` | Migratsioonid, algandmed ja käivitus (Railway kasutab seda) |
| `npm run db:migrate` | Rakendab migratsioonid |
| `npm run db:seed` | Lisab või uuendab algandmed |
| `npm test` | Automaattestid |
| `npm run typecheck` | TypeScripti tüübikontroll |
| `npm run lint` | Koodi stiilikontroll |

## Teadaolevad piirangud

- Lehe värskendamine taimeri ajal viib avalehele; pooleli jäänud taimerit ei taastata.
- Ekraani ärkvel hoidmine töötab ainult brauserites, mis seda toetavad. Mujal võib ekraan taimeri ajal kustuda; aeg jääb siiski täpseks.
- Lukustatud ekraaniga ei saa brauser heli mängida. Kui lõpust on tagasi tulles möödas üle minuti, jääb heli ära.
- Kui lõpetatud tegevuse salvestamine võrguvea tõttu ei õnnestu, jääb see ajaloost välja. Kiitust näeb laps ikka.
- Päringute arvu ei piirata.
