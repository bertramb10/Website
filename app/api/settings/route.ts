import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Settings {
  notificationEmail: string;
  matchThreshold: number;
  searchKeywords: string[];
}

// Get settings
export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'jobs-database.json');
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    return NextResponse.json({
      notificationEmail: data.notificationEmail,
      matchThreshold: data.matchThreshold,
      searchKeywords: data.searchKeywords,
    });
  } catch (error) {
    console.error('Failed to load settings:', error);
    return NextResponse.json(
      { error: 'Failed to load settings' },
      { status: 500 }
    );
  }
}

// Save settings
export async function POST(request: NextRequest) {
  try {
    const body: Settings = await request.json();
    const dbPath = path.join(process.cwd(), 'data', 'jobs-database.json');

    // Load current database
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    // Update settings
    data.notificationEmail = body.notificationEmail;
    data.matchThreshold = body.matchThreshold;
    data.searchKeywords = body.searchKeywords;

    // Save back
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
    });
  } catch (error) {
    console.error('Failed to save settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
