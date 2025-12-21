import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ModuleProgress {
  id: string;
  completed: boolean;
  started: boolean;
  lastVisited: string | null;
  timeSpent: number; // in seconds
}

interface ProgressContextType {
  moduleProgress: ModuleProgress[];
  markModuleStarted: (moduleId: string) => void;
  markModuleCompleted: (moduleId: string) => void;
  updateModuleTimeSpent: (moduleId: string, seconds: number) => void;
  getModuleProgress: (moduleId: string) => ModuleProgress | undefined;
  getOverallProgress: () => number; // percentage
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const MODULE_IDS = ['robotic-nervous-system', 'digital-twin', 'ai-robot-brain', 'vla-capstone'];

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>(() => {
    // Initialize from localStorage or default state
    const savedProgress = typeof window !== 'undefined' ? localStorage.getItem('moduleProgress') : null;
    if (savedProgress) {
      try {
        return JSON.parse(savedProgress);
      } catch (e) {
        console.error('Error parsing saved progress:', e);
      }
    }

    // Default progress state
    return MODULE_IDS.map(id => ({
      id,
      completed: false,
      started: false,
      lastVisited: null,
      timeSpent: 0
    }));
  });

  // Save to localStorage whenever progress changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('moduleProgress', JSON.stringify(moduleProgress));
    }
  }, [moduleProgress]);

  const markModuleStarted = (moduleId: string) => {
    setModuleProgress(prev =>
      prev.map(module =>
        module.id === moduleId
          ? { ...module, started: true, lastVisited: new Date().toISOString() }
          : module
      )
    );
  };

  const markModuleCompleted = (moduleId: string) => {
    setModuleProgress(prev =>
      prev.map(module =>
        module.id === moduleId
          ? { ...module, completed: true, lastVisited: new Date().toISOString() }
          : module
      )
    );
  };

  const updateModuleTimeSpent = (moduleId: string, seconds: number) => {
    setModuleProgress(prev =>
      prev.map(module =>
        module.id === moduleId
          ? { ...module, timeSpent: module.timeSpent + seconds }
          : module
      )
    );
  };

  const getModuleProgress = (moduleId: string) => {
    return moduleProgress.find(module => module.id === moduleId);
  };

  const getOverallProgress = () => {
    const completedCount = moduleProgress.filter(module => module.completed).length;
    return Math.round((completedCount / moduleProgress.length) * 100);
  };

  const value = {
    moduleProgress,
    markModuleStarted,
    markModuleCompleted,
    updateModuleTimeSpent,
    getModuleProgress,
    getOverallProgress
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};