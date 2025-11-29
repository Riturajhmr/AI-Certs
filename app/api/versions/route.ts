/**
 * API Route: GET /api/versions
 * Retrieves all version history entries
 */

import { NextResponse } from 'next/server';
import { readVersions } from '@/lib/storage';

// Configure runtime for Vercel
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const versions = readVersions();
    
    // Return versions in reverse chronological order (newest first)
    const sortedVersions = [...versions].reverse();
    
    return NextResponse.json({
      success: true,
      versions: sortedVersions,
      count: sortedVersions.length,
    });
  } catch (error) {
    console.error('Error fetching versions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

