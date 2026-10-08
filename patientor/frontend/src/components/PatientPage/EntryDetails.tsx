import type {
  Diagnosis,
  Entry
} from '../../types';

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled entry: ${JSON.stringify(value)}`
  );
};

const EntryDetails = ({
  entry,
  diagnoses
}: Props) => {
  const diagnosisName = (
    code: string
  ): string => {
    return (
      diagnoses.find(
        (diagnosis) => diagnosis.code === code
      )?.name ?? ''
    );
  };

  const common = (
    <>
      <div>
        <strong>
          {entry.date} {entry.specialist}
        </strong>
      </div>

      <div>
        <i>{entry.description}</i>
      </div>

      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map((code) => (
            <li key={code}>
              {code} {diagnosisName(code)}
            </li>
          ))}
        </ul>
      )}
    </>
  );

  switch (entry.type) {
    case 'HealthCheck':
      return (
        <div>
          {common}
          <div>
            health rating:{' '}
            {entry.healthCheckRating}
          </div>
          <hr />
        </div>
      );

    case 'Hospital':
      return (
        <div>
          {common}
          <div>
            discharge date:{' '}
            {entry.discharge.date}
          </div>
          <div>
            discharge criteria:{' '}
            {entry.discharge.criteria}
          </div>
          <hr />
        </div>
      );

    case 'OccupationalHealthcare':
      return (
        <div>
          {common}

          <div>
            employer:{' '}
            {entry.employerName}
          </div>

          {entry.sickLeave && (
            <div>
              sick leave:{' '}
              {entry.sickLeave.startDate}
              {' - '}
              {entry.sickLeave.endDate}
            </div>
          )}

          <hr />
        </div>
      );

    default:
      return assertNever(entry);
  }
};

export default EntryDetails;