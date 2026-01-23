import React from 'react';

interface NavbarProps {
  currentTab: 'tasks' | 'habits' | 'pomodoro';
  onTabChange: (tab: 'tasks' | 'habits' | 'pomodoro') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const navItems = [
    { id: 'tasks', label: 'tasks' },
    { id: 'habits', label: 'habits' },
    { id: 'pomodoro', label: 'pomodoro' },
  ] as const;

  return (
    <nav className="bg-white border-b-2 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <p className="text-2xl font-light font-poppins text-black">
              <span className="font-semibold">motiv</span>.
            </p>
          </div>

          {/* Navigation Items */}
          <div className="hidden sm:flex gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-4 py-2 text-sm font-medium transition ${
                  currentTab === item.id
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                } rounded-md`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu */}
          <div className="sm:hidden">
            <select
              value={currentTab}
              onChange={(e) => onTabChange(e.target.value as 'tasks' | 'habits' | 'pomodoro')}
              className="px-3 py-2 text-sm font-medium border border-gray-300 rounded-md focus:outline-none focus:border-black"
            >
              {navItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};
