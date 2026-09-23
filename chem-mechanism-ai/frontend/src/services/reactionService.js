const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const analyzeReaction = async (reaction) => {
  const response = await fetch(`${API_URL}/api/reactions/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reaction }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data;
};
