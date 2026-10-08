import express from 'express';
import { z } from 'zod';
import patientService from '../services/patientService.ts';
import { NewPatientSchema } from '../types.ts';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(patientService.getPatients());
});

router.post('/', (req, res) => {
  try {
    const newPatient = NewPatientSchema.parse(req.body);
    const addedPatient = patientService.addPatient(newPatient);

    res.json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({
        error: error.issues
      });
    } else {
      res.status(400).send({
        error: 'unknown error'
      });
    }
  }
});

export default router;