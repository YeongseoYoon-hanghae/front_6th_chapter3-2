# React 클린코드 기반 Brownfield 리팩토링 아키텍처

## 🏗️ 개요

이 문서는 기존 캘린더 애플리케이션의 **점진적 클린코드 리팩토링**을 위한 아키텍처입니다. **MUST NOT EFFECT TO THE BROWNFIELD CODE** 원칙 하에 기존 기능에 절대 영향을 주지 않으면서 **선언적 프로그래밍** 패턴으로 점진적 개선을 수행합니다.

### 핵심 원칙

1. **📋 선언적 프로그래밍** - What을 명확히 표현하는 코드 구조
2. **🔒 기존 코드 무손상** - Brownfield 코드에 절대 영향 없음
3. **⚡ 점진적 마이그레이션** - 새로운 패턴을 단계별로 도입
4. **🎯 관심사 분리** - 각 레이어의 명확한 책임 분담
5. **🧪 테스트 가능성** - 모든 새 코드는 완전한 테스트 커버리지

## 📊 현재 시스템 분석

### 기존 아키텍처 현황

```typescript
// 현재 구조 (유지됨)
src/
├── App.tsx                 # 단일 메인 컴포넌트 (273 라인)
├── components/             # UI 컴포넌트들
│   ├── EventForm.tsx      # 복잡한 폼 컴포넌트 (274 라인)
│   ├── CalendarView.tsx   # 캘린더 뷰
│   └── ...
├── hooks/                  # 커스텀 훅들
│   ├── useEventForm.ts    # 폼 상태 관리
│   ├── useEditingState.ts # 편집 상태 관리
│   └── ...
├── utils/                  # 유틸리티 함수들
│   ├── recurringUtils.ts  # 반복 일정 로직
│   └── ...
└── types.ts               # 타입 정의
```

### 식별된 리팩토링 기회

1. **App.tsx 복잡도** - 273라인의 단일 컴포넌트
2. **EventForm.tsx 비대함** - 274라인의 복잡한 폼
3. **Props Drilling** - 깊은 props 전달 체인
4. **비즈니스 로직 혼재** - UI와 로직의 혼재
5. **테스트 어려움** - 복잡한 컴포넌트 구조

## 🎯 클린코드 리팩토링 전략

### Phase 1: 선언적 컴포넌트 분리 (무손상)

**목표**: 기존 코드 변경 없이 새로운 선언적 컴포넌트 도입

```typescript
// 새로운 선언적 컴포넌트 구조 (기존과 병행)
src/
├── components/              # 기존 컴포넌트 (유지)
│   ├── EventForm.tsx       # 기존 유지
│   └── ...
├── components-v2/           # 새로운 클린코드 컴포넌트
│   ├── declarative/         # 선언적 컴포넌트
│   │   ├── Calendar/
│   │   │   ├── Calendar.tsx           # 순수한 캘린더 컴포넌트
│   │   │   ├── CalendarProvider.tsx   # 상태 제공자
│   │   │   └── index.ts
│   │   ├── EventForm/
│   │   │   ├── EventForm.tsx          # 선언적 폼
│   │   │   ├── EventFormProvider.tsx  # 폼 상태 관리
│   │   │   ├── EventFormFields.tsx    # 필드 컴포넌트
│   │   │   └── index.ts
│   │   └── EventList/
│   ├── atomic/              # 원자 수준 컴포넌트
│   │   ├── Form/
│   │   │   ├── FormField.tsx
│   │   │   ├── FormButton.tsx
│   │   │   └── FormValidation.tsx
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Dialog/
│   └── composite/           # 합성 컴포넌트
│       ├── EventCard/
│       ├── DatePicker/
│       └── TimeSlot/
```

### Phase 2: 상태 관리 클린코드화

**목표**: 명확한 상태 관리 패턴 도입

```typescript
// 새로운 상태 관리 구조
src/
├── state/                   # 새로운 상태 관리
│   ├── contexts/            # React Context
│   │   ├── CalendarContext.tsx
│   │   ├── EventFormContext.tsx
│   │   └── NotificationContext.tsx
│   ├── stores/              # 상태 저장소
│   │   ├── calendarStore.ts
│   │   ├── eventStore.ts
│   │   └── uiStore.ts
│   ├── selectors/           # 선택자 패턴
│   │   ├── calendarSelectors.ts
│   │   └── eventSelectors.ts
│   └── actions/             # 액션 정의
│       ├── calendarActions.ts
│       └── eventActions.ts
```

### Phase 3: 비즈니스 로직 분리

**목표**: 도메인 로직을 UI에서 완전 분리

```typescript
// 비즈니스 로직 레이어
src/
├── domain/                  # 도메인 레이어
│   ├── entities/            # 엔티티
│   │   ├── Event.ts
│   │   ├── Calendar.ts
│   │   └── RecurringEvent.ts
│   ├── repositories/        # 저장소 패턴
│   │   ├── EventRepository.ts
│   │   └── CalendarRepository.ts
│   ├── services/            # 도메인 서비스
│   │   ├── EventService.ts
│   │   ├── RecurringService.ts
│   │   └── NotificationService.ts
│   └── usecases/            # 유스케이스
│       ├── CreateEventUseCase.ts
│       ├── UpdateEventUseCase.ts
│       └── DeleteEventUseCase.ts
```

## 🏗️ 아키텍처 레이어 정의

### 1. Presentation Layer (선언적 UI)

```typescript
// 예시: 선언적 캘린더 컴포넌트
interface CalendarProps {
  events: Event[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onEventCreate: (event: Partial<Event>) => void;
  renderEvent?: (event: Event) => ReactNode;
}

export const Calendar: React.FC<CalendarProps> = ({
  events,
  selectedDate,
  onDateSelect,
  onEventCreate,
  renderEvent = DefaultEventRenderer,
}) => {
  return (
    <CalendarProvider>
      <CalendarHeader selectedDate={selectedDate} />
      <CalendarGrid
        events={events}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        renderEvent={renderEvent}
      />
      <CalendarActions onEventCreate={onEventCreate} />
    </CalendarProvider>
  );
};
```

### 2. State Management Layer (선언적 상태)

```typescript
// 선언적 상태 관리
interface CalendarState {
  readonly currentDate: Date;
  readonly selectedDate: Date | null;
  readonly events: ReadonlyArray<Event>;
  readonly isLoading: boolean;
  readonly error: string | null;
}

interface CalendarActions {
  readonly setCurrentDate: (date: Date) => void;
  readonly selectDate: (date: Date) => void;
  readonly loadEvents: (dateRange: DateRange) => Promise<void>;
  readonly createEvent: (event: Partial<Event>) => Promise<void>;
  readonly updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
  readonly deleteEvent: (id: string) => Promise<void>;
}

// Context Provider
export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(calendarReducer, initialState);

  const actions = useMemo(
    () => ({
      setCurrentDate: (date: Date) => dispatch({ type: 'SET_CURRENT_DATE', payload: date }),
      selectDate: (date: Date) => dispatch({ type: 'SELECT_DATE', payload: date }),
      // ... 기타 액션들
    }),
    []
  );

  return <CalendarContext.Provider value={{ state, actions }}>{children}</CalendarContext.Provider>;
};
```

### 3. Business Logic Layer (순수 함수)

```typescript
// 순수한 비즈니스 로직
export class EventService {
  constructor(private repository: EventRepository) {}

  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    // 비즈니스 규칙 검증
    this.validateEventData(eventData);

    // 중복 검사
    await this.checkForConflicts(eventData);

    // 이벤트 생성
    const event = Event.create(eventData);

    // 저장
    return await this.repository.save(event);
  }

  async createRecurringEvents(eventData: CreateRecurringEventRequest): Promise<Event[]> {
    // 반복 일정 생성 로직
    const dates = RecurringService.calculateDates(eventData.recurrence);
    const events = dates.map((date) => Event.create({ ...eventData, date }));

    return await this.repository.saveMany(events);
  }

  private validateEventData(eventData: CreateEventRequest): void {
    if (!eventData.title?.trim()) {
      throw new ValidationError('제목은 필수입니다');
    }

    if (eventData.startTime >= eventData.endTime) {
      throw new ValidationError('종료 시간은 시작 시간보다 늦어야 합니다');
    }
  }

  private async checkForConflicts(eventData: CreateEventRequest): Promise<void> {
    const overlapping = await this.repository.findOverlapping(
      eventData.date,
      eventData.startTime,
      eventData.endTime
    );

    if (overlapping.length > 0) {
      throw new ConflictError('해당 시간에 다른 일정이 있습니다', overlapping);
    }
  }
}
```

### 4. Data Access Layer (저장소 패턴)

```typescript
// 저장소 인터페이스 (추상화)
export interface EventRepository {
  findById(id: string): Promise<Event | null>;
  findByDateRange(start: Date, end: Date): Promise<Event[]>;
  findOverlapping(date: Date, startTime: string, endTime: string): Promise<Event[]>;
  save(event: Event): Promise<Event>;
  saveMany(events: Event[]): Promise<Event[]>;
  update(id: string, updates: Partial<Event>): Promise<Event>;
  delete(id: string): Promise<void>;
}

// API 구현체 (기존 API와 호환)
export class ApiEventRepository implements EventRepository {
  constructor(private apiClient: ApiClient) {}

  async findById(id: string): Promise<Event | null> {
    try {
      const response = await this.apiClient.get(`/api/events/${id}`);
      return Event.fromJSON(response.data);
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  }

  async findByDateRange(start: Date, end: Date): Promise<Event[]> {
    const response = await this.apiClient.get('/api/events', {
      params: { start: start.toISOString(), end: end.toISOString() },
    });
    return response.data.map(Event.fromJSON);
  }

  // ... 기타 메서드들
}

// Mock 구현체 (테스트용)
export class MockEventRepository implements EventRepository {
  private events: Map<string, Event> = new Map();

  async findById(id: string): Promise<Event | null> {
    return this.events.get(id) || null;
  }

  // ... 기타 메서드들
}
```

## 🔄 점진적 마이그레이션 전략

### 1단계: 새 컴포넌트 점진적 도입

```typescript
// App.tsx (기존 유지하면서 점진적 교체)
function App() {
  // 기존 코드 유지
  const { editingEvent, isSingleEdit, startEdit, startSingleEdit, stopEditing } = useEditingState();
  // ... 기존 로직들

  // 새로운 선언적 컴포넌트를 옵션으로 도입
  const [useV2Components, setUseV2Components] = useState(false);

  if (useV2Components) {
    return (
      <CalendarProvider>
        <Layout>
          <CalendarV2
            events={events}
            onEventCreate={handleEventCreate}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
          />
        </Layout>
      </CalendarProvider>
    );
  }

  // 기존 UI 유지
  return (
    <Box sx={{ display: 'flex', p: 2, gap: 2, height: '100vh' }}>{/* 기존 코드 그대로 */}</Box>
  );
}
```

### 2단계: 컴포넌트별 선택적 교체

```typescript
// 컴포넌트 교체를 위한 Feature Flag 패턴
const FeatureFlag = {
  USE_V2_EVENT_FORM: process.env.NODE_ENV === 'development',
  USE_V2_CALENDAR_VIEW: false,
  USE_V2_EVENT_LIST: false,
} as const;

// 조건부 컴포넌트 렌더링
const EventFormComponent = FeatureFlag.USE_V2_EVENT_FORM ? EventFormV2 : EventForm;

const CalendarViewComponent = FeatureFlag.USE_V2_CALENDAR_VIEW ? CalendarViewV2 : CalendarView;
```

### 3단계: 상태 관리 점진적 마이그레이션

```typescript
// 기존 훅과 새 상태 관리를 브릿지로 연결
export const useLegacyBridge = () => {
  const { state, actions } = useCalendarContext();

  // 기존 훅들과 호환되는 인터페이스 제공
  return {
    // 기존 훅 시그니처와 동일
    editingEvent: state.editingEvent,
    startEdit: actions.startEdit,
    stopEditing: actions.stopEditing,

    // 새로운 기능
    isLoading: state.isLoading,
    error: state.error,
  };
};
```

## 🧪 테스트 전략

### 컴포넌트 테스트 (선언적 방식)

```typescript
// 선언적 컴포넌트 테스트
describe('CalendarV2', () => {
  const mockEvents: Event[] = [
    Event.create({
      title: '테스트 이벤트',
      date: new Date('2024-01-15'),
      startTime: '10:00',
      endTime: '11:00',
    }),
  ];

  it('should render events for selected date', () => {
    render(
      <Calendar
        events={mockEvents}
        selectedDate={new Date('2024-01-15')}
        onDateSelect={jest.fn()}
        onEventCreate={jest.fn()}
      />
    );

    expect(screen.getByText('테스트 이벤트')).toBeInTheDocument();
  });

  it('should call onEventCreate when creating new event', async () => {
    const onEventCreate = jest.fn();
    const user = userEvent.setup();

    render(
      <Calendar
        events={[]}
        selectedDate={new Date('2024-01-15')}
        onDateSelect={jest.fn()}
        onEventCreate={onEventCreate}
      />
    );

    await user.click(screen.getByRole('button', { name: '일정 추가' }));

    expect(onEventCreate).toHaveBeenCalled();
  });
});
```

### 비즈니스 로직 테스트

```typescript
// 순수 함수 테스트
describe('EventService', () => {
  let eventService: EventService;
  let mockRepository: jest.Mocked<EventRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findOverlapping: jest.fn(),
      // ... 기타 메서드들
    } as jest.Mocked<EventRepository>;

    eventService = new EventService(mockRepository);
  });

  describe('createEvent', () => {
    it('should create event when data is valid', async () => {
      const eventData = {
        title: '회의',
        date: new Date('2024-01-15'),
        startTime: '10:00',
        endTime: '11:00',
      };

      mockRepository.findOverlapping.mockResolvedValue([]);
      mockRepository.save.mockResolvedValue(Event.create(eventData));

      const result = await eventService.createEvent(eventData);

      expect(result).toBeInstanceOf(Event);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({ title: '회의' }));
    });

    it('should throw validation error when title is empty', async () => {
      const eventData = {
        title: '',
        date: new Date('2024-01-15'),
        startTime: '10:00',
        endTime: '11:00',
      };

      await expect(eventService.createEvent(eventData)).rejects.toThrow(ValidationError);
    });

    it('should throw conflict error when time overlaps', async () => {
      const eventData = {
        title: '회의',
        date: new Date('2024-01-15'),
        startTime: '10:00',
        endTime: '11:00',
      };

      mockRepository.findOverlapping.mockResolvedValue([
        Event.create({
          title: '기존 회의',
          date: eventData.date,
          startTime: '10:30',
          endTime: '11:30',
        }),
      ]);

      await expect(eventService.createEvent(eventData)).rejects.toThrow(ConflictError);
    });
  });
});
```

## 📁 최종 디렉토리 구조

```typescript
src/
├── components/                 # 기존 컴포넌트 (유지)
│   ├── EventForm.tsx          # 기존 유지
│   ├── CalendarView.tsx       # 기존 유지
│   └── ...
├── components-v2/              # 새로운 클린코드 컴포넌트
│   ├── declarative/           # 선언적 컴포넌트
│   │   ├── Calendar/
│   │   ├── EventForm/
│   │   └── EventList/
│   ├── atomic/                # 원자 컴포넌트
│   │   ├── Form/
│   │   ├── Button/
│   │   └── Input/
│   └── composite/             # 합성 컴포넌트
│       ├── EventCard/
│       └── DatePicker/
├── domain/                    # 도메인 레이어
│   ├── entities/              # 엔티티
│   │   ├── Event.ts
│   │   └── Calendar.ts
│   ├── repositories/          # 저장소 인터페이스
│   │   └── EventRepository.ts
│   ├── services/              # 도메인 서비스
│   │   ├── EventService.ts
│   │   └── RecurringService.ts
│   └── usecases/              # 유스케이스
│       ├── CreateEventUseCase.ts
│       └── UpdateEventUseCase.ts
├── infrastructure/            # 인프라 레이어
│   ├── repositories/          # 저장소 구현체
│   │   ├── ApiEventRepository.ts
│   │   └── MockEventRepository.ts
│   ├── api/                   # API 클라이언트
│   │   └── ApiClient.ts
│   └── storage/               # 로컬 저장소
│       └── LocalStorage.ts
├── state/                     # 상태 관리
│   ├── contexts/              # React Context
│   │   ├── CalendarContext.tsx
│   │   └── EventFormContext.tsx
│   ├── providers/             # 프로바이더
│   │   └── AppProviders.tsx
│   └── hooks/                 # 상태 관리 훅
│       ├── useCalendar.ts
│       └── useEventForm.ts
├── shared/                    # 공통 코드
│   ├── types/                 # 타입 정의
│   │   ├── Event.ts
│   │   └── Calendar.ts
│   ├── constants/             # 상수
│   │   └── dateConstants.ts
│   ├── utils/                 # 유틸리티 (순수 함수)
│   │   ├── dateUtils.ts
│   │   └── validationUtils.ts
│   └── errors/                # 에러 클래스
│       ├── ValidationError.ts
│       └── ConflictError.ts
├── hooks/                     # 기존 훅 (유지)
│   ├── useEventForm.ts        # 기존 유지
│   └── ...
└── __tests__/                 # 테스트
    ├── components-v2/         # 새 컴포넌트 테스트
    ├── domain/                # 도메인 로직 테스트
    ├── infrastructure/        # 인프라 테스트
    └── integration/           # 통합 테스트
```

## 🚀 구현 로드맵

### Phase 1: 기반 구조 (1-2주)

- [ ] 디렉토리 구조 설정
- [ ] 기본 타입 및 인터페이스 정의
- [ ] 에러 클래스 구현
- [ ] 유틸리티 함수 작성

### Phase 2: 도메인 레이어 (2-3주)

- [ ] Event 엔티티 구현
- [ ] EventRepository 인터페이스 정의
- [ ] EventService 구현
- [ ] UseCase 클래스들 구현
- [ ] 단위 테스트 작성

### Phase 3: 인프라 레이어 (1-2주)

- [ ] ApiEventRepository 구현 (기존 API 호환)
- [ ] MockEventRepository 구현 (테스트용)
- [ ] API 클라이언트 추상화
- [ ] 통합 테스트 작성

### Phase 4: 상태 관리 (2-3주)

- [ ] React Context 구현
- [ ] 상태 관리 훅 작성
- [ ] 기존 훅과의 브릿지 구현
- [ ] 상태 관리 테스트

### Phase 5: UI 컴포넌트 (3-4주)

- [ ] 원자 컴포넌트 구현
- [ ] 합성 컴포넌트 구현
- [ ] 선언적 컴포넌트 구현
- [ ] 컴포넌트 테스트 작성

### Phase 6: 점진적 마이그레이션 (2-3주)

- [ ] Feature Flag 시스템 구현
- [ ] 기존 컴포넌트와 새 컴포넌트 병행
- [ ] 사용자 피드백 수집
- [ ] 성능 모니터링

### Phase 7: 완전 전환 (1-2주)

- [ ] 기존 코드 제거
- [ ] 문서 업데이트
- [ ] 최종 테스트 및 배포

## 🔧 개발 가이드라인

### 1. 선언적 컴포넌트 작성 규칙

```typescript
// ✅ 좋은 예: 선언적이고 테스트 가능한 컴포넌트
interface CalendarProps {
  readonly events: ReadonlyArray<Event>;
  readonly selectedDate: Date;
  readonly onDateSelect: (date: Date) => void;
  readonly onEventCreate: (event: Partial<Event>) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  events,
  selectedDate,
  onDateSelect,
  onEventCreate,
}) => {
  // 순수한 UI 로직만 포함
  const displayEvents = useMemo(
    () => events.filter((event) => isSameDay(event.date, selectedDate)),
    [events, selectedDate]
  );

  return (
    <CalendarContainer>
      <CalendarHeader date={selectedDate} />
      <EventList events={displayEvents} onEventCreate={onEventCreate} />
    </CalendarContainer>
  );
};

// ❌ 피할 것: 비즈니스 로직이 포함된 컴포넌트
export const BadCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  // 컴포넌트에 비즈니스 로직이 포함됨 (안티패턴)
  const createEvent = async (eventData: Partial<Event>) => {
    setLoading(true);
    try {
      // 비즈니스 규칙 검증
      if (!eventData.title) throw new Error('제목 필요');

      // API 호출
      const response = await fetch('/api/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
      });

      // 상태 업데이트
      const newEvent = await response.json();
      setEvents((prev) => [...prev, newEvent]);
    } catch (error) {
      // 에러 처리
    } finally {
      setLoading(false);
    }
  };

  // ... 복잡한 렌더링 로직
};
```

### 2. 비즈니스 로직 분리 규칙

```typescript
// ✅ 좋은 예: 순수한 비즈니스 로직
export class EventService {
  constructor(private repository: EventRepository) {}

  async createEvent(request: CreateEventRequest): Promise<Event> {
    // 1. 입력 검증
    this.validateRequest(request);

    // 2. 비즈니스 규칙 적용
    await this.enforceBusinessRules(request);

    // 3. 엔티티 생성
    const event = Event.create(request);

    // 4. 저장
    return await this.repository.save(event);
  }

  private validateRequest(request: CreateEventRequest): void {
    if (!request.title?.trim()) {
      throw new ValidationError('제목은 필수입니다');
    }

    if (request.startTime >= request.endTime) {
      throw new ValidationError('종료 시간은 시작 시간보다 늦어야 합니다');
    }
  }

  private async enforceBusinessRules(request: CreateEventRequest): Promise<void> {
    const overlapping = await this.repository.findOverlapping(
      request.date,
      request.startTime,
      request.endTime
    );

    if (overlapping.length > 0) {
      throw new ConflictError('시간이 겹치는 일정이 있습니다', overlapping);
    }
  }
}

// ❌ 피할 것: UI와 비즈니스 로직이 혼재
const BadEventForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  // ...

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // UI에 비즈니스 로직이 포함됨 (안티패턴)
    if (!title.trim()) {
      alert('제목은 필수입니다'); // 비즈니스 규칙이 UI에 하드코딩
      return;
    }

    // API 호출도 UI에서 직접 (안티패턴)
    try {
      await fetch('/api/events', {
        method: 'POST',
        body: JSON.stringify({ title, date }),
      });
    } catch (error) {
      alert('저장 실패'); // 에러 처리도 UI에 하드코딩
    }
  };
};
```

### 3. 테스트 작성 규칙

```typescript
// ✅ 좋은 예: 철저한 테스트 커버리지
describe('EventService', () => {
  let eventService: EventService;
  let mockRepository: jest.Mocked<EventRepository>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    eventService = new EventService(mockRepository);
  });

  describe('createEvent', () => {
    const validEventData = {
      title: '회의',
      date: new Date('2024-01-15'),
      startTime: '10:00',
      endTime: '11:00',
    };

    it('should create event with valid data', async () => {
      // Given
      mockRepository.findOverlapping.mockResolvedValue([]);
      mockRepository.save.mockResolvedValue(Event.create(validEventData));

      // When
      const result = await eventService.createEvent(validEventData);

      // Then
      expect(result).toBeInstanceOf(Event);
      expect(result.title).toBe('회의');
      expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({ title: '회의' }));
    });

    it('should throw ValidationError when title is empty', async () => {
      // Given
      const invalidData = { ...validEventData, title: '' };

      // When & Then
      await expect(eventService.createEvent(invalidData)).rejects.toThrow(ValidationError);

      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictError when time overlaps', async () => {
      // Given
      const overlappingEvent = Event.create({
        title: '기존 회의',
        date: validEventData.date,
        startTime: '10:30',
        endTime: '11:30',
      });
      mockRepository.findOverlapping.mockResolvedValue([overlappingEvent]);

      // When & Then
      await expect(eventService.createEvent(validEventData)).rejects.toThrow(ConflictError);
    });
  });
});
```

## 🎯 성공 지표

### 코드 품질 지표

- **순환 복잡도**: 기존 평균 8 → 목표 4 이하
- **테스트 커버리지**: 기존 60% → 목표 90% 이상
- **코드 중복률**: 기존 15% → 목표 5% 이하

### 개발 생산성 지표

- **새 기능 개발 시간**: 30% 단축
- **버그 수정 시간**: 50% 단축
- **테스트 작성 시간**: 40% 단축

### 유지보수성 지표

- **컴포넌트 평균 라인 수**: 기존 200라인 → 목표 50라인 이하
- **함수 평균 라인 수**: 기존 30라인 → 목표 10라인 이하
- **Props 개수**: 기존 평균 15개 → 목표 5개 이하

## 🔍 모니터링 및 검증

### 리팩토링 진행도 체크리스트

#### Phase 1 완료 기준

- [ ] 새 디렉토리 구조 생성
- [ ] 기존 코드 영향도 0% 확인
- [ ] 기본 타입 정의 완료
- [ ] 첫 번째 선언적 컴포넌트 작동 확인

#### Phase 2 완료 기준

- [ ] 모든 도메인 엔티티 구현
- [ ] 비즈니스 로직 100% 테스트 커버리지
- [ ] 순수 함수로만 구성된 서비스 레이어
- [ ] UI와 비즈니스 로직 완전 분리

#### 전체 완료 기준

- [ ] 기존 기능 100% 호환성 유지
- [ ] 새 아키텍처로 90% 이상 전환
- [ ] 성능 저하 0% 확인
- [ ] 코드 품질 지표 목표 달성

## 📚 참고 자료

### 클린 아키텍처 패턴

- **Repository Pattern**: 데이터 접근 추상화
- **Use Case Pattern**: 비즈니스 로직 캡슐화
- **Dependency Injection**: 의존성 역전
- **Command Query Separation**: 명령과 조회 분리

### React 모범 사례

- **Composition over Inheritance**: 합성 우선
- **Higher-Order Components**: 공통 로직 추상화
- **Render Props**: 렌더링 로직 공유
- **Custom Hooks**: 상태 로직 재사용

### 테스트 전략

- **Test Pyramid**: 단위 테스트 중심
- **Test Doubles**: Mock, Stub, Spy 활용
- **Behavior-Driven Development**: 행동 중심 테스트
- **Property-Based Testing**: 속성 기반 테스트

---

이 아키텍처는 **기존 코드에 절대 영향을 주지 않으면서** React 클린코드 원칙을 점진적으로 도입하는 안전한 리팩토링 전략을 제공합니다. 모든 변경사항은 **선언적 프로그래밍** 원칙에 따라 "무엇을" 명확히 표현하는 구조로 설계되었습니다.
