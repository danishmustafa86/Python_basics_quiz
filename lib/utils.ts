export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function calculateScore(
  answers: Record<number, number>,
  correctAnswers: Record<number, number>,
  totalQuestions: number
): { score: number; percentage: number; correct: number } {
  let correct = 0;
  for (let i = 1; i <= totalQuestions; i++) {
    if (answers[i] === correctAnswers[i]) {
      correct++;
    }
  }
  const percentage = Math.round((correct / totalQuestions) * 100);
  return { score: correct, percentage, correct };
}
