import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Load resume data
function getResumeData() {
  const resumePath = path.join(process.cwd(), 'data', 'resume.json');
  const resumeData = JSON.parse(fs.readFileSync(resumePath, 'utf-8'));
  return resumeData;
}

// Quick keyword extraction for match scoring (simplified version from analyze-job)
function quickExtractKeywords(text: string) {
  const technicalSkills = [
    // Programming languages
    'javascript', 'typescript', 'python', 'java', 'c#', 'c\\+\\+', 'go', 'rust', 'php', 'swift', 'kotlin', 'scala', 'ruby',
    // Frontend
    'react', 'angular', 'vue', 'next\\.js', 'nuxt', 'svelte', 'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap',
    // Backend
    'node\\.js', '\\.net', 'asp\\.net', 'express', 'nestjs', 'django', 'flask', 'spring', 'laravel',
    // Databases
    'sql', 'mysql', 'mongodb', 'postgresql', 'redis', 'elasticsearch', 'dynamodb', 'cassandra', 'oracle',
    // Cloud & DevOps
    'docker', 'kubernetes', 'azure', 'aws', 'gcp', 'terraform', 'ansible', 'jenkins', 'gitlab', 'github actions',
    // Tools & Methodologies
    'git', 'scrum', 'agile', 'jira', 'confluence', 'ci\\/cd', 'rest', 'graphql', 'api', 'microservices',
    // Testing
    'jest', 'cypress', 'selenium', 'unit testing', 'integration testing', 'tdd',
  ];

  const lowerText = text.toLowerCase();
  const foundTechnical = technicalSkills
    .filter(skill => new RegExp(`\\b${skill}\\b`, 'i').test(lowerText))
    .map(skill => skill.replace(/\\\\/g, '').replace(/\\.\\?/g, '-').replace(/\\\./g, '.'));

  return { technical: [...new Set(foundTechnical)] };
}

interface Keywords {
  technical: string[];
}

interface ResumeData {
  skills: {
    languages: string[];
    frontend: string[];
    backend: string[];
    tools: string[];
  };
}

// Calculate match score
function calculateMatchScore(keywords: Keywords, resumeData: ResumeData): number {
  const allResumeSkills = [
    ...resumeData.skills.languages,
    ...resumeData.skills.frontend,
    ...resumeData.skills.backend,
    ...resumeData.skills.tools,
  ].map((s: string) => s.toLowerCase());

  const matchedSkills = keywords.technical.filter((skill: string) =>
    allResumeSkills.some((rs: string) => rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs))
  );

  if (keywords.technical.length === 0) return 50;

  const score = (matchedSkills.length / keywords.technical.length) * 100;
  return Math.round(score);
}

// Parse RSS feed from JobIndex
async function parseJobIndexRSS(keywords: string, location?: string) {
  try {
    // Use IT category (supid=1) to filter only IT jobs
    // Don't use quotes - let JobIndex find all relevant jobs with OR matching
    const rssUrl = new URL('https://www.jobindex.dk/jobsoegning.rss');
    rssUrl.searchParams.set('supid', '1'); // IT category
    rssUrl.searchParams.set('q', keywords);

    // Add location filter if specified
    if (location && location.toLowerCase() !== 'danmark') {
      // Map common locations to JobIndex area codes
      const locationMap: { [key: string]: string } = {
        'københavn': 'storkbh',
        'kobenhavn': 'storkbh',
        'kbh': 'storkbh',
        'storkøbenhavn': 'storkbh',
        'aarhus': '0751',
        'odense': '0461',
        'aalborg': '0851',
      };

      const areaCode = locationMap[location.toLowerCase()] || location;
      rssUrl.searchParams.set('area', areaCode);
    }

    console.log(`Fetching RSS from: ${rssUrl.toString()}`);
    const response = await fetch(rssUrl.toString());
    const xmlText = await response.text();

    const jobs = [];

    // Simple regex-based XML parsing (good enough for RSS)
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let id = 1;

    while ((match = itemRegex.exec(xmlText)) !== null && jobs.length < 20) {
      const itemXml = match[1];

      // Extract fields from XML
      const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/)?.[1] || itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/)?.[2] || '';
      const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || '';
      const description = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/)?.[1] || itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/)?.[2] || '';
      const category = itemXml.match(/<category>(.*?)<\/category>/)?.[1] || '';
      const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || new Date().toISOString();

      // Clean HTML from description
      const cleanDescription = description
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#x[0-9A-F]+;/g, '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 1500);

      // Extract company from title (format: "Job Title, Company")
      const titleParts = title.split(',');
      const jobTitle = titleParts[0]?.trim() || title;
      const company = titleParts.length > 1 ? titleParts[titleParts.length - 1].trim() : 'Se opslag';

      // Try to extract location from description or title
      let jobLocation = 'Danmark';
      const locationPatterns = [
        /(?:København|Copenhagen|Storkøbenhavn|KBH)/i,
        /(?:Aarhus|Århus)/i,
        /(?:Odense)/i,
        /(?:Aalborg)/i,
      ];

      const fullText = (title + ' ' + cleanDescription).toLowerCase();
      for (const pattern of locationPatterns) {
        if (pattern.test(fullText)) {
          const match = fullText.match(pattern);
          if (match) {
            jobLocation = match[0];
            break;
          }
        }
      }

      if (title && link) {
        jobs.push({
          id: `rss-${id++}`,
          title: jobTitle,
          company: company,
          location: jobLocation,
          description: cleanDescription || 'Klik for at se fuld jobbeskrivelse',
          url: link,
          postedDate: new Date(pubDate).toISOString(),
          salary: null,
          contractType: category || 'Se opslag',
        });
      }
    }

    console.log(`Found ${jobs.length} jobs from RSS for "${keywords}"`);
    return jobs;
  } catch (error) {
    console.error('RSS parse error:', error);
    return [];
  }
}

// Parse RSS feed from IT-jobbank.dk
async function parseITJobBankRSS(keywords: string, location?: string) {
  try {
    const rssUrl = new URL('https://www.it-jobbank.dk/jobsoegning.rss');
    rssUrl.searchParams.set('q', keywords);

    // IT-jobbank doesn't need category filter (it's already IT-only)
    // But we can add location filter
    if (location && location.toLowerCase() !== 'danmark') {
      const locationMap: { [key: string]: string } = {
        'københavn': 'storkbh',
        'kobenhavn': 'storkbh',
        'kbh': 'storkbh',
        'storkøbenhavn': 'storkbh',
        'aarhus': '0751',
        'odense': '0461',
        'aalborg': '0851',
      };

      const areaCode = locationMap[location.toLowerCase()] || location;
      rssUrl.searchParams.set('area', areaCode);
    }

    console.log(`Fetching IT-jobbank RSS from: ${rssUrl.toString()}`);
    const response = await fetch(rssUrl.toString());
    const xmlText = await response.text();

    const jobs = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let id = 1;

    while ((match = itemRegex.exec(xmlText)) !== null && jobs.length < 25) {
      const itemXml = match[1];

      const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/)?.[1] || itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/)?.[2] || '';
      const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || '';
      const description = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/)?.[1] || itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/)?.[2] || '';
      const category = itemXml.match(/<category>(.*?)<\/category>/)?.[1] || '';
      const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || new Date().toISOString();

      const cleanDescription = description
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#x[0-9A-F]+;/g, '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 1500);

      const titleParts = title.split(',');
      const jobTitle = titleParts[0]?.trim() || title;
      const company = titleParts.length > 1 ? titleParts[titleParts.length - 1].trim() : 'Se opslag';

      // Try to extract location from description or title
      let jobLocation = 'Danmark';
      const locationPatterns = [
        /(?:København|Copenhagen|Storkøbenhavn|KBH)/i,
        /(?:Aarhus|Århus)/i,
        /(?:Odense)/i,
        /(?:Aalborg)/i,
      ];

      const fullText = (title + ' ' + cleanDescription).toLowerCase();
      for (const pattern of locationPatterns) {
        if (pattern.test(fullText)) {
          const match = fullText.match(pattern);
          if (match) {
            jobLocation = match[0];
            break;
          }
        }
      }

      if (title && link) {
        jobs.push({
          id: `itjobbank-${id++}`,
          title: jobTitle,
          company: company,
          location: jobLocation,
          description: cleanDescription || 'Klik for at se fuld jobbeskrivelse',
          url: link,
          postedDate: new Date(pubDate).toISOString(),
          salary: null,
          contractType: category || 'Se opslag',
        });
      }
    }

    console.log(`Found ${jobs.length} jobs from IT-jobbank for "${keywords}"`);
    return jobs;
  } catch (error: unknown) {
    console.error('IT-jobbank RSS parse error:', error);
    return [];
  }
}

// Generate mock jobs for demonstration (until we get proper scraping working)
function generateMockJobs(_keywords: string) {
  const mockJobs = [
    {
      id: 'mock-1',
      title: 'Software Udvikler - .NET/C#',
      company: 'TechDanmark A/S',
      location: 'København',
      description: `Vi søger en dygtig software udvikler med erfaring i .NET og C#. Du kommer til at arbejde med moderne cloud-baserede løsninger i Azure, og du får mulighed for at arbejde med spændende projekter i et agilt team. Vi forventer erfaring med C#, .NET Core, Azure, SQL, og gerne TypeScript. Vi tilbyder en spændende arbejdsplads med gode udviklingsmuligheder.`,
      url: 'https://www.jobindex.dk',
      postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      salary: '45000 - 55000 DKK',
      contractType: 'Fastansættelse'
    },
    {
      id: 'mock-2',
      title: 'Frontend Developer - React & TypeScript',
      company: 'Digital Solutions ApS',
      location: 'Aarhus',
      description: `Er du skarp til React og TypeScript? Vi søger en frontend developer til vores voksende team. Du kommer til at arbejde med moderne webudvikling, responsive design, og brugervenlige interfaces. Erfaring med React, TypeScript, HTML, CSS, og gerne Next.js er et must. Vi tilbyder flexibilitet, gode kolleger, og spændende projekter.`,
      url: 'https://www.jobindex.dk',
      postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      salary: '42000 - 52000 DKK',
      contractType: 'Fastansættelse'
    },
    {
      id: 'mock-3',
      title: 'Full Stack Udvikler - JavaScript/Node.js',
      company: 'Innovation Labs',
      location: 'Odense',
      description: `Vi mangler en full stack udvikler der kan arbejde med både frontend og backend. Du skal have erfaring med JavaScript, Node.js, React, og databaser som MongoDB eller SQL. Vi arbejder agilt med SCRUM, og du får mulighed for at påvirke teknologivalg og arkitektur. Godt arbejdsmiljø og udviklingsmuligheder.`,
      url: 'https://www.jobindex.dk',
      postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      salary: null,
      contractType: 'Fastansættelse'
    },
    {
      id: 'mock-4',
      title: 'DevOps Engineer - Kubernetes & Azure',
      company: 'CloudOps Denmark',
      location: 'København',
      description: `Søger erfaren DevOps engineer til at arbejde med cloud infrastructure, CI/CD pipelines, og containerization. Du skal have erfaring med Docker, Kubernetes, Azure DevOps, Terraform, og Infrastructure as Code. Vi tilbyder et teknisk udfordrende miljø hvor du kan arbejde med cutting-edge teknologier.`,
      url: 'https://www.jobindex.dk',
      postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      salary: '50000 - 65000 DKK',
      contractType: 'Fastansættelse'
    },
    {
      id: 'mock-5',
      title: 'Junior Softwareudvikler - C# .NET',
      company: 'StartUp Solutions',
      location: 'Aalborg',
      description: `Ny-uddannet eller junior udvikler søges til vores udviklingsteam. Du får mulighed for at lære fra erfarne udviklere og arbejde med C#, .NET, Azure, og SQL. Vi lægger vægt på læring og udvikling, og du får god onboarding og mentoring. Perfekt for dig der lige er færdiguddannet som IT-Teknolog eller Datamatiker.`,
      url: 'https://www.jobindex.dk',
      postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      salary: '38000 - 45000 DKK',
      contractType: 'Fastansættelse'
    }
  ];

  return mockJobs;
}

// Simple scraper for JobIndex.dk
async function scrapeJobIndex(_keywords: string) {
  try {
    const searchUrl = `https://www.jobindex.dk/jobsoegning?q=${encodeURIComponent(_keywords)}`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const html = await response.text();

    // Improved regex patterns for JobIndex.dk
    const jobs = [];

    // Find all job article blocks
    const articleRegex = /<article[^>]*class="[^"]*jix_robotjob[^"]*"[^>]*>([\s\S]*?)<\/article>/g;
    let articleMatch;
    let id = 1;

    while ((articleMatch = articleRegex.exec(html)) !== null && jobs.length < 20) {
      const articleHtml = articleMatch[1];

      // Extract job details with more flexible patterns
      const titleMatch = articleHtml.match(/<h4[^>]*>\s*<a[^>]*>(.*?)<\/a>\s*<\/h4>/s);
      const linkMatch = articleHtml.match(/<a[^>]*href="([^"]*)"[^>]*class="[^"]*jix_robotjob__link[^"]*"/);
      const companyMatch = articleHtml.match(/class="[^"]*jobsearch-jtitle-company-name[^"]*"[^>]*>([^<]*)</);
      const locationMatch = articleHtml.match(/class="[^"]*PaidJob-inner-job-label[^"]*"[^>]*>([^<]*)</);

      if (titleMatch && linkMatch) {
        const title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
        const url = linkMatch[1].startsWith('http') ? linkMatch[1] : `https://www.jobindex.dk${linkMatch[1]}`;

        jobs.push({
          id: `jobindex-${id++}`,
          title: title || 'IT Stilling',
          company: companyMatch ? companyMatch[1].trim() : 'Se opslag',
          location: locationMatch ? locationMatch[1].trim() : 'Danmark',
          description: `${title} - Klik for at se fuldt job opslag på JobIndex.dk`,
          url: url,
          postedDate: new Date().toISOString(),
          salary: null,
          contractType: 'Se opslag for detaljer',
        });
      }
    }

    console.log(`Found ${jobs.length} jobs for "${keywords}"`);
    return jobs;
  } catch (error) {
    console.error('JobIndex scrape error:', error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keywords, location } = body;

    if (!keywords) {
      return NextResponse.json(
        { error: 'Søgeord er påkrævet' },
        { status: 400 }
      );
    }

    // Fetch from multiple sources in parallel
    const [jobIndexJobs, itJobBankJobs] = await Promise.all([
      parseJobIndexRSS(keywords, location).catch(() => []),
      parseITJobBankRSS(keywords, location).catch(() => []),
    ]);

    // Merge jobs from both sources
    let jobs = [...jobIndexJobs, ...itJobBankJobs];

    // Remove duplicates based on URL
    const uniqueJobs = jobs.filter((job, index, self) =>
      index === self.findIndex(j => j.url === job.url)
    );

    // Post-filter by location (RSS area parameter doesn't always work perfectly)
    let filteredJobs = uniqueJobs;

    if (location && location.toLowerCase() !== 'danmark') {
      const locationLower = location.toLowerCase();
      const isKbh = ['københavn', 'kobenhavn', 'kbh', 'storkøbenhavn', 'copenhagen'].includes(locationLower);

      if (isKbh) {
        // For København, use a comprehensive list of Copenhagen area municipalities
        const kbhAreas = [
          'københavn', 'copenhagen', 'kbh', 'storkøbenhavn',
          'frederiksberg', 'gentofte', 'gladsaxe', 'herlev', 'rødovre',
          'glostrup', 'brøndby', 'hvidovre', 'vallensbæk', 'ishøj',
          'tårnby', 'dragør', 'albertslund', 'ballerup', 'høje-taastrup',
          'lyngby', 'rudersdal', 'furesø', 'helsingør', 'fredensborg',
          'hillerød', 'hørsholm', 'allerød', 'egedal', 'frederikssund',
          'solrød', 'greve', 'køge', 'roskilde', 'lejre'
        ];

        // Exclude specific Jylland/Fyn areas
        const excludeAreas = [
          'aarhus', 'aalborg', 'odense', 'esbjerg', 'randers', 'kolding',
          'horsens', 'vejle', 'silkeborg', 'herning', 'fredericia', 'viborg',
          'hjørring', 'holstebro', 'thisted', 'svendborg', 'næstved',
          'frederikshavn', 'middelfart', 'sønderborg', 'jylland', 'fyn'
        ];

        filteredJobs = uniqueJobs.filter(job => {
          const fullText = (job.title + ' ' + job.description + ' ' + job.location).toLowerCase();

          // Exclude if it explicitly mentions Jylland/Fyn areas
          const hasExcludedArea = excludeAreas.some(area => fullText.includes(area));
          if (hasExcludedArea) return false;

          // Include if it mentions København area
          const hasKbhArea = kbhAreas.some(area => fullText.includes(area));
          return hasKbhArea;
        });

        console.log(`Filtered to ${filteredJobs.length} København jobs (from ${uniqueJobs.length} total)`);
      }
    }

    console.log(`Total jobs: ${filteredJobs.length} (JobIndex: ${jobIndexJobs.length}, IT-jobbank: ${itJobBankJobs.length})`);

    // Fallback to mock data if all sources fail
    if (filteredJobs.length === 0) {
      console.log('All RSS feeds failed or no jobs match location, using mock data for demonstration');
      jobs = generateMockJobs(keywords);
    } else {
      jobs = filteredJobs;
    }

    // Auto-analyze all jobs for match scores
    const resumeData = getResumeData();
    const analyzedJobs = jobs.map(job => {
      const keywords = quickExtractKeywords(job.title + ' ' + job.description);
      const matchScore = calculateMatchScore(keywords, resumeData);
      console.log(`Job: "${job.title}" - Found ${keywords.technical.length} keywords: [${keywords.technical.slice(0, 5).join(', ')}${keywords.technical.length > 5 ? '...' : ''}] - Match: ${matchScore}%`);
      return { ...job, matchScore };
    });

    // Sort by match score (highest first)
    analyzedJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    console.log(`Auto-analyzed ${analyzedJobs.length} jobs with match scores`);

    return NextResponse.json({
      jobs: analyzedJobs,
      totalCount: analyzedJobs.length,
      page: 1,
    });
  } catch (error) {
    console.error('Fetch jobs error:', error);
    return NextResponse.json(
      { error: 'Kunne ikke hente jobs' },
      { status: 500 }
    );
  }
}
