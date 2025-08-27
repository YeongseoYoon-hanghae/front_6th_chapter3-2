import { RepeatType, EventForm, Event } from '../types';
import { formatDate } from './dateUtils';

const MAX_END_DATE = '2025-10-30';

/**
 * 윤년인지 판정합니다.
 * @param year 년도
 * @returns 윤년이면 true, 아니면 false
 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * 반복 일정의 날짜들을 계산합니다.
 * @param startDate 시작일 (YYYY-MM-DD 형식)
 * @param endDate 종료일 (YYYY-MM-DD 형식)
 * @param repeatType 반복 유형 ('daily' | 'weekly' | 'monthly' | 'yearly')
 * @param repeatInterval 반복 간격 (1 이상의 정수)
 * @returns 계산된 날짜 배열 (YYYY-MM-DD 형식)
 */
export function calculateRecurringDates(
  startDate: string,
  endDate: string,
  repeatType: RepeatType,
  repeatInterval: number
): string[] {
  // 유효성 검사
  if (repeatType === 'none' || repeatInterval <= 0) {
    return [startDate];
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const maxEnd = new Date(MAX_END_DATE);

  // 시작일이 종료일보다 늦거나, 시작일이 최대 종료일을 초과하면 빈 배열 반환
  if (start > end || start > maxEnd) {
    return [];
  }

  // 실제 종료일은 입력된 종료일과 최대 종료일 중 더 이른 날짜
  const actualEnd = end > maxEnd ? maxEnd : end;

  const dates: string[] = [];
  let currentDate = new Date(start);

  // 원본 날짜 정보 저장 (매월/매년 반복용)
  const originalDay = start.getDate();
  const originalMonth = start.getMonth();

  while (currentDate <= actualEnd) {
    dates.push(formatDate(currentDate));

    // 다음 날짜 계산
    const nextDate = new Date(currentDate);

    switch (repeatType) {
      case 'daily':
        nextDate.setDate(currentDate.getDate() + repeatInterval);
        break;

      case 'weekly':
        nextDate.setDate(currentDate.getDate() + repeatInterval * 7);
        break;

      case 'monthly': {
        nextDate.setMonth(currentDate.getMonth() + repeatInterval);
        nextDate.setDate(originalDay);

        // 31일 특수 규칙: 31일이 없는 달은 건너뛰기
        if (originalDay === 31 && nextDate.getDate() !== 31) {
          // 31일이 없는 달이면 다음 달로 건너뛰기
          nextDate.setMonth(nextDate.getMonth() + 1);
          nextDate.setDate(31);

          // 여전히 31일이 없으면 한 달 더 건너뛰기
          if (nextDate.getDate() !== 31) {
            nextDate.setMonth(nextDate.getMonth() + 1);
            nextDate.setDate(31);
          }
        }
        // 일반적인 월말 날짜 보정 (예: 30일 → 28일)
        else if (nextDate.getDate() !== originalDay) {
          nextDate.setDate(0); // 이전 달의 마지막 날로 설정
        }
        break;
      }

      case 'yearly': {
        // 윤년 2월 29일 특별 처리
        if (originalMonth === 1 && originalDay === 29) {
          // 다음 윤년까지 건너뛰기
          let nextYear = currentDate.getFullYear() + repeatInterval;
          while (!isLeapYear(nextYear)) {
            nextYear += repeatInterval;
          }
          nextDate.setFullYear(nextYear);
        } else {
          nextDate.setFullYear(currentDate.getFullYear() + repeatInterval);
        }

        nextDate.setMonth(originalMonth);
        nextDate.setDate(originalDay);

        // 날짜 보정 (예: 2월 29일 → 2월 28일)
        if (nextDate.getMonth() !== originalMonth || nextDate.getDate() !== originalDay) {
          nextDate.setDate(0); // 이전 달의 마지막 날로 설정
        }
        break;
      }
    }

    currentDate = nextDate;
  }

  return dates;
}

/**
 * EventForm 데이터를 기반으로 반복 일정들을 생성합니다.
 * @param eventData 원본 일정 데이터
 * @returns 생성된 반복 일정 배열
 */
export function generateRepeatEvents(eventData: EventForm): EventForm[] {
  // 반복 설정이 없거나 간격이 0이면 원본 일정만 반환
  if (eventData.repeat.type === 'none' || eventData.repeat.interval === 0) {
    return [eventData];
  }

  const endDate = eventData.repeat.endDate || MAX_END_DATE;

  // calculateRecurringDates를 재사용하여 날짜 계산
  const dates = calculateRecurringDates(
    eventData.date,
    endDate,
    eventData.repeat.type,
    eventData.repeat.interval
  );

  // 계산된 날짜들로 일정 객체들 생성
  return dates.map((date) => ({
    ...eventData,
    date: date,
  }));
}

/**
 * 반복 이벤트를 단일 이벤트로 전환합니다.
 * - repeat.type 을 'none'으로 설정
 * - repeat.id 를 제거
 */
export function convertToSingleEvent<T extends Event | EventForm>(event: T): T {
  const { repeat, ...rest } = event as Event;
  const nextRepeat = { ...repeat, type: 'none' as RepeatType, interval: 0 };
  delete (nextRepeat as Event['repeat']).id;
  return { ...(rest as T), repeat: nextRepeat } as T;
}
