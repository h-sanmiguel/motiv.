import type { Quote } from './quotesData';
import { getRandomQuote } from './quotesData';

export const fetchDailyQuote = async (): Promise<Quote> => {
  try {
    const quote = getRandomQuote();
    console.log('Random quote selected:', quote);
    return quote;
  } catch (error) {
    console.error('Failed to get quote:', error);
    return {
      text: 'Focus on progress, not perfection.',
      author: 'Unknown',
    };
  }
};

export const getDailyQuote = async (): Promise<Quote> => {
  return fetchDailyQuote();
};
