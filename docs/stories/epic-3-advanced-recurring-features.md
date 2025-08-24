# Epic 3: 고급 반복 기능 (선택적)

## Epic 개요

### Epic 제목

**고급 반복 일정 기능 및 전체 관리**

### Epic 설명

반복 일정의 고급 옵션과 전체 관리 기능을 구현합니다. 반복 횟수 제한, 특정 요일 선택, 월간 반복 옵션, 전체 반복 그룹 관리 등의 파워유저용 기능을 제공합니다.

### 비즈니스 가치

- 파워유저의 복잡한 반복 요구사항 충족
- 제품의 고급 기능으로 인한 경쟁 우위 확보
- 사용자 세분화를 통한 프리미엄 가치 제공
- 장기적인 사용자 락인(Lock-in) 효과

### 성공 지표

- 고급 반복 기능 사용률: 30% 이상
- 파워유저 만족도: 4.7/5.0 이상
- 반복 관리 효율성 증대: 50% 이상
- 고급 기능으로 인한 사용자 유지율 증가: 15% 이상

## User Stories

### Story 3.1: 반복 간격 및 횟수 설정

**Story**: 캘린더 파워유저로서, 반복 간격과 횟수를 세밀하게 설정할 수 있어서, 복잡한 반복 패턴의 일정을 정확히 관리할 수 있다.

**Priority**: Should Have (P1)

**Acceptance Criteria**:

1. 각 반복 유형에 대해 간격을 설정할 수 있다 (2일마다, 3주마다 등)
2. 반복 횟수를 최대 10회로 제한하여 설정할 수 있다
3. 주간 반복 시 특정 요일을 선택할 수 있다 (월,수,금)
4. 월간 반복 시 날짜 기준 vs 요일 순서 기준을 선택할 수 있다
5. 예외 날짜를 지정하여 특정 날짜를 제외할 수 있다

**Technical Requirements**:

- 확장된 RepeatInfo 인터페이스
- 새로운 컴포넌트: `AdvancedRepeatSettings`
- 복합 날짜 계산 로직
- UI/UX: 고급 설정 패널

**Definition of Done**:

- [ ] 확장된 RepeatInfo 타입 정의 완료
- [ ] 간격 설정 UI 구현 (2일마다, 3주마다 등)
- [ ] 반복 횟수 제한 (최대 10회) 구현
- [ ] 주간 반복 요일 선택 기능
- [ ] 월간 반복 고급 옵션 (날짜/요일 기준)
- [ ] 예외 날짜 설정 기능

### Story 3.2: 반복 일정 전체 관리

**Story**: 캘린더 사용자로서, 반복 일정 그룹 전체를 한 번에 수정하거나 삭제할 수 있어서, 반복 패턴 변경이나 전체 취소를 효율적으로 할 수 있다.

**Priority**: Should Have (P1)

**Acceptance Criteria**:

1. 반복 일정 수정 시 "전체 반복 일정 수정" 옵션을 선택할 수 있다
2. 전체 반복 일정 수정 시 모든 인스턴스가 동시에 업데이트된다
3. 반복 일정 삭제 시 "전체 반복 일정 삭제" 옵션을 선택할 수 있다
4. 전체 삭제 시 영향받는 일정 개수가 명확히 표시된다
5. 전체 작업 실행 전에 확인 다이얼로그가 표시된다

**Technical Requirements**:

- 새로운 컴포넌트: `RepeatActionDialog`
- 배치 API 활용: PUT/DELETE `/api/events-list`
- 반복 그룹 검색 및 관리 로직
- 트랜잭션 처리 및 롤백 메커니즘

**Definition of Done**:

- [ ] 반복 작업 선택 다이얼로그 구현
- [ ] 전체 수정 기능 구현 (PUT `/api/events-list`)
- [ ] 전체 삭제 기능 구현 (DELETE `/api/events-list`)
- [ ] 영향 범위 미리보기 기능
- [ ] 트랜잭션 처리 및 에러 복구

## 기술적 세부사항

### 확장된 데이터 모델

#### 고급 RepeatInfo 인터페이스

```typescript
export interface RepeatInfo {
  type: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // 간격 (2일마다 = 2)
  endDate?: string;
  endCondition: 'date' | 'count';
  count?: number; // 반복 횟수 (최대 10)
  id?: string;

  // 고급 옵션들
  weeklyOptions?: {
    daysOfWeek: number[]; // [1,3,5] = 월,수,금
  };
  monthlyOptions?: {
    type: 'date' | 'weekday'; // 날짜 기준 vs 요일 기준
    weekdayOrdinal?: number; // 첫째(1), 둘째(2), 마지막(-1)
    weekday?: number; // 0=일요일, 1=월요일, ...
  };
  exceptions?: string[]; // 제외할 날짜들 (YYYY-MM-DD)
}
```

### 새로운 컴포넌트 아키텍처

#### 고급 반복 설정 패널

```typescript
export const AdvancedRepeatSettings = ({
  repeatInfo,
  onChange,
}: {
  repeatInfo: RepeatInfo;
  onChange: (info: RepeatInfo) => void;
}) => {
  // 간격 설정 UI
  // 반복 횟수 설정 UI
  // 요일 선택 UI (주간 반복)
  // 월간 옵션 UI
};
```

#### 반복 작업 다이얼로그

```typescript
export const RepeatActionDialog = ({
  action,
  repeatGroup,
  onConfirm,
}: {
  action: 'edit' | 'delete';
  repeatGroup: Event[];
  onConfirm: (scope: 'single' | 'all') => void;
}) => {
  // 작업 선택 UI (단일 vs 전체)
  // 영향받는 일정 개수 표시
  // 확인/취소 버튼
};
```

### 고급 날짜 계산 로직

#### 간격 기반 반복 계산

```typescript
export const calculateIntervalDates = (startDate: string, repeatInfo: RepeatInfo): string[] => {
  // interval 기반 날짜 계산
  // count 또는 endDate 기반 종료 처리
  // exceptions 날짜 제외 처리
};
```

#### 주간 반복 요일 선택

```typescript
export const calculateWeeklyWithDays = (
  startDate: string,
  daysOfWeek: number[],
  endCondition: RepeatInfo
): string[] => {
  // 특정 요일만 선택된 주간 반복 처리
};
```

#### 월간 반복 고급 옵션

```typescript
export const calculateMonthlyAdvanced = (
  startDate: string,
  monthlyOptions: RepeatInfo['monthlyOptions'],
  endCondition: RepeatInfo
): string[] => {
  if (monthlyOptions?.type === 'weekday') {
    // "매월 첫째 주 월요일", "매월 마지막 금요일" 등
    return calculateByWeekdayOrdinal(startDate, monthlyOptions, endCondition);
  } else {
    // 기존 날짜 기준 처리
    return calculateByDate(startDate, endCondition);
  }
};
```

### API 확장

#### 배치 수정 API

```typescript
// PUT /api/events-list
{
  "repeatId": "uuid-123",
  "updates": {
    "title": "새로운 제목",
    "startTime": "10:00"
  }
}
```

#### 배치 삭제 API

```typescript
// DELETE /api/events-list
{
  "repeatId": "uuid-123"
}
```

## 고급 기능별 상세 구현

### 1. 간격 설정 (Interval Configuration)

**사용자 시나리오**:

- "2일마다 운동" (매일 → 2일 간격)
- "3주마다 팀 미팅" (매주 → 3주 간격)
- "6개월마다 건강검진" (매월 → 6개월 간격)

**구현 방식**:

```typescript
const calculateWithInterval = (startDate: Date, type: RepeatType, interval: number) => {
  switch (type) {
    case 'daily':
      return addDays(startDate, interval);
    case 'weekly':
      return addWeeks(startDate, interval);
    case 'monthly':
      return addMonths(startDate, interval);
    case 'yearly':
      return addYears(startDate, interval);
  }
};
```

### 2. 반복 횟수 제한 (Count Limitation)

**사용자 시나리오**:

- "5회만 반복되는 교육 일정"
- "10번의 치료 일정"

**구현 방식**:

```typescript
const generateWithCountLimit = (startDate: string, repeatInfo: RepeatInfo): string[] => {
  const dates = [];
  let current = new Date(startDate);

  for (let i = 0; i < (repeatInfo.count || 1); i++) {
    dates.push(current.toISOString().split('T')[0]);
    current = getNextDate(current, repeatInfo);
  }

  return dates;
};
```

### 3. 주간 반복 요일 선택

**사용자 시나리오**:

- "월, 수, 금요일만 반복" (헬스장)
- "화, 목요일 영어 수업"

**구현 방식**:

```typescript
const generateWeeklyWithSpecificDays = (startDate: string, daysOfWeek: number[]): string[] => {
  // 시작 주에서 해당 요일들 찾기
  // 다음 주로 이동하면서 반복
  // 종료 조건까지 계속
};
```

### 4. 월간 반복 고급 옵션

**날짜 기준 vs 요일 기준**:

- **날짜 기준**: "매월 15일" (기존 방식)
- **요일 기준**: "매월 첫째 주 월요일", "매월 마지막 금요일"

**구현 방식**:

```typescript
const calculateMonthlyByWeekday = (
  startDate: Date,
  ordinal: number, // 1=첫째, 2=둘째, -1=마지막
  weekday: number // 0=일, 1=월, ...
): Date => {
  const year = startDate.getFullYear();
  const month = startDate.getMonth();

  if (ordinal > 0) {
    // 첫째, 둘째 등
    return getNthWeekdayOfMonth(year, month, ordinal, weekday);
  } else {
    // 마지막
    return getLastWeekdayOfMonth(year, month, weekday);
  }
};
```

### 5. 예외 날짜 처리

**사용자 시나리오**:

- "매주 월요일 회의, 단 휴일은 제외"
- "매월 15일 보고서 제출, 주말이면 다음 월요일"

**구현 방식**:

```typescript
const applyExceptions = (dates: string[], exceptions: string[]): string[] => {
  return dates.filter((date) => !exceptions.includes(date));
};

const adjustForHolidays = (dates: string[], holidays: string[]): string[] => {
  return dates.map((date) => {
    if (holidays.includes(date)) {
      // 다음 평일로 이동
      return getNextWeekday(date);
    }
    return date;
  });
};
```

## 사용자 인터페이스 설계

### 고급 설정 패널 UI 흐름

```
1. 기본 반복 설정 (유형, 종료일)
   ↓
2. "고급 설정 보기" 버튼 클릭
   ↓
3. 확장 패널 열림:
   - 간격 설정 (숫자 입력)
   - 반복 횟수 (드롭다운: 무제한/1-10회)
   - 요일 선택 (주간 반복 시)
   - 월간 옵션 (날짜/요일 기준)
   - 예외 날짜 (캘린더 선택)
```

### 전체 관리 다이얼로그 UI

```
반복 일정 수정/삭제 감지
   ↓
다이얼로그 표시:
   ┌─────────────────────────────────┐
   │ 🔄 반복 일정 관리                │
   │                                 │
   │ "매주 팀 미팅"은 반복 일정입니다   │
   │                                 │
   │ ○ 이 일정만 수정/삭제            │
   │ ○ 전체 반복 일정 수정/삭제        │
   │   (총 12개 일정에 영향)          │
   │                                 │
   │    [취소]  [확인]               │
   └─────────────────────────────────┘
```

## 테스트 전략

### 복합 시나리오 테스트

#### 1. 간격 + 횟수 조합

```typescript
// "2일마다 5회 반복"
const testCase = {
  type: 'daily',
  interval: 2,
  count: 5,
  startDate: '2024-12-20',
};
// 예상 결과: 2024-12-20, 22, 24, 26, 28
```

#### 2. 주간 요일 선택 + 예외 날짜

```typescript
// "월,수,금 반복, 12월 25일 제외"
const testCase = {
  type: 'weekly',
  weeklyOptions: { daysOfWeek: [1, 3, 5] },
  exceptions: ['2024-12-25'],
};
```

#### 3. 월간 요일 기준 반복

```typescript
// "매월 첫째 주 월요일"
const testCase = {
  type: 'monthly',
  monthlyOptions: {
    type: 'weekday',
    weekdayOrdinal: 1,
    weekday: 1,
  },
};
```

### 성능 테스트

- 복합 조건으로 100개 인스턴스 생성 시간: 2초 이내
- 전체 반복 그룹 수정 시간: 3초 이내
- 예외 날짜 필터링 성능: 100ms 이내

### 사용자 경험 테스트

- 고급 설정 완료 시간: 평균 2분 이내
- 설정 오류율: 10% 이하
- 전체 관리 의도와 결과 일치도: 95% 이상

## 위험 요소 및 완화 방안

### 주요 위험 요소

#### 1. 복잡성으로 인한 사용성 저하

**위험**: 고급 옵션이 너무 복잡해서 사용자 혼란
**완화**:

- 단계적 UI 공개 (기본 → 고급)
- 실시간 미리보기 제공
- 명확한 도움말 및 예시

#### 2. 성능 저하

**위험**: 복합 조건 계산으로 인한 속도 저하
**완화**:

- 계산 결과 캐싱
- 백그라운드 처리
- 복잡도 제한 (최대 조건 수)

#### 3. 데이터 일관성

**위험**: 전체 수정/삭제 시 일부 실패
**완화**:

- 트랜잭션 처리
- 실패 시 롤백 메커니즘
- 사용자에게 명확한 피드백

## Dependencies

### 선행 조건

- Epic 2: 반복 일정 핵심 기능 완료
- 배치 API 확장 (PUT/DELETE `/api/events-list`)
- 고급 UI 컴포넌트 라이브러리

### 외부 의존성

- 날짜 계산 라이브러리 (date-fns 등)
- 복잡한 폼 관리 (React Hook Form 등)
- 캘린더 선택 컴포넌트

## 예상 소요 시간

### 개발 시간 (총 10일)

- Story 3.1 (고급 설정): 6일
  - 데이터 모델 확장: 1일
  - 고급 계산 로직: 2일
  - UI 컴포넌트: 2일
  - 통합 및 테스트: 1일
- Story 3.2 (전체 관리): 4일
  - 배치 API 연동: 2일
  - 관리 UI: 1일
  - 테스트 및 안정화: 1일

### 테스트 시간 (총 4일)

- 복합 시나리오 테스트: 2일
- 성능 및 스트레스 테스트: 1일
- 사용자 경험 테스트: 1일

## Success Criteria

### 기능적 성공 기준

- [ ] 모든 고급 반복 옵션 정확 동작
- [ ] 복합 조건 조합 100% 정확성
- [ ] 전체 관리 기능 안정적 동작
- [ ] 예외 처리 및 에러 복구 완벽

### 성능 성공 기준

- [ ] 복합 조건 계산 시간: 2초 이내
- [ ] 전체 관리 작업 시간: 3초 이내
- [ ] UI 응답성: 200ms 이내
- [ ] 메모리 사용량 증가: 30% 이내

### 사용자 경험 성공 기준

- [ ] 고급 기능 학습 시간: 10분 이내
- [ ] 설정 완료 성공률: 90% 이상
- [ ] 사용자 만족도: 4.5/5.0 이상
- [ ] 기능 사용률: 30% 이상

## Business Impact

### 직접적 가치

- 복잡한 일정 관리 자동화로 생산성 증대
- 파워유저 유치 및 유지
- 경쟁 제품 대비 차별화 포인트

### 간접적 가치

- 프리미엄 기능으로 인한 브랜드 가치 상승
- 기업 고객 유치 가능성
- 추후 SaaS 모델 확장 기반

이 Epic은 선택적 기능이지만, 구현 시 제품의 완성도와 경쟁력을 크게 향상시킬 수 있는 차별화 요소입니다. 파워유저의 요구사항을 충족하여 장기적인 사용자 충성도를 확보할 수 있습니다.
