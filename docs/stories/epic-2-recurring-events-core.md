# Epic 2: 반복 일정 핵심 기능

## Epic 개요

### Epic 제목

**반복 일정 핵심 기능 구현**

### Epic 설명

사용자가 매일, 매주, 매월, 매년 반복되는 일정을 생성하고 관리할 수 있는 핵심 기능을 구현합니다. 특수 날짜 규칙과 시각적 구분, 개별 반복 인스턴스 수정/삭제 기능을 포함합니다.

### 비즈니스 가치

- 반복 일정으로 인한 사용자 생산성 향상
- 복잡한 일정 관리 자동화
- 사용자 경험의 획기적 개선
- 경쟁 제품 대비 차별화된 기능 제공

### 성공 지표

- 반복 일정 생성 성공률: 95% 이상
- 반복 일정 사용자 채택률: 70% 이상
- 특수 날짜 규칙 정확도: 100%
- 사용자 만족도 증가: 30% 이상

## User Stories

### Story 2.1: 반복 일정 생성

**Story**: 캘린더 사용자로서, 반복 유형과 종료 조건을 설정하여 반복 일정을 생성할 수 있어서, 반복되는 일정을 매번 입력하지 않아도 된다.

**Priority**: Must Have (P0)

**Acceptance Criteria**:

1. 반복 유형(매일, 매주, 매월, 매년)을 선택할 수 있다
2. 반복 종료 날짜를 설정할 수 있다 (최대 2025-10-30)
3. 31일 매월 선택 시 31일에만 생성된다
4. 윤년 29일 매년 선택 시 29일에만 생성된다
5. 배치 API를 통해 모든 반복 인스턴스가 생성된다

**Technical Requirements**:

- 새로운 컴포넌트: `useRecurringEvents` 훅
- API Integration: POST `/api/events-list`
- 특수 날짜 계산 로직: 31일, 윤년 처리
- 성능: 최대 100개 인스턴스, 1초 이내 생성

**Definition of Done**:

- [ ] 반복 설정 UI가 일정 폼에 활성화
- [ ] 모든 반복 유형별 날짜 계산 로직 정확히 구현
- [ ] 특수 날짜 규칙 (31일, 윤년) 정확히 처리
- [ ] POST `/api/events-list` API 연동 완료
- [ ] 반복 일정 생성 시간 1초 이내 (최대 100개)

### Story 2.2: 반복 일정 시각적 구분

**Story**: 캘린더 사용자로서, 반복 일정을 아이콘으로 구분해서 볼 수 있어서, 일반 일정과 반복 일정을 쉽게 식별할 수 있다.

**Priority**: Must Have (P0)

**Acceptance Criteria**:

1. 반복 일정에 반복 아이콘이 표시된다
2. 월별 뷰와 주별 뷰 모두에서 아이콘이 표시된다
3. 아이콘이 기존 일정 레이아웃을 방해하지 않는다
4. 아이콘 스타일이 Material-UI 디자인과 일치한다

**Technical Requirements**:

- 새로운 컴포넌트: `RecurringEventIcon`
- Material-UI Icons 사용 (Repeat, Loop, Cached 등)
- 접근성 지원: ARIA 레이블, 툴팁
- 반응형 디자인 지원

**Definition of Done**:

- [ ] RecurringEventIcon 컴포넌트 구현 완료
- [ ] 캘린더 뷰에 아이콘 렌더링 로직 통합
- [ ] Material-UI Icons 활용한 일관된 디자인
- [ ] 아이콘 클릭/호버 시 반복 정보 툴팁 표시
- [ ] 접근성 고려 (ARIA 레이블 추가)

### Story 2.3: 반복 일정 단일 수정

**Story**: 캘린더 사용자로서, 반복 일정 중 하나만 수정할 수 있어서, 특정 날짜의 일정만 변경이 필요할 때 유연하게 대응할 수 있다.

**Priority**: Must Have (P0)

**Acceptance Criteria**:

1. 반복 일정 수정 시 해당 인스턴스가 단일 일정으로 전환된다
2. 반복 아이콘이 자동으로 제거된다
3. 기존 PUT API를 활용하여 수정된다
4. 나머지 반복 일정들은 영향받지 않는다
5. 수정 완료 시 적절한 피드백이 제공된다

**Technical Requirements**:

- 새로운 컴포넌트: `RecurringEditDialog`
- 반복→단일 전환 로직
- 기존 PUT `/api/events/:id` API 활용
- 데이터 무결성 검증 로직

**Definition of Done**:

- [ ] 반복 일정 수정 감지 로직 구현
- [ ] 반복→단일 전환 로직 정확히 구현
- [ ] repeat.id 제거 및 repeat.type = 'none' 설정
- [ ] 수정 완료 시 적절한 알림 메시지 표시
- [ ] 나머지 반복 일정 무결성 보장

### Story 2.4: 반복 일정 단일 삭제

**Story**: 캘린더 사용자로서, 반복 일정 중 하나만 삭제할 수 있어서, 특정 날짜의 일정만 취소가 필요할 때 나머지는 유지할 수 있다.

**Priority**: Must Have (P0)

**Acceptance Criteria**:

1. 반복 일정 중 선택한 인스턴스만 삭제된다
2. 기존 DELETE API를 활용한다
3. 나머지 반복 일정들은 영향 받지 않는다
4. 삭제 확인 다이얼로그가 표시된다
5. 삭제 완료 시 즉시 캘린더에서 제거된다

**Technical Requirements**:

- 새로운 컴포넌트: `RecurringDeleteDialog`
- 기존 DELETE `/api/events/:id` API 활용
- 반복 그룹 무결성 유지 로직
- 삭제 확인 UX 구현

**Definition of Done**:

- [ ] 반복 일정 삭제 확인 다이얼로그 구현
- [ ] 단일 인스턴스 삭제 로직 구현
- [ ] 반복 그룹 내 다른 일정 영향도 검증
- [ ] 삭제 완료 시 적절한 피드백 제공
- [ ] 반복 그룹 참조 무결성 유지

## 기술적 세부사항

### 새로운 컴포넌트 아키텍처

#### Core Hooks

```typescript
export const useRecurringEvents = () => {
  const generateRecurringDates = (startDate: string, repeatInfo: RepeatInfo): string[] => {
    // 반복 유형별 날짜 계산 로직
  };

  const createRecurringEvents = async (eventForm: EventForm, recurringDates: string[]) => {
    // 배치 API 호출
  };

  return { generateRecurringDates, createRecurringEvents };
};
```

#### UI Components

```typescript
export const RecurringEventIcon = ({ event }: { event: Event }) => {
  // Material-UI 아이콘 렌더링
  // 툴팁 및 접근성 지원
};
```

#### Service Layer

```typescript
export class RecurringEventManager {
  static async createBatch(events: EventForm[]): Promise<Event[]> {
    // 배치 API 호출
  }

  static convertToSingle(event: Event): Event {
    // 반복→단일 전환
  }

  static validateGroup(groupId: string, allEvents: Event[]): boolean {
    // 그룹 무결성 검증
  }
}
```

### 데이터 모델 확장

#### 확장된 RepeatInfo

```typescript
export interface RepeatInfo {
  type: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: string; // YYYY-MM-DD 형식
  endCondition: 'date';
  id?: string; // 반복 그룹 ID
}

export interface Event extends EventForm {
  id: string;
  repeat: RepeatInfo & {
    id?: string; // 반복 그룹 ID (새로 추가)
  };
}
```

### API 통합 전략

#### 배치 API 활용

```typescript
// 반복 일정 생성
POST /api/events-list
{
  "events": [
    {
      "title": "회의",
      "date": "2024-12-20",
      "repeat": {
        "type": "weekly",
        "id": "repeat-uuid-123"
      }
    },
    // ... 더 많은 반복 인스턴스들
  ]
}
```

## 특수 날짜 규칙 구현

### 31일 매월 반복 규칙

- 31일이 없는 달 (4, 6, 9, 11월)은 건너뛰기
- 2월은 항상 건너뛰기
- 정확히 31일에만 일정 생성

**구현 로직**:

```typescript
const getNextMonthWithDate31 = (current: Date): Date => {
  let next = new Date(current);
  do {
    next.setMonth(next.getMonth() + 1);
  } while (next.getDate() !== 31);
  return next;
};
```

### 윤년 29일 매년 반복 규칙

- 윤년이 아닌 해에는 건너뛰기
- 정확히 2월 29일에만 일정 생성

**구현 로직**:

```typescript
const getNextLeapYear = (current: Date): Date => {
  let year = current.getFullYear() + 1;
  while (!isLeapYear(year)) {
    year++;
  }
  return new Date(year, 1, 29); // 2월 29일
};
```

## 성능 최적화 전략

### 배치 처리 최적화

- 최대 100개 인스턴스 제한
- 1초 이내 생성 완료 목표
- 메모리 효율적인 날짜 계산

### 렌더링 최적화

- React.memo 활용한 컴포넌트 메모이제이션
- 아이콘 컴포넌트 최적화
- 불필요한 리렌더링 방지

### 네트워크 최적화

- 배치 API 타임아웃: 10초
- 에러 발생 시 적절한 롤백 처리
- 네트워크 실패 재시도 로직

## 테스트 전략

### 단위 테스트

#### 핵심 로직 테스트

- [ ] 반복 날짜 계산 정확성 (모든 반복 유형)
- [ ] 특수 날짜 규칙 (31일, 윤년)
- [ ] 반복 그룹 ID 생성 및 할당
- [ ] 반복→단일 전환 로직

#### 컴포넌트 테스트

- [ ] RecurringEventIcon 렌더링 및 상호작용
- [ ] 반복 설정 UI 폼 검증
- [ ] 다이얼로그 컴포넌트 동작

### 통합 테스트

#### API 통합

- [ ] POST `/api/events-list` 배치 생성
- [ ] PUT/DELETE 기존 API와의 호환성
- [ ] 에러 응답 처리 및 복구

#### 데이터 플로우

- [ ] 반복 일정 생성 → 저장 → 조회 플로우
- [ ] 수정/삭제 시 데이터 무결성 유지
- [ ] 캘린더 뷰 업데이트 정확성

### E2E 테스트

#### 사용자 시나리오

- [ ] 반복 일정 생성 전체 플로우
- [ ] 각 반복 유형별 생성 테스트
- [ ] 특수 케이스 (31일, 윤년) 생성
- [ ] 단일 수정/삭제 플로우

## 위험 요소 및 완화 방안

### 주요 위험 요소

#### 1. 성능 위험

**위험**: 대량 반복 일정 생성 시 브라우저 멈춤
**완화**: 최대 100개 제한, 배치 처리 최적화, 프로그레스 표시

#### 2. 데이터 무결성 위험

**위험**: 반복 그룹 데이터 불일치
**완화**: 클라이언트 검증 로직, 서버 사이드 검증, 트랜잭션 처리

#### 3. 사용자 경험 위험

**위험**: 복잡한 반복 설정으로 인한 혼란
**완화**: 직관적 UI 설계, 미리보기 기능, 명확한 피드백

#### 4. 브라우저 호환성 위험

**위험**: 날짜 계산 로직의 브라우저별 차이
**완화**: Date 객체 표준화, 광범위한 브라우저 테스트

### 롤백 계획

- 반복 기능 비활성화 옵션 (기능 플래그)
- 기존 단일 일정 모드로 복구 가능
- 데이터 마이그레이션 롤백 스크립트

## Dependencies

### 선행 조건

- Epic 1: 기본 일정 관리 기능 완료
- server.js 업데이트 (배치 API 구현)
- 기존 모든 테스트 케이스 통과

### 외부 의존성

- Material-UI Icons 패키지
- 브라우저 Notification API 지원
- JSON 파일 구조 확장 지원

### 내부 의존성

- `useEventForm` 훅 확장
- `useEventOperations` 훅 확장
- 기존 Event/EventForm 타입 확장

## 예상 소요 시간

### 개발 시간 (총 8일)

- Story 2.1 (반복 생성): 3일
- Story 2.2 (시각적 구분): 2일
- Story 2.3 (단일 수정): 2일
- Story 2.4 (단일 삭제): 1일

### 테스트 시간 (총 3일)

- 단위 테스트: 1일
- 통합 테스트: 1일
- E2E 테스트: 1일

### 통합 및 최적화 (총 2일)

- 성능 최적화: 1일
- 버그 수정 및 안정화: 1일

## Success Criteria

### 기능적 성공 기준

- [ ] 모든 반복 유형 (매일/매주/매월/매년) 정확 동작
- [ ] 특수 날짜 규칙 100% 정확성
- [ ] 반복 일정 시각적 구분 명확성
- [ ] 단일 수정/삭제 기능 완벽 동작

### 성능 성공 기준

- [ ] 반복 일정 생성 시간: 1초 이내 (100개)
- [ ] 아이콘 렌더링 성능 영향: 5% 이내
- [ ] 메모리 사용량 증가: 20% 이내
- [ ] 배치 API 응답 시간: 3초 이내

### 사용자 경험 성공 기준

- [ ] 반복 설정 완료 시간: 평균 30초 이내
- [ ] 반복 일정 식별 정확도: 95% 이상
- [ ] 수정/삭제 의도와 결과 일치도: 98% 이상
- [ ] 사용자 오류율: 5% 이하

### 품질 성공 기준

- [ ] 단위 테스트 커버리지: 95% 이상
- [ ] 통합 테스트 통과율: 100%
- [ ] 크로스 브라우저 호환성: 100%
- [ ] 접근성 점수: 90점 이상

## Business Value

### 직접적 가치

- 반복 일정으로 인한 사용자 입력 시간 80% 단축
- 일정 관리 정확도 향상으로 인한 생산성 증대
- 경쟁 제품 대비 차별화된 사용자 경험 제공

### 간접적 가치

- 사용자 만족도 증가로 인한 리텐션 향상
- 고급 기능에 대한 프리미엄 가치 인식
- 추후 고급 반복 기능 (Epic 3) 확장 기반 마련

이 Epic은 캘린더 애플리케이션의 핵심 가치를 획기적으로 향상시키는 가장 중요한 기능 세트입니다. 성공적인 구현을 통해 사용자 경험을 혁신하고 제품의 차별화된 경쟁 우위를 확보할 수 있습니다.
