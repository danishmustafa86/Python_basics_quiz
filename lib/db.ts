import { sql } from '@vercel/postgres';

// Validate database connection
function validateDatabaseConnection() {
  // Neon provides DATABASE_URL, but @vercel/postgres also supports POSTGRES_URL
  const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  if (!postgresUrl) {
    console.error('❌ Neither POSTGRES_URL nor DATABASE_URL environment variable is set!');
    console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('POSTGRES')));
    throw new Error('Database connection URL not configured. Check Vercel environment variables.');
  }

  console.log('✓ Database connection URL found');
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
