import {
  useState,
  type SyntheticEvent
} from 'react';

import {
  HealthCheckRating,
  type Diagnosis,
  type Entry,
  type NewEntry
} from '../../types';

interface Props {
  diagnoses: Diagnosis[];
  onSubmit: (
    entry: NewEntry
  ) => Promise<void>;
}

const AddEntryForm = ({
  diagnoses,
  onSubmit
}: Props) => {
  const [type, setType] =
    useState<Entry['type']>('HealthCheck');

  const [date, setDate] = useState('');
  const [description, setDescription] =
    useState('');

  const [specialist, setSpecialist] =
    useState('');

  const [diagnosisCodes, setDiagnosisCodes] =
    useState<string[]>([]);

  const [healthCheckRating, setHealthCheckRating] =
    useState<HealthCheckRating>(
      HealthCheckRating.Healthy
    );

  const [employerName, setEmployerName] =
    useState('');

  const [sickLeaveStart, setSickLeaveStart] =
    useState('');

  const [sickLeaveEnd, setSickLeaveEnd] =
    useState('');

  const [dischargeDate, setDischargeDate] =
    useState('');

  const [
    dischargeCriteria,
    setDischargeCriteria
  ] = useState('');

  const changeHealthRating = (
    value: string
  ) => {
    switch (value) {
      case '0':
        setHealthCheckRating(
          HealthCheckRating.Healthy
        );
        break;

      case '1':
        setHealthCheckRating(
          HealthCheckRating.LowRisk
        );
        break;

      case '2':
        setHealthCheckRating(
          HealthCheckRating.HighRisk
        );
        break;

      case '3':
        setHealthCheckRating(
          HealthCheckRating.CriticalRisk
        );
        break;
    }
  };

  const submitEntry = async (
    event: SyntheticEvent
  ) => {
    event.preventDefault();

    const common = {
      date,
      description,
      specialist,
      diagnosisCodes:
        diagnosisCodes.length > 0
          ? diagnosisCodes
          : undefined
    };

    let entry: NewEntry;

    switch (type) {
      case 'HealthCheck':
        entry = {
          ...common,
          type: 'HealthCheck',
          healthCheckRating
        };
        break;

      case 'Hospital':
        entry = {
          ...common,
          type: 'Hospital',
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria
          }
        };
        break;

      case 'OccupationalHealthcare':
        entry = {
          ...common,
          type: 'OccupationalHealthcare',
          employerName,
          sickLeave:
            sickLeaveStart && sickLeaveEnd
              ? {
                  startDate: sickLeaveStart,
                  endDate: sickLeaveEnd
                }
              : undefined
        };
        break;
    }

    await onSubmit(entry);
  };

  return (
    <div>
      <h3>New Entry</h3>

      <form onSubmit={submitEntry}>
        <div>
          <label htmlFor="entry-type">
            Type
          </label>{' '}
          <select
            id="entry-type"
            value={type}
            onChange={(event) =>
              setType(
                event.target.value as Entry['type']
              )
            }
          >
            <option value="HealthCheck">
              HealthCheck
            </option>

            <option value="OccupationalHealthcare">
              OccupationalHealthcare
            </option>

            <option value="Hospital">
              Hospital
            </option>
          </select>
        </div>

        <div>
          <label htmlFor="entry-date">
            Date
          </label>{' '}
          <input
            id="entry-date"
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="entry-description">
            Description
          </label>{' '}
          <input
            id="entry-description"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            required
          />
        </div>

        <div>
          <label htmlFor="entry-specialist">
            Specialist
          </label>{' '}
          <input
            id="entry-specialist"
            value={specialist}
            onChange={(event) =>
              setSpecialist(
                event.target.value
              )
            }
            required
          />
        </div>

        <div>
          <label htmlFor="diagnosis-codes">
            Diagnosis codes
          </label>{' '}
          <select
            id="diagnosis-codes"
            multiple
            value={diagnosisCodes}
            onChange={(event) =>
              setDiagnosisCodes(
                Array.from(
                  event.target.selectedOptions,
                  (option) => option.value
                )
              )
            }
          >
            {diagnoses.map((diagnosis) => (
              <option
                key={diagnosis.code}
                value={diagnosis.code}
              >
                {diagnosis.code} - {diagnosis.name}
              </option>
            ))}
          </select>
        </div>

        {type === 'HealthCheck' && (
          <div>
            <label htmlFor="health-rating">
              Health rating
            </label>{' '}
            <select
              id="health-rating"
              value={healthCheckRating}
              onChange={(event) =>
                changeHealthRating(
                  event.target.value
                )
              }
            >
              <option value="0">
                0 - Healthy
              </option>
              <option value="1">
                1 - Low Risk
              </option>
              <option value="2">
                2 - High Risk
              </option>
              <option value="3">
                3 - Critical Risk
              </option>
            </select>
          </div>
        )}

        {type === 'Hospital' && (
          <>
            <div>
              <label htmlFor="discharge-date">
                Discharge date
              </label>{' '}
              <input
                id="discharge-date"
                type="date"
                value={dischargeDate}
                onChange={(event) =>
                  setDischargeDate(
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div>
              <label htmlFor="discharge-criteria">
                Discharge criteria
              </label>{' '}
              <input
                id="discharge-criteria"
                value={dischargeCriteria}
                onChange={(event) =>
                  setDischargeCriteria(
                    event.target.value
                  )
                }
                required
              />
            </div>
          </>
        )}

        {type ===
          'OccupationalHealthcare' && (
          <>
            <div>
              <label htmlFor="employer-name">
                Employer
              </label>{' '}
              <input
                id="employer-name"
                value={employerName}
                onChange={(event) =>
                  setEmployerName(
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div>
              <label htmlFor="sick-start">
                Sick leave start
              </label>{' '}
              <input
                id="sick-start"
                type="date"
                value={sickLeaveStart}
                onChange={(event) =>
                  setSickLeaveStart(
                    event.target.value
                  )
                }
              />
            </div>

            <div>
              <label htmlFor="sick-end">
                Sick leave end
              </label>{' '}
              <input
                id="sick-end"
                type="date"
                value={sickLeaveEnd}
                onChange={(event) =>
                  setSickLeaveEnd(
                    event.target.value
                  )
                }
              />
            </div>
          </>
        )}

        <button type="submit">
          Add
        </button>
      </form>
    </div>
  );
};

export default AddEntryForm;