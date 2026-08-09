import { NextResponse } from 'next/server';
import { getAllQuizResults, initializeDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initializeDatabase();
    const results = await getAllQuizResults();
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}
