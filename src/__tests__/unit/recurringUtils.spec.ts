import { describe, it, expect } from 'vitest';

import { Event, EventForm } from '../../types';
import {
  calculateRecurringDates,
  generateRepeatEvents,
  convertToSingleEvent,
  calculateWeeklyWithSpecificDays,
  calculateRecurringDatesWithOptions,
  generateRepeatEventsWithOptions,
} from '../../utils/recurringUtils';

describe('반복 날짜 계산 유틸리티', () => {
  describe('매일 반복 날짜 계산', () => {
    it('시작일(2025-10-15)부터 종료일(2025-10-17)까지 매일 반복하면 정확한 날짜들이 생성된다', () => {
      // Given 시작일이 2025-10-15이고 종료일이 2025-10-17이면
      const startDate = '2025-10-15';
      const endDate = '2025-10-17';
      const repeatType = 'daily';
      const repeatInterval = 1;

      // When 매일 반복 날짜를 계산하면
      const result = calculateRecurringDates(startDate, endDate, repeatType, repeatInterval);

      // Then 시작일, 16일, 17일이 포함된 배열이 반환된다
      expect(result).toEqual(['2025-10-15', '2025-10-16', '2025-10-17']);
    });

    it('종료일(2025-10-15)이 시작일(2025-10-17)보다 이전이면 빈 배열이 반환된다', () => {
      // Given 시작일이 2025-10-17이고 종료일이 2025-10-15이면
      const startDate = '2025-10-17';
      const endDate = '2025-10-15';
      const repeatType = 'daily';
      const repeatInterval = 1;

      // When 매일 반복 날짜를 계산하면
      const result = calculateRecurringDates(startDate, endDate, repeatType, repeatInterval);

      // Then 빈 배열이 반환된다
      expect(result).toEqual([]);
    });
  });

  describe('매주 반복 날짜 계산', () => {
    it('시작일(2025-10-15)부터 종료일(2025-10-29)까지 매주 반복하면 7일씩 증가하며 날짜가 생성된다', () => {
      // Given 시작일이 2025-10-15이고 종료일이 2025-10-29이면
      const startDate = '2025-10-15';
      const endDate = '2025-10-29';
      const repeatType = 'weekly';
      const repeatInterval = 1;

      // When 매주 반복 날짜를 계산하면
      const result = calculateRecurringDates(startDate, endDate, repeatType, repeatInterval);

      // Then 15일, 22일, 29일이 포함된 배열이 반환된다
      expect(result).toEqual(['2025-10-15', '2025-10-22', '2025-10-29']);
    });
  });

  describe('최대 종료일 제한', () => {
    it('종료일이 2025-10-30을 초과하면 2025-10-30까지만 생성한다', () => {
      // Given 시작일이 2025-10-28이고 종료일이 2025-11-02이면
      const startDate = '2025-10-28';
      const endDate = '2025-11-02';
      const repeatType = 'daily';
      const repeatInterval = 1;

      // When 매일 반복 날짜를 계산하면
      const result = calculateRecurringDates(startDate, endDate, repeatType, repeatInterval);

      // Then 28일, 29일, 30일까지만 포함된 배열이 반환된다
      expect(result).toEqual(['2025-10-28', '2025-10-29', '2025-10-30']);
    });

    it('시작일이 2025-10-30을 초과하면 빈 배열이 반환된다', () => {
      // Given 시작일이 2025-11-01이고 종료일이 2025-11-05이면
      const startDate = '2025-11-01';
      const endDate = '2025-11-05';
      const repeatType = 'daily';
      const repeatInterval = 1;

      // When 매일 반복 날짜를 계산하면
      const result = calculateRecurringDates(startDate, endDate, repeatType, repeatInterval);

      // Then 빈 배열이 반환된다
      expect(result).toEqual([]);
    });
  });

  describe('매월 반복 날짜 계산', () => {
    it('시작일부터 종료일까지 매월 반복하면 1개월씩 증가하며 날짜가 생성된다', () => {
      // Given 시작일이 2025-01-15이고 종료일이 2025-03-15이면
      const startDate = '2025-01-15';
      const endDate = '2025-03-15';
      const repeatType = 'monthly';
      const repeatInterval = 1;

      // When 매월 반복 날짜를 계산하면
      const result = calculateRecurringDates(startDate, endDate, repeatType, repeatInterval);

      // Then 1월 15일, 2월 15일, 3월 15일이 포함된 배열이 반환된다
      expect(result).toEqual(['2025-01-15', '2025-02-15', '2025-03-15']);
    });

    it('반복 간격이 2개월이면 2개월씩 건너뛰며 날짜가 생성된다', () => {
      // Given 시작일이 2025-01-15이고 종료일이 2025-07-15이고 간격이 2이면
      const startDate = '2025-01-15';
      const endDate = '2025-07-15';
      const repeatType = 'monthly';
      const repeatInterval = 2;

      // When 매월 반복 날짜를 계산하면
      const result = calculateRecurringDates(startDate, endDate, repeatType, repeatInterval);

      // Then 1월 15일, 3월 15일, 5월 15일, 7월 15일이 포함된 배열이 반환된다
      expect(result).toEqual(['2025-01-15', '2025-03-15', '2025-05-15', '2025-07-15']);
    });
  });

  describe('매년 반복 날짜 계산', () => {
    it('시작일부터 종료일까지 매년 반복하면 1년씩 증가하며 날짜가 생성된다', () => {
      // Given 시작일이 2023-10-15이고 종료일이 2025-10-15이면
      const startDate = '2023-10-15';
      const endDate = '2025-10-15';
      const repeatType = 'yearly';
      const repeatInterval = 1;

      // When 매년 반복 날짜를 계산하면
      const result = calculateRecurringDates(startDate, endDate, repeatType, repeatInterval);

      // Then 2023년 10월 15일, 2024년 10월 15일, 2025년 10월 15일이 포함된 배열이 반환된다
      expect(result).toEqual(['2023-10-15', '2024-10-15', '2025-10-15']);
    });

    it('반복 간격이 2년이면 2년씩 건너뛰며 날짜가 생성된다', () => {
      // Given 시작일이 2023-10-15이고 종료일이 2029-10-15이고 간격이 2이면
      const startDate = '2023-10-15';
      const endDate = '2029-10-15';
      const repeatType = 'yearly';
      const repeatInterval = 2;

      // When 매년 반복 날짜를 계산하면
      const result = calculateRecurringDates(startDate, endDate, repeatType, repeatInterval);

      // Then 2023년 10월 15일, 2025년 10월 15일이 포함된 배열이 반환된다 (2027, 2029는 2025-10-30 제한으로 제외)
      expect(result).toEqual(['2023-10-15', '2025-10-15']);
    });
  });

  describe('경계값 테스트', () => {
    it('시작일이 2025-10-30이면 해당 날짜만 포함된 배열이 반환된다', () => {
      // Given 시작일과 종료일이 모두 2025-10-30이면
      const startDate = '2025-10-30';
      const endDate = '2025-10-30';
      const repeatType = 'daily';
      const repeatInterval = 1;

      // When 매일 반복 날짜를 계산하면
      const result = calculateRecurringDates(startDate, endDate, repeatType, repeatInterval);

      // Then 2025-10-30만 포함된 배열이 반환된다
      expect(result).toEqual(['2025-10-30']);
    });

    it('반복 간격이 0이면 시작일만 포함된 배열이 반환된다', () => {
      // Given 시작일이 2025-10-15이고 종료일이 2025-10-17이고 간격이 0이면
      const startDate = '2025-10-15';
      const endDate = '2025-10-17';
      const repeatType = 'daily';
      const repeatInterval = 0;

      // When 매일 반복 날짜를 계산하면
      const result = calculateRecurringDates(startDate, endDate, repeatType, repeatInterval);

      // Then 시작일만 포함된 배열이 반환된다
      expect(result).toEqual(['2025-10-15']);
    });

    it('반복 간격이 음수이면 시작일만 포함된 배열이 반환된다', () => {
      // Given 시작일이 2025-10-15이고 종료일이 2025-10-17이고 간격이 -1이면
      const startDate = '2025-10-15';
      const endDate = '2025-10-17';
      const repeatType = 'daily';
      const repeatInterval = -1;

      // When 매일 반복 날짜를 계산하면
      const result = calculateRecurringDates(startDate, endDate, repeatType, repeatInterval);

      // Then 시작일만 포함된 배열이 반환된다
      expect(result).toEqual(['2025-10-15']);
    });
  });

  describe('특수 규칙 테스트', () => {
    it('시작일이 31일인 경우 31일이 있는 달에만 생성된다', () => {
      // Given 시작일이 2025-01-31이고 종료일이 2025-04-30이면
      const startDate = '2025-01-31';
      const endDate = '2025-04-30';
      const repeatType = 'monthly';
      const repeatInterval = 1;

      // When 매월 반복 날짜를 계산하면
      const result = calculateRecurringDates(startDate, endDate, repeatType, repeatInterval);

      // Then 1월 31일, 3월 31일만 포함된 배열이 반환된다 (2월, 4월은 31일이 없으므로 제외)
      expect(result).toEqual(['2025-01-31', '2025-03-31']);
    });

    it('시작일이 2월 29일인 경우 윤년에만 생성된다', () => {
      // Given 시작일이 2024-02-29이고 종료일이 2028-02-29이면
      const startDate = '2024-02-29';
      const endDate = '2028-02-29';
      const repeatType = 'yearly';
      const repeatInterval = 1;

      // When 매년 반복 날짜를 계산하면
      const result = calculateRecurringDates(startDate, endDate, repeatType, repeatInterval);

      // Then 2024년 2월 29일만 포함된 배열이 반환된다 (2028년은 2025-10-30 제한으로 제외)
      expect(result).toEqual(['2024-02-29']);
    });

    it('시작일이 2월 29일이고 간격이 2년인 경우 윤년에만 생성된다', () => {
      // Given 시작일이 2024-02-29이고 종료일이 2032-02-29이고 간격이 2이면
      const startDate = '2024-02-29';
      const endDate = '2032-02-29';
      const repeatType = 'yearly';
      const repeatInterval = 2;

      // When 매년 반복 날짜를 계산하면
      const result = calculateRecurringDates(startDate, endDate, repeatType, repeatInterval);

      // Then 2024년 2월 29일만 포함된 배열이 반환된다 (2028년, 2032년은 2025-10-30 제한으로 제외)
      expect(result).toEqual(['2024-02-29']);
    });
  });
});

describe('반복 일정 생성 유틸리티', () => {
  describe('EventForm 기반 반복 일정 생성', () => {
    it('반복 설정이 없으면 원본 일정만 반환한다', () => {
      // Given 반복 설정이 없는 일정이면
      const eventData: EventForm = {
        title: '일회성 회의',
        date: '2025-10-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '일회성 회의입니다',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      };

      // When 반복 일정을 생성하면
      const result = generateRepeatEvents(eventData);

      // Then 원본 일정만 포함된 배열이 반환된다
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(eventData);
    });

    it('반복 일정을 생성하면 EventForm 객체들이 올바르게 생성된다', () => {
      // Given 반복 설정이 있는 일정이면
      const eventData: EventForm = {
        title: '팀 회의',
        date: '2025-10-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '팀 회의입니다',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'daily', interval: 1, endDate: '2025-10-16' },
        notificationTime: 10,
      };

      // When 반복 일정을 생성하면
      const result = generateRepeatEvents(eventData);

      // Then EventForm 객체들이 올바르게 생성된다
      expect(result).toHaveLength(2);

      // 첫 번째 일정은 원본과 동일하되 날짜만 다름
      expect(result[0]).toEqual({
        ...eventData,
        date: '2025-10-15',
      });

      // 두 번째 일정은 날짜만 변경됨
      expect(result[1]).toEqual({
        ...eventData,
        date: '2025-10-16',
      });
    });

    it('종료일이 2025-10-30을 초과하면 2025-10-30까지만 일정이 생성된다', () => {
      // Given 종료일이 2025-10-30을 초과하는 일정이면
      const eventData: EventForm = {
        title: '제한된 반복',
        date: '2025-10-28',
        startTime: '10:00',
        endTime: '11:00',
        description: '제한된 반복입니다',
        location: '회의실 C',
        category: '업무',
        repeat: { type: 'daily', interval: 1, endDate: '2025-11-02' },
        notificationTime: 15,
      };

      // When 반복 일정을 생성하면
      const result = generateRepeatEvents(eventData);

      // Then 3개의 일정만 생성된다 (28일, 29일, 30일)
      expect(result).toHaveLength(3);
      expect(result[0].date).toBe('2025-10-28');
      expect(result[1].date).toBe('2025-10-29');
      expect(result[2].date).toBe('2025-10-30');
    });
  });
});

describe('반복→단일 전환 유틸리티', () => {
  it('반복 이벤트를 단일로 전환하면 반복 표시는 사라진다', () => {
    // Given 사용자에게 주간 반복 이벤트가 있다 (id로 동일 그룹 식별)
    const original: Event = {
      id: 'abc',
      title: '반복 이벤트',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '',
      location: '',
      category: '업무',
      repeat: { type: 'weekly', interval: 1, endDate: '2025-10-29', id: 'repeat-1' },
      notificationTime: 10,
    };

    // When 단일 이벤트로 전환하면
    const single = convertToSingleEvent(original);

    // Then 사용자 입장에서는 더 이상 반복이 아니다 (아이콘/그룹 해제 조건)
    expect(single.repeat.type).toBe('none');
    expect(single.repeat.interval).toBe(0);
    expect('id' in single.repeat).toBe(false);

    // And 원본 데이터는 변하지 않는다 (불변성 보장)
    expect(original.repeat.type).toBe('weekly');
    expect(original.repeat.interval).toBe(1);
    expect(original.repeat.id).toBe('repeat-1');
  });
});

describe('주간 요일별 날짜 계산 유틸리티', () => {
  describe('calculateWeeklyWithSpecificDays', () => {
    describe('기본 동작', () => {
      it('단일 요일 선택 시 정확한 날짜 반환', () => {
        const result = calculateWeeklyWithSpecificDays(
          '2024-01-01', // 월요일
          '2024-01-15',
          1,
          { daysOfWeek: [1] } // 월요일만
        );
        expect(result).toEqual(['2024-01-01', '2024-01-08', '2024-01-15']);
      });

      it('복수 요일 선택 시 정확한 날짜 반환', () => {
        const result = calculateWeeklyWithSpecificDays(
          '2024-01-01', // 월요일
          '2024-01-07',
          1,
          { daysOfWeek: [1, 3, 5] } // 월, 수, 금
        );
        expect(result).toEqual(['2024-01-01', '2024-01-03', '2024-01-05']);
      });

      it('시작일이 선택된 요일이 아닌 경우', () => {
        const result = calculateWeeklyWithSpecificDays(
          '2024-01-02', // 화요일
          '2024-01-10',
          1,
          { daysOfWeek: [1, 5] } // 월, 금만
        );
        expect(result).toEqual(['2024-01-05', '2024-01-08']); // 금요일부터 시작
      });

      it('interval 간격으로 주 반복', () => {
        const result = calculateWeeklyWithSpecificDays(
          '2024-01-01', // 월요일
          '2024-01-29',
          2, // 격주
          { daysOfWeek: [1] } // 월요일
        );
        expect(result).toEqual(['2024-01-01', '2024-01-15', '2024-01-29']);
      });
    });

    describe('경계값 및 에러 케이스', () => {
      it('빈 요일 배열에 대해 빈 배열 반환', () => {
        const result = calculateWeeklyWithSpecificDays('2024-01-01', '2024-01-07', 1, {
          daysOfWeek: [],
        });
        expect(result).toEqual([]);
      });

      it('유효하지 않은 interval에 대해 빈 배열 반환', () => {
        const result = calculateWeeklyWithSpecificDays('2024-01-01', '2024-01-07', 0, {
          daysOfWeek: [1],
        });
        expect(result).toEqual([]);
      });

      it('시작일이 종료일보다 늦은 경우 빈 배열 반환', () => {
        const result = calculateWeeklyWithSpecificDays('2024-01-15', '2024-01-01', 1, {
          daysOfWeek: [1],
        });
        expect(result).toEqual([]);
      });

      it('MAX_END_DATE 이후로는 날짜 생성 안함', () => {
        const result = calculateWeeklyWithSpecificDays('2025-10-01', '2025-12-31', 1, {
          daysOfWeek: [1],
        });
        // 2025-10-30 이후 날짜는 포함되지 않아야 함
        expect(result.every((date) => date <= '2025-10-30')).toBe(true);
      });
    });

    describe('다양한 요일 조합', () => {
      it('평일만 선택 (월~금)', () => {
        const result = calculateWeeklyWithSpecificDays(
          '2024-01-01', // 월요일
          '2024-01-07',
          1,
          { daysOfWeek: [1, 2, 3, 4, 5] }
        );
        expect(result).toEqual([
          '2024-01-01',
          '2024-01-02',
          '2024-01-03',
          '2024-01-04',
          '2024-01-05',
        ]);
      });

      it('주말만 선택 (토, 일)', () => {
        const result = calculateWeeklyWithSpecificDays(
          '2024-01-01', // 월요일
          '2024-01-07',
          1,
          { daysOfWeek: [0, 6] } // 일, 토
        );
        expect(result).toEqual(['2024-01-06', '2024-01-07']);
      });

      it('모든 요일 선택', () => {
        const result = calculateWeeklyWithSpecificDays('2024-01-01', '2024-01-07', 1, {
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        });
        expect(result).toHaveLength(7);
      });
    });
  });

  describe('calculateRecurringDatesWithOptions', () => {
    it('weeklyOptions가 있는 주간 반복', () => {
      const result = calculateRecurringDatesWithOptions('2024-01-01', '2024-01-15', 'weekly', 1, {
        daysOfWeek: [1, 5],
      });
      expect(result).toEqual([
        '2024-01-01',
        '2024-01-05',
        '2024-01-08',
        '2024-01-12',
        '2024-01-15',
      ]);
    });

    it('weeklyOptions가 없는 주간 반복은 기존 로직 사용', () => {
      const result = calculateRecurringDatesWithOptions('2024-01-01', '2024-01-15', 'weekly', 1);
      expect(result).toEqual(['2024-01-01', '2024-01-08', '2024-01-15']);
    });

    it('주간이 아닌 반복 타입에서는 weeklyOptions 무시', () => {
      const result = calculateRecurringDatesWithOptions('2024-01-01', '2024-01-05', 'daily', 1, {
        daysOfWeek: [1],
      });
      // 매일 반복으로 동작해야 함
      expect(result).toEqual([
        '2024-01-01',
        '2024-01-02',
        '2024-01-03',
        '2024-01-04',
        '2024-01-05',
      ]);
    });
  });

  describe('generateRepeatEventsWithOptions', () => {
    const baseEvent: EventForm = {
      title: 'Test Event',
      date: '2024-01-01',
      startTime: '09:00',
      endTime: '10:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'weekly', interval: 1 },
      notificationTime: 10,
    };

    it('weeklyOptions가 있는 반복 일정 생성', () => {
      const eventWithOptions = {
        ...baseEvent,
        repeat: {
          ...baseEvent.repeat,
          endDate: '2024-01-15',
          weeklyOptions: { daysOfWeek: [1, 5] },
        },
      };

      const result = generateRepeatEventsWithOptions(eventWithOptions);
      expect(result).toHaveLength(5); // 1일(월), 5일(금), 8일(월), 12일(금), 15일(월)
      expect(result.map((e) => e.date)).toEqual([
        '2024-01-01',
        '2024-01-05',
        '2024-01-08',
        '2024-01-12',
        '2024-01-15',
      ]);
    });

    it('weeklyOptions가 없는 일정은 기존 방식으로 생성', () => {
      const eventWithoutOptions = {
        ...baseEvent,
        repeat: {
          ...baseEvent.repeat,
          endDate: '2024-01-15',
        },
      };

      const result = generateRepeatEventsWithOptions(eventWithoutOptions);
      expect(result).toHaveLength(3); // 1일, 8일, 15일
      expect(result.map((e) => e.date)).toEqual(['2024-01-01', '2024-01-08', '2024-01-15']);
    });
  });
});

describe('하위 호환성', () => {
  it('기존 calculateRecurringDates 함수 동작 유지', () => {
    const existingResult = calculateRecurringDates('2024-01-01', '2024-01-15', 'weekly', 1);
    const newResult = calculateRecurringDatesWithOptions('2024-01-01', '2024-01-15', 'weekly', 1);
    expect(newResult).toEqual(existingResult);
  });

  it('기존 generateRepeatEvents 함수와 일치', () => {
    const baseEvent: EventForm = {
      title: 'Test',
      date: '2024-01-01',
      startTime: '09:00',
      endTime: '10:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'weekly', interval: 1, endDate: '2024-01-15' },
      notificationTime: 10,
    };

    const existingResult = generateRepeatEvents(baseEvent);
    const newResult = generateRepeatEventsWithOptions(baseEvent);
    expect(newResult).toEqual(existingResult);
  });
});
