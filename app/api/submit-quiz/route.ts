import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'quiz-results.json');

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function getExistingResults() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    await ensureDataDir();
    const results = await getExistingResults();

    // Add new result
    results.push({
      name: body.name,
      rollNo: body.rollNo,
      score: body.score,
      percentage: body.percentage,
      submittedAt: body.submittedAt,
    });

    await fs.writeFile(DATA_FILE, JSON.stringify(results, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return NextResponse.json({ error: 'Failed to save result' }, { status: 500 });
  }
}
