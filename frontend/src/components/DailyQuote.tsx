import React, { useState, useEffect } from 'react';
import { getDailyQuote } from '../utils/groq';

export const DailyQuote: React.FC = () => {
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuote = async () => {
      try {
        setLoading(true);
        const dailyQuote = await getDailyQuote();
        setQuote({ text: dailyQuote.text, author: dailyQuote.author });
      } catch (error) {
        console.error('Error loading quote:', error);
        setQuote({ 
          text: 'Focus on progress, not perfection.',
          author: 'Unknown'
        });
      } finally {
        setLoading(false);
      }
    };

    loadQuote();
  }, []);

  if (loading || !quote) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-6 mb-6">
      <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3 text-center">
        ✨ Quote of the Day
      </p>
      <p className="text-base font-serif italic text-gray-700 text-center mb-2">
        "{quote.text}"
      </p>
      <p className="text-sm text-gray-500 text-center font-serif">
        — {quote.author}
      </p>
    </div>
  );
};
