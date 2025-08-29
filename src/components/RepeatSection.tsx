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

import { RepeatType, WeeklyOptions } from '../types';
import { WeeklyDaysSelector } from './WeeklyDaysSelector';

interface RepeatSectionProps {
  isRepeating: boolean;
  onIsRepeatingChange: (isRepeating: boolean) => void;
  repeatType: RepeatType;
  onRepeatTypeChange: (type: RepeatType) => void;
  repeatInterval: number;
  onRepeatIntervalChange: (interval: number) => void;
  repeatEndDate: string;
  onRepeatEndDateChange: (endDate: string) => void;

  // 새로 추가되는 주간 반복 관련 props
  /**
   * 주간 반복 시 선택된 요일 정보
   * repeatType이 'weekly'가 아니면 무시됨
   */
  weeklyOptions?: WeeklyOptions;

  /**
   * 주간 요일 선택 변경 시 호출되는 콜백
   * repeatType이 'weekly'일 때만 호출됨
   */
  onWeeklyOptionsChange?: (options: WeeklyOptions | undefined) => void;

  /**
   * 주간 요일 선택 필드의 검증 오류 메시지
   */
  weeklyOptionsError?: string;
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
  weeklyOptions,
  onWeeklyOptionsChange,
  weeklyOptionsError,
}: RepeatSectionProps) => {
  /**
   * 반복 타입 변경 핸들러
   * 주간 타입 변경 시 weeklyOptions 상태 초기화/설정
   */
  const handleRepeatTypeChange = (newType: RepeatType) => {
    onRepeatTypeChange(newType);

    // weeklyOptions 상태 관리
    if (onWeeklyOptionsChange) {
      if (newType === 'weekly') {
        // 주간으로 변경 시 기본값 설정 (빈 배열)
        if (!weeklyOptions) {
          onWeeklyOptionsChange({ daysOfWeek: [] });
        }
      } else {
        // 다른 타입으로 변경 시 weeklyOptions 제거
        onWeeklyOptionsChange(undefined);
      }
    }
  };

  /**
   * 주간 요일 선택 변경 핸들러
   */
  const handleWeeklyOptionsChange = (selectedDays: number[]) => {
    if (onWeeklyOptionsChange && repeatType === 'weekly') {
      onWeeklyOptionsChange({ daysOfWeek: selectedDays });
    }
  };

  return (
    <Stack spacing={2}>
      <RepeatToggle isRepeating={isRepeating} onToggle={onIsRepeatingChange} />

      {isRepeating && (
        <RepeatSettings
          repeatType={repeatType}
          onRepeatTypeChange={handleRepeatTypeChange}
          repeatInterval={repeatInterval}
          onRepeatIntervalChange={onRepeatIntervalChange}
          repeatEndDate={repeatEndDate}
          onRepeatEndDateChange={onRepeatEndDateChange}
          weeklyOptions={weeklyOptions}
          onWeeklyOptionsChange={onWeeklyOptionsChange ? handleWeeklyOptionsChange : undefined}
          weeklyOptionsError={weeklyOptionsError}
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

  // 새로 추가되는 주간 반복 관련 props
  weeklyOptions?: WeeklyOptions;
  onWeeklyOptionsChange?: (selectedDays: number[]) => void;
  weeklyOptionsError?: string;
}

const RepeatSettings = ({
  repeatType,
  onRepeatTypeChange,
  repeatInterval,
  onRepeatIntervalChange,
  repeatEndDate,
  onRepeatEndDateChange,
  weeklyOptions,
  onWeeklyOptionsChange,
  weeklyOptionsError,
}: RepeatSettingsProps) => (
  <Stack spacing={2}>
    <RepeatTypeField value={repeatType} onChange={onRepeatTypeChange} />

    {/* 주간 반복 시에만 요일 선택 UI 표시 */}
    {repeatType === 'weekly' && onWeeklyOptionsChange && weeklyOptions !== undefined && (
      <WeeklyDaysSelector
        selectedDays={weeklyOptions?.daysOfWeek || []}
        onSelectionChange={onWeeklyOptionsChange}
        error={weeklyOptionsError}
        labelId="weekly-days-selector-label"
      />
    )}

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
