'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!rollNo.trim()) {
      setError('Please enter your roll number');
      return;
    }

    const studentData = {
      name: name.trim(),
      rollNo: rollNo.trim(),
      startTime: new Date().toISOString(),
    };

    sessionStorage.setItem('studentData', JSON.stringify(studentData));
    router.push('/quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Python Quiz</h1>
          <p className="text-gray-600">Medium Level Assessment</p>
        </div>

        <form onSubmit={handleStart} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Roll Number *
            </label>
            <input
              type="text"
              value={rollNo}
              onChange={(e) => {
                setRollNo(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your roll number"
            />
          </div>

          {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Duration:</span> 40 minutes<br/>
              <span className="font-semibold">Questions:</span> 50 MCQs<br/>
              <span className="font-semibold">Level:</span> Medium
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-shadow"
          >
            Start Quiz
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          Please ensure you have at least 40 minutes available before starting.
        </p>
      </div>
    </div>
  );
}
