import { v1 as uuid } from 'uuid';
import patientsData from '../../data/patients.ts';
import type {
  NewPatient,
  NonSensitivePatient,
  Patient
} from '../types.ts';

const patients: Patient[] = patientsData;

const getPatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...patient
  };

  patients.push(newPatient);

  return newPatient;
};

export default {
  getPatients,
  addPatient
};