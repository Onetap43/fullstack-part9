import axios from 'axios';
import {
  useEffect,
  useState,
  type FormEvent
} from 'react';

import {
  Weather,
  Visibility,
  type DiaryEntry,
  type NewDiaryEntry
} from './types';

const API_URL = 'http://localhost:3000/api/diaries';

interface BackendError {
  error: unknown;
}

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<BackendError>(error)) {
    const backendError = error.response?.data?.error;

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

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [visibility, setVisibility] =
    useState<Visibility>(Visibility.Great);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void axios
      .get<DiaryEntry[]>(API_URL)
      .then((response) => {
        setDiaries(response.data);
      })
      .catch((caughtError: unknown) => {
        setError(getErrorMessage(caughtError));
      });
  }, []);

  const addDiary = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const newDiary: NewDiaryEntry = {
      date,
      weather,
      visibility,
      comment
    };

    try {
      const response = await axios.post<DiaryEntry>(
        API_URL,
        newDiary
      );

      setDiaries(diaries.concat(response.data));

      setDate('');
      setComment('');
      setWeather(Weather.Sunny);
      setVisibility(Visibility.Great);
    } catch (caughtError: unknown) {
      setError(getErrorMessage(caughtError));
    }
  };

  return (
    <div>
      <h1>Flight diaries</h1>

      <h2>Add new entry</h2>

      {error && (
        <div>
          <strong>Error: {error}</strong>
        </div>
      )}

      <form onSubmit={addDiary}>
        <div>
          date{' '}
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </div>

        <div>
          weather{' '}
          {Object.values(Weather).map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="weather"
                value={option}
                checked={weather === option}
                onChange={() => setWeather(option)}
              />
              {option}{' '}
            </label>
          ))}
        </div>

        <div>
          visibility{' '}
          {Object.values(Visibility).map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="visibility"
                value={option}
                checked={visibility === option}
                onChange={() => setVisibility(option)}
              />
              {option}{' '}
            </label>
          ))}
        </div>

        <div>
          comment{' '}
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>

        <button type="submit">add</button>
      </form>

      <h2>Diary entries</h2>

      {diaries.map((diary) => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <div>visibility: {diary.visibility}</div>
          <div>weather: {diary.weather}</div>

          {diary.comment && (
            <div>comment: {diary.comment}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default App;