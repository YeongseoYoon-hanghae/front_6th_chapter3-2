import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';

import { RepeatType } from '../types';

interface RecurringEventFormProps {
  repeatType: RepeatType;
  setRepeatType: React.Dispatch<React.SetStateAction<RepeatType>>;
  repeatInterval: number;
  setRepeatInterval: React.Dispatch<React.SetStateAction<number>>;
  repeatEndDate: string;
  setRepeatEndDate: React.Dispatch<React.SetStateAction<string>>;
}

const MAX_END_DATE = '2025-10-30';

export const RecurringEventForm: React.FC<RecurringEventFormProps> = ({
  repeatType,
  setRepeatType,
  repeatInterval,
  setRepeatInterval,
  repeatEndDate,
  setRepeatEndDate,
}) => {
  const [endDateError, setEndDateError] = useState<string | null>(null);

  const repeatTypeOptions: Array<{ value: RepeatType; label: string }> = useMemo(
    () => [
      { value: 'daily', label: '매일' },
      { value: 'weekly', label: '매주' },
      { value: 'monthly', label: '매월' },
      { value: 'yearly', label: '매년' },
    ],
    []
  );

  const handleEndDateChange = (value: string) => {
    if (value && value > MAX_END_DATE) {
      setEndDateError(`최대 종료일은 ${MAX_END_DATE} 입니다.`);
      // 입력을 막지 않고 오류만 표시. 필요 시 최대값으로 보정하려면 아래 주석을 해제하세요.
      // setRepeatEndDate(MAX_END_DATE);
      setRepeatEndDate(value);
      return;
    }
    setEndDateError(null);
    setRepeatEndDate(value);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Typography variant="h6">반복 설정</Typography>

      <FormControl fullWidth>
        <FormLabel id="repeat-type-label" htmlFor="repeat-type">
          반복 유형
        </FormLabel>
        <Select
          id="repeat-type"
          aria-labelledby="repeat-type-label"
          size="small"
          value={repeatType}
          onChange={(e) => setRepeatType(e.target.value as RepeatType)}
        >
          {repeatTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value} aria-label={`${option.label}-option`}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <FormLabel htmlFor="repeat-interval">반복 간격</FormLabel>
        <TextField
          id="repeat-interval"
          size="small"
          type="number"
          slotProps={{ htmlInput: { min: 1 } }}
          value={repeatInterval}
          onChange={(e) => setRepeatInterval(Math.max(1, Number(e.target.value) || 1))}
        />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel htmlFor="repeat-end-date">반복 종료 날짜</FormLabel>
        <Tooltip title={endDateError || ''} open={!!endDateError} placement="top">
          <TextField
            id="repeat-end-date"
            size="small"
            type="date"
            value={repeatEndDate}
            slotProps={{ htmlInput: { max: MAX_END_DATE } }}
            onChange={(e) => handleEndDateChange(e.target.value)}
            error={!!endDateError}
            helperText={endDateError || ''}
          />
        </Tooltip>
      </FormControl>
    </Stack>
  );
};

export default RecurringEventForm;
