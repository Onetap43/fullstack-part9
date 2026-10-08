export interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  dailyExercises: number[],
  target: number
): ExerciseResult => {
  if (dailyExercises.length === 0) {
    throw new Error('Exercise data cannot be empty');
  }

  const periodLength = dailyExercises.length;
  const trainingDays = dailyExercises.filter((hours) => hours > 0).length;

  const totalHours = dailyExercises.reduce(
    (sum, hours) => sum + hours,
    0
  );

  const average = totalHours / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = 'great';
  } else if (average >= target - 1) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'bad';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

interface ExerciseValues {
  target: number;
  exercises: number[];
}

const parseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) {
    throw new Error('Not enough arguments');
  }

  const numbers = args.slice(2).map(Number);

  if (numbers.some((number) => Number.isNaN(number))) {
    throw new Error('Provided values were not numbers!');
  }

  const target = numbers[0];
  const exercises = numbers.slice(1);

  if (target === undefined) {
    throw new Error('Target is missing');
  }

  return { target, exercises };
};

if (process.argv[1] === import.meta.filename) {
  try {
    const { target, exercises } = parseArguments(process.argv);
    console.log(calculateExercises(exercises, target));
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`Error: ${error.message}`);
    }
  }
}