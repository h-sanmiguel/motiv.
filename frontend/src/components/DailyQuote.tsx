import React, { useState, useEffect } from 'react';
import { getDailyQuote } from '../utils/groq';

export const DailyQuote: React.FC = () => {
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadQuote();
  }, []);

  if (loading || !quote) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
          ✨ Quote of the Day
        </p>
        <button
          onClick={loadQuote}
          disabled={loading}
          className="text-xs text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
          title="Get a new quote"
        >
          ↻
        </button>
      </div>
      <p className="text-base font-serif italic text-gray-700 text-center mb-2">
        "{quote.text}"
      </p>
      <p className="text-sm text-gray-500 text-center font-serif">
        — {quote.author}
      </p>
    </div>
  );
};
