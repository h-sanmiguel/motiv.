export interface Quote {
  text: string;
  author: string;
}

const QUOTES_API_URL = 'https://api.quotable.io/v2/random';

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
  const { text, author } = await fetchDailyQuote();
  return { text, author };
};
