import { NextRequest, NextResponse } from 'next/server';
import { saveQuizResult, initializeDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const body = await request.json();

    await saveQuizResult({
      name: body.name,
      rollNo: body.rollNo,
      score: body.score,
      percentage: body.percentage,
      submittedAt: body.submittedAt,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return NextResponse.json({ error: 'Failed to save result' }, { status: 500 });
  }
}
