import React, { useState } from 'react';

export const About: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: 'What is motiv?',
      answer: 'motiv. is a minimalist productivity app designed to help you manage tasks, track habits, and stay focused using the Pomodoro technique. It combines task management, habit tracking, and a customizable timer into one clean interface.',
    },
    {
      id: 2,
      question: 'How does the Pomodoro timer work?',
      answer: 'The Pomodoro technique breaks work into focused 25-minute sessions (work sessions) followed by 5-minute breaks. After 4 work sessions, you get a longer 15-minute break. You can customize these durations to your preference in the timer settings.',
    },
    {
      id: 3,
      question: 'Will my data be saved if I close the app?',
      answer: 'Yes! All your tasks, habits, and timer state are automatically saved to your browser\'s local storage. Your data persists even if you close the browser, refresh the page, or switch tabs. The timer will resume from where it left off.',
    },
    {
      id: 4,
      question: 'Can I customize the Pomodoro timer durations?',
      answer: 'Absolutely! In the Pomodoro tab, go to the "manage" presets section. You can create custom presets with different work, short break, and long break durations to fit your workflow.',
    },
    {
      id: 5,
      question: 'How do I track my habits?',
      answer: 'In the Habits tab, create a new habit and mark it as complete each day. The app automatically calculates your streak—the number of consecutive days you\'ve completed the habit. This helps you stay consistent and motivated.',
    },
    {
      id: 6,
      question: 'Can I set priority levels for tasks?',
      answer: 'Yes! Each task can have a priority level: low (green), medium (amber), or high (red). This helps you focus on what matters most. You can also filter tasks by completion status.',
    },
    {
      id: 7,
      question: 'Is my data synced across devices?',
      answer: 'Currently, motiv. uses your browser\'s local storage, so data is device-specific. To access your data on another device, you would need to use the same browser on that device.',
    },
    {
      id: 8,
      question: 'What does the session indicator color mean?',
      answer: 'The timer display changes color based on the session type: Red for work sessions, Blue for short breaks, and Green for long breaks. This visual feedback helps you stay aware of what phase you\'re in.',
    },
  ];

  return (
    <div className="space-y-12">
      {/* About Section */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-light mb-4">about motiv.</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            motiv. is a minimalist productivity application designed for people who want to focus on what matters. We believe productivity doesn't need to be complicated—it needs to be simple, intuitive, and effective.
          </p>
          <p>
            Built with modern web technologies and a focus on user experience, motiv. combines three powerful productivity tools into one clean interface: task management, habit tracking, and the Pomodoro technique.
          </p>
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-medium">Key Features:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><span className="font-medium">Task Manager</span> - Organize your tasks with priority levels (high, medium, low) and track completion status</li>
              <li><span className="font-medium">Habit Tracker</span> - Build consistency by tracking daily habits and monitoring your streaks</li>
              <li><span className="font-medium">Pomodoro Timer</span> - Stay focused with customizable work and break sessions, with visual indicators for each session type</li>
              <li><span className="font-medium">Data Persistence</span> - All your data is saved locally and persists across browser sessions</li>
              <li><span className="font-medium">Minimalist Design</span> - Clean, distraction-free interface with Poppins typography</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-light mb-6">frequently asked questions</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span className="font-medium text-gray-900 text-left">{faq.question}</span>
                <span className={`text-xl text-gray-600 transition-transform ${openFAQ === faq.id ? 'rotate-180' : ''}`}>
                  ›
                </span>
              </button>
              {openFAQ === faq.id && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
        <h2 className="text-xl font-medium mb-4">feedback & support</h2>
        <p className="text-gray-700 text-sm mb-4">
          We'd love to hear from you! If you have suggestions, feedback, or encounter any issues, please reach out.
        </p>
        <p className="text-gray-600 text-xs">
          Built with ❤️ for productivity enthusiasts. © 2026 motiv.
        </p>
      </section>
    </div>
  );
};
