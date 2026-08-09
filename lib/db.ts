import { sql } from '@vercel/postgres';

// Validate database connection - try multiple env var names
function validateDatabaseConnection() {
  // Try POSTGRES_URL first (Vercel standard), then DATABASE_URL (Neon direct)
  const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  if (!postgresUrl) {
    console.error('❌ Database connection URL not set!');
    console.error('Missing: POSTGRES_URL or DATABASE_URL');
    console.error('Available environment variables:',
      Object.keys(process.env)
        .filter(k => k.includes('DATABASE') || k.includes('POSTGRES') || k.includes('NEON'))
        .map(k => `${k}=***`)
        .join(', ')
    );
    throw new Error('Database configuration missing. Set POSTGRES_URL or DATABASE_URL.');
  }

  const source = process.env.POSTGRES_URL ? 'POSTGRES_URL' : 'DATABASE_URL';
  console.log(`✓ Database connected via ${source}`);
  return postgresUrl;
}

export async function initializeDatabase() {
  try {
    validateDatabaseConnection();

    await sql`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        roll_no VARCHAR(50) NOT NULL UNIQUE,
        score INTEGER NOT NULL,
        percentage INTEGER NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ Database table initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

export interface QuizResult {
  id?: number;
  name: string;
  rollNo: string;
  score: number;
  percentage: number;
  submittedAt?: string;
}

export async function saveQuizResult(result: QuizResult) {
  try {
    validateDatabaseConnection();

    const { name, rollNo, score, percentage } = result;
    console.log(`Saving quiz result: ${name} (${rollNo}) - ${score}/${percentage}%`);

    await sql`
      INSERT INTO quiz_results (name, roll_no, score, percentage)
      VALUES (${name}, ${rollNo}, ${score}, ${percentage})
      ON CONFLICT (roll_no) DO UPDATE SET
        name = ${name},
        score = ${score},
        percentage = ${percentage},
        submitted_at = CURRENT_TIMESTAMP
    `;

    console.log(`✓ Quiz result saved: ${rollNo}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error saving quiz result:', error);
    throw error;
  }
}

export async function getAllQuizResults(): Promise<QuizResult[]> {
  try {
    validateDatabaseConnection();

    console.log('Fetching all quiz results...');
    const result = await sql`
      SELECT id, name, roll_no as "rollNo", score, percentage, submitted_at as "submittedAt"
      FROM quiz_results
      ORDER BY submitted_at DESC
    `;

    console.log(`✓ Fetched ${result.rows.length} quiz results`);
    return result.rows as QuizResult[];
  } catch (error) {
    console.error('❌ Error fetching quiz results:', error);
    throw error;
  }
}

export async function deleteQuizResult(rollNo: string) {
  try {
    await sql`
      DELETE FROM quiz_results
      WHERE roll_no = ${rollNo}
    `;
    return { success: true };
  } catch (error) {
    console.error('Error deleting quiz result:', error);
    throw error;
  }
}
