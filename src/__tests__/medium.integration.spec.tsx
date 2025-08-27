import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, within, act, waitForElementToBeRemoved } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { SnackbarProvider } from 'notistack';
import { OverlayProvider } from 'overlay-kit';
import { ReactElement } from 'react';
import { debug } from 'vitest-preview';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
  setupMockHandlerBatchCreation,
} from '../__mocks__/handlersUtils';
import App from '../App';
import { REPEAT_LABEL_MAP } from '../policy';
import { server } from '../setupTests';
import { Event } from '../types';

const theme = createTheme();

// ! Hard 여기 제공 안함
const setup = (element: ReactElement) => {
  const user = userEvent.setup();

  return {
    ...render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <OverlayProvider>{element}</OverlayProvider>
        </SnackbarProvider>
      </ThemeProvider>
    ),
    user,
  };
};

// ! Hard 여기 제공 안함
const saveSchedule = async (
  user: UserEvent,
  form: Omit<Event, 'id' | 'notificationTime' | 'repeat'>,
  options?: { submit?: boolean }
) => {
  const { title, date, startTime, endTime, location, description, category } = form;

  await user.click(screen.getAllByText('일정 추가')[0]);

  await user.type(screen.getByLabelText('제목'), title);
  await user.type(screen.getByLabelText('날짜'), date);
  await user.type(screen.getByLabelText('시작 시간'), startTime);
  await user.type(screen.getByLabelText('종료 시간'), endTime);
  await user.type(screen.getByLabelText('설명'), description);
  await user.type(screen.getByLabelText('위치'), location);
  await user.click(screen.getByLabelText('카테고리'));
  await user.click(within(screen.getByLabelText('카테고리')).getByRole('combobox'));
  await user.click(screen.getByRole('option', { name: `${category}-option` }));

  if (options?.submit !== false) {
    await user.click(screen.getByTestId('event-submit-button'));
  }
};

const saveRecurringSchedule = async (
  user: UserEvent,
  form: Omit<Event, 'id' | 'notificationTime'>,
  options?: { submit?: boolean }
) => {
  const { title, date, startTime, endTime, location, description, repeat } = form;

  await user.click(screen.getAllByText('일정 추가')[0]);

  await user.type(screen.getByLabelText('제목'), title);
  await user.type(screen.getByLabelText('날짜'), date);
  await user.type(screen.getByLabelText('시작 시간'), startTime);
  await user.type(screen.getByLabelText('종료 시간'), endTime);
  await user.type(screen.getByLabelText('설명'), description);
  await user.type(screen.getByLabelText('위치'), location);
  await user.click(screen.getByLabelText('카테고리'));
  await user.click(screen.getByLabelText('반복 유형'));
  await user.click(
    screen.getByRole('option', {
      name: `${REPEAT_LABEL_MAP[repeat.type as Exclude<Event['repeat']['type'], 'none'>]}`,
    })
  );
  await user.clear(screen.getByLabelText('반복 간격'));
  await user.type(screen.getByLabelText('반복 간격'), repeat.interval.toString());
  await user.type(screen.getByLabelText('반복 종료일'), repeat.endDate ?? '');

  if (options?.submit !== false) {
    await user.click(screen.getByTestId('event-submit-button'));
    await screen.findByText('반복 일정이 생성되었습니다.');
  }
};

describe('일정 CRUD 및 기본 기능', () => {
  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    setupMockHandlerCreation();

    const { user } = setup(<App />);

    await saveSchedule(user, {
      title: '새 회의',
      date: '2025-10-15',
      startTime: '14:00',
      endTime: '15:00',
      description: '프로젝트 진행 상황 논의',
      location: '회의실 A',
      category: '업무',
    });

    const eventList = within(screen.getByTestId('event-list'));
    expect(eventList.getByText('새 회의')).toBeInTheDocument();
    expect(eventList.getByText('2025-10-15')).toBeInTheDocument();
    expect(eventList.getByText('14:00 - 15:00')).toBeInTheDocument();
    expect(eventList.getByText('프로젝트 진행 상황 논의')).toBeInTheDocument();
    expect(eventList.getByText('회의실 A')).toBeInTheDocument();
    expect(eventList.getByText('카테고리: 업무')).toBeInTheDocument();
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {
    const { user } = setup(<App />);

    setupMockHandlerUpdating();

    await user.click(await screen.findByLabelText('Edit event'));

    await user.clear(screen.getByLabelText('제목'));
    await user.type(screen.getByLabelText('제목'), '수정된 회의');
    await user.clear(screen.getByLabelText('설명'));
    await user.type(screen.getByLabelText('설명'), '회의 내용 변경');

    await user.click(screen.getByTestId('event-submit-button'));

    const eventList = within(screen.getByTestId('event-list'));
    expect(eventList.getByText('수정된 회의')).toBeInTheDocument();
    expect(eventList.getByText('회의 내용 변경')).toBeInTheDocument();
  });

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
    setupMockHandlerDeletion();

    const { user } = setup(<App />);
    const eventList = within(screen.getByTestId('event-list'));
    expect(await eventList.findByText('삭제할 이벤트')).toBeInTheDocument();

    // 삭제 버튼 클릭
    const allDeleteButton = await screen.findAllByLabelText('Delete event');
    await user.click(allDeleteButton[0]);

    expect(eventList.queryByText('삭제할 이벤트')).not.toBeInTheDocument();
  });
});

describe('일정 뷰', () => {
  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {
    // ! 현재 시스템 시간 2025-10-01
    const { user } = setup(<App />);

    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'week-option' }));

    // ! 일정 로딩 완료 후 테스트
    await screen.findByText('일정 로딩 완료!');

    const eventList = within(screen.getByTestId('event-list'));
    expect(eventList.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {
    setupMockHandlerCreation();

    const { user } = setup(<App />);
    await saveSchedule(user, {
      title: '이번주 팀 회의',
      date: '2025-10-02',
      startTime: '09:00',
      endTime: '10:00',
      description: '이번주 팀 회의입니다.',
      location: '회의실 A',
      category: '업무',
    });

    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'week-option' }));

    const weekView = within(screen.getByTestId('week-view'));
    expect(weekView.getByText('이번주 팀 회의')).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
    vi.setSystemTime(new Date('2025-01-01'));

    setup(<App />);

    // ! 일정 로딩 완료 후 테스트
    await screen.findByText('일정 로딩 완료!');

    const eventList = within(screen.getByTestId('event-list'));
    expect(eventList.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
    setupMockHandlerCreation();

    const { user } = setup(<App />);
    await saveSchedule(user, {
      title: '이번달 팀 회의',
      date: '2025-10-02',
      startTime: '09:00',
      endTime: '10:00',
      description: '이번달 팀 회의입니다.',
      location: '회의실 A',
      category: '업무',
    });

    const monthView = within(screen.getByTestId('month-view'));
    expect(monthView.getByText('이번달 팀 회의')).toBeInTheDocument();
  });

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
    vi.setSystemTime(new Date('2025-01-01'));
    setup(<App />);

    const monthView = screen.getByTestId('month-view');

    // 1월 1일 셀 확인
    const januaryFirstCell = within(monthView).getByText('1').closest('td')!;
    expect(within(januaryFirstCell).getByText('신정')).toBeInTheDocument();
  });
});

describe('검색 기능', () => {
  beforeEach(() => {
    server.use(
      http.get('/api/events', () => {
        return HttpResponse.json({
          events: [
            {
              id: 1,
              title: '팀 회의',
              date: '2025-10-15',
              startTime: '09:00',
              endTime: '10:00',
              description: '주간 팀 미팅',
              location: '회의실 A',
              category: '업무',
              repeat: { type: 'none', interval: 0 },
              notificationTime: 10,
            },
            {
              id: 2,
              title: '프로젝트 계획',
              date: '2025-10-16',
              startTime: '14:00',
              endTime: '15:00',
              description: '새 프로젝트 계획 수립',
              location: '회의실 B',
              category: '업무',
              repeat: { type: 'none', interval: 0 },
              notificationTime: 10,
            },
          ],
        });
      })
    );
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {
    const { user } = setup(<App />);

    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    await user.type(searchInput, '존재하지 않는 일정');

    const eventList = within(screen.getByTestId('event-list'));
    expect(eventList.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {
    const { user } = setup(<App />);

    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    await user.type(searchInput, '팀 회의');

    const eventList = within(screen.getByTestId('event-list'));
    expect(eventList.getByText('팀 회의')).toBeInTheDocument();
  });

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
    const { user } = setup(<App />);

    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    await user.type(searchInput, '팀 회의');
    await user.clear(searchInput);

    const eventList = within(screen.getByTestId('event-list'));
    expect(eventList.getByText('팀 회의')).toBeInTheDocument();
    expect(eventList.getByText('프로젝트 계획')).toBeInTheDocument();
  });
});

describe('일정 충돌', () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {
    setupMockHandlerCreation([
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

    const { user } = setup(<App />);

    await saveSchedule(user, {
      title: '새 회의',
      date: '2025-10-15',
      startTime: '09:30',
      endTime: '10:30',
      description: '설명',
      location: '회의실 A',
      category: '업무',
    });

    debug();

    expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
    expect(screen.getByText(/다음 일정과 겹칩니다/)).toBeInTheDocument();
    expect(screen.getByText('기존 회의 (2025-10-15 09:00-10:00)')).toBeInTheDocument();
  });

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {
    setupMockHandlerUpdating();

    const { user } = setup(<App />);

    const editButton = (await screen.findAllByLabelText('Edit event'))[1];
    await user.click(editButton);

    // 시간 수정하여 다른 일정과 충돌 발생
    await user.clear(screen.getByLabelText('시작 시간'));
    await user.type(screen.getByLabelText('시작 시간'), '08:30');
    await user.clear(screen.getByLabelText('종료 시간'));
    await user.type(screen.getByLabelText('종료 시간'), '10:30');

    await user.click(screen.getByTestId('event-submit-button'));

    expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
    expect(screen.getByText(/다음 일정과 겹칩니다/)).toBeInTheDocument();
    expect(screen.getByText('기존 회의 (2025-10-15 09:00-10:00)')).toBeInTheDocument();
  });
});

describe('반복 일정 테스트', () => {
  it('반복 일정 편집 클릭이면 다이얼로그가 표시된다', async () => {
    setupMockHandlerBatchCreation([]);
    const { user } = setup(<App />);

    // Given 반복 일정 하나 저장
    await saveRecurringSchedule(
      user,
      {
        title: '반복 회의',
        date: '2025-10-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '반복 테스트',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'weekly', interval: 1, endDate: '2025-10-29' },
      },
      { submit: false }
    );

    await user.click(screen.getByTestId('event-submit-button'));
    await screen.findByText('반복 일정이 생성되었습니다.');

    // When 리스트 첫 항목의 Edit 클릭
    const editButtons = await screen.findAllByLabelText('Edit event');
    await user.click(editButtons[0]);

    // Then 다이얼로그 표시
    expect(
      await screen.findByRole('dialog', { name: /반복 일정을 수정하시겠어요/ })
    ).toBeInTheDocument();
  });

  it('이 일정만 수정 선택이면 편집 모드로 진입한다', async () => {
    setupMockHandlerBatchCreation([]);
    const { user } = setup(<App />);

    // Given 반복 일정 생성
    await saveSchedule(
      user,
      {
        title: '반복 회의',
        date: '2025-10-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '반복 테스트',
        location: '회의실 A',
        category: '업무',
      },
      { submit: false }
    );
    await user.click(screen.getByLabelText('반복 유형'));
    await user.click(screen.getByRole('option', { name: '매주' }));
    await user.clear(screen.getByLabelText('반복 간격'));
    await user.type(screen.getByLabelText('반복 간격'), '1');
    await user.type(screen.getByLabelText('반복 종료일'), '2025-10-29');
    await user.click(screen.getByTestId('event-submit-button'));
    await screen.findByText('반복 일정이 생성되었습니다.');

    // When 편집 클릭 후 "이 일정만 수정" 선택
    const editButtons = await screen.findAllByLabelText('Edit event');
    await user.click(editButtons[0]);
    const onlyThisBtn = await screen.findByRole('button', { name: '이 일정만 수정' });
    await user.click(onlyThisBtn);

    // Then 편집 모드 진입(제목 입력창이 해당 일정 제목으로 채워짐)
    expect(await screen.findByDisplayValue('반복 회의')).toBeInTheDocument();
  });

  it('취소 선택이면 변경 없이 종료된다', async () => {
    setupMockHandlerBatchCreation([]);
    const { user } = setup(<App />);

    // Given 반복 일정 생성
    await saveSchedule(
      user,
      {
        title: '반복 회의',
        date: '2025-10-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '반복 테스트',
        location: '회의실 A',
        category: '업무',
      },
      { submit: false }
    );
    await user.click(screen.getByLabelText('반복 유형'));
    await user.click(screen.getByRole('option', { name: '매주' }));
    await user.clear(screen.getByLabelText('반복 간격'));
    await user.type(screen.getByLabelText('반복 간격'), '1');
    await user.type(screen.getByLabelText('반복 종료일'), '2025-10-29');
    await user.click(screen.getByTestId('event-submit-button'));
    await screen.findByText('반복 일정이 생성되었습니다.');

    // When 편집 클릭 후 "취소" 선택
    const editButtons = await screen.findAllByLabelText('Edit event');
    await user.click(editButtons[0]);
    const cancelBtn = await screen.findByRole('button', { name: '취소' });
    await user.click(cancelBtn);

    // Then 다이얼로그가 사라지고, 폼은 편집 모드로 진입하지 않음(제목 입력값이 비어 있음)
    await waitForElementToBeRemoved(() =>
      screen.getByRole('dialog', { name: /반복 일정을 수정하시겠어요/ })
    );
    expect(screen.getByLabelText('제목')).toHaveValue('');
  });

  it('반복 일정이 켜져 있으면 반복 필드가 표시된다', async () => {
    // Given 앱이 렌더링되면
    setup(<App />);

    // When 반복일정 체크박스가 켜져있어야한다
    const checkbox = screen.getByRole('checkbox', { name: '반복 일정' });
    expect(checkbox).toBeChecked();

    // Then 반복 유형/간격/종료일 필드가 표시된다
    expect(screen.getByLabelText('반복 유형')).toBeInTheDocument();
    expect(screen.getByLabelText('반복 간격')).toBeInTheDocument();
    expect(screen.getByLabelText('반복 종료일')).toBeInTheDocument();
  });

  it('반복 유형 드롭다운을 열면 네 가지 옵션이 보인다', async () => {
    // Given 반복 필드가 표시되면
    const { user } = setup(<App />);

    const checkbox = screen.getByRole('checkbox', { name: '반복 일정' });
    expect(checkbox).toBeChecked();

    // When 드롭다운을 열면
    await user.click(screen.getByLabelText('반복 유형'));

    // Then 네 가지 옵션이 보인다
    expect(screen.getByRole('option', { name: '매일' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '매주' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '매월' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '매년' })).toBeInTheDocument();
  });

  it('종료일은 2025-10-30까지만 선택할 수 있다', async () => {
    // Given 반복 필드가 표시되면
    setup(<App />);

    const checkbox = screen.getByRole('checkbox', { name: '반복 일정' });
    expect(checkbox).toBeChecked();

    // When 종료일 입력 요소를 확인하면
    const endDateInput = screen.getByLabelText('반복 종료일');

    // Then max 속성이 2025-10-30으로 설정된다
    expect(endDateInput).toHaveAttribute('max', '2025-10-30');
  });

  it('반복 일정 저장 시 성공 스낵바가 노출된다', async () => {
    setupMockHandlerBatchCreation();

    const { user } = setup(<App />);
    await saveRecurringSchedule(
      user,
      {
        title: '반복 회의',
        date: '2025-10-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '반복 테스트',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'weekly', interval: 1, endDate: '2025-10-29' },
      },
      { submit: true }
    );

    expect(await screen.findByText('반복 일정이 생성되었습니다.')).toBeInTheDocument();
  });

  it('Week 뷰에 반복 일정이 표시된다', async () => {
    setupMockHandlerBatchCreation();

    const { user } = setup(<App />);
    await saveRecurringSchedule(
      user,
      {
        title: '반복 회의',
        date: '2025-10-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '반복 테스트',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'weekly', interval: 1, endDate: '2025-10-29' },
      },
      { submit: true }
    );

    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'week-option' }));
    const weekView = within(screen.getByTestId('week-view'));
    expect(await weekView.findByText('반복 회의')).toBeInTheDocument();
  });

  it('Month 뷰에 반복 일정이 표시된다', async () => {
    setupMockHandlerBatchCreation();

    const { user } = setup(<App />);
    await saveRecurringSchedule(
      user,
      {
        title: '반복 회의',
        date: '2025-10-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '반복 테스트',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'weekly', interval: 1, endDate: '2025-10-29' },
      },
      { submit: true }
    );

    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'month-option' }));
    const monthView = within(screen.getByTestId('month-view'));
    const monthHeader = screen.getByText(/\d{4}년 \d+월/);
    if (!/2025년 10월/.test(monthHeader.textContent || '')) {
      await user.click(screen.getByLabelText('Next'));
    }
    const items = await monthView.findAllByText('반복 회의');
    expect(items.length).toBeGreaterThan(0);
  });

  it('이 일정만 수정 후 저장하면 해당 이벤트만 반복 표시가 사라진다', async () => {
    // Given 월 단위 반복 일정이 생성되어 있을 때
    const mockEvents = setupMockHandlerBatchCreation([]);

    // PUT 핸들러만 별도 추가 (mockEvents 배열 업데이트)
    server.use(
      http.put('/api/events/:id', async ({ params, request }) => {
        const { id } = params;
        const updatedEvent = (await request.json()) as Event;

        // mockEvents 배열에서 해당 이벤트 찾아서 업데이트
        const index = mockEvents.findIndex((event) => event.id === id);
        if (index !== -1) {
          mockEvents[index] = { ...mockEvents[index], ...updatedEvent };
        }

        return HttpResponse.json(mockEvents[index]);
      })
    );

    const { user } = setup(<App />);
    await saveRecurringSchedule(
      user,
      {
        title: '반복 회의',
        date: '2025-10-01',
        startTime: '09:00',
        endTime: '10:00',
        description: '반복 테스트',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'monthly', interval: 1, endDate: '2025-11-29' },
      },
      { submit: true }
    );

    // When 첫 번째 항목을 편집하고 "이 일정만 수정"을 선택하여 저장하면
    const editButtons = await screen.findAllByLabelText('Edit event');
    await user.click(editButtons[0]);
    const onlyThisBtn = await screen.findByRole('button', { name: '이 일정만 수정' });
    await user.click(onlyThisBtn);
    await user.click(screen.getByTestId('event-submit-button'));

    // Then 해당 이벤트는 존재하지만 반복 일정 아이콘은 사라진다
    const eventList = within(screen.getByTestId('event-list'));
    expect(eventList.getByText('반복 회의')).toBeInTheDocument();
    expect(eventList.queryByLabelText('반복 일정 아이콘')).toBeNull();
  });
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {
  vi.setSystemTime(new Date('2025-10-15 08:49:59'));

  setup(<App />);

  // ! 일정 로딩 완료 후 테스트
  await screen.findByText('일정 로딩 완료!');

  expect(screen.queryByText('10분 후 기존 회의 일정이 시작됩니다.')).not.toBeInTheDocument();

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(screen.getByText('10분 후 기존 회의 일정이 시작됩니다.')).toBeInTheDocument();
});
