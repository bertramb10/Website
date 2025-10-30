import { NextRequest, NextResponse } from 'next/server';
import { sendJobNotification } from '@/lib/email';

// Test email endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email address required' },
        { status: 400 }
      );
    }

    // Create a test job
    const testJobs = [
      {
        id: 'test-1',
        title: 'Senior Software Udvikler - Test Job',
        company: 'Test Company A/S',
        location: 'København',
        description: 'Dette er en test email for at verificere at email systemet virker korrekt. Du vil modtage denne type email når der findes nye jobs med høj match score. Jobbet beskrivelsen vil normalt være længere og indeholde flere detaljer om stillingen, krav, og virksomheden.',
        url: 'https://www.jobindex.dk',
        matchScore: 85,
      },
      {
        id: 'test-2',
        title: 'Full Stack Developer - .NET & React',
        company: 'Digital Solutions ApS',
        location: 'København',
        description: 'Endnu en test job for at vise hvordan flere jobs vises i emailen. Dette giver dig en god idé om hvordan notifikationerne vil se ud når systemet finder rigtige jobs.',
        url: 'https://www.it-jobbank.dk',
        matchScore: 92,
      },
    ];

    console.log(`\n📧 Sending test email to: ${email}`);

    const success = await sendJobNotification(email, testJobs);

    if (success) {
      return NextResponse.json({
        success: true,
        message: `Test email sent successfully to ${email}! Check your inbox (and spam folder).`,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to send email. Check console logs for details.',
      });
    }
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: 'Failed to send test email', details: String(error) },
      { status: 500 }
    );
  }
}
