export interface Quote {
  text: string;
  author: string;
  date: string; // ISO date string (YYYY-MM-DD)
}

const QUOTES_API_URL = 'https://api.quotable.io/v2/quoteoftheday';

export const fetchDailyQuote = async (): Promise<{ text: string; author: string }> => {
  try {
    const response = await fetch(QUOTES_API_URL);

    if (!response.ok) {
      throw new Error(`Quotes API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      text: data.quote || data.content,
      author: data.author || 'Unknown',
    };
  } catch (error) {
    console.error('Failed to fetch quote from Quotes API:', error);
    // Return a default quote if API fails
    return {
      text: 'Focus on progress, not perfection.',
      author: 'Unknown',
    };
  }
};

export const getDailyQuote = async (): Promise<Quote> => {
  const today = new Date().toISOString().split('T')[0];
  
  // Check localStorage for today's quote
  const cachedQuote = localStorage.getItem('dailyQuote');
  if (cachedQuote) {
    const parsed: Quote = JSON.parse(cachedQuote);
    if (parsed.date === today) {
      return parsed;
    }
  }

  // Fetch new quote for today
  const { text, author } = await fetchDailyQuote();
  const quote: Quote = { text, author, date: today };
  
  // Cache it
  localStorage.setItem('dailyQuote', JSON.stringify(quote));
  
  return quote;
};
