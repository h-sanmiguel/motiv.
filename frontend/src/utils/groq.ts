export interface Quote {
  text: string;
  author: string;
  date: string; // ISO date string (YYYY-MM-DD)
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const fetchDailyQuote = async (): Promise<{ text: string; author: string }> => {
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
            content: 'Generate one short productivity quote (max 80 chars). Return ONLY in this exact format:\n"Your quote here" - Author Name\n\nExample:\n"Do one thing at a time" - Focus Master',
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const fullQuote = data.choices[0].message.content.trim();
    
    console.log('Raw quote from API:', fullQuote);
    
    // Try different parsing patterns
    // Pattern 1: "Quote" - Author or "Quote" — Author
    let match = fullQuote.match(/^"([^"]+)"\s*[-–—]\s*(.+)$/);
    if (match) {
      return {
        text: match[1].trim(),
        author: match[2].trim(),
      };
    }
    
    // Pattern 2: Quote - Author (without quotes)
    match = fullQuote.match(/^([^-–—]+)\s*[-–—]\s*(.+)$/);
    if (match) {
      return {
        text: match[1].trim(),
        author: match[2].trim(),
      };
    }
    
    // Pattern 3: Split by newline and parse separately
    const lines = fullQuote.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
    if (lines.length >= 2) {
      return {
        text: lines[0].replace(/^["']|["']$/g, ''),
        author: lines[1].replace(/^[-–—*]\s*/, '').trim(),
      };
    }
    
    // Fallback if parsing fails
    return {
      text: fullQuote,
      author: 'Groq AI',
    };
  } catch (error) {
    console.error('Failed to fetch quote from Groq:', error);
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
