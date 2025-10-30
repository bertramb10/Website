import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Get all profiles
export async function GET() {
  try {
    const profilesPath = path.join(process.cwd(), 'data', 'job-profiles.json');
    const data = JSON.parse(fs.readFileSync(profilesPath, 'utf-8'));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to load profiles:', error);
    return NextResponse.json(
      { error: 'Failed to load profiles' },
      { status: 500 }
    );
  }
}

// Update active profile or profile keywords
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const profilesPath = path.join(process.cwd(), 'data', 'job-profiles.json');

    // Load current profiles
    const data = JSON.parse(fs.readFileSync(profilesPath, 'utf-8'));

    // Update active profile if specified
    if (body.activeProfile) {
      data.activeProfile = body.activeProfile;
    }

    // Update custom profile keywords if specified
    if (body.customKeywords) {
      const customProfile = data.profiles.find((p: { id: string }) => p.id === 'custom');
      if (customProfile) {
        customProfile.keywords = body.customKeywords;
      }
    }

    // Save back
    fs.writeFileSync(profilesPath, JSON.stringify(data, null, 2), 'utf-8');

    // Also update jobs-database.json with active profile keywords
    const dbPath = path.join(process.cwd(), 'data', 'jobs-database.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    const activeProfile = data.profiles.find((p: { id: string }) => p.id === data.activeProfile);
    if (activeProfile) {
      dbData.searchKeywords = activeProfile.keywords;
      dbData.matchThreshold = activeProfile.matchThreshold;
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
