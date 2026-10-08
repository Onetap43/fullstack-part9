import { v1 as uuid } from 'uuid';
import patientsData from '../../data/patients.ts';

import type {
  Entry,
  NewEntry,
  NewPatient,
  NonSensitivePatient,
  Patient
} from '../types.ts';

const patients: Patient[] = patientsData;

const getPatients = (): NonSensitivePatient[] => {
  return patients.map(
    ({ id, name, dateOfBirth, gender, occupation }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation
    })
  );
};

const getPatient = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...patient,
    entries: []
  };

  patients.push(newPatient);

  return newPatient;
};

const addEntry = (
  patientId: string,
  entry: NewEntry
): Entry | undefined => {
  const patient = patients.find(
    (candidate) => candidate.id === patientId
  );

  if (!patient) {
    return undefined;
  }

  const newEntry = {
    id: uuid(),
    ...entry
  };

  patient.entries.push(newEntry);

  return newEntry;
};

export default {
  getPatients,
  getPatient,
  addPatient,
  addEntry
};