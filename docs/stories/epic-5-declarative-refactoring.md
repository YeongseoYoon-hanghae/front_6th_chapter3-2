# Epic 5: 클린코드 리팩토링 - 선언적 프로그래밍 패러다임 적용

## 📋 Epic 메타정보

- **생성일**: 2024-12-19
- **예상 기간**: 2-3주
- **복잡도**: Medium (M)
- **TDD 적용**: ✅ 필수
- **클린코드 준수**: ✅ 핵심 목표

## 🎯 Epic 개요

### Epic 제목

**클린코드 리팩토링 - 선언적 프로그래밍 패러다임 적용**

### Epic 목표

기존 기능과 디자인을 완전히 보존하면서, 현재 React 컴포넌트들을 **클린코드 원칙과 선언적 프로그래밍 패러다임**으로 점진적 리팩토링하여 코드 가독성, 유지보수성, 테스트 용이성을 향상시킨다.

### 비즈니스 가치

- **기존 시스템 개선**: 현재 잘 작동하는 기능들의 내부 코드 품질 향상으로 유지보수성 확보
- **사용자 경험 유지**: 사용자가 체감하는 UI/UX는 100% 동일하게 유지하면서 개발자 경험 개선
- **기술적 부채 해결**: 복잡한 로직을 선언적 패턴으로 전환하여 React 클린코드 표준 준수
- **코드 품질 향상**: 읽기 쉽고 이해하기 쉬운 코드로 개선하여 팀 개발 효율성 증대

### 성공 지표

- 모든 기존 E2E 테스트 100% 통과 (기능 무손상 보장)
- 컴포넌트 복잡도 개선 (선언적 패턴 적용)
- 단위 테스트 커버리지 95% 이상 달성
- 코드 가독성 향상 (코드 리뷰 품질 개선)

## 🏗️ 기존 시스템 컨텍스트

### 현재 시스템 상태

**기존 관련 기능**: React 기반 캘린더 애플리케이션 (잘 작동하는 완성된 시스템)
**기술 스택**: React 18, TypeScript, Material-UI, Custom Hooks 패턴
**아키텍처 패턴**: 컴포넌트 기반, Custom Hooks 상태 관리, 유틸리티 함수 분리
**통합 지점**: 모든 기존 컴포넌트들 간의 props 및 상태 전달

### 리팩토링 현황 분석 [[docs/clean-code.md]]

**현재 코드 품질 상태**:

✅ **이미 잘 구현된 부분**:

- Custom Hooks를 통한 관심사 분리 (`useEventForm`, `useEventOperations` 등)
- TypeScript 타입 안전성 100% 적용
- 컴포넌트 단위 분리가 잘 되어 있음
- DOM 직접 조작 패턴이 거의 없음 (main.tsx의 `document.getElementById('root')` 제외)

🔄 **클린코드 개선이 필요한 부분**:

- [ ] 복잡한 조건부 렌더링 로직을 작은 컴포넌트로 분리 (단일 책임 원칙)
- [ ] `map` 함수 내부의 복잡한 계산 로직을 순수 함수로 추출 (함수 분리)
- [ ] 컴포넌트 내부의 복잡한 로직을 의미 있는 이름의 함수로 분리
- [ ] 중복되는 조건부 로직을 재사용 가능한 패턴으로 추상화

**발견된 클린코드 개선 패턴**:

- [ ] `MonthView`/`WeekView`의 테이블 셀 렌더링 로직을 의미 있는 컴포넌트로 분리
- [ ] `EventList`의 조건부 표시 로직을 명확한 함수명으로 추상화
- [ ] `App.tsx`의 복잡한 이벤트 생성 로직을 단계별 함수로 분해
- [ ] `RecurringEventIcon`의 조건부 로직을 읽기 쉬운 선언적 코드로 개선

## 🧪 TDD 전략

### 테스트 우선 개발 계획

1. **Red Phase**: 기존 기능을 완벽히 재현하는 테스트 먼저 작성
2. **Green Phase**: 리팩토링된 선언적 컴포넌트로 테스트 통과
3. **Refactor Phase**: 클린코드 원칙 적용 및 성능 최적화

### 테스트 레이어 구조 [[memory:7535141]]

**단위 테스트**: 추출된 순수 함수 및 유틸리티

- 날짜 계산 로직 (`getEventsForDay`, `getWeeksAtMonth` 등)
- 스타일 계산 함수
- 조건부 렌더링 결정 함수
- 데이터 변환 함수

**통합 테스트**: 리팩토링된 컴포넌트 간 상호작용

- 리팩토링 전후 props 전달 호환성
- 새로운 선언적 컴포넌트들의 조합
- 기존 커스텀 훅과의 연동

**인간 관점 테스트**: 사용자 시나리오 [[memory:7535139]]

- 리팩토링 전후 완전히 동일한 사용자 경험 보장
- 모든 기존 E2E 테스트 시나리오 통과
- 성능 회귀 없음 확인

## 🔒 Brownfield 호환성 요구사항

### 필수 호환성 체크리스트

- [ ] **API 호환성**: 컴포넌트 props 인터페이스 100% 유지
- [ ] **데이터 호환성**: 기존 상태 관리 및 데이터 흐름 보존
- [ ] **UI 호환성**: 픽셀 단위까지 동일한 시각적 결과 보장
- [ ] **성능 호환성**: 렌더링 성능 및 메모리 사용량 유지
- [ ] **테스트 호환성**: 기존 모든 테스트가 수정 없이 통과

### 리스크 완화 전략

**주요 리스크**: 리팩토링 과정에서 의도치 않은 기능 변경 또는 성능 저하
**완화 방안**:

- Feature Flag를 통한 점진적 전환
- A/B 테스트로 리팩토링 전후 비교
- 각 스토리별 독립적 배포로 리스크 분산
  **롤백 계획**: Git 브랜치별 독립 구현으로 즉시 원복 가능
  **모니터링**: 자동화된 성능 테스트 및 시각적 회귀 테스트

## 📖 User Stories

### Story 5.1: MonthView/WeekView 테이블 셀 렌더링 클린코드 리팩토링

**User Story** [[memory:7535139]]:
As a 개발자,
I want MonthView와 WeekView의 복잡한 테이블 셀 렌더링 로직을 의미 있는 컴포넌트로 분리하기를,
So that 각 셀의 책임이 명확해지고 코드를 읽고 이해하기 쉬워진다.

**Priority**: Must Have (P0)

**TDD 접근법**:

1. **Red**: 현재 MonthView/WeekView의 모든 렌더링 결과를 검증하는 테스트 작성
2. **Green**: `CalendarDayCell`, `DayHeader`, `EventListInCell` 등 의미 있는 컴포넌트로 분리
3. **Refactor**: 복잡한 조건부 로직을 명확한 함수명으로 추상화

**Acceptance Criteria** (Given-When-Then):

1. **Given** 기존 MonthView가 있고, **When** 리팩토링된 컴포넌트로 교체하면, **Then** 시각적으로 완전히 동일한 결과가 렌더링된다
2. **Given** 특정 날짜의 이벤트들이 있고, **When** 해당 날짜 셀을 클릭하면, **Then** 기존과 동일한 이벤트들이 정확히 표시된다
3. **Given** 반복 일정이 있고, **When** 월/주 뷰를 전환하면, **Then** 모든 반복 일정 아이콘이 올바르게 표시된다

**Brownfield 통합 요구사항**: 4. 기존 `CalendarView` 컴포넌트가 변경되지 않고 계속 작동함 5. 새 컴포넌트들이 기존 Material-UI 테마 시스템을 따름 6. 기존 `filteredEvents`, `notifiedEvents` props와의 호환성 유지

**기술적 요구사항**:

- **새 컴포넌트**:
  - `CalendarDayCell` (날짜 셀 전용 컴포넌트)
  - `DayHeader` (날짜 헤더 표시)
  - `EventListInCell` (셀 내 이벤트 목록)
  - `HolidayDisplay` (공휴일 표시)
- **클린코드 원칙**:
  - 각 컴포넌트는 단일 책임만 가짐
  - 복잡한 조건부 로직을 명확한 함수명으로 분리
  - props 인터페이스 100% 유지

**Definition of Done**:

- [ ] 모든 테스트가 Red-Green-Refactor 사이클로 작성됨
- [ ] 시각적으로 기존과 100% 동일한 결과 보장
- [ ] 기존 기능 회귀 테스트 100% 통과
- [ ] 각 컴포넌트가 단일 책임 원칙을 준수함
- [ ] 복잡한 로직이 명확한 함수명으로 분리됨
- [ ] 코드 리뷰 및 페어 프로그래밍 완료

### Story 5.2: EventList 조건부 표시 로직 클린코드 분리

**User Story** [[memory:7535139]]:
As a 개발자,
I want EventList의 복잡한 조건부 표시 로직과 스타일링을 의미 있는 컴포넌트로 분리하기를,
So that 각 이벤트 아이템의 표시 책임이 명확해지고 코드 가독성이 향상된다.

**Priority**: Must Have (P0)

**TDD 접근법**:

1. **Red**: EventList의 모든 조건부 표시 로직 및 이벤트 렌더링 테스트 작성
2. **Green**: `EventListItem`, `EventNotificationBadge`, `EventRepeatInfo` 컴포넌트 분리
3. **Refactor**: 조건부 스타일링 로직을 명확한 함수명으로 추상화

**Acceptance Criteria** (Given-When-Then):

1. **Given** 알림이 설정된 이벤트가 있고, **When** 이벤트 리스트를 렌더링하면, **Then** 알림 아이콘과 굵은 글씨가 정확히 표시된다
2. **Given** 반복 이벤트가 있고, **When** 이벤트 리스트에서 확인하면, **Then** 반복 정보와 아이콘이 올바르게 표시된다
3. **Given** 검색어가 입력되고, **When** 필터링이 적용되면, **Then** 기존과 동일한 검색 결과가 표시된다

**Brownfield 통합 요구사항**: 4. 기존 `EventList` 컴포넌트의 props 인터페이스가 변경되지 않음 5. 새 컴포넌트들이 기존 이벤트 편집/삭제 핸들러와 호환됨 6. 기존 검색 기능과의 완벽한 호환성 유지

**Definition of Done**:

- [ ] 조건부 표시 로직이 의미 있는 컴포넌트로 분리됨
- [ ] 복잡한 조건부 스타일링이 명확한 함수로 추출됨
- [ ] 기존 이벤트 편집/삭제 기능 100% 동작 보장
- [ ] 각 컴포넌트가 단일 책임 원칙 준수
- [ ] 접근성 기능 유지 확인

### Story 5.3: App.tsx 복잡한 이벤트 생성 로직 클린코드 분해

**User Story** [[memory:7535139]]:
As a 개발자,
I want App.tsx의 복잡한 이벤트 생성 및 중복 검사 로직을 의미 있는 함수들로 분해하기를,
So that 각 단계의 책임이 명확해지고 코드를 읽고 이해하기 쉬워진다.

**Priority**: Should Have (P1)

**TDD 접근법**:

1. **Red**: 현재 이벤트 생성의 모든 시나리오 (단일/반복/중복) 테스트 작성
2. **Green**: `validateEventData`, `checkEventOverlap`, `createSingleEvent`, `createRecurringEvents` 등 단계별 함수 구현
3. **Refactor**: 각 함수의 책임을 명확히 하고 의미 있는 이름으로 개선

**Acceptance Criteria** (Given-When-Then):

1. **Given** 중복되는 시간의 이벤트를 생성하고, **When** 저장하면, **Then** 기존과 동일한 중복 경고 다이얼로그가 표시된다
2. **Given** 반복 이벤트를 생성하고, **When** 저장하면, **Then** 기존과 동일한 개수의 반복 일정이 생성된다
3. **Given** 기존 이벤트를 수정하고, **When** 저장하면, **Then** 기존 기능과 완전히 동일하게 작동한다

**Brownfield 통합 요구사항**: 4. 기존 `EventForm` 컴포넌트의 `onSubmit` 핸들러 시그니처 유지 5. 기존 `overlay-kit` 기반 다이얼로그 시스템과 호환 6. 기존 snackbar 알림 시스템과의 완벽한 연동

**Definition of Done**:

- [ ] 복잡한 이벤트 생성 로직이 의미 있는 함수들로 분해됨
- [ ] 각 함수가 단일 책임 원칙을 준수함
- [ ] 이벤트 생성 시나리오별 독립적 테스트 작성
- [ ] 함수명이 하는 일을 명확히 표현함
- [ ] 기존 UX 플로우 100% 보존

### Story 5.4: RecurringEventIcon 조건부 로직 클린코드 개선

**User Story** [[memory:7535139]]:
As a 개발자,
I want RecurringEventIcon의 복잡한 조건부 로직과 동적 계산을 의미 있는 함수로 분리하기를,
So that 코드 가독성이 개선되고 각 계산의 목적이 명확해진다.

**Priority**: Could Have (P2)

**TDD 접근법**:

1. **Red**: 모든 반복 타입별 아이콘 렌더링 및 스타일 계산 테스트 작성
2. **Green**: `calculateIconSize`, `getTooltipText`, `shouldShowIcon` 등 목적별 함수 분리
3. **Refactor**: 조건부 로직을 읽기 쉬운 함수 조합으로 변환

**Acceptance Criteria** (Given-When-Then):

1. **Given** 다양한 크기의 반복 이벤트 아이콘이 있고, **When** 렌더링하면, **Then** 기존과 동일한 크기와 위치로 표시된다
2. **Given** 반복 종료일이 있는 이벤트가 있고, **When** 툴팁을 확인하면, **Then** 기존과 동일한 정보가 표시된다
3. **Given** 반복 타입이 'none'인 이벤트가 있고, **When** 아이콘을 확인하면, **Then** 아이콘이 표시되지 않는다

**Brownfield 통합 요구사항**: 4. 기존 `RecurringEventIcon` props 인터페이스 100% 유지 5. 기존 Material-UI 반응형 스타일 시스템과 호환 6. 기존 접근성 기능 (tabIndex, aria-label) 완전 보존

**Definition of Done**:

- [ ] 복잡한 계산 로직이 목적별 함수로 분리됨
- [ ] 각 함수명이 하는 일을 명확히 표현함
- [ ] 조건부 로직이 읽기 쉬운 구조로 개선됨
- [ ] 기존과 동일한 시각적 결과 보장
- [ ] 접근성 테스트 통과

## 🏗️ 아키텍처 및 설계

### 클린코드 적용 전략 [[docs/react-clean-code-refactoring-architecture.md]]

#### Phase 1: 의미 있는 컴포넌트 분리 (무손상)

```typescript
// 기존 컴포넌트 유지하면서 새 컴포넌트 병행 구현
src/
├── components/           # 기존 컴포넌트 (유지)
├── components-v2/        # 새로운 클린코드 컴포넌트
│   ├── calendar/        # 캘린더 관련 컴포넌트
│   │   ├── CalendarDayCell.tsx
│   │   ├── DayHeader.tsx
│   │   ├── HolidayDisplay.tsx
│   │   └── EventListInCell.tsx
│   ├── event/          # 이벤트 관련 컴포넌트
│   │   ├── EventListItem.tsx
│   │   ├── EventNotificationBadge.tsx
│   │   └── EventRepeatInfo.tsx
│   └── shared/         # 공통 컴포넌트
│       └── ConditionalDisplay.tsx
```

#### Phase 2: 복잡한 로직 함수 분리

```typescript
src/
├── utils-v2/           # 개선된 유틸리티 함수들
│   ├── eventCreationHelpers.ts  # 이벤트 생성 단계별 함수
│   ├── eventValidation.ts       # 검증 로직 함수
│   ├── iconCalculation.ts       # 아이콘 계산 함수
│   └── styleHelpers.ts          # 스타일 계산 함수
├── helpers/            # 의미 있는 도우미 함수들
│   ├── eventDisplayHelpers.ts  # 이벤트 표시 로직
│   ├── calendarHelpers.ts       # 캘린더 계산 로직
│   └── conditionalHelpers.ts    # 조건부 로직 함수
```

#### Phase 3: 점진적 교체 및 통합

```typescript
// 기존 컴포넌트를 점진적으로 새 버전으로 교체
// Feature Flag 없이 직접 교체 (기능 100% 동일하므로)
```

### 점진적 마이그레이션 전략

1. **컴포넌트별 독립 리팩토링**: 각 컴포넌트를 별도로 리팩토링
2. **즉시 교체**: 기능이 100% 동일하므로 Feature Flag 없이 직접 교체
3. **TDD 보장**: 모든 변경사항을 테스트로 검증 후 교체

## 🧪 테스트 전략

### 테스트 커버리지 목표

- **단위 테스트**: 95% 이상 (분리된 함수들 중심)
- **통합 테스트**: 모든 리팩토링된 컴포넌트
- **시각적 회귀 테스트**: 기존과 동일한 렌더링 결과 검증
- **기능 테스트**: 모든 사용자 시나리오 보장

### TDD 사이클 적용 [[memory:7535143]]

```typescript
// 1. Red: 현재 기능을 완벽히 재현하는 테스트
describe('MonthView 클린코드 리팩토링', () => {
  it('기존과 동일한 테이블 구조를 렌더링한다', () => {
    const { container } = render(<MonthView {...existingProps} />);
    const newContainer = render(<MonthViewV2 {...existingProps} />);

    expect(container.innerHTML).toBe(newContainer.innerHTML);
  });
});

// 2. Green: 의미 있는 컴포넌트로 분리하여 동일한 결과 구현
const MonthViewV2 = (props) => {
  const { weeks, holidays, events } = props;
  return (
    <CalendarTable>
      <DayHeaders />
      {weeks.map((week, index) => (
        <WeekRow key={index}>
          {week.map((day) => (
            <CalendarDayCell
              key={day}
              day={day}
              holidays={holidays}
              events={getEventsForDay(events, day)}
            />
          ))}
        </WeekRow>
      ))}
    </CalendarTable>
  );
};

// 3. Refactor: 복잡한 로직을 명확한 함수로 분리
const getEventsForDay = (events, day) => {
  return events.filter((event) => isSameDay(event.date, day));
};
```

### 인간 관점 테스트 예시 [[memory:7535139]]

```typescript
describe('사용자 여정: 리팩토링 후 동일한 경험', () => {
  it('사용자가 기존과 완전히 동일한 캘린더 경험을 한다', async () => {
    // 사용자가 월 뷰에서 이벤트를 확인
    await user.click(screen.getByTestId('month-view'));
    expect(screen.getAllByTestId('event-item')).toHaveLength(expectedCount);

    // 사용자가 이벤트를 클릭해서 편집
    await user.click(screen.getByText('기존 이벤트'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // 모든 기능이 기존과 동일하게 작동
    await user.click(screen.getByRole('button', { name: '수정' }));
    expect(screen.getByText('일정이 수정되었습니다')).toBeInTheDocument();
  });
});
```

## 📈 코드 품질 지표

### 클린코드 목표

- **코드 가독성**: 복잡한 로직을 의미 있는 함수명으로 분리
- **단일 책임**: 각 컴포넌트와 함수가 하나의 책임만 가짐
- **기능 보존**: 사용자가 체감하는 기능 100% 동일 유지
- **테스트 용이성**: 분리된 함수들의 독립적 테스트 가능

### 품질 지표

- **컴포넌트 복잡도**: 각 컴포넌트가 명확한 단일 책임
- **함수 명확성**: 함수명만으로 하는 일을 이해 가능
- **테스트 커버리지**: 95% 이상
- **타입 안전성**: 100% TypeScript (현재 유지)

## 🚀 구현 타임라인

### Week 1: Phase 1 - 컴포넌트 분리

- [ ] Story 5.1 구현 (MonthView/WeekView 클린코드 리팩토링)
- [ ] 의미 있는 컴포넌트들 TDD로 구현
- [ ] 기존 기능 100% 호환성 확인

### Week 2: Phase 2 - 로직 함수 분리

- [ ] Story 5.2 구현 (EventList 클린코드 개선)
- [ ] Story 5.3 구현 (App.tsx 로직 분해)
- [ ] 복잡한 로직을 명확한 함수로 분리
- [ ] 통합 테스트 작성

### Week 3: Phase 3 - 마무리 및 통합

- [ ] Story 5.4 구현 (RecurringEventIcon 개선)
- [ ] 모든 클린코드 원칙 적용 확인
- [ ] 시각적 회귀 테스트 자동화
- [ ] 문서화 및 팀 리뷰

## ✅ 완료 기준

### Epic 성공 기준

- [ ] 모든 스토리의 Acceptance Criteria 충족
- [ ] 기존 기능 100% 무결성 유지 (E2E 테스트 통과)
- [ ] TDD 사이클로 모든 리팩토링 코드 작성 완료
- [ ] 클린코드 원칙 적용으로 코드 가독성 향상
- [ ] 각 컴포넌트와 함수가 단일 책임 원칙 준수
- [ ] 사용자 시나리오 테스트 100% 통과

### 품질 보증

- [ ] 모든 테스트 통과 (단위/통합/E2E/시각적)
- [ ] 코드 리뷰 완료 (클린코드 원칙 준수 확인)
- [ ] 함수명과 컴포넌트명의 명확성 확인
- [ ] 접근성 검증 완료 (기존 레벨 유지)
- [ ] 크로스 브라우저 테스트 완료

## 📚 Dependencies 및 참고자료

### 선행 조건

- [ ] 기존 시스템 분석 완료 ✅
- [ ] TDD 환경 설정 완료 ✅
- [ ] 팀 TDD 역량 확보 ✅
- [ ] 시각적 회귀 테스트 도구 설정

### 외부 의존성

- React Testing Library (기존) - 컴포넌트 테스트
- Jest (기존) - 단위 테스트
- Playwright (기존) - E2E 테스트
- 시각적 회귀 테스트 도구 (선택사항)

### 참고 문서

- [[docs/clean-code.md]]: 클린코드 원칙 및 변환 규칙
- [[docs/react-clean-code-refactoring-architecture.md]]: 아키텍처 가이드
- [[docs/tdd-code-of-conduct.md]]: TDD 행동강령 [[memory:7535143]]

## 🎯 다음 단계

Epic 완료 후 다음 정보를 바탕으로 지속적 개선:

**클린코드 리팩토링 성과 평가**:

"클린코드 리팩토링 Epic 완료 결과:

- **기존 기능 보존**: 모든 사용자 기능 100% 동일하게 유지
- **코드 가독성 향상**: 복잡한 로직이 의미 있는 함수로 분리됨
- **개발자 경험**: 코드를 읽고 이해하기 쉬워져 유지보수성 향상
- **단일 책임**: 각 컴포넌트와 함수가 명확한 책임을 가짐
- **테스트 용이성**: 분리된 함수들의 독립적 테스트 가능

향후 모든 새 기능은 이 클린코드 패턴을 따라 개발하여 지속적인 코드 품질 향상을 도모한다."

---

## 🔄 지속적 개선 계획

### 메트릭 모니터링

- [ ] 코드 가독성 지표 추적
- [ ] 함수/컴포넌트 복잡도 모니터링
- [ ] 테스트 커버리지 모니터링
- [ ] 개발자 만족도 조사 (코드 이해도)

### 패턴 전파

- [ ] 클린코드 가이드라인 문서화
- [ ] 팀 교육 자료 작성 (의미 있는 네이밍, 단일 책임)
- [ ] 코드 리뷰 체크리스트 업데이트
- [ ] 새 기능 개발 시 클린코드 패턴 적용 의무화
