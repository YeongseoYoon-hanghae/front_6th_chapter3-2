export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export enum CalendarViewType {
  WEEK = 'week',
  MONTH = 'month',
}

/**
 * 주간 반복 시 선택할 수 있는 요일 옵션
 * @interface WeeklyOptions
 */
export interface WeeklyOptions {
  /**
   * 선택된 요일 배열
   * 0: 일요일, 1: 월요일, ..., 6: 토요일
   * 예: [1, 3, 5] => 월, 수, 금요일
   */
  daysOfWeek: number[];
}

/**
 * 반복 일정 정보
 * @interface RepeatInfo
 */
export interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endDate?: string;
  id?: string;
  /**
   * 주간 반복 시 특정 요일 선택 옵션
   * type이 'weekly'일 때만 사용됨
   */
  weeklyOptions?: WeeklyOptions;
}

export interface EventForm {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  repeat: RepeatInfo;
  notificationTime: number; // 분 단위로 저장
}

export interface Event extends EventForm {
  id: string;
}

/**
 * WeeklyOptions가 있는 RepeatInfo인지 확인
 */
export function hasWeeklyOptions(
  repeat: RepeatInfo
): repeat is RepeatInfo & { weeklyOptions: WeeklyOptions } {
  return repeat.type === 'weekly' && repeat.weeklyOptions !== undefined;
}

/**
 * 유효한 요일 배열인지 검증
 */
export function isValidDaysOfWeek(days: number[]): boolean {
  return (
    days.length > 0 &&
    days.every((day) => day >= 0 && day <= 6) &&
    new Set(days).size === days.length
  );
}
