import * as nodemailer from 'nodemailer';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  matchScore?: number;
}

// Create email transporter
// NOTE: You need to set up environment variables for this to work
export function createEmailTransporter() {
  // Detect email provider from EMAIL_USER
  const emailUser = process.env.EMAIL_USER || '';
  let service = 'gmail'; // default

  if (emailUser.includes('yahoo')) {
    service = 'yahoo';
  } else if (emailUser.includes('outlook') || emailUser.includes('hotmail')) {
    service = 'hotmail';
  }

  // For Yahoo, we need to use SMTP settings explicitly
  if (service === 'yahoo') {
    return nodemailer.createTransport({
      host: 'smtp.mail.yahoo.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // For other services
  return nodemailer.createTransport({
    service: service,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

// Send email notification for high-match jobs
export async function sendJobNotification(
  recipientEmail: string,
  jobs: Job[]
): Promise<boolean> {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('Email credentials not configured. Skipping email notification.');
      console.log('To enable email notifications, add these to your .env.local file:');
      console.log('EMAIL_USER=your-email@gmail.com');
      console.log('EMAIL_PASSWORD=your-app-password');
      return false;
    }

    const transporter = createEmailTransporter();

    // Generate HTML email body
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 {
              color: #2563eb;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 10px;
            }
            .job-card {
              background: #f8fafc;
              border-left: 4px solid #2563eb;
              padding: 15px;
              margin: 15px 0;
              border-radius: 4px;
            }
            .job-title {
              font-size: 18px;
              font-weight: bold;
              color: #1e293b;
              margin: 0 0 5px 0;
            }
            .job-company {
              color: #64748b;
              margin: 0 0 10px 0;
            }
            .match-score {
              display: inline-block;
              background: #10b981;
              color: white;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 14px;
              font-weight: bold;
            }
            .job-link {
              display: inline-block;
              margin-top: 10px;
              padding: 8px 16px;
              background: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 4px;
            }
            .job-link:hover {
              background: #1d4ed8;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              font-size: 14px;
              color: #64748b;
            }
          </style>
        </head>
        <body>
          <h1>🎯 ${jobs.length} New High-Match Job${jobs.length > 1 ? 's' : ''} Found!</h1>

          <p>Din automatiske job søgning har fundet nye stillinger med høj kompatibilitet:</p>

          ${jobs.map(job => `
            <div class="job-card">
              <h2 class="job-title">${job.title}</h2>
              <p class="job-company">📍 ${job.company} • ${job.location}</p>
              <span class="match-score">${job.matchScore}% Match</span>
              <p>${job.description.substring(0, 200)}...</p>
              <a href="${job.url}" class="job-link" target="_blank">Se Jobopslag →</a>
            </div>
          `).join('')}

          <div class="footer">
            <p>
              Denne email blev sendt automatisk af dit Job Application System.<br>
              Du modtager kun emails for jobs med >${process.env.MATCH_THRESHOLD || 80}% match.
            </p>
          </div>
        </body>
      </html>
    `;

    // Plain text version for email clients that don't support HTML
    const textBody = `
${jobs.length} New High-Match Jobs Found!

Din automatiske job søgning har fundet nye stillinger med høj kompatibilitet:

${jobs.map(job => `
${job.title}
${job.company} • ${job.location}
Match: ${job.matchScore}%
${job.url}
`).join('\n---\n')}

Denne email blev sendt automatisk af dit Job Application System.
    `.trim();

    // Send email
    await transporter.sendMail({
      from: `"Job Alert System" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `🎯 ${jobs.length} New High-Match Job${jobs.length > 1 ? 's' : ''} Found!`,
      text: textBody,
      html: htmlBody,
    });

    console.log(`✅ Email notification sent to ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
}
