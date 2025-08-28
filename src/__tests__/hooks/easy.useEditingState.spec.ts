import { act, renderHook } from '@testing-library/react';

import { useEditingState } from '../../hooks/useEditingState';
import { Event } from '../../types';

const mockEvent: Event = {
  id: '1',
  title: '테스트 이벤트',
  date: '2025-10-01',
  startTime: '10:00',
  endTime: '11:00',
  description: '',
  location: '',
  category: '',
  repeat: { type: 'none', interval: 1 },
  notificationTime: 10,
};

const mockRecurringEvent: Event = {
  id: '2',
  title: '반복 이벤트',
  date: '2025-10-01',
  startTime: '09:00',
  endTime: '10:00',
  description: '',
  location: '',
  category: '',
  repeat: { type: 'weekly', interval: 1 },
  notificationTime: 10,
};

describe('useEditingState 초기 상태', () => {
  it('editingEvent는 null이어야 한다', () => {
    const { result } = renderHook(() => useEditingState());

    expect(result.current.editingEvent).toBe(null);
  });

  it('isEditing은 false이어야 한다', () => {
    const { result } = renderHook(() => useEditingState());

    expect(result.current.isEditing).toBe(false);
  });

  it('isSingleEdit는 false이어야 한다', () => {
    const { result } = renderHook(() => useEditingState());

    expect(result.current.isSingleEdit).toBe(false);
  });
});

describe('일반 편집 모드', () => {
  it('startEdit 호출 시 일반 편집 모드로 진입한다', () => {
    const { result } = renderHook(() => useEditingState());

    act(() => {
      result.current.startEdit(mockEvent);
    });

    expect(result.current.editingEvent).toBe(mockEvent);
    expect(result.current.isEditing).toBe(true);
    expect(result.current.isSingleEdit).toBe(false);
  });

  it('startEditing 호출 시에도 일반 편집 모드로 진입한다 (기존 호환성)', () => {
    const { result } = renderHook(() => useEditingState());

    act(() => {
      result.current.startEditing(mockEvent);
    });

    expect(result.current.editingEvent).toBe(mockEvent);
    expect(result.current.isEditing).toBe(true);
    expect(result.current.isSingleEdit).toBe(false);
  });
});

describe('단일 편집 모드', () => {
  it('startSingleEdit 호출 시 단일 편집 모드로 진입한다', () => {
    const { result } = renderHook(() => useEditingState());

    act(() => {
      result.current.startSingleEdit(mockRecurringEvent);
    });

    expect(result.current.editingEvent).toBe(mockRecurringEvent);
    expect(result.current.isEditing).toBe(true);
    expect(result.current.isSingleEdit).toBe(true);
  });
});

describe('편집 종료', () => {
  it('stopEditing 호출 시 모든 상태가 초기화된다', () => {
    const { result } = renderHook(() => useEditingState());

    // 단일 편집 모드로 진입
    act(() => {
      result.current.startSingleEdit(mockRecurringEvent);
    });

    // 편집 종료
    act(() => {
      result.current.stopEditing();
    });

    expect(result.current.editingEvent).toBe(null);
    expect(result.current.isEditing).toBe(false);
    expect(result.current.isSingleEdit).toBe(false);
  });

  it('일반 편집에서 stopEditing 호출 시에도 모든 상태가 초기화된다', () => {
    const { result } = renderHook(() => useEditingState());

    // 일반 편집 모드로 진입
    act(() => {
      result.current.startEdit(mockEvent);
    });

    // 편집 종료
    act(() => {
      result.current.stopEditing();
    });

    expect(result.current.editingEvent).toBe(null);
    expect(result.current.isEditing).toBe(false);
    expect(result.current.isSingleEdit).toBe(false);
  });
});

describe('상태 전환', () => {
  it('일반 편집에서 단일 편집으로 전환할 수 있다', () => {
    const { result } = renderHook(() => useEditingState());

    // 일반 편집 모드로 진입
    act(() => {
      result.current.startEdit(mockEvent);
    });

    expect(result.current.isSingleEdit).toBe(false);

    // 단일 편집 모드로 전환
    act(() => {
      result.current.startSingleEdit(mockRecurringEvent);
    });

    expect(result.current.editingEvent).toBe(mockRecurringEvent);
    expect(result.current.isEditing).toBe(true);
    expect(result.current.isSingleEdit).toBe(true);
  });

  it('단일 편집에서 일반 편집으로 전환할 수 있다', () => {
    const { result } = renderHook(() => useEditingState());

    // 단일 편집 모드로 진입
    act(() => {
      result.current.startSingleEdit(mockRecurringEvent);
    });

    expect(result.current.isSingleEdit).toBe(true);

    // 일반 편집 모드로 전환
    act(() => {
      result.current.startEdit(mockEvent);
    });

    expect(result.current.editingEvent).toBe(mockEvent);
    expect(result.current.isEditing).toBe(true);
    expect(result.current.isSingleEdit).toBe(false);
  });
});
