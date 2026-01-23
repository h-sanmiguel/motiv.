export interface Quote {
  text: string;
  date: string; // ISO date string (YYYY-MM-DD)
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const fetchDailyQuote = async (): Promise<string> => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'user',
            content: 'Generate a short, inspiring productivity quote (max 100 characters). Just the quote, no attribution.',
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const quote = data.choices[0].message.content.trim();
    return quote;
  } catch (error) {
    console.error('Failed to fetch quote from Groq:', error);
    // Return a default quote if API fails
    return 'Focus on progress, not perfection.';
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
  const text = await fetchDailyQuote();
  const quote: Quote = { text, date: today };
  
  // Cache it
  localStorage.setItem('dailyQuote', JSON.stringify(quote));
  
  return quote;
};
