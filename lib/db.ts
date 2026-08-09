import { sql } from '@vercel/postgres';

export async function initializeDatabase() {
  try {
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
  } catch (error) {
    console.error('Database initialization error:', error);
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
    const { name, rollNo, score, percentage } = result;
    await sql`
      INSERT INTO quiz_results (name, roll_no, score, percentage)
      VALUES (${name}, ${rollNo}, ${score}, ${percentage})
      ON CONFLICT (roll_no) DO UPDATE SET
        name = ${name},
        score = ${score},
        percentage = ${percentage},
        submitted_at = CURRENT_TIMESTAMP
    `;
    return { success: true };
  } catch (error) {
    console.error('Error saving quiz result:', error);
    throw error;
  }
}

export async function getAllQuizResults(): Promise<QuizResult[]> {
  try {
    const result = await sql`
      SELECT id, name, roll_no as "rollNo", score, percentage, submitted_at as "submittedAt"
      FROM quiz_results
      ORDER BY submitted_at DESC
    `;
    return result.rows as QuizResult[];
  } catch (error) {
    console.error('Error fetching quiz results:', error);
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
