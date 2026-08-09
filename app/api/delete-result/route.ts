import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'quiz-results.json');

async function getExistingResults() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rollNo } = body;

    if (!rollNo) {
      return NextResponse.json({ error: 'rollNo is required' }, { status: 400 });
    }

    const results = await getExistingResults();
    const filteredResults = results.filter((r: any) => r.rollNo !== rollNo);

    await fs.writeFile(DATA_FILE, JSON.stringify(filteredResults, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quiz result:', error);
    return NextResponse.json({ error: 'Failed to delete result' }, { status: 500 });
  }
}
