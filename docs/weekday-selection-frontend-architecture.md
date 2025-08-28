# 주간 반복 요일 선택 기능 - 프론트엔드 아키텍처

## 개요

기존 반복 일정 기능에 주간 반복 시 특정 요일을 선택할 수 있는 기능을 추가하는 프론트엔드 아키텍처 문서입니다. 기존 시스템의 무결성을 유지하면서 선언적이고 확장 가능한 방식으로 구현합니다.

## 기술 스택 분석

### 현재 기술 스택

- **Framework**: React 19 + TypeScript
- **UI Library**: Material-UI 7.2.0
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library
- **State Management**: Custom Hooks 기반

## 현재 시스템 분석

### 1. 기존 반복 일정 구조

#### 타입 정의 (`src/types.ts`)

```typescript
export interface RepeatInfo {
  type: RepeatType; // 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number; // 반복 간격
  endDate?: string; // 종료일
  id?: string; // 반복 그룹 ID
}
```

#### 핵심 유틸리티 (`src/utils/recurringUtils.ts`)

- `calculateRecurringDates()`: 현재 주간 반복은 단순히 7일 간격으로 계산
- `generateRepeatEvents()`: 반복 이벤트 생성
- 제약사항: 특정 요일 선택 기능 없음

#### UI 컴포넌트 (`src/components/RepeatSection.tsx`)

- 선언적 구조로 잘 설계됨
- `RepeatSettings` 컴포넌트에서 반복 설정 관리
- 확장 가능한 구조

## 요구사항 분석

### 3. 요일 지정 (주간 반복의 경우)

> 주간 반복 시 특정 요일을 선택할 수 있다.

**사용자 시나리오**:

- "매주 월, 수, 금요일에 운동"
- "매주 화, 목요일에 영어 수업"
- "매주 주말(토, 일)에 가족 시간"

**기능 요구사항**:

1. 주간 반복 선택 시 요일 선택 UI 표시
2. 복수 요일 선택 가능 (체크박스 형태)
3. 최소 1개 요일 선택 필수
4. 선택된 요일만 반복 일정 생성
5. 기존 단순 주간 반복과의 호환성 유지

## 아키텍처 설계

### 1. 데이터 모델 확장

#### 확장된 RepeatInfo 타입

```typescript
export interface WeeklyOptions {
  daysOfWeek: number[]; // [1,3,5] = 월,수,금 (0=일요일, 1=월요일, ..., 6=토요일)
}

export interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endDate?: string;
  id?: string;

  // 신규: 주간 반복 옵션
  weeklyOptions?: WeeklyOptions;
}
```

**설계 원칙**:

- 기존 인터페이스와 완벽 호환 (옵셔널 필드)
- 확장 가능한 구조 (향후 월간 옵션 등 추가 가능)
- 명확한 요일 인덱스 규칙 (JavaScript Date 표준 따름)

### 2. 유틸리티 함수 확장

#### 새로운 유틸리티 함수

```typescript
// src/utils/recurringUtils.ts 확장

/**
 * 주간 반복에서 특정 요일들만 계산합니다.
 * @param startDate 시작일
 * @param endDate 종료일
 * @param interval 주간 간격
 * @param daysOfWeek 선택된 요일 배열 [0-6]
 * @returns 계산된 날짜 배열
 */
export function calculateWeeklyWithSpecificDays(
  startDate: string,
  endDate: string,
  interval: number,
  daysOfWeek: number[]
): string[] {
  // 구현 로직
}

/**
 * 요일 인덱스를 한국어 이름으로 변환
 */
export function getDayName(dayIndex: number): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[dayIndex];
}

/**
 * 기존 calculateRecurringDates를 확장하여 weeklyOptions 지원
 */
export function calculateRecurringDatesWithOptions(
  startDate: string,
  endDate: string,
  repeatInfo: RepeatInfo
): string[] {
  // weeklyOptions가 있으면 새로운 로직 사용
  // 없으면 기존 로직 사용 (하위 호환성)
}
```

### 3. UI 컴포넌트 설계

#### WeeklyDaysSelector 컴포넌트

```typescript
// src/components/WeeklyDaysSelector.tsx

interface WeeklyDaysSelectorProps {
  selectedDays: number[];
  onDaysChange: (days: number[]) => void;
  disabled?: boolean;
}

export const WeeklyDaysSelector = ({
  selectedDays,
  onDaysChange,
  disabled = false,
}: WeeklyDaysSelectorProps) => {
  // 체크박스 그리드 형태로 요일 선택 UI
  // Material-UI Checkbox와 FormGroup 사용
  // 반응형 레이아웃 (모바일에서는 세로 배치)
};
```

**설계 특징**:

- 선언적 구조로 설계
- Material-UI 컴포넌트 활용
- 접근성 고려 (ARIA 라벨, 키보드 네비게이션)
- 반응형 디자인

#### RepeatSection 컴포넌트 확장

```typescript
// src/components/RepeatSection.tsx 수정

const RepeatSettings = ({
  repeatType,
  onRepeatTypeChange,
  // ... 기존 props
  weeklyOptions,
  onWeeklyOptionsChange,
}: RepeatSettingsProps) => (
  <Stack spacing={2}>
    <RepeatTypeField value={repeatType} onChange={onRepeatTypeChange} />

    {/* 주간 반복 시 요일 선택 UI 추가 */}
    {repeatType === 'weekly' && (
      <WeeklyDaysSelector
        selectedDays={weeklyOptions?.daysOfWeek || []}
        onDaysChange={(days) => onWeeklyOptionsChange({ daysOfWeek: days })}
      />
    )}

    <RepeatIntervalAndEndDate
      interval={repeatInterval}
      onIntervalChange={onRepeatIntervalChange}
      endDate={repeatEndDate}
      onEndDateChange={onRepeatEndDateChange}
    />
  </Stack>
);
```

### 4. 상태 관리 통합

#### App.tsx 상태 확장

```typescript
// src/App.tsx 수정

function App() {
  // 기존 상태들...
  const [weeklyOptions, setWeeklyOptions] = useState<WeeklyOptions>({
    daysOfWeek: [],
  });

  // 반복 타입 변경 시 초기화
  const handleRepeatTypeChange = (type: RepeatType) => {
    setRepeatType(type);
    if (type !== 'weekly') {
      setWeeklyOptions({ daysOfWeek: [] });
    }
  };

  // 이벤트 생성 시 weeklyOptions 포함
  const addOrUpdateEvent = async () => {
    // ... 기존 로직
    const eventData: EventForm = {
      // ... 기존 필드들
      repeat: {
        type: repeatType,
        interval: repeatInterval,
        endDate: repeatEndDate || undefined,
        weeklyOptions:
          repeatType === 'weekly' && weeklyOptions.daysOfWeek.length > 0
            ? weeklyOptions
            : undefined,
      },
    };
    // ... 나머지 로직
  };
}
```

## 구현 계획

### Phase 1: 타입 및 유틸리티 확장

1. `RepeatInfo` 인터페이스에 `weeklyOptions` 추가
2. `calculateWeeklyWithSpecificDays` 함수 구현
3. `calculateRecurringDatesWithOptions` 함수로 기존 로직 확장
4. 단위 테스트 작성

### Phase 2: UI 컴포넌트 구현

1. `WeeklyDaysSelector` 컴포넌트 개발
2. `RepeatSection` 컴포넌트에 통합
3. 스타일링 및 반응형 디자인 적용
4. 접근성 개선

### Phase 3: 상태 관리 통합

1. `App.tsx`에 weeklyOptions 상태 추가
2. 이벤트 생성/수정 로직에 통합
3. 폼 검증 로직 추가 (최소 1개 요일 선택)

### Phase 4: 테스트 및 검증

1. 통합 테스트 작성
2. E2E 테스트 시나리오 추가
3. 기존 기능 회귀 테스트
4. 사용성 테스트

## 호환성 및 마이그레이션

### 하위 호환성 보장

- 기존 `RepeatInfo` 객체는 수정 없이 동작
- `weeklyOptions`가 없는 경우 기존 로직 사용
- 데이터베이스 스키마 변경 불필요

### 점진적 마이그레이션

1. 새로운 반복 일정은 요일 선택 기능 활용
2. 기존 반복 일정은 수정 시에만 새 기능 적용
3. 사용자 교육 및 안내 메시지 제공

## 성능 고려사항

### 계산 복잡도

- 기존: O(n) - n은 전체 날짜 수
- 신규: O(n × k) - k는 선택된 요일 수 (최대 7)
- 실제 영향: 미미함 (최대 100개 일정 생성 제한)

### 메모리 사용량

- RepeatInfo 객체당 추가 메모리: ~100 bytes
- UI 렌더링 비용: 7개 체크박스 추가
- 전체 영향: 무시할 수 있는 수준

## 접근성 (A11y) 고려사항

### WeeklyDaysSelector 접근성

```typescript
<FormGroup role="group" aria-labelledby="weekly-days-legend">
  <FormLabel id="weekly-days-legend">반복할 요일 선택</FormLabel>
  {WEEKDAYS.map((day, index) => (
    <FormControlLabel
      key={index}
      control={
        <Checkbox
          checked={selectedDays.includes(index)}
          onChange={() => handleDayToggle(index)}
          aria-label={`${day}요일 선택`}
        />
      }
      label={day}
    />
  ))}
</FormGroup>
```

### 키보드 네비게이션

- Tab으로 요일 간 이동
- Space로 요일 선택/해제
- 스크린 리더 지원

## 테스트 전략

### 단위 테스트

```typescript
// src/__tests__/utils/recurringUtils.test.ts 확장

describe('calculateWeeklyWithSpecificDays', () => {
  test('월,수,금 선택 시 올바른 날짜 생성', () => {
    const result = calculateWeeklyWithSpecificDays(
      '2024-01-01', // 월요일
      '2024-01-31',
      1,
      [1, 3, 5] // 월,수,금
    );
    expect(result).toContain('2024-01-01'); // 월
    expect(result).toContain('2024-01-03'); // 수
    expect(result).toContain('2024-01-05'); // 금
    expect(result).not.toContain('2024-01-02'); // 화
  });
});
```

### 통합 테스트

```typescript
// src/__tests__/components/RepeatSection.test.tsx 확장

test('주간 반복 선택 시 요일 선택 UI 표시', () => {
  render(<RepeatSection {...props} repeatType="weekly" />);

  expect(screen.getByText('반복할 요일 선택')).toBeInTheDocument();
  expect(screen.getByLabelText('월요일 선택')).toBeInTheDocument();
  // ... 나머지 요일들
});
```

### E2E 테스트

```typescript
// tests/e2e/specs/weekly-recurring.spec.ts

test('주간 반복 요일 선택으로 일정 생성', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="add-event"]');

  // 반복 일정 활성화
  await page.check('[aria-label="반복 일정"]');

  // 주간 반복 선택
  await page.selectOption('[data-testid="repeat-type"]', 'weekly');

  // 월,수,금 선택
  await page.check('[aria-label="월요일 선택"]');
  await page.check('[aria-label="수요일 선택"]');
  await page.check('[aria-label="금요일 선택"]');

  // 일정 저장
  await page.click('[data-testid="save-event"]');

  // 캘린더에서 확인
  await expect(page.locator('[data-date="2024-01-01"]')).toHaveText(/테스트 일정/);
  await expect(page.locator('[data-date="2024-01-03"]')).toHaveText(/테스트 일정/);
  await expect(page.locator('[data-date="2024-01-05"]')).toHaveText(/테스트 일정/);
});
```

## 향후 확장 계획

### 1. 월간 반복 요일 옵션

```typescript
interface MonthlyOptions {
  type: 'date' | 'weekday';
  weekdayOrdinal?: number; // 첫째(1), 둘째(2), 마지막(-1)
  weekday?: number; // 0=일요일, 1=월요일, ...
}
```

### 2. 예외 날짜 설정

```typescript
interface RepeatInfo {
  // ... 기존 필드들
  exceptions?: string[]; // 제외할 날짜들 ['2024-01-15', '2024-02-20']
}
```

### 3. 반복 종료 조건 확장

```typescript
interface RepeatInfo {
  // ... 기존 필드들
  endCondition: 'date' | 'count' | 'never';
  count?: number; // 반복 횟수
}
```

## 결론

이 아키텍처는 기존 시스템의 무결성을 유지하면서 주간 반복 요일 선택 기능을 추가합니다. 선언적 접근 방식과 확장 가능한 설계를 통해 향후 고급 반복 기능도 쉽게 추가할 수 있는 기반을 제공합니다.

### 핵심 장점

1. **하위 호환성**: 기존 코드 수정 최소화
2. **확장성**: 향후 기능 추가 용이
3. **선언적 구조**: 코드 가독성 및 유지보수성 향상
4. **테스트 가능성**: 각 레이어별 독립적 테스트 가능
5. **접근성**: 웹 접근성 가이드라인 준수

이 설계를 통해 사용자는 "매주 월, 수, 금요일 운동" 같은 복잡한 반복 패턴을 쉽게 설정할 수 있게 됩니다.
