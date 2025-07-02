export type Workout = {
  title: string;
  minutes: number;
  kcal: number;
  place: string;
  equipment: string[];
  exercises: Exercise[];
  icon: string;
};

export type Exercise = {
  name: string;
  assetId: any;
  duration: number;
  sets: number;
  reps: number;
  rest: number;
};
