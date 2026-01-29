import React, { useState, useEffect } from 'react';
import { QuoteSkeleton } from './SkeletonLoaders';

interface CachedQuote {
  quote: { text: string; author: string };
  date: string;
}

const QUOTE_CACHE_KEY = 'daily_quote_cache';

const getStoredQuote = (): CachedQuote | null => {
  try {
    const cached = localStorage.getItem(QUOTE_CACHE_KEY);
    if (!cached) return null;
    
    const parsed: CachedQuote = JSON.parse(cached);
    const today = new Date().toDateString();
    
    if (parsed.date === today) {
      return parsed;
    }
  } catch (error) {
    console.error('Error reading cached quote:', error);
  }
  return null;
};

const saveQuote = (quote: { text: string; author: string }) => {
  try {
    const cacheData: CachedQuote = {
      quote,
      date: new Date().toDateString(),
    };
    localStorage.setItem(QUOTE_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error saving quote:', error);
  }
};

export const DailyQuote: React.FC = () => {
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    setVisible(false);
    
    const timer = setTimeout(() => {
      const cachedQuote = getStoredQuote();
      
      if (cachedQuote) {
        setQuote(cachedQuote.quote);
      } else {
        const dailyQuote = { text: 'Focus on progress, not perfection.', author: 'Unknown' };
        setQuote(dailyQuote);
        saveQuote(dailyQuote);
      }
      
      setLoading(false);
      setVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <QuoteSkeleton />}
      {!loading && visible && quote && (
        <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-6 mb-6 transition-opacity duration-500">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">
            ✨ Quote of the Day
          </p>
          <p className="text-base font-serif italic text-gray-700 text-center mb-2">
            "{quote.text}"
          </p>
          <p className="text-sm text-gray-500 text-center font-serif">
            — {quote.author}
          </p>
        </div>
      )}
    </>
  );
};
