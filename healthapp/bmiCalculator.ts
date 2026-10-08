export const calculateBmi = (height: number, weight: number): string => {
  if (height <= 0 || weight <= 0) {
    throw new Error('Height and weight must be positive numbers');
  }

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  if (bmi < 18.5) {
    return 'Underweight';
  }

  if (bmi < 25) {
    return 'Normal range';
  }

  if (bmi < 30) {
    return 'Overweight';
  }

  return 'Obese';
};

interface BmiValues {
  height: number;
  weight: number;
}

const parseArguments = (args: string[]): BmiValues => {
  if (args.length < 4) {
    throw new Error('Not enough arguments');
  }

  if (args.length > 4) {
    throw new Error('Too many arguments');
  }

  const height = Number(args[2]);
  const weight = Number(args[3]);

  if (Number.isNaN(height) || Number.isNaN(weight)) {
    throw new Error('Provided values were not numbers!');
  }

  return { height, weight };
};

if (process.argv[1] === import.meta.filename) {
  try {
    const { height, weight } = parseArguments(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`Error: ${error.message}`);
    }
  }
}