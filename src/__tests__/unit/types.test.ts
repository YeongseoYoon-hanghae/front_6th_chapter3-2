import { describe, it, expect } from 'vitest';

import type { WeeklyOptions, RepeatInfo } from '../../types';
import { hasWeeklyOptions, isValidDaysOfWeek } from '../../types';

describe('WeeklyOptions', () => {
  describe('정상 케이스', () => {
    it('단일 요일을 받아들여야 한다', () => {
      const options: WeeklyOptions = { daysOfWeek: [2] };
      expect(options.daysOfWeek).toEqual([2]);
      expect(options.daysOfWeek).toHaveLength(1);
    });

    it('복수 요일을 받아들여야 한다', () => {
      const options: WeeklyOptions = { daysOfWeek: [1, 3, 5] };
      expect(options.daysOfWeek).toEqual([1, 3, 5]);
      expect(options.daysOfWeek).toHaveLength(3);
    });
  });

  describe('경계값 케이스', () => {
    it('빈 배열을 받아들여야 한다', () => {
      const options: WeeklyOptions = { daysOfWeek: [] };
      expect(options.daysOfWeek).toEqual([]);
      expect(options.daysOfWeek).toHaveLength(0);
    });

    it('최소값(0) 요일을 받아들여야 한다', () => {
      const options: WeeklyOptions = { daysOfWeek: [0] };
      expect(options.daysOfWeek).toEqual([0]);
      expect(options.daysOfWeek[0]).toBe(0);
    });

    it('최대값(6) 요일을 받아들여야 한다', () => {
      const options: WeeklyOptions = { daysOfWeek: [6] };
      expect(options.daysOfWeek).toEqual([6]);
      expect(options.daysOfWeek[0]).toBe(6);
    });

    it('중간값 요일들을 받아들여야 한다', () => {
      const options: WeeklyOptions = { daysOfWeek: [2, 3, 4] };
      expect(options.daysOfWeek).toEqual([2, 3, 4]);
      expect(options.daysOfWeek).toHaveLength(3);
    });
  });
});

describe('RepeatInfo with weeklyOptions', () => {
  describe('정상 케이스', () => {
    it('weeklyOptions 없이도 동작해야 한다 (하위 호환성)', () => {
      const repeat: RepeatInfo = {
        type: 'weekly',
        interval: 1,
      };
      expect(repeat.weeklyOptions).toBeUndefined();
      expect(repeat.type).toBe('weekly');
      expect(repeat.interval).toBe(1);
    });

    it('weeklyOptions가 제공될 때 받아들여야 한다', () => {
      const repeat: RepeatInfo = {
        type: 'weekly',
        interval: 1,
        weeklyOptions: { daysOfWeek: [1, 3, 5] },
      };
      expect(repeat.weeklyOptions?.daysOfWeek).toEqual([1, 3, 5]);
      expect(repeat.type).toBe('weekly');
      expect(repeat.interval).toBe(1);
    });

    it('모든 기존 필드를 유지해야 한다', () => {
      const repeat: RepeatInfo = {
        type: 'monthly',
        interval: 2,
        endDate: '2024-12-31',
        id: 'test-id',
        weeklyOptions: { daysOfWeek: [0, 6] },
      };

      expect(repeat.type).toBe('monthly');
      expect(repeat.interval).toBe(2);
      expect(repeat.endDate).toBe('2024-12-31');
      expect(repeat.id).toBe('test-id');
      expect(repeat.weeklyOptions?.daysOfWeek).toEqual([0, 6]);
    });

    it('다양한 반복 타입에서 weeklyOptions를 가질 수 있어야 한다', () => {
      const weeklyRepeat: RepeatInfo = {
        type: 'weekly',
        interval: 1,
        weeklyOptions: { daysOfWeek: [1, 3, 5] },
      };
      const monthlyRepeat: RepeatInfo = {
        type: 'monthly',
        interval: 1,
        weeklyOptions: { daysOfWeek: [0, 6] },
      };

      expect(weeklyRepeat.weeklyOptions?.daysOfWeek).toEqual([1, 3, 5]);
      expect(monthlyRepeat.weeklyOptions?.daysOfWeek).toEqual([0, 6]);
    });
  });

  describe('경계값 케이스', () => {
    it('최소 interval 값에서 동작해야 한다', () => {
      const repeat: RepeatInfo = {
        type: 'weekly',
        interval: 0,
        weeklyOptions: { daysOfWeek: [1] },
      };
      expect(repeat.interval).toBe(0);
      expect(repeat.weeklyOptions?.daysOfWeek).toEqual([1]);
    });

    it('큰 interval 값에서 동작해야 한다', () => {
      const repeat: RepeatInfo = {
        type: 'weekly',
        interval: 999,
        weeklyOptions: { daysOfWeek: [0, 1, 2, 3, 4, 5, 6] },
      };
      expect(repeat.interval).toBe(999);
      expect(repeat.weeklyOptions?.daysOfWeek).toHaveLength(7);
    });

    it('빈 weeklyOptions를 가질 수 있어야 한다', () => {
      const repeat: RepeatInfo = {
        type: 'weekly',
        interval: 1,
        weeklyOptions: { daysOfWeek: [] },
      };
      expect(repeat.weeklyOptions?.daysOfWeek).toEqual([]);
      expect(repeat.weeklyOptions?.daysOfWeek).toHaveLength(0);
    });

    it('단일 요일만 선택된 weeklyOptions를 가질 수 있어야 한다', () => {
      const repeat: RepeatInfo = {
        type: 'weekly',
        interval: 1,
        weeklyOptions: { daysOfWeek: [3] },
      };
      expect(repeat.weeklyOptions?.daysOfWeek).toEqual([3]);
      expect(repeat.weeklyOptions?.daysOfWeek).toHaveLength(1);
    });

    it('모든 요일이 선택된 weeklyOptions를 가질 수 있어야 한다', () => {
      const repeat: RepeatInfo = {
        type: 'weekly',
        interval: 1,
        weeklyOptions: { daysOfWeek: [0, 1, 2, 3, 4, 5, 6] },
      };
      expect(repeat.weeklyOptions?.daysOfWeek).toEqual([0, 1, 2, 3, 4, 5, 6]);
      expect(repeat.weeklyOptions?.daysOfWeek).toHaveLength(7);
    });
  });
});

describe('Type Guard Functions', () => {
  describe('hasWeeklyOptions', () => {
    describe('정상 케이스', () => {
      it('weekly 반복에 weeklyOptions가 있으면 true를 반환해야 한다', () => {
        const repeat: RepeatInfo = {
          type: 'weekly',
          interval: 1,
          weeklyOptions: { daysOfWeek: [1, 3, 5] },
        };
        expect(hasWeeklyOptions(repeat)).toBe(true);
      });

      it('weekly 반복에 weeklyOptions가 없으면 false를 반환해야 한다', () => {
        const repeat: RepeatInfo = { type: 'weekly', interval: 1 };
        expect(hasWeeklyOptions(repeat)).toBe(false);
      });

      it('weekly가 아닌 반복이면 false를 반환해야 한다', () => {
        const repeat: RepeatInfo = { type: 'daily', interval: 1 };
        expect(hasWeeklyOptions(repeat)).toBe(false);
      });

      it('weekly가 아닌 반복에 weeklyOptions가 있어도 false를 반환해야 한다', () => {
        const repeat: RepeatInfo = {
          type: 'monthly',
          interval: 1,
          weeklyOptions: { daysOfWeek: [1, 3] },
        };
        expect(hasWeeklyOptions(repeat)).toBe(false);
      });
    });

    describe('경계값 케이스', () => {
      it('none 타입 반복에서 false를 반환해야 한다', () => {
        const repeat: RepeatInfo = { type: 'none', interval: 0 };
        expect(hasWeeklyOptions(repeat)).toBe(false);
      });

      it('yearly 타입 반복에서 false를 반환해야 한다', () => {
        const repeat: RepeatInfo = { type: 'yearly', interval: 1 };
        expect(hasWeeklyOptions(repeat)).toBe(false);
      });

      it('interval이 0인 weekly 반복에서도 false를 반환해야 한다', () => {
        const repeat: RepeatInfo = { type: 'weekly', interval: 0 };
        expect(hasWeeklyOptions(repeat)).toBe(false);
      });

      it('interval이 큰 값인 weekly 반복에서도 false를 반환해야 한다', () => {
        const repeat: RepeatInfo = { type: 'weekly', interval: 999 };
        expect(hasWeeklyOptions(repeat)).toBe(false);
      });

      it('빈 weeklyOptions를 가진 weekly 반복에서도 true를 반환해야 한다', () => {
        const repeat: RepeatInfo = {
          type: 'weekly',
          interval: 1,
          weeklyOptions: { daysOfWeek: [] },
        };
        expect(hasWeeklyOptions(repeat)).toBe(true);
      });
    });
  });

  describe('isValidDaysOfWeek', () => {
    describe('정상 케이스', () => {
      it('단일 유효한 요일이면 true를 반환해야 한다', () => {
        expect(isValidDaysOfWeek([0])).toBe(true);
        expect(isValidDaysOfWeek([3])).toBe(true);
        expect(isValidDaysOfWeek([6])).toBe(true);
      });

      it('복수 유효한 요일이면 true를 반환해야 한다', () => {
        expect(isValidDaysOfWeek([1, 3, 5])).toBe(true);
        expect(isValidDaysOfWeek([0, 2, 4, 6])).toBe(true);
        expect(isValidDaysOfWeek([2, 4])).toBe(true);
      });

      it('모든 요일이면 true를 반환해야 한다', () => {
        expect(isValidDaysOfWeek([0, 1, 2, 3, 4, 5, 6])).toBe(true);
      });

      it('연속된 요일이면 true를 반환해야 한다', () => {
        expect(isValidDaysOfWeek([0, 1, 2])).toBe(true);
        expect(isValidDaysOfWeek([4, 5, 6])).toBe(true);
        expect(isValidDaysOfWeek([1, 2, 3, 4])).toBe(true);
      });

      it('순서가 뒤바뀐 요일이어도 true를 반환해야 한다', () => {
        expect(isValidDaysOfWeek([3, 1, 5])).toBe(true);
        expect(isValidDaysOfWeek([6, 5, 4, 3, 2, 1, 0])).toBe(true);
        expect(isValidDaysOfWeek([5, 3, 1])).toBe(true);
      });

      it('주중만 선택된 요일이면 true를 반환해야 한다', () => {
        expect(isValidDaysOfWeek([1, 2, 3, 4, 5])).toBe(true);
      });

      it('주말만 선택된 요일이면 true를 반환해야 한다', () => {
        expect(isValidDaysOfWeek([0, 6])).toBe(true);
      });
    });

    describe('경계값 케이스', () => {
      it('최소값(0)과 최대값(6)을 동시에 가진 배열이면 true를 반환해야 한다', () => {
        expect(isValidDaysOfWeek([0, 6])).toBe(true);
        expect(isValidDaysOfWeek([6, 0])).toBe(true);
      });

      it('중간값들만 가진 배열이면 true를 반환해야 한다', () => {
        expect(isValidDaysOfWeek([2, 3, 4])).toBe(true);
        expect(isValidDaysOfWeek([1, 5])).toBe(true);
      });

      it('짝수 요일만 가진 배열이면 true를 반환해야 한다', () => {
        expect(isValidDaysOfWeek([0, 2, 4, 6])).toBe(true);
      });

      it('홀수 요일만 가진 배열이면 true를 반환해야 한다', () => {
        expect(isValidDaysOfWeek([1, 3, 5])).toBe(true);
      });
    });

    describe('유효하지 않은 케이스', () => {
      it('빈 배열이면 false를 반환해야 한다', () => {
        expect(isValidDaysOfWeek([])).toBe(false);
      });

      it('범위를 벗어난 음수 값이 포함되면 false를 반환해야 한다', () => {
        expect(isValidDaysOfWeek([-1, 1])).toBe(false);
        expect(isValidDaysOfWeek([-1])).toBe(false);
        expect(isValidDaysOfWeek([-5, 0, 3])).toBe(false);
      });

      it('범위를 벗어난 양수 값이 포함되면 false를 반환해야 한다', () => {
        expect(isValidDaysOfWeek([1, 7])).toBe(false);
        expect(isValidDaysOfWeek([7])).toBe(false);
        expect(isValidDaysOfWeek([0, 8, 3])).toBe(false);
      });

      it('중복된 값이 포함되면 false를 반환해야 한다', () => {
        expect(isValidDaysOfWeek([1, 1, 3])).toBe(false);
        expect(isValidDaysOfWeek([0, 0])).toBe(false);
        expect(isValidDaysOfWeek([2, 4, 2])).toBe(false);
        expect(isValidDaysOfWeek([1, 3, 5, 1])).toBe(false);
      });

      it('혼합된 유효하지 않은 값들이 포함되면 false를 반환해야 한다', () => {
        expect(isValidDaysOfWeek([-1, 1, 7])).toBe(false);
        expect(isValidDaysOfWeek([0, 0, 8])).toBe(false);
        expect(isValidDaysOfWeek([1, 1, -1, 3])).toBe(false);
      });
    });
  });
});
