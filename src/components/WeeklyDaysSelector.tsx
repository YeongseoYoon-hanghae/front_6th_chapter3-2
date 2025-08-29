import {
  FormControl,
  FormGroup,
  FormLabel,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import React from 'react';

/**
 * 주간 반복 시 특정 요일들을 선택할 수 있는 체크박스 그룹 컴포넌트
 *
 * 선언적 특징:
 * - 요일 데이터와 UI를 명확히 분리
 * - 상태 관리를 상위 컴포넌트에 위임
 * - 접근성과 반응형 디자인을 내장
 */
export interface WeeklyDaysSelectorProps {
  /** 선택된 요일 배열 (0=일요일, 1=월요일, ..., 6=토요일) */
  selectedDays: number[];
  /** 요일 선택 변경 시 호출되는 콜백 함수 */
  onSelectionChange: (days: number[]) => void;
  /** 컴포넌트 비활성화 여부 */
  disabled?: boolean;
  /** 외부에서 전달되는 검증 오류 메시지 */
  error?: string;
  /** 접근성을 위한 레이블 ID */
  labelId?: string;
}

const WEEKDAYS = [
  { value: 0, label: '일', fullLabel: '일요일' },
  { value: 1, label: '월', fullLabel: '월요일' },
  { value: 2, label: '화', fullLabel: '화요일' },
  { value: 3, label: '수', fullLabel: '수요일' },
  { value: 4, label: '목', fullLabel: '목요일' },
  { value: 5, label: '금', fullLabel: '금요일' },
  { value: 6, label: '토', fullLabel: '토요일' },
] as const;

export const WeeklyDaysSelector: React.FC<WeeklyDaysSelectorProps> = ({
  selectedDays,
  onSelectionChange,
  disabled = false,
  error,
  labelId,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const hasValidation = selectedDays.length === 0;
  const showError = error || (hasValidation ? '최소 1개 요일을 선택해주세요' : '');

  /**
   * 요일 체크박스 변경 핸들러
   * 선택/해제에 따라 배열을 업데이트하고 정렬된 상태로 유지
   */
  const handleDayToggle = (dayValue: number) => {
    if (disabled) return;

    const newSelectedDays = selectedDays.includes(dayValue)
      ? selectedDays.filter((day) => day !== dayValue)
      : [...selectedDays, dayValue].sort();

    onSelectionChange(newSelectedDays);
  };

  /**
   * 키보드 이벤트 핸들러
   */
  const handleKeyDown = (event: React.KeyboardEvent, dayValue: number) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleDayToggle(dayValue);
    }
  };

  return (
    <FormControl
      component="fieldset"
      fullWidth
      error={Boolean(showError)}
      disabled={disabled}
      sx={{
        '&.Mui-error': {
          '& .MuiFormLabel-root': {
            color: theme.palette.error.main,
          },
        },
      }}
    >
      <FormLabel
        component="legend"
        id={labelId}
        sx={{
          marginBottom: 1,
          fontSize: theme.typography.body2.fontSize,
          fontWeight: theme.typography.fontWeightMedium,
        }}
      >
        반복 요일
      </FormLabel>

      <FormGroup
        aria-labelledby={labelId}
        role="group"
        sx={{
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 0.5 : 1,
          flexWrap: isMobile ? 'nowrap' : 'wrap',
        }}
      >
        {WEEKDAYS.map((weekday) => (
          <FormControlLabel
            key={weekday.value}
            control={
              <Checkbox
                checked={selectedDays.includes(weekday.value)}
                onChange={() => handleDayToggle(weekday.value)}
                onKeyDown={(e) => handleKeyDown(e, weekday.value)}
                disabled={disabled}
                size="small"
                inputProps={{
                  'aria-label': `${weekday.fullLabel} 선택`,
                }}
                sx={{
                  padding: theme.spacing(0.5),
                  '&.Mui-checked': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            }
            label={weekday.label}
            sx={{
              marginRight: isMobile ? 0 : 1,
              marginLeft: 0,
              minWidth: isMobile ? 'auto' : '60px',
              '& .MuiFormControlLabel-label': {
                fontSize: theme.typography.body2.fontSize,
                userSelect: 'none',
              },
            }}
          />
        ))}
      </FormGroup>

      {showError && <FormHelperText sx={{ marginTop: 1 }}>{showError}</FormHelperText>}
    </FormControl>
  );
};

/**
 * 선택된 요일들을 한국어 문자열로 변환하는 유틸리티 함수
 * @param selectedDays 선택된 요일 배열
 * @returns "월, 수, 금" 형태의 문자열
 */
export function formatSelectedDays(selectedDays: number[]): string {
  if (selectedDays.length === 0) return '';

  const dayLabels = selectedDays
    .sort()
    .map((day) => WEEKDAYS.find((wd) => wd.value === day)?.label)
    .filter(Boolean);

  return dayLabels.join(', ');
}

/**
 * 선택된 요일이 유효한지 검증하는 함수
 * @param selectedDays 선택된 요일 배열
 * @returns 유효성 검증 결과
 */
export function validateSelectedDays(selectedDays: number[]): {
  isValid: boolean;
  errorMessage?: string;
} {
  if (selectedDays.length === 0) {
    return {
      isValid: false,
      errorMessage: '최소 1개 요일을 선택해주세요',
    };
  }

  const hasInvalidDay = selectedDays.some((day) => day < 0 || day > 6);
  if (hasInvalidDay) {
    return {
      isValid: false,
      errorMessage: '유효하지 않은 요일이 선택되었습니다',
    };
  }

  return { isValid: true };
}
