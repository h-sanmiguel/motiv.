import React, { useState, useEffect } from 'react';
import { getDailyQuote } from '../utils/groq';

export const DailyQuote: React.FC = () => {
  const [quote, setQuote] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuote = async () => {
      try {
        setLoading(true);
        const dailyQuote = await getDailyQuote();
        setQuote(dailyQuote.text);
      } catch (error) {
        console.error('Error loading quote:', error);
        setQuote('Focus on progress, not perfection.');
      } finally {
        setLoading(false);
      }
    };

    loadQuote();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-4 mb-6">
      <p className="text-sm text-gray-600 italic text-center">
        ✨ {quote}
      </p>
    </div>
  );
};
