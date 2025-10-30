import { NextResponse } from 'next/server';
import cron from 'node-cron';

let cronJobStarted = false;
let cronTask: cron.ScheduledTask | null = null;

// Start cron job
export async function POST() {
  try {
    if (cronJobStarted && cronTask) {
      return NextResponse.json({
        message: 'Cron job already running',
        status: 'active',
      });
    }

    // Schedule job to run every 6 hours
    // Cron format: minute hour day month day-of-week
    // "0 */6 * * *" = every 6 hours at minute 0
    cronTask = cron.schedule('0 */6 * * *', async () => {
      console.log('\n⏰ [CRON] Running scheduled job check...');
      console.log(`Time: ${new Date().toISOString()}`);

      try {
        // Call the auto-check-jobs API
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/auto-check-jobs`, {
          method: 'GET',
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ [CRON] Auto-check completed successfully');
          console.log(`New jobs: ${result.newJobs}`);
          console.log(`High-match jobs: ${result.highMatchJobs}`);
        } else {
          console.error('❌ [CRON] Auto-check failed:', response.statusText);
        }
      } catch (error) {
        console.error('❌ [CRON] Error during scheduled check:', error);
      }
    });

    cronTask.start();
    cronJobStarted = true;

    console.log('✅ Cron job started - will run every 6 hours');

    return NextResponse.json({
      message: 'Cron job started successfully',
      schedule: 'Every 6 hours',
      nextRun: 'Within 6 hours',
      status: 'active',
    });
  } catch (error) {
    console.error('Failed to start cron job:', error);
    return NextResponse.json(
      { error: 'Failed to start cron job', details: String(error) },
      { status: 500 }
    );
  }
}

// Get cron status
export async function GET() {
  return NextResponse.json({
    status: cronJobStarted ? 'active' : 'inactive',
    schedule: 'Every 6 hours',
  });
}
