import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises } from './exerciseCalculator.ts';

const app = express();

app.use(express.json());

type NumericValue = number | string;

const isNumericValue = (value: unknown): value is NumericValue => {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return false;
  }

  if (value === '') {
    return false;
  }

  return !Number.isNaN(Number(value));
};

const isNumericArray = (value: unknown): value is NumericValue[] => {
  return Array.isArray(value) && value.every(isNumericValue);
};

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  if (
    typeof height !== 'string' ||
    typeof weight !== 'string' ||
    !isNumericValue(height) ||
    !isNumericValue(weight)
  ) {
    return res.status(400).send({
      error: 'malformatted parameters'
    });
  }

  const numericHeight = Number(height);
  const numericWeight = Number(weight);

  try {
    return res.json({
      weight: numericWeight,
      height: numericHeight,
      bmi: calculateBmi(numericHeight, numericWeight)
    });
  } catch {
    return res.status(400).send({
      error: 'malformatted parameters'
    });
  }
});

app.post('/exercises', (req, res) => {
  const body: unknown = req.body;

  if (
    typeof body !== 'object' ||
    body === null ||
    !('daily_exercises' in body) ||
    !('target' in body)
  ) {
    return res.status(400).send({
      error: 'parameters missing'
    });
  }

  const dailyExercises = body.daily_exercises;
  const target = body.target;

  if (
    !isNumericArray(dailyExercises) ||
    !isNumericValue(target)
  ) {
    return res.status(400).send({
      error: 'malformatted parameters'
    });
  }

  const exercises = dailyExercises.map(Number);
  const numericTarget = Number(target);

  try {
    return res.json(
      calculateExercises(exercises, numericTarget)
    );
  } catch {
    return res.status(400).send({
      error: 'malformatted parameters'
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});