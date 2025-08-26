import { act, renderHook } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
  setupMockHandlerBatchCreation,
} from '../../__mocks__/handlersUtils.ts';
import { useEventOperations } from '../../hooks/useEventOperations.ts';
import { server } from '../../setupTests.ts';
import { Event, RepeatType } from '../../types.ts';

const enqueueSnackbarFn = vi.fn();

vi.mock('notistack', async () => {
  const actual = await vi.importActual('notistack');
  return {
    ...actual,
    useSnackbar: () => ({
      enqueueSnackbar: enqueueSnackbarFn,
    }),
  };
});

it('저장되어있는 초기 이벤트 데이터를 적절하게 불러온다', async () => {
  const { result } = renderHook(() => useEventOperations(false));

  await act(() => Promise.resolve(null));

  expect(result.current.events).toEqual([
    {
      id: '1',
      title: '기존 회의',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ]);
});

it('정의된 이벤트 정보를 기준으로 적절하게 저장이 된다', async () => {
  setupMockHandlerCreation(); // ? Med: 이걸 왜 써야하는지 물어보자

  const { result } = renderHook(() => useEventOperations(false));

  await act(() => Promise.resolve(null));

  const newEvent: Event = {
    id: '1',
    title: '새 회의',
    date: '2025-10-16',
    startTime: '11:00',
    endTime: '12:00',
    description: '새로운 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  };

  await act(async () => {
    await result.current.saveEvent(newEvent);
  });

  expect(result.current.events).toEqual([{ ...newEvent, id: '1' }]);
});

it("새로 정의된 'title', 'endTime' 기준으로 적절하게 일정이 업데이트 된다", async () => {
  setupMockHandlerUpdating();

  const { result } = renderHook(() => useEventOperations(true));

  await act(() => Promise.resolve(null));

  const updatedEvent: Event = {
    id: '1',
    date: '2025-10-15',
    startTime: '09:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
    title: '수정된 회의',
    endTime: '11:00',
  };

  await act(async () => {
    await result.current.saveEvent(updatedEvent);
  });

  expect(result.current.events[0]).toEqual(updatedEvent);
});

it('존재하는 이벤트 삭제 시 에러없이 아이템이 삭제된다.', async () => {
  setupMockHandlerDeletion();

  const { result } = renderHook(() => useEventOperations(false));

  await act(async () => {
    await result.current.deleteEvent('1');
  });

  await act(() => Promise.resolve(null));

  expect(result.current.events).toEqual([]);
});

it("이벤트 로딩 실패 시 '이벤트 로딩 실패'라는 텍스트와 함께 에러 토스트가 표시되어야 한다", async () => {
  server.use(
    http.get('/api/events', () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  renderHook(() => useEventOperations(true));

  await act(() => Promise.resolve(null));

  expect(enqueueSnackbarFn).toHaveBeenCalledWith('이벤트 로딩 실패', { variant: 'error' });

  server.resetHandlers();
});

it("존재하지 않는 이벤트 수정 시 '일정 저장 실패'라는 토스트가 노출되며 에러 처리가 되어야 한다", async () => {
  const { result } = renderHook(() => useEventOperations(true));

  await act(() => Promise.resolve(null));

  const nonExistentEvent: Event = {
    id: '999', // 존재하지 않는 ID
    title: '존재하지 않는 이벤트',
    date: '2025-07-20',
    startTime: '09:00',
    endTime: '10:00',
    description: '이 이벤트는 존재하지 않습니다',
    location: '어딘가',
    category: '기타',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  };

  await act(async () => {
    await result.current.saveEvent(nonExistentEvent);
  });

  expect(enqueueSnackbarFn).toHaveBeenCalledWith('일정 저장 실패', { variant: 'error' });
});

it("네트워크 오류 시 '일정 삭제 실패'라는 텍스트가 노출되며 이벤트 삭제가 실패해야 한다", async () => {
  server.use(
    http.delete('/api/events/:id', () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  const { result } = renderHook(() => useEventOperations(false));

  await act(() => Promise.resolve(null));

  await act(async () => {
    await result.current.deleteEvent('1');
  });

  expect(enqueueSnackbarFn).toHaveBeenCalledWith('일정 삭제 실패', { variant: 'error' });

  expect(result.current.events).toHaveLength(1);
});

describe('반복 일정 배치 생성', () => {
  it('반복 일정을 배치로 생성하면 반복 그룹 ID가 할당되고 성공 메시지가 표시된다', async () => {
    // Given 반복 일정 데이터가 있으면
    setupMockHandlerBatchCreation();

    const baseEvent = {
      title: '팀 회의',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '팀 회의입니다',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'daily' as RepeatType, interval: 1, endDate: '2025-10-17' },
      notificationTime: 10,
    };

    const dates = ['2025-10-15', '2025-10-16', '2025-10-17'];

    // When 반복 일정을 배치로 생성하면
    const { result } = renderHook(() => useEventOperations(false));

    await act(() => Promise.resolve(null));

    await act(async () => {
      await result.current.createRecurringEvents(baseEvent, dates);
    });

    // Then 반복 그룹 ID가 할당되고 성공 메시지가 표시된다
    expect(result.current.events).toHaveLength(3);
    expect(enqueueSnackbarFn).toHaveBeenCalledWith('반복 일정이 생성되었습니다.', {
      variant: 'success',
    });

    // And 반복 그룹 ID가 모두 존재하고 동일하다
    const repeatEvents = result.current.events.filter((e) => e.repeat.type !== 'none');
    const groupIds = repeatEvents.map((e) => (e as Event).repeat.id);
    expect(groupIds.every((id) => typeof id === 'string' && id.length > 0)).toBe(true);
    const uniqueGroupIds = Array.from(new Set(groupIds));
    expect(uniqueGroupIds).toHaveLength(1);
  });

  it('반복 일정 배치 생성 실패 시 오류 메시지가 표시된다', async () => {
    // Given 서버 오류가 발생하면
    server.use(
      http.post('/api/events-list', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const baseEvent = {
      title: '팀 회의',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '팀 회의입니다',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'daily' as RepeatType, interval: 1, endDate: '2025-10-17' },
      notificationTime: 10,
    };

    const dates = ['2025-10-15', '2025-10-16', '2025-10-17'];

    // When 반복 일정을 배치로 생성하면
    const { result } = renderHook(() => useEventOperations(false));

    await act(() => Promise.resolve(null));

    await act(async () => {
      await result.current.createRecurringEvents(baseEvent, dates);
    });

    // Then 오류 메시지가 표시된다
    expect(enqueueSnackbarFn).toHaveBeenCalledWith('반복 일정 생성 실패', { variant: 'error' });

    server.resetHandlers();
  });

  it('반복 설정이 없는 일정은 반복 그룹 ID 없이 생성된다', async () => {
    // Given 반복 설정이 없는 일정 데이터가 있으면
    setupMockHandlerBatchCreation();

    const baseEvent = {
      title: '일회성 회의',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '일회성 회의입니다',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'none' as RepeatType, interval: 0 },
      notificationTime: 10,
    };

    const dates = ['2025-10-15'];

    // When 반복 일정을 배치로 생성하면
    const { result } = renderHook(() => useEventOperations(false));

    await act(() => Promise.resolve(null));

    await act(async () => {
      await result.current.createRecurringEvents(baseEvent, dates);
    });

    // Then 반복 그룹 ID 없이 생성된다
    expect(result.current.events).toHaveLength(1);
    expect(enqueueSnackbarFn).toHaveBeenCalledWith('반복 일정이 생성되었습니다.', {
      variant: 'success',
    });

    // And 반복 그룹 ID는 부여되지 않는다
    const [created] = result.current.events;
    expect((created as Event).repeat?.id).toBeUndefined();
  });
});
