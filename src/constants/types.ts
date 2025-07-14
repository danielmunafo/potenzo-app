export type Workout = {
  id: string;
  title: string;
  minutes: number;
  kcal: number;
  place: string;
  equipment: string[];
  exercises: Exercise[];
  icon: string;
};

export type Exercise = {
  id: string;
  name: string;
  assetId: any;
  duration: number;
  sets: number;
  reps: number;
  rest: number;
};

export type CarouselPreviewExercise = Exercise & {
  overlayContent: React.ReactNode;
};

export type CarouselExecuteExercise = Exercise & {
  overlayContent: React.ReactNode;
};
