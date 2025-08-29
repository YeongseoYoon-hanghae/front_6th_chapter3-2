import { useCallback, useEffect, useState } from 'react';

import { Event, RepeatType, WeeklyOptions, hasWeeklyOptions } from '../types';

interface FormState {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  isRepeating: boolean;
  repeatType: RepeatType;
  repeatInterval: number;
  repeatEndDate: string;
  notificationTime: number;
  weeklyOptions?: WeeklyOptions;
}

const getInitialFormState = (initialEvent?: Event): FormState => ({
  title: initialEvent?.title || '',
  date: initialEvent?.date || '',
  startTime: initialEvent?.startTime || '',
  endTime: initialEvent?.endTime || '',
  description: initialEvent?.description || '',
  location: initialEvent?.location || '',
  category: initialEvent?.category || '업무',
  isRepeating: initialEvent ? initialEvent.repeat.type !== 'none' : false,
  repeatType: initialEvent ? initialEvent.repeat.type : 'daily',
  repeatInterval: initialEvent?.repeat.interval || 1,
  repeatEndDate: initialEvent?.repeat.endDate || '',
  notificationTime: initialEvent?.notificationTime || 10,
  weeklyOptions:
    initialEvent && hasWeeklyOptions(initialEvent.repeat)
      ? initialEvent.repeat.weeklyOptions
      : undefined,
});

export const useFormState = (initialEvent?: Event) => {
  const [formState, setFormState] = useState<FormState>(() => getInitialFormState(initialEvent));

  useEffect(() => {
    setFormState(getInitialFormState(initialEvent));
  }, [initialEvent]);

  const updateField = useCallback(<K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState(getInitialFormState(initialEvent));
  }, [initialEvent]);

  const loadEvent = useCallback((event: Event) => {
    setFormState(getInitialFormState(event));
  }, []);

  return {
    formState,
    updateField,
    resetForm,
    loadEvent,
  };
};
