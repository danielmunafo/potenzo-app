import { Workout } from '@/constants/types';
import React, { createContext, useContext, useState } from 'react';

interface WorkoutContextType {
  workout: Workout | undefined;
  setWorkout: (w: Workout) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);
interface WorkoutProviderProps {
  children: React.ReactNode;
}

export function WorkoutProvider({ children }: WorkoutProviderProps) {
  const [workout, setWorkout] = useState<Workout | undefined>(undefined);

  const value: WorkoutContextType = {
    workout,
    setWorkout,
  };
  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
}

export function useWorkoutContext() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkoutContext must be used within a WorkoutProvider');
  }
  return context;
}
