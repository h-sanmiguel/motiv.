export interface Quote {
  text: string;
  author: string;
}

export const QUOTES_COLLECTION: Quote[] = [
  // Success & Achievement
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Whether you think you can, or you think you can't – you're right.", author: "Henry Ford" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  
  // Focus & Productivity
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The key to success is to focus on goals, not obstacles.", author: "Unknown" },
  { text: "Concentrate all your thoughts on the work at hand.", author: "Alexander Graham Bell" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  
  // Perseverance
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { text: "It's going to be hard, but hard does not mean impossible.", author: "Unknown" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { text: "The master has failed more times than the beginner has even tried.", author: "Stephen McCranie" },
  { text: "Courage is not the absence of fear, but rather the assessment that something else is more important.", author: "Franklin D. Roosevelt" },
  
  // Motivation & Inspiration
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
  { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { text: "Little things make big days.", author: "Unknown" },
  { text: "Don't wait for opportunity. Create it.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Sometimes we're tested not to show our weaknesses, but to discover our strengths.", author: "Unknown" },
  
  // Growth & Learning
  { text: "The only way to learn is to do.", author: "Richard Branson" },
  { text: "Knowledge is power.", author: "Francis Bacon" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Strive for progress, not perfection.", author: "Unknown" },
  
  // Action & Effort
  { text: "It is time to take the bull by the horns.", author: "Unknown" },
  { text: "The only place success comes before work is in the dictionary.", author: "Vince Lombardi" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  
  // Belief & Mindset
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "What we think, we become.", author: "Buddha" },
  { text: "If you can dream it, you can achieve it.", author: "Zig Ziglar" },
  { text: "I am not what happened to me. I am what I choose to become.", author: "Carl Jung" },
  { text: "Everything you want is on the other side of fear.", author: "George Addair" },
  
  // Resilience
  { text: "The comeback is always stronger than the setback.", author: "Unknown" },
  { text: "It is not the mountain we conquer, but ourselves.", author: "Edmund Hillary" },
  { text: "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.", author: "Rikki Rogers" },
  { text: "The only real failure in life is not trying.", author: "Unknown" },
  
  // Discipline & Habits
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "The discipline to pursue the extraordinary is the most valuable resource you have.", author: "Robin Sharma" },
  { text: "You don't rise to the level of your goals, you fall to the level of your systems.", author: "James Clear" },
  { text: "Small progress is still progress.", author: "Unknown" },
  
  // Purpose & Meaning
  { text: "The two most important days in your life are the day you are born and the day you find out why.", author: "Mark Twain" },
  { text: "Don't ask what the world needs. Ask what makes you come alive and go do it.", author: "Howard Thurman" },
  { text: "Your work is going to fill a large part of your life.", author: "Steve Jobs" },
  { text: "Finding purpose is not about finding a job you love; it's about doing work that you believe in.", author: "Unknown" },
  
  // Patience & Timing
  { text: "Great things take time.", author: "Unknown" },
  { text: "Patience, persistence, and perspiration make an unbeatable combination for success.", author: "Napoleon Hill" },
  { text: "The master has failed more times than the beginner has even tried.", author: "Stephen McCranie" },
  { text: "Rome was not built in a day.", author: "Unknown" },
  
  // Self-Improvement
  { text: "Invest in yourself. Your education, your health, your skills—these are the best investments.", author: "Unknown" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "Comparison is the thief of joy.", author: "Theodore Roosevelt" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  
  // Action-Oriented
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  
  // Emotional Intelligence
  { text: "The only way out is through.", author: "Robert Frost" },
  { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
  
  // Leadership & Influence
  { text: "A leader is one who knows the way, goes the way, and shows the way.", author: "John C. Maxwell" },
  { text: "The greatest leader is not necessarily the one who does the greatest things.", author: "Ronald Reagan" },
  { text: "Leadership is not about being in charge. It's about taking care of those in your charge.", author: "Simon Sinek" },
  
  // Vision & Goals
  { text: "A goal without a plan is just a wish.", author: "Antoine de Saint-Exupéry" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "If you aim at nothing, you will hit it every time.", author: "Unknown" },
  
  // Creativity & Innovation
  { text: "Creativity takes courage.", author: "Henri Matisse" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "The chief enemy of creativity is good sense.", author: "Pablo Picasso" },
  
  // Determination
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Your potential is the one thing you can control.", author: "Unknown" },
  { text: "Nothing is impossible. The word itself says I'm possible!", author: "Audrey Hepburn" },
  
  // Wisdom
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The obstacle is the way.", author: "Marcus Aurelius" },
  
  // Energy & Momentum
  { text: "Momentum is created by action.", author: "Unknown" },
  { text: "Every accomplishment starts with the decision to try.", author: "Unknown" },
  { text: "Motion creates emotion.", author: "Tony Robbins" },
  
  // Gratitude & Mindfulness
  { text: "Gratitude turns what we have into enough.", author: "Melody Beattie" },
  { text: "The present moment is filled with joy and peace.", author: "Thich Nhat Hanh" },
  { text: "Be grateful for what you have while pursuing what you want.", author: "Unknown" },
  
  // Change & Adaptation
  { text: "Change is the only constant.", author: "Heraclitus" },
  { text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.", author: "Alan Watts" },
  { text: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles R. Swindoll" },
];

let lastQuoteIndex = -1;

export const getRandomQuote = (): Quote => {
  // Get a random quote that's different from the last one
  let newIndex = Math.floor(Math.random() * QUOTES_COLLECTION.length);
  while (newIndex === lastQuoteIndex && QUOTES_COLLECTION.length > 1) {
    newIndex = Math.floor(Math.random() * QUOTES_COLLECTION.length);
  }
  lastQuoteIndex = newIndex;
  
  return QUOTES_COLLECTION[newIndex];
};
