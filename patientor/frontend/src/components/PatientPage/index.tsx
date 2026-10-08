import {
  useEffect,
  useState
} from 'react';

import {
  useParams
} from 'react-router-dom';

import axios from 'axios';

import type {
  Diagnosis,
  NewEntry,
  Patient
} from '../../types';

import patientService from '../../services/patients';

import EntryDetails from './EntryDetails';
import AddEntryForm from './AddEntryForm';

interface Props {
  diagnoses: Diagnosis[];
}

const getErrorMessage = (
  error: unknown
): string => {
  if (
    axios.isAxiosError<{ error?: unknown }>(error)
  ) {
    const backendError =
      error.response?.data?.error;

    if (typeof backendError === 'string') {
      return backendError;
    }

    if (backendError !== undefined) {
      return JSON.stringify(backendError);
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
};

const PatientPage = ({
  diagnoses
}: Props) => {
  const { id } = useParams();

  const [patient, setPatient] =
    useState<Patient | null>(null);

  const [error, setError] =
    useState<string>();

  const [entryFormOpen, setEntryFormOpen] =
    useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchPatient = async () => {
      try {
        const data =
          await patientService.getOne(id);

        setPatient(data);
      } catch (caughtError: unknown) {
        setError(
          getErrorMessage(caughtError)
        );
      }
    };

    void fetchPatient();
  }, [id]);

  if (!patient) {
    return (
      <div>
        {error ?? 'Loading patient...'}
      </div>
    );
  }

  const submitEntry = async (
    entry: NewEntry
  ): Promise<void> => {
    try {
      const addedEntry =
        await patientService.addEntry(
          patient.id,
          entry
        );

      setPatient({
        ...patient,
        entries:
          patient.entries.concat(
            addedEntry
          )
      });

      setError(undefined);
      setEntryFormOpen(false);
    } catch (caughtError: unknown) {
      setError(
        getErrorMessage(caughtError)
      );
    }
  };

  return (
    <div>
      <h2>{patient.name}</h2>

      <div>
        ssn: {patient.ssn}
      </div>

      <div>
        occupation: {patient.occupation}
      </div>

      <div>
        gender: {patient.gender}
      </div>

      <div>
        date of birth: {patient.dateOfBirth}
      </div>

      {error && (
        <div>
          <strong>
            Error: {error}
          </strong>
        </div>
      )}

      <h3>entries</h3>

      {patient.entries.map((entry) => (
        <EntryDetails
          key={entry.id}
          entry={entry}
          diagnoses={diagnoses}
        />
      ))}

      {!entryFormOpen && (
        <button
          type="button"
          onClick={() => setEntryFormOpen(true)}
        >
          Add New Entry
        </button>
      )}

      {entryFormOpen && (
        <AddEntryForm
          diagnoses={diagnoses}
          onSubmit={submitEntry}
        />
      )}
    </div>
  );
};

export default PatientPage;