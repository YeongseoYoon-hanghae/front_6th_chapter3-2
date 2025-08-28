import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';

import { RepeatType } from '../types';

interface RepeatSectionProps {
  isRepeating: boolean;
  onIsRepeatingChange: (isRepeating: boolean) => void;
  repeatType: RepeatType;
  onRepeatTypeChange: (type: RepeatType) => void;
  repeatInterval: number;
  onRepeatIntervalChange: (interval: number) => void;
  repeatEndDate: string;
  onRepeatEndDateChange: (endDate: string) => void;
}

/**
 * 반복 일정 설정 섹션
 *
 * 선언적 개선사항:
 * - 복잡한 조건부 렌더링 로직을 명확한 컴포넌트로 분리
 * - 반복 관련 모든 필드를 하나의 의미 있는 섹션으로 그룹화
 * - 반복 활성화 상태에 따른 필드 표시/숨김을 선언적으로 처리
 * - 반복 타입 옵션을 내부에서 관리
 */
export const RepeatSection = ({
  isRepeating,
  onIsRepeatingChange,
  repeatType,
  onRepeatTypeChange,
  repeatInterval,
  onRepeatIntervalChange,
  repeatEndDate,
  onRepeatEndDateChange,
}: RepeatSectionProps) => {
  return (
    <Stack spacing={2}>
      <RepeatToggle isRepeating={isRepeating} onToggle={onIsRepeatingChange} />

      {isRepeating && (
        <RepeatSettings
          repeatType={repeatType}
          onRepeatTypeChange={onRepeatTypeChange}
          repeatInterval={repeatInterval}
          onRepeatIntervalChange={onRepeatIntervalChange}
          repeatEndDate={repeatEndDate}
          onRepeatEndDateChange={onRepeatEndDateChange}
        />
      )}
    </Stack>
  );
};

/**
 * 반복 일정 활성화/비활성화 토글
 * 목적: 반복 일정 설정의 진입점 역할
 */
const RepeatToggle = ({
  isRepeating,
  onToggle,
}: {
  isRepeating: boolean;
  onToggle: (value: boolean) => void;
}) => (
  <FormControl>
    <FormControlLabel
      control={
        <Checkbox
          checked={isRepeating}
          onChange={(e) => onToggle(e.target.checked)}
          slotProps={{ input: { 'aria-label': '반복 일정' } }}
        />
      }
      label="반복 일정"
    />
  </FormControl>
);

/**
 * 반복 상세 설정
 * 목적: 반복이 활성화된 상태에서의 모든 설정을 관리
 */
interface RepeatSettingsProps {
  repeatType: RepeatType;
  onRepeatTypeChange: (type: RepeatType) => void;
  repeatInterval: number;
  onRepeatIntervalChange: (interval: number) => void;
  repeatEndDate: string;
  onRepeatEndDateChange: (endDate: string) => void;
}

const RepeatSettings = ({
  repeatType,
  onRepeatTypeChange,
  repeatInterval,
  onRepeatIntervalChange,
  repeatEndDate,
  onRepeatEndDateChange,
}: RepeatSettingsProps) => (
  <Stack spacing={2}>
    <RepeatTypeField value={repeatType} onChange={onRepeatTypeChange} />
    <RepeatIntervalAndEndDate
      interval={repeatInterval}
      onIntervalChange={onRepeatIntervalChange}
      endDate={repeatEndDate}
      onEndDateChange={onRepeatEndDateChange}
    />
  </Stack>
);

/**
 * 반복 타입 선택 필드
 * 목적: 반복 타입 옵션을 내부에서 관리
 */
const RepeatTypeField = ({
  value,
  onChange,
}: {
  value: RepeatType;
  onChange: (type: RepeatType) => void;
}) => (
  <FormControl fullWidth>
    <FormLabel id="repeat-type">반복 유형</FormLabel>
    <Select
      labelId="repeat-type"
      id="repeat-type"
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value as RepeatType)}
    >
      <MenuItem value="daily">매일</MenuItem>
      <MenuItem value="weekly">매주</MenuItem>
      <MenuItem value="monthly">매월</MenuItem>
      <MenuItem value="yearly">매년</MenuItem>
    </Select>
  </FormControl>
);

/**
 * 반복 간격과 종료일 필드
 * 목적: 관련된 두 필드를 논리적으로 그룹화
 */
interface RepeatIntervalAndEndDateProps {
  interval: number;
  onIntervalChange: (interval: number) => void;
  endDate: string;
  onEndDateChange: (endDate: string) => void;
}

const RepeatIntervalAndEndDate = ({
  interval,
  onIntervalChange,
  endDate,
  onEndDateChange,
}: RepeatIntervalAndEndDateProps) => (
  <Stack direction="row" spacing={2}>
    <FormControl fullWidth>
      <FormLabel htmlFor="repeat-interval">반복 간격</FormLabel>
      <TextField
        id="repeat-interval"
        size="small"
        type="number"
        value={interval}
        onChange={(e) => onIntervalChange(Number(e.target.value))}
        slotProps={{ htmlInput: { min: 1 } }}
      />
    </FormControl>
    <FormControl fullWidth>
      <FormLabel htmlFor="repeat-end-date">반복 종료일</FormLabel>
      <TextField
        id="repeat-end-date"
        size="small"
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        slotProps={{ htmlInput: { max: '2025-10-30' } }}
      />
    </FormControl>
  </Stack>
);
