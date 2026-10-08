import express from 'express';
import { z } from 'zod';

import patientService from '../services/patientService.ts';
import {
  NewEntrySchema,
  NewPatientSchema
} from '../types.ts';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(patientService.getPatients());
});

router.get('/:id', (req, res) => {
  const patient = patientService.getPatient(req.params.id);

  if (!patient) {
    return res.sendStatus(404);
  }

  return res.json(patient);
});

router.post('/', (req, res) => {
  try {
    const newPatient = NewPatientSchema.parse(req.body);
    const addedPatient =
      patientService.addPatient(newPatient);

    return res.json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).send({
        error: error.issues
      });
    }

    return res.status(400).send({
      error: 'unknown error'
    });
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    const newEntry = NewEntrySchema.parse(req.body);

    const addedEntry = patientService.addEntry(
      req.params.id,
      newEntry
    );

    if (!addedEntry) {
      return res.sendStatus(404);
    }

    return res.json(addedEntry);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).send({
        error: error.issues
      });
    }

    return res.status(400).send({
      error: 'unknown error'
    });
  }
});

export default router;