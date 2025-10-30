import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Load resume data
function getResumeData() {
  const resumePath = path.join(process.cwd(), 'data', 'resume.json');
  const resumeData = JSON.parse(fs.readFileSync(resumePath, 'utf-8'));
  return resumeData;
}

// Extract keywords from job text
function extractKeywords(text: string) {
  const technicalSkills = [
    // Programming Languages
    'javascript', 'typescript', 'python', 'java', 'c#', 'c\\+\\+', 'go', 'rust', 'php', 'kotlin', 'swift', 'powershell',

    // Frontend Frameworks & Libraries
    'react', 'angular', 'vue', 'vue\\.js', 'next\\.js', 'nuxt', 'nuxt\\.js', 'svelte',
    'html', 'css', 'tailwind', 'bootstrap', 'sass', 'scss',
    'reactjs', 'angularjs',

    // Design Tools
    'figma', 'sketch', 'adobe xd', 'invision', 'zeplin', 'framer',

    // UX/UI Design
    'ux', 'ui', 'ux/ui', 'user experience', 'user interface', 'wireframe', 'wireframes', 'prototype', 'prototyping',
    'interaction design', 'visual design', 'design system', 'design systems', 'design guideline', 'design guidelines',
    'user research', 'usability testing', 'user testing', 'a/b testing', 'a/b.?test', 'user flow', 'user flows',
    'user journey', 'customer journey', 'information architecture', 'responsive design', 'mobile.?first',
    'accessibility', 'wcag', 'flows', 'interaktioner', 'interactions', 'design trends', 'best practices',
    'brand.?oplevelse', 'brugeroplevelse', 'brugercentreret', 'pixel.?perfect', 'high.?fidelity',
    'low.?fidelity', 'mockup', 'mockups', 'design.?thinking', 'user.?centric', 'customer.?centric',

    // Backend & Frameworks
    'node\\.js', 'express', 'django', 'flask', 'spring', '\\.net', '\\.net core', 'net core', 'asp\\.net', 'jakarta ee', 'j2ee',

    // Databases & Search
    'sql', 't-sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'solr', 'opensearch',
    'microsoft sql server', 'mssql', 'sql server', 'oracle',
    'database architecture', 'database modeling', 'data modeling', 'data quality',

    // Testing
    'cypress', 'unit test', 'integration test', 'system test', 'quality assurance', 'qa',

    // DevOps & Infrastructure
    'docker', 'kubernetes', 'k8s', 'linux', 'windows', 'container', 'containerization',
    'infrastructure as code', 'iac', 'terraform', 'ansible',
    'ci/cd', 'gitops', 'pipelines', 'github actions', 'gitlab ci',
    'monitoring', 'high availability', 'scalability', 'devops',

    // Cloud & Tools
    'aws', 's3', 'cloudfront', 'azure', 'gcp', 'cloud', 'saas', 'paas',
    'git', 'github', 'gitlab', 'bitbucket', 'jenkins', 'azure devops', 'octopus',
    'over.?the.?air', 'ota',

    // Methodologies & Practices
    'agile', 'scrum', 'kanban', 'lean', 'design thinking', 'user.?centered', 'user.?centric',
    'test.?driven', 'tdd', 'continuous integration', 'continuous deployment',
    'automated tests', 'automation', 'prompting', 'full.?stack', 'full stack',

    // APIs & Architecture
    'rest api', 'graphql', 'microservices', 'api', 'restful', 'api integration',
    'distribuerede systemer', 'distributed systems', 'enterprise architecture',
    'edi', 'peppol', 'nemhandel',
    'togaf', 'migration', 'rehost', 'replatform', 'refactor',

    // Security & Data
    'cybersecurity', 'cyber security', 'sikkerhed', 'security', 'security-by-design', 'adgangsstyring', 'authentication',
    'machine learning', 'ml', 'ai', 'sprogmodeller',
    'etl', 'data integration', 'data.?centric',

    // CMS & Platforms
    'open source', 'wordpress', 'contentful', 'sanity', 'strapi', 'headless cms',
    'umbraco', 'sitecore', 'salesforce', 'sharepoint', 'dynamics crm', 'business central', 'erp',

    // Other Technologies
    'mainframe', 'batch jobs', 'business process automation', 'web components',
  ];

  const softSkills = [
    // General soft skills
    'communication', 'teamwork', 'problem.?solving', 'leadership', 'analytical',
    'creative', 'adaptable', 'detail.?oriented', 'self.?motivated', 'collaborative',
    'time.?management', 'critical.?thinking', 'independent', 'proactive',
    'engagement', 'dedication', 'drive', 'structured', 'pixel.?perfect',
    'empathy', 'curiosity', 'stakeholder management', 'feedback', 'coaching',
    'quality.?conscious', 'pride', 'humor', 'self.?directed',
    // Danish soft skills
    'metodisk', 'detailorienteret', 'nysgerrig', 'initiativrig', 'analytisk',
    'selvstændig', 'samarbejde', 'faglig sparring', 'videndeling',
    'fleksibel', 'uformel', 'proaktiv', 'ambitiøs', 'kvalitetsbevidst',
    'ansvarsfuld', 'selvkørende', 'struktureret', 'logisk',
  ];

  const lowerText = text.toLowerCase();

  // Find skills from predefined list
  const foundTechnical = technicalSkills
    .filter(skill => new RegExp(`\\b${skill}\\b`, 'i').test(lowerText))
    .map(skill => skill.replace(/\\\\/g, '').replace(/\\.\\?/g, '-').replace(/\\\./g, '.'));

  const foundSoft = softSkills
    .filter(skill => new RegExp(`\\b${skill}\\b`, 'i').test(lowerText))
    .map(skill => skill.replace(/\\.\\?/g, '-'));

  // SMART EXTRACTION: Find skills mentioned after common patterns
  const patternPhrases = [
    /(?:erfaring med|experience with|knowledge of|skilled in|proficient in|expertise in)\s+([A-Za-z][A-Za-z0-9\s.\/+-]{2,30}?)(?:[,.\n]|$)/gi,
    /(?:du er|du har|you are|you have)\s+(?:en\s+)?(?:dygtig|god til|skilled|proficient)\s+(?:til\s+)?([A-Za-z][A-Za-z0-9\s.\/+-]{2,30}?)(?:[,.\n]|$)/gi,
    /(?:viden om|kendskab til|knowledge of)\s+([A-Za-z][A-Za-z0-9\s.\/+-]{2,30}?)(?:[,.\n]|$)/gi,
    /(?:arbejder med|works with|using|ved brug af)\s+([A-Za-z][A-Za-z0-9\s.\/+-]{2,30}?)(?:[,.\n]|$)/gi,
  ];

  const smartExtracted: string[] = [];
  for (const pattern of patternPhrases) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const skill = match[1].trim();
      // Filter out common words and keep likely tech terms
      if (skill.length > 2 && !['the', 'and', 'with', 'for', 'that', 'this', 'from'].includes(skill.toLowerCase())) {
        smartExtracted.push(skill);
      }
    }
  }

  // Skip capitalized word extraction - too much noise
  // Instead, rely only on predefined list + smart pattern extraction

  const allTechnical = [...new Set([...foundTechnical, ...smartExtracted])];
  const allSoft = [...new Set(foundSoft)];

  return {
    technical: allTechnical.slice(0, 25), // Limit to top 25
    soft: allSoft,
  };
}

// Extract requirements
function extractRequirements(text: string): string[] {
  const requirements: string[] = [];
  const lines = text.split('\n');

  // Look for bullet points or numbered lists
  const bulletPatterns = [
    /^[\s]*[-•*]\s+(.+)$/,
    /^[\s]*\d+[\.)]\s+(.+)$/,
  ];

  for (const line of lines) {
    for (const pattern of bulletPatterns) {
      const match = line.match(pattern);
      if (match && match[1]) {
        const requirement = match[1].trim();
        // Filter out very short or generic items
        if (requirement.length > 15 && !requirement.toLowerCase().startsWith('learn')) {
          requirements.push(requirement);
        }
      }
    }
  }

  // Look for key requirement phrases in Danish and English
  const requirementPhrases = [
    // Danish - more specific patterns
    /(?:erfaring med|erfaring inden for|erfaring i)[\s:]+(.{10,80}?)(?:[,.\n]|$)/gi,
    /(?:du har|du skal)[\s:]+(.{10,80}?)(?:[,.\n]|$)/gi,
    /(?:minimum|mindst)[\s]+(\d+[\s]+(?:år|years?))[\s]+(.{10,80}?)(?:[,.\n]|$)/gi,
    /(?:kendskab til|viden om)[\s:]+(.{10,80}?)(?:[,.\n]|$)/gi,
    // English - more specific patterns
    /(?:experience (?:with|in))[\s:]+(.{10,80}?)(?:[,.\n]|$)/gi,
    /(?:knowledge of)[\s:]+(.{10,80}?)(?:[,.\n]|$)/gi,
    /(?:you have|you must have)[\s:]+(.{10,80}?)(?:[,.\n]|$)/gi,
    /(?:minimum|at least)[\s]+(\d+[\s]+(?:år|years?))[\s]+(?:of[\s]+)?(.{10,80}?)(?:[,.\n]|$)/gi,
  ];

  for (const pattern of requirementPhrases) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const requirement = (match[1] || match[2] || '').trim();
      if (requirement.length > 15) {
        requirements.push(requirement);
      }
    }
  }

  // Deduplicate and clean up
  const uniqueRequirements = [...new Set(requirements)]
    .map(req => {
      // Clean up formatting
      return req
        .replace(/[\r\n]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    })
    .filter(req => req.length > 15 && req.length < 300);

  return uniqueRequirements.slice(0, 12); // Top 12 requirements
}

interface Keywords {
  technical: string[];
  soft: string[];
}

interface ResumeData {
  skills: {
    languages: string[];
    frontend: string[];
    backend: string[];
    tools: string[];
    other?: string[];
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

  if (keywords.technical.length === 0) return 50; // Default if no technical skills found

  const score = (matchedSkills.length / keywords.technical.length) * 100;
  return Math.round(score);
}

// Generate cover letter
function generateCoverLetter(jobText: string, keywords: Keywords, resumeData: ResumeData & { personalInfo: { name: string }; summary: string; experience: unknown[]; education: unknown[] }): string {
  const { personalInfo, summary, experience, education, skills } = resumeData;

  // Extract company name (improved detection for Danish and English)
  let companyName = 'your company';
  const companyPatterns = [
    /(?:hos|at)\s+([A-Z][a-zA-Z0-9\s&.]+?)(?:\.|,|\s+(?:er|is|søger|seeks))/i,
    /([A-Z][a-zA-Z0-9\s&.]+?)\s+(?:søger|is looking for|is seeking)/i,
    /position\s+(?:at|hos)\s+([A-Z][a-zA-Z0-9\s&.]+)/i,
  ];

  for (const pattern of companyPatterns) {
    const match = jobText.match(pattern);
    if (match && match[1]) {
      companyName = match[1].trim();
      break;
    }
  }

  // Get all resume skills in lowercase for matching
  const allResumeSkills = [
    ...skills.languages,
    ...skills.frontend,
    ...skills.backend,
    ...skills.tools,
    ...(skills.other || [])
  ].map((s: string) => s.toLowerCase());

  // Match job keywords with YOUR actual skills
  const matchedSkills = keywords.technical
    .filter((skill: string) => {
      const skillLower = skill.toLowerCase();
      return allResumeSkills.some((rs: string) =>
        rs.includes(skillLower) ||
        skillLower.includes(rs) ||
        rs === skillLower
      );
    })
    .slice(0, 6);

  // Skills from job posting that you DON'T have (to mention willingness to learn)
  const newSkills = keywords.technical
    .filter((skill: string) => {
      const skillLower = skill.toLowerCase();
      return !allResumeSkills.some((rs: string) =>
        rs.includes(skillLower) || skillLower.includes(rs)
      );
    })
    .slice(0, 3);

  // Get most relevant experience
  const latestExperience = experience.length > 0 ? experience[0] : null;

  // Get relevant achievements from experience
  const relevantAchievements = latestExperience
    ? latestExperience.achievements.slice(0, 2)
    : [];

  // Build the cover letter with ACTUAL resume data
  const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the position at ${companyName}. ${summary}

${latestExperience ? `During my recent role as ${latestExperience.position} at ${latestExperience.company}, I gained valuable hands-on experience with ${latestExperience.responsibilities.slice(0, 2).join(' and ').toLowerCase()}. ${relevantAchievements[0] || ''}` : 'Through my studies and projects, I have developed strong practical skills in software development.'}

I noticed that this position emphasizes ${keywords.technical.slice(0, 3).join(', ')}${matchedSkills.length > 0 ? `. I have direct experience working with ${matchedSkills.join(', ')}, which I have applied in real-world projects` : ''}. My technical foundation includes proficiency in ${[...skills.languages.slice(0, 3), ...skills.frontend.slice(0, 2)].join(', ')}, and I continuously expand my knowledge to stay current with industry best practices.

${newSkills.length > 0 ? `I am particularly excited about the opportunity to deepen my expertise in ${newSkills.join(', ')}, and I am committed to quickly mastering any technologies that are new to me.` : ''}

My education from ${education[0].institution}, where I completed ${education[0].degree}, combined with my professional experience, has equipped me with a solid foundation in software development principles. ${latestExperience && relevantAchievements[1] ? relevantAchievements[1] : 'I thrive in collaborative environments and take pride in delivering high-quality, maintainable code.'}

${keywords.soft.length > 0 ? `I believe my ${keywords.soft.slice(0, 3).join(', ')} approach aligns well with your team's values and work culture.` : ''}

I am confident that my technical skills, proven ability to learn quickly, and dedication to excellence would make me a valuable addition to your team. I would welcome the opportunity to discuss how my background aligns with your needs.

Thank you for considering my application. I look forward to the possibility of speaking with you further.

Best regards,
${personalInfo.name}
${personalInfo.email}
${personalInfo.phone}`;

  return coverLetter;
}

// Fetch job posting from URL (basic implementation)
async function fetchJobPosting(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const html = await response.text();

    // Basic HTML to text conversion (strip tags)
    const text = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return text;
  } catch {
    throw new Error('Failed to fetch job posting from URL');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, url, text } = body;

    let jobText = '';

    // Get job text from URL or direct input
    if (mode === 'url' && url) {
      jobText = await fetchJobPosting(url);
    } else if (mode === 'text' && text) {
      jobText = text;
    } else {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    // Load resume
    const resumeData = getResumeData();

    // Extract keywords and requirements
    const keywords = extractKeywords(jobText);
    const requirements = extractRequirements(jobText);

    // Calculate match score
    const matchScore = calculateMatchScore(keywords, resumeData);

    // Generate cover letter
    const coverLetter = generateCoverLetter(jobText, keywords, resumeData);

    return NextResponse.json({
      keywords,
      requirements,
      matchScore,
      coverLetter,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze job posting' },
      { status: 500 }
    );
  }
}
