import { Exercise, Workout } from '@/constants/types';
import React, { createContext, useContext, useState } from 'react';

interface WorkoutContextType {
  workout: Workout | undefined;
  setWorkout: (w: Workout | undefined) => void;
  exercise: Exercise | undefined;
  setExercise: (e: Exercise | undefined) => void;
  step: number;
  setStep: (s: number) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);
interface WorkoutProviderProps {
  children: React.ReactNode;
}

export function WorkoutProvider({ children }: WorkoutProviderProps) {
  const [workout, setWorkout] = useState<Workout | undefined>(undefined);
  const [exercise, setExercise] = useState<Exercise | undefined>(undefined);
  const [step, setStep] = useState<number>(0);

  const value: WorkoutContextType = {
    workout,
    setWorkout,
    exercise,
    setExercise,
    step,
    setStep,
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
