import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sendJobNotification } from '@/lib/email';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  postedDate: string;
  salary: string | null;
  contractType: string;
  matchScore?: number;
  foundAt?: string; // When we discovered this job
  notified?: boolean; // Whether we've sent notification
}

interface JobDatabase {
  jobs: Job[];
  lastChecked: string | null;
  searchKeywords: string[];
  notificationEmail: string;
  matchThreshold: number;
}

// Load jobs database
function loadDatabase(): JobDatabase {
  const dbPath = path.join(process.cwd(), 'data', 'jobs-database.json');
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load database:', error);
    return {
      jobs: [],
      lastChecked: null,
      searchKeywords: ['c#', 'python', 'javascript', 'typescript', 'react', 'sql'],
      notificationEmail: 'your-email@example.com',
      matchThreshold: 80,
    };
  }
}

// Save jobs database
function saveDatabase(db: JobDatabase) {
  const dbPath = path.join(process.cwd(), 'data', 'jobs-database.json');
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
    console.log('Database saved successfully');
  } catch (error) {
    console.error('Failed to save database:', error);
  }
}

// Check if job already exists in database
function jobExists(db: JobDatabase, jobUrl: string): boolean {
  return db.jobs.some(job => job.url === jobUrl);
}

// Send email notification wrapper
async function notifyHighMatchJobs(email: string, jobs: Job[]) {
  console.log(`\n=== SENDING EMAIL NOTIFICATION ===`);
  console.log(`To: ${email}`);
  console.log(`Subject: ${jobs.length} New High-Match Jobs Found!`);
  console.log(`\nJobs:`);
  jobs.forEach(job => {
    console.log(`- ${job.title} at ${job.company} (${job.matchScore}% match)`);
    console.log(`  ${job.url}`);
  });

  // Send actual email
  const emailSent = await sendJobNotification(email, jobs);

  if (emailSent) {
    console.log(`✅ Email successfully sent!`);
  } else {
    console.log(`⚠️ Email not sent (check email configuration)`);
  }
  console.log(`=================================\n`);
}

// Main auto-check handler
export async function GET(request: NextRequest) {
  try {
    console.log('\n🔍 Auto-checking for new jobs...');

    const db = loadDatabase();
    const searchKeywords = db.searchKeywords;
    const location = 'københavn';

    // Fetch jobs for each keyword
    let allNewJobs: Job[] = [];

    for (const keyword of searchKeywords) {
      console.log(`Searching for: "${keyword}"`);

      // Call our existing fetch-jobs API
      // Use relative URL to work regardless of port
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/fetch-jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: keyword, location }),
      });

      if (response.ok) {
        const data = await response.json();
        const jobs = data.jobs || [];

        // Filter for new jobs only
        const newJobs = jobs.filter((job: Job) => !jobExists(db, job.url));

        console.log(`Found ${jobs.length} jobs, ${newJobs.length} are new`);

        // Add metadata
        newJobs.forEach((job: Job) => {
          job.foundAt = new Date().toISOString();
          job.notified = false;
        });

        allNewJobs.push(...newJobs);
      }
    }

    // Remove duplicates from allNewJobs
    const uniqueNewJobs = allNewJobs.filter((job, index, self) =>
      index === self.findIndex(j => j.url === job.url)
    );

    console.log(`\nTotal new unique jobs: ${uniqueNewJobs.length}`);

    // Filter high-match jobs for notification
    const highMatchJobs = uniqueNewJobs.filter(
      job => (job.matchScore || 0) >= db.matchThreshold
    );

    console.log(`High-match jobs (>=${db.matchThreshold}%): ${highMatchJobs.length}`);

    // Send notification if we have high-match jobs
    if (highMatchJobs.length > 0) {
      await notifyHighMatchJobs(db.notificationEmail, highMatchJobs);

      // Mark as notified
      highMatchJobs.forEach(job => {
        job.notified = true;
      });
    }

    // Add new jobs to database
    db.jobs.push(...uniqueNewJobs);
    db.lastChecked = new Date().toISOString();

    // Keep only last 500 jobs to prevent database from growing too large
    if (db.jobs.length > 500) {
      db.jobs = db.jobs.slice(-500);
    }

    saveDatabase(db);

    return NextResponse.json({
      success: true,
      newJobs: uniqueNewJobs.length,
      highMatchJobs: highMatchJobs.length,
      totalJobsInDatabase: db.jobs.length,
      lastChecked: db.lastChecked,
    });
  } catch (error) {
    console.error('Auto-check error:', error);
    return NextResponse.json(
      { error: 'Failed to auto-check jobs', details: String(error) },
      { status: 500 }
    );
  }
}
