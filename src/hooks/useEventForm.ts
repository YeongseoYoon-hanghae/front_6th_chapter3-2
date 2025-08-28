import { Event, RepeatType } from '../types';
import { useFormState } from './useFormState';
import { useTimeValidation } from './useTimeValidation';

export const useEventForm = (editingEvent?: Event | null) => {
  const { formState, updateField, resetForm } = useFormState(editingEvent || undefined);
  const { startTimeError, endTimeError, createStartTimeHandler, createEndTimeHandler } =
    useTimeValidation();

  const handleReset = () => {
    resetForm();
  };

  const handleStartTimeChange = createStartTimeHandler({
    endTime: formState.endTime,
    onTimeChange: (time) => updateField('startTime', time),
  });

  const handleEndTimeChange = createEndTimeHandler({
    startTime: formState.startTime,
    onTimeChange: (time) => updateField('endTime', time),
  });

  return {
    ...formState,

    setTitle: (value: string) => updateField('title', value),
    setDate: (value: string) => updateField('date', value),
    setStartTime: (value: string) => updateField('startTime', value),
    setEndTime: (value: string) => updateField('endTime', value),
    setDescription: (value: string) => updateField('description', value),
    setLocation: (value: string) => updateField('location', value),
    setCategory: (value: string) => updateField('category', value),
    setIsRepeating: (value: boolean) => updateField('isRepeating', value),
    setRepeatType: (value: RepeatType) => updateField('repeatType', value),
    setRepeatInterval: (value: number) => updateField('repeatInterval', value),
    setRepeatEndDate: (value: string) => updateField('repeatEndDate', value),
    setNotificationTime: (value: number) => updateField('notificationTime', value),

    startTimeError,
    endTimeError,
    handleStartTimeChange,
    handleEndTimeChange,

    resetForm: handleReset,
  };
};
