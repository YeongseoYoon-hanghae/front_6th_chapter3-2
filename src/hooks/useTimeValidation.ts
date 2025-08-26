import { ChangeEvent, useState } from 'react';

import { getTimeErrorMessage } from '../utils/timeValidation';

type TimeErrorRecord = Record<'startTimeError' | 'endTimeError', string | null>;

export const useTimeValidation = () => {
  const [{ startTimeError, endTimeError }, setTimeError] = useState<TimeErrorRecord>({
    startTimeError: null,
    endTimeError: null,
  });

  const validateStartTime = (startTime: string, endTime: string) => {
    setTimeError(getTimeErrorMessage(startTime, endTime));
  };

  const validateEndTime = (startTime: string, endTime: string) => {
    setTimeError(getTimeErrorMessage(startTime, endTime));
  };

  const createStartTimeHandler =
    ({ endTime, onTimeChange }: { endTime: string; onTimeChange: (time: string) => void }) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const newStartTime = e.target.value;
      onTimeChange(newStartTime);
      setTimeError(getTimeErrorMessage(newStartTime, endTime));
    };

  const createEndTimeHandler =
    ({ startTime, onTimeChange }: { startTime: string; onTimeChange: (time: string) => void }) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const newEndTime = e.target.value;
      onTimeChange(newEndTime);
      setTimeError(getTimeErrorMessage(startTime, newEndTime));
    };

  return {
    startTimeError,
    endTimeError,
    validateStartTime,
    validateEndTime,
    createStartTimeHandler,
    createEndTimeHandler,
  };
};
