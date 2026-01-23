import React, { useState, useEffect } from 'react';
import type { PomodoroSession, PomodoroPreset } from '../types';
import { generateId, getToday, getTodaysPomodoroCount, saveTimerState, loadTimerState } from '../utils/storage';
import { createPomodoroNotification } from '../utils/notifications';
import type { Notification } from '../utils/notifications';

interface PomodoroTimerProps {
  sessions: PomodoroSession[];
  presets: PomodoroPreset[];
  onSessionComplete: (session: PomodoroSession) => void;
  onAddPreset: (preset: PomodoroPreset) => void;
  onUpdatePreset: (id: string, updated: Partial<PomodoroPreset>) => void;
  onDeletePreset: (id: string) => void;
  onAddNotification?: (notification: Notification) => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  sessions,
  presets,
  onSessionComplete,
  onAddPreset,
  onUpdatePreset,
  onDeletePreset,
  onAddNotification,
}) => {
  // Initialize timer state from localStorage on first mount
  const getInitialTimerState = () => {
    const restoredTimer = loadTimerState();
    if (restoredTimer) {
      return {
        timeLeft: Math.round(restoredTimer.timeLeft),
        isRunning: restoredTimer.isRunning,
        sessionType: restoredTimer.sessionType,
        activePresetId: restoredTimer.activePresetId,
      };
    }
    return {
      timeLeft: 25 * 60,
      isRunning: false,
      sessionType: 'work' as const,
      activePresetId: 'default',
    };
  };

  const initialState = getInitialTimerState();
  const [timeLeft, setTimeLeft] = useState(initialState.timeLeft);
  const [isRunning, setIsRunning] = useState(initialState.isRunning);
  const [sessionType, setSessionType] = useState<'work' | 'break' | 'longbreak'>(initialState.sessionType);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [activePresetId, setActivePresetId] = useState<string>(initialState.activePresetId);
  const [showPresetSettings, setShowPresetSettings] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const today = getToday();
  const todaysCount = getTodaysPomodoroCount(sessions);

  // Initialize on mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize with default preset if none exist
  useEffect(() => {
    if (!presets || presets.length === 0 && isMounted) {
      const defaultPreset: PomodoroPreset = {
        id: 'default',
        name: 'default',
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        isDefault: true,
      };
      onAddPreset(defaultPreset);
    }
  }, [isMounted, presets?.length, onAddPreset]);

  // Persist timer state whenever it changes
  useEffect(() => {
    const timerState = {
      timeLeft,
      isRunning,
      sessionType,
      lastUpdateTime: Date.now(),
      activePresetId,
    };
    saveTimerState(timerState);
  }, [timeLeft, isRunning, sessionType, activePresetId]);

  // Timer effect
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, sessionType, sessionsCompleted]);

  useEffect(() => {
    setSessionsCompleted(todaysCount);
  }, [todaysCount]);

  const currentPreset = presets.length > 0 ? (presets.find(p => p.id === activePresetId) || presets[0]) : null;

  const handleTimerComplete = () => {
    setIsRunning(true);
    playNotificationSound();

    if (sessionType === 'work') {
      const session: PomodoroSession = {
        id: generateId(),
        date: today,
        duration: currentPreset?.workDuration || 25,
        completed: true,
      };
      onSessionComplete(session);
      setSessionsCompleted(prev => prev + 1);

      let nextType: 'work' | 'break' | 'longbreak';
      if ((sessionsCompleted + 1) % 4 === 0) {
        nextType = 'longbreak';
        setSessionType('longbreak');
        setTimeLeft((currentPreset?.longBreakDuration || 15) * 60);
      } else {
        nextType = 'break';
        setSessionType('break');
        setTimeLeft((currentPreset?.shortBreakDuration || 5) * 60);
      }
      onAddNotification?.(createPomodoroNotification(`Work session done, next: ${nextType === 'longbreak' ? 'long break' : 'short break'}`));
    } else {
      setSessionType('work');
      setTimeLeft((currentPreset?.workDuration || 25) * 60);
      onAddNotification?.(createPomodoroNotification('Break done, next: work session'));
    }
  };

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioContext.currentTime;
      
      // Bell chime: three ascending notes
      const notes = [
        { frequency: 523.25, start: 0, duration: 0.3 },    // C5
        { frequency: 659.25, start: 0.15, duration: 0.3 },  // E5
        { frequency: 783.99, start: 0.3, duration: 0.4 },   // G5
      ];
      
      notes.forEach(note => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.value = note.frequency;
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0.3, now + note.start);
        gain.gain.exponentialRampToValueAtTime(0.01, now + note.start + note.duration);
        
        osc.start(now + note.start);
        osc.stop(now + note.start + note.duration);
      });
    } catch (e) {
      console.log('Audio notification failed:', e);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    if (sessionType === 'work') {
      setTimeLeft((currentPreset?.workDuration || 25) * 60);
    } else if (sessionType === 'break') {
      setTimeLeft((currentPreset?.shortBreakDuration || 5) * 60);
    } else {
      setTimeLeft((currentPreset?.longBreakDuration || 15) * 60);
    }
  };

  const handleAddNewPreset = () => {
    if (newPresetName.trim() && currentPreset) {
      const newPreset: PomodoroPreset = {
        id: generateId(),
        name: newPresetName.trim(),
        workDuration: currentPreset.workDuration,
        shortBreakDuration: currentPreset.shortBreakDuration,
        longBreakDuration: currentPreset.longBreakDuration,
      };
      onAddPreset(newPreset);
      setNewPresetName('');
    }
  };

  const getSessionLabel = () => {
    switch (sessionType) {
      case 'work':
        return 'work session';
      case 'break':
        return 'short break';
      case 'longbreak':
        return 'long break';
    }
  };

  const getSessionColor = () => {
    switch (sessionType) {
      case 'work':
        return 'bg-red-50 border-red-300';
      case 'break':
        return 'bg-blue-50 border-blue-300';
      case 'longbreak':
        return 'bg-green-50 border-green-300';
    }
  };

  const getSessionBadgeColor = () => {
    switch (sessionType) {
      case 'work':
        return 'bg-red-100 text-red-700';
      case 'break':
        return 'bg-blue-100 text-blue-700';
      case 'longbreak':
        return 'bg-green-100 text-green-700';
    }
  };


  return (
    <div className="space-y-6">
      {/* Timer Display */}
      <div className={`border-2 border-black rounded-lg p-12 text-black transition-all duration-300 ${getSessionColor()}`}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getSessionBadgeColor()}`}>
            {getSessionLabel()}
          </span>
        </div>
        <p 
          onClick={() => {
            if (!isRunning) {
              const sessionMap = {
                'work': 'break' as const,
                'break': 'longbreak' as const,
                'longbreak': 'work' as const,
              };
              const newSessionType = sessionMap[sessionType];
              setSessionType(newSessionType);
              if (newSessionType === 'work') {
                setTimeLeft((currentPreset?.workDuration || 25) * 60);
              } else if (newSessionType === 'break') {
                setTimeLeft((currentPreset?.shortBreakDuration || 5) * 60);
              } else {
                setTimeLeft((currentPreset?.longBreakDuration || 15) * 60);
              }
            }
          }}
          className={`text-center text-sm font-medium text-gray-600 uppercase tracking-wide ${!isRunning ? 'cursor-pointer hover:text-black transition' : ''}`}
        >
          click to change
        </p>
        <p className="text-center text-6xl sm:text-7xl font-light font-mono mb-8">{formatTime(timeLeft)}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setIsRunning(!isRunning)}
            disabled={timeLeft === 0}
            className={`px-6 py-2 text-sm font-medium rounded transition ${
              timeLeft === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isRunning ? 'pause' : 'start'}
          </button>
          <button
            onClick={handleReset}
            disabled={timeLeft === 0 && !isRunning}
            className={`px-6 py-2 text-sm font-medium rounded transition ${
              timeLeft === 0 && !isRunning
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-black hover:bg-gray-300'
            }`}
          >
            reset
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">today</p>
          <p className="text-3xl font-light text-gray-900 mt-2">{sessionsCompleted}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">active preset</p>
          <p className="text-sm font-medium text-gray-900 mt-2 capitalize">{currentPreset?.name || 'default'}</p>
        </div>
      </div>

      {/* Presets */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">presets</p>
          <button
            onClick={() => setShowPresetSettings(!showPresetSettings)}
            className="text-xs font-medium text-gray-600 hover:text-gray-900"
          >
            {showPresetSettings ? 'done' : 'manage'}
          </button>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap gap-2">
          {presets && presets.length > 0 ? (
            presets.map(preset => (
              <button
                key={preset.id}
                onClick={() => {
                  if (!isRunning) {
                    setActivePresetId(preset.id);
                    setSessionType('work');
                    setTimeLeft(preset.workDuration * 60);
                  }
                }}
                disabled={isRunning}
                className={`px-3 py-1 rounded text-xs font-medium transition ${
                  activePresetId === preset.id && !isRunning
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                }`}
              >
                {preset.name}
              </button>
            ))
          ) : (
            <p className="text-xs text-gray-500">loading presets...</p>
          )}
        </div>

        {/* Preset Settings */}
        {showPresetSettings && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            {/* Add New Preset */}
            <div className="space-y-2">
              <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">new preset</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddNewPreset()}
                  placeholder="preset name..."
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                />
                <button
                  onClick={handleAddNewPreset}
                  className="px-3 py-1 bg-black text-white text-xs font-medium rounded hover:bg-gray-800"
                >
                  add
                </button>
              </div>
            </div>

            {/* Edit Existing Presets */}
            <div className="space-y-3">
              {presets && presets.length > 0 ? (
                presets.map(preset => (
                  <div key={preset.id} className="space-y-2 p-3 bg-gray-50 rounded border border-gray-200">
                    <p className="font-medium text-sm capitalize">{preset.name}</p>
                    
                    {editingPresetId === preset.id ? (
                    // Edit Mode
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-gray-600">work (min) <span className="text-gray-400">1-120</span></label>
                        <input
                          type="number"
                          value={preset.workDuration}
                          onChange={(e) => {
                            const val = Math.min(120, Math.max(1, parseInt(e.target.value) || 25));
                            onUpdatePreset(preset.id, { workDuration: val });
                          }}
                          min="1"
                          max="120"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">short break (min) <span className="text-gray-400">1-30</span></label>
                        <input
                          type="number"
                          value={preset.shortBreakDuration}
                          onChange={(e) => {
                            const val = Math.min(30, Math.max(1, parseInt(e.target.value) || 5));
                            onUpdatePreset(preset.id, { shortBreakDuration: val });
                          }}
                          min="1"
                          max="30"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">long break (min) <span className="text-gray-400">1-60</span></label>
                        <input
                          type="number"
                          value={preset.longBreakDuration}
                          onChange={(e) => {
                            const val = Math.min(60, Math.max(1, parseInt(e.target.value) || 15));
                            onUpdatePreset(preset.id, { longBreakDuration: val });
                          }}
                          min="1"
                          max="60"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => setEditingPresetId(null)}
                          className="flex-1 px-2 py-1 bg-black text-white text-xs font-medium rounded hover:bg-gray-800"
                        >
                          done
                        </button>
                        {!preset.isDefault && (
                          <button
                            onClick={() => onDeletePreset(preset.id)}
                            className="flex-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded hover:bg-red-200"
                          >
                            delete
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600">
                        {preset.workDuration}m / {preset.shortBreakDuration}m / {preset.longBreakDuration}m
                      </p>
                      {!preset.isDefault && (
                        <button
                          onClick={() => setEditingPresetId(preset.id)}
                          disabled={isRunning}
                          className={`text-xs font-medium ${
                            isRunning
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                          title={isRunning ? 'Cannot edit while timer is running' : 'edit'}
                        >
                          edit
                        </button>
                      )}
                    </div>
                  )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">no presets available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
