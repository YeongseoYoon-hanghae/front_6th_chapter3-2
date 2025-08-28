import { FormControl, FormLabel, Stack, TextField, Tooltip } from '@mui/material';
import React from 'react';

import { getTimeErrorMessage } from '../utils/timeValidation';

interface TimeSectionProps {
  startTime: string;
  endTime: string;
  startTimeError: string | null;
  endTimeError: string | null;
  onStartTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * 시간 입력 섹션
 *
 * 선언적 개선사항:
 * - 시작시간과 종료시간의 중복 로직을 하나의 컴포넌트로 통합
 * - 에러 처리 로직을 내부에서 일관성 있게 관리
 * - 시간 검증 로직을 명확하게 분리
 * - 시간 관련 모든 책임을 하나의 섹션에서 처리
 */
export const TimeSection = ({
  startTime,
  endTime,
  startTimeError,
  endTimeError,
  onStartTimeChange,
  onEndTimeChange,
}: TimeSectionProps) => {
  return (
    <Stack direction="row" spacing={2}>
      <TimeField
        id="start-time"
        label="시작 시간"
        value={startTime}
        error={startTimeError}
        onChange={onStartTimeChange}
        onBlur={() => getTimeErrorMessage(startTime, endTime)}
      />
      <TimeField
        id="end-time"
        label="종료 시간"
        value={endTime}
        error={endTimeError}
        onChange={onEndTimeChange}
        onBlur={() => getTimeErrorMessage(startTime, endTime)}
      />
    </Stack>
  );
};

/**
 * 개별 시간 입력 필드
 * 목적: 시간 입력 필드의 중복 로직을 하나의 컴포넌트로 통합
 */
interface TimeFieldProps {
  id: string;
  label: string;
  value: string;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
}

const TimeField = ({ id, label, value, error, onChange, onBlur }: TimeFieldProps) => (
  <FormControl fullWidth>
    <FormLabel htmlFor={id}>{label}</FormLabel>
    <Tooltip title={error || ''} open={!!error} placement="top">
      <TextField
        id={id}
        size="small"
        type="time"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={!!error}
      />
    </Tooltip>
  </FormControl>
);
