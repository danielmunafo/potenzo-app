import React from 'react';

import { WorkoutGetReady } from '@/components/workouts/WorkoutGetReady';
import WorkoutPreview from '@/components/workouts/WorkoutPreview';
import { WorkoutsList } from '@/components/workouts/WorkoutsList';
import { useWorkoutContext } from '@/contexts/WorkoutContext';

interface WorkoutStep {
  Component: React.ComponentType;
}
const steps = new Map<number, WorkoutStep>([
  [0, { Component: WorkoutsList }],
  [1, { Component: WorkoutPreview }],
  [2, { Component: WorkoutGetReady }],
]);

export function WorkoutsScreen() {
  const { step } = useWorkoutContext();

  const Component = steps.get(step)?.Component ?? React.Fragment;
  return <Component />;
}

export default WorkoutsScreen;
