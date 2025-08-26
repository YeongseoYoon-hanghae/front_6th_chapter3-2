import { describe, it, expect } from 'vitest';

import { EventForm } from '../../types';
import { calculateRecurringDates, generateRepeatEvents } from '../../utils/recurringUtils';

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
