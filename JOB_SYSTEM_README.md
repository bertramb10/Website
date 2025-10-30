# Smart Job Application System

Et automatisk job søge- og ansøgningssystem der finder relevante IT-jobs fra danske jobportaler, matcher dem mod dit CV, og sender notifikationer om høj-match jobs.

## ✨ Features

### 🔍 **Automatisk Job Søgning**
- Søger automatisk hver 6. time efter nye job opslag
- Henter jobs fra JobIndex.dk og IT-jobbank.dk
- Filtrerer efter location (kun Storkøbenhavn)
- Konfigurerbare søgeord

### 🎯 **Intelligent Match Scoring**
- Analyserer job beskrivelser for tekniske keywords
- Sammenligner med dit CV automatisk
- Beregner match score (0-100%)
- Sorterer jobs efter relevans

### 📧 **Email Notifikationer**
- Modtag email når nye høj-match jobs findes (>80%)
- Pæne HTML emails med job detaljer
- Kun notifikationer for nye jobs (ingen duplikater)

### 📊 **Job Analyzer**
- Ekstraher keywords fra job opslag
- Identificer requirements og kvalifikationer
- Generer tilpassede cover letters
- Highlight tekniske og soft skills

## 🚀 Kom i Gang

### 1. Installation

Projektet bruger Next.js 15 med TypeScript. Dependencies er allerede installeret.

```bash
cd portfolio
npm install  # Hvis nødvendigt
```

### 2. Konfigurer Email (Valgfrit, men anbefalet)

For at modtage email notifikationer skal du oprette en `.env.local` fil i projektets rod:

```env
# Email konfiguration (Gmail eksempel)
EMAIL_USER=din-email@gmail.com
EMAIL_PASSWORD=din-app-password
```

**Gmail Setup:**
1. Gå til [Google Account Security](https://myaccount.google.com/security)
2. Aktiver "2-Step Verification"
3. Opret et "App Password" på [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Brug det app password i `.env.local` (IKKE dit normale password!)

**Andre email providers:**
- Redigér `lib/email.ts` og opdater transporter konfigurationen

### 3. Opdater Dit CV

Redigér `data/resume.json` med dine egne oplysninger:

```json
{
  "name": "Dit Navn",
  "email": "din@email.dk",
  "phone": "+45 12 34 56 78",
  "skills": {
    "languages": ["C#", "Python", "JavaScript", "TypeScript"],
    "frontend": ["React", "HTML", "CSS", "Tailwind CSS"],
    "backend": [".NET", "Azure", "SQL"],
    "tools": ["Git", "VS Code", "Azure DevOps"]
  },
  "experience": [...],
  "education": [...]
}
```

### 4. Konfigurer Søgeord og Email

Redigér `data/jobs-database.json`:

```json
{
  "searchKeywords": ["c#", "python", "react", "javascript", ".net"],
  "notificationEmail": "din-email@example.com",
  "matchThreshold": 80
}
```

Eller brug Settings siden efter serveren er startet (http://localhost:3001/job-settings).

### 5. Start Serveren

```bash
npm run dev
```

Serveren kører på [http://localhost:3001](http://localhost:3001) (eller 3000 hvis ledig).

## 📖 Brug

### Manuel Job Søgning

1. Gå til [http://localhost:3001/jobs](http://localhost:3001/jobs)
2. Indtast søgeord (f.eks. "c#", "python", "react")
3. Vælg location (f.eks. "København")
4. Klik "Søg Jobs"
5. Se resultater sorteret efter match score

### Automatisk Job Tjek

1. Gå til [http://localhost:3001/job-settings](http://localhost:3001/job-settings)
2. Konfigurer email, søgeord og match threshold
3. Klik "Start Automatisk Tjek"
4. Systemet søger nu automatisk hver 6. time
5. Du modtager email når høj-match jobs findes

### Manuel Test af Auto-Check

Klik "Søg Nu (Manuelt)" på settings siden eller besøg:
```
http://localhost:3001/api/auto-check-jobs
```

### Job Analyzer

1. Fra job søgning: Klik "Analyser & Lav Ansøgning" på et job
2. Eller gå direkte til [http://localhost:3001/job-analyzer](http://localhost:3001/job-analyzer)
3. Indsæt job URL eller tekst
4. Få keyword analyse, match score og cover letter forslag

## 📁 Fil Struktur

```
portfolio/
├── app/
│   ├── jobs/page.tsx                    # Job søgning interface
│   ├── job-analyzer/page.tsx            # Job analyse tool
│   ├── job-settings/page.tsx            # Konfiguration
│   └── api/
│       ├── fetch-jobs/route.ts          # RSS feed parsing
│       ├── analyze-job/route.ts         # Job analyse
│       ├── auto-check-jobs/route.ts     # Automatisk tjek
│       ├── settings/route.ts            # Gem/hent settings
│       └── cron/
│           └── start/route.ts           # Start cron job
├── lib/
│   └── email.ts                         # Email notifikationer
├── data/
│   ├── resume.json                      # Dit CV
│   └── jobs-database.json               # Job database og settings
└── .env.local                           # Email credentials (opret selv)
```

## ⚙️ Konfiguration

### Match Score Threshold

Default er 80%. Jobs med ≥80% match trigger email notifikationer.

Juster i `data/jobs-database.json` eller via Settings siden:
```json
{
  "matchThreshold": 75  // Sænk til 75% for flere notifikationer
}
```

### Søgeord

Tilføj/fjern søgeord i `data/jobs-database.json` eller via Settings siden:
```json
{
  "searchKeywords": [
    "c#",
    "python",
    "javascript",
    "typescript",
    "react",
    "sql",
    "azure",
    ".net",
    "udvikler"
  ]
}
```

### Cron Schedule

Standard: Hver 6. time (`0 */6 * * *`)

For at ændre frekvens, redigér `app/api/cron/start/route.ts`:

```typescript
// Hver 2. time
cronTask = cron.schedule('0 */2 * * *', async () => { ... });

// Hver dag kl. 09:00
cronTask = cron.schedule('0 9 * * *', async () => { ... });

// Hver time
cronTask = cron.schedule('0 * * * *', async () => { ... });
```

## 🔧 Avanceret

### Tilføj Flere Job Sources

Redigér `app/api/fetch-jobs/route.ts` og tilføj nye RSS parsers:

```typescript
const [jobIndexJobs, itJobBankJobs, newSourceJobs] = await Promise.all([
  parseJobIndexRSS(keywords, location),
  parseITJobBankRSS(keywords, location),
  parseNewSourceRSS(keywords, location),  // Din nye source
]);
```

### Production Deployment

**Vercel (Anbefalet):**
1. Deploy på Vercel
2. Tilføj environment variables i Vercel dashboard
3. Brug Vercel Cron Jobs i stedet for node-cron:
   - Opret `vercel.json`:
   ```json
   {
     "crons": [{
       "path": "/api/auto-check-jobs",
       "schedule": "0 */6 * * *"
     }]
   }
   ```

**Andre hosting:**
- Brug external cron service (cron-job.org, EasyCron)
- Eller setup separat Node.js process med node-cron

### Database Upgrade

Nuværende system bruger JSON fil (`jobs-database.json`). For production:

1. Opgrader til PostgreSQL/MongoDB
2. Redigér `app/api/auto-check-jobs/route.ts` og `app/api/settings/route.ts`
3. Skift `fs.readFileSync` med database queries

## 🐛 Troubleshooting

### Email sendes ikke

**Problem:** "Email credentials not configured" i console

**Løsning:**
1. Tjek at `.env.local` findes og indeholder korrekte credentials
2. For Gmail: Brug App Password, ikke dit normale password
3. Genstart dev serveren efter at have oprettet `.env.local`

### Cron job kører ikke

**Problem:** Auto-check sker ikke automatisk

**Løsning:**
1. Tjek at du har klikket "Start Automatisk Tjek" på Settings siden
2. I development mode kan cron stoppe hvis serveren genstartes
3. For production: Brug Vercel Cron eller external service

### Får kun 50% match på alle jobs

**Problem:** Match scores er altid 50%

**Løsning:**
1. Tjek at `data/resume.json` indeholder dine faktiske skills
2. RSS beskrivelser er korte - nogle jobs har limited info
3. Brug "Analyser & Lav Ansøgning" for fuld analyse af interessante jobs

### Ingen jobs fundet

**Problem:** Søgning returnerer 0 jobs

**Løsning:**
1. Prøv bredere søgeord ("udvikler" i stedet for "senior c# .net udvikler")
2. Tjek internet forbindelse
3. JobIndex/IT-jobbank RSS feeds kan være nede midlertidigt
4. Prøv "Danmark" som location i stedet for "København"

## 📝 Næste Skridt

Forslag til fremtidige forbedringer:

- [ ] Add flere job sources (LinkedIn, Graduateland, Ofir)
- [ ] Application tracking (gem hvilke jobs du har søgt)
- [ ] Job statistics dashboard
- [ ] Favorit/gem jobs funktion
- [ ] Bedre AI-genererede cover letters
- [ ] Remote jobs filter
- [ ] Job alerts via SMS/Discord
- [ ] Interview preparation tips baseret på job requirements

## 📄 License

Dette er et personligt projekt. Brug frit til egen brug.

## 🙋 Support

Ved problemer eller spørgsmål, check:
1. Console logs i browser (F12 → Console)
2. Terminal output fra Next.js dev server
3. `/api/auto-check-jobs` endpoint for debug info
