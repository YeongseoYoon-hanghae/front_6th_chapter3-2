# 캘린더 애플리케이션 - 완전한 제품 요구사항 명세서 (PRD)

## 프로젝트 개요

### 제품명

**고급 캘린더 관리 시스템**

### 제품 목적

사용자가 일정을 효율적으로 생성, 관리하고 반복 일정을 통해 생산성을 극대화할 수 있는 웹 기반 캘린더 애플리케이션

### 목표 사용자

- 개인 일정 관리가 필요한 사용자
- 반복적인 업무 일정을 관리하는 직장인
- 체계적인 시간 관리를 원하는 모든 사용자

## 제품 목표

### 주요 목표

1. **완전한 기본 일정 관리 기능** 제공
2. **직관적이고 강력한 반복 일정 기능** 구현
3. **사용자 친화적인 인터페이스** 제공
4. **안정적이고 빠른 성능** 보장

### 성공 지표

- 일정 생성 완료율: 95% 이상
- 반복 일정 설정 성공률: 90% 이상
- 사용자 만족도: 4.5/5.0 이상
- 페이지 로딩 시간: 2초 이내

## 기능 요구사항

### Epic 1: 기본 일정 관리 기능

#### 1.1 일정 CRUD 기능

**우선순위**: 필수 (P0)

**기능 설명**:

- 일정 생성, 조회, 수정, 삭제 기능
- 모든 필드에 대한 완전한 검증
- 실시간 피드백 제공

**상세 요구사항**:

1. **일정 생성**

   - 제목 (필수, 최대 100자)
   - 날짜 선택 (필수)
   - 시작/종료 시간 (필수, HH:MM 형식)
   - 설명 (선택, 최대 500자)
   - 위치 (선택, 최대 200자)
   - 카테고리 선택 (업무/개인/가족/기타)

2. **일정 조회**

   - 월별 뷰: 한 달 전체 일정 표시
   - 주별 뷰: 한 주 상세 일정 표시
   - 일정별 상세 정보 팝업

3. **일정 수정**

   - 모든 필드 수정 가능
   - 수정 전 확인 다이얼로그
   - 수정 후 즉시 반영

4. **일정 삭제**
   - 삭제 확인 다이얼로그
   - 삭제 후 즉시 캘린더에서 제거

#### 1.2 캘린더 뷰 및 탐색

**우선순위**: 필수 (P0)

**기능 설명**:

- 월별/주별 캘린더 뷰 제공
- 직관적인 날짜 탐색 기능

**상세 요구사항**:

1. **월별 뷰**

   - 달력 형태로 일정 표시
   - 하루에 여러 일정 표시 지원
   - 공휴일 표시
   - 이전/다음 달 탐색

2. **주별 뷰**

   - 일주일 단위 상세 표시
   - 시간대별 일정 배치
   - 이전/다음 주 탐색

3. **오늘 날짜 표시**
   - 현재 날짜 하이라이트
   - 오늘 날짜로 바로가기 버튼

#### 1.3 일정 검색 및 필터링

**우선순위**: 필수 (P0)

**기능 설명**:

- 제목 기반 일정 검색
- 카테고리별 필터링

**상세 요구사항**:

1. **검색 기능**

   - 제목 기반 실시간 검색
   - 검색 결과 하이라이트
   - 검색어 자동완성

2. **필터링 기능**
   - 카테고리별 필터링
   - 다중 카테고리 선택 가능
   - 필터 상태 시각적 표시

#### 1.4 일정 충돌 감지 및 알림

**우선순위**: 필수 (P0)

**기능 설명**:

- 시간이 겹치는 일정 자동 감지
- 사전 설정된 시간에 알림 제공

**상세 요구사항**:

1. **충돌 감지**

   - 일정 생성/수정 시 자동 확인
   - 겹치는 일정 목록 표시
   - 강제 저장 옵션 제공

2. **알림 시스템**
   - 알림 시간 설정 (1분~1일 전)
   - 브라우저 알림 표시
   - 알림 내용: 제목, 시작 시간, 위치

### Epic 2: 반복 일정 핵심 기능

#### 2.1 반복 일정 생성

**우선순위**: 필수 (P0)

**기능 설명**:

- 다양한 반복 유형으로 일정 생성
- 특수 날짜 규칙 지원

**상세 요구사항**:

1. **반복 유형 선택**

   - 매일 (daily)
   - 매주 (weekly)
   - 매월 (monthly)
   - 매년 (yearly)

2. **반복 종료 조건**

   - 특정 날짜까지 반복
   - UI 달력 선택 제한: 2025-10-30까지만 선택 가능

3. **특수 날짜 규칙**

   - **31일 매월 반복**: 31일이 없는 달은 건너뜀
   - **윤년 29일 매년 반복**: 평년에는 건너뜀

4. **배치 생성**
   - 모든 반복 인스턴스를 한 번에 생성
   - 반복 그룹 ID로 관련 일정 묶음
   - 최대 100개 인스턴스 제한

#### 2.2 반복 일정 시각적 구분

**우선순위**: 필수 (P0)

**기능 설명**:

- 반복 일정을 일반 일정과 구분하여 표시

**상세 요구사항**:

1. **반복 아이콘 표시**

   - 각 반복 일정에 아이콘 추가
   - 반복 유형별 다른 아이콘 (선택적)
   - 월별/주별 뷰 모두 지원

2. **접근성 지원**
   - 아이콘 hover 시 반복 정보 툴팁
   - ARIA 레이블 적용
   - 고대비 모드 지원

#### 2.3 반복 일정 단일 수정

**우선순위**: 필수 (P0)

**기능 설명**:

- 반복 일정 중 특정 인스턴스만 수정

**상세 요구사항**:

1. **수정 확인 다이얼로그**

   - "이 일정만 수정" vs "전체 반복 일정 수정" 선택
   - 수정 영향 범위 명확히 표시

2. **단일 인스턴스 수정**
   - 반복 정보 제거하여 단일 일정으로 전환
   - 반복 아이콘 자동 제거
   - 나머지 반복 일정은 영향 없음

#### 2.4 반복 일정 단일 삭제

**우선순위**: 필수 (P0)

**기능 설명**:

- 반복 일정 중 특정 인스턴스만 삭제

**상세 요구사항**:

1. **삭제 확인 다이얼로그**

   - "이 일정만 삭제" vs "전체 반복 일정 삭제" 선택
   - 삭제할 일정 정보 명확히 표시

2. **단일 인스턴스 삭제**
   - 선택된 일정만 삭제
   - 나머지 반복 일정은 유지
   - 반복 그룹 무결성 보장

### Epic 3: 고급 반복 기능 (선택적 기능)

#### 3.1 반복 간격 설정

**우선순위**: 선택 (P2)

**기능 설명**:

- 반복 유형별 상세 간격 설정
- 반복 횟수 제한

**상세 요구사항**:

1. **간격 설정**

   - 2일마다, 3주마다 등 사용자 정의 간격
   - 간격별 최대 반복 횟수: 10회

2. **고급 반복 옵션**
   - 주간 반복: 특정 요일 선택 (월,수,금)
   - 월간 반복: 특정 날짜 vs 특정 순서의 요일 선택
   - 예외 날짜 설정

#### 3.2 반복 일정 전체 관리

**우선순위**: 선택 (P2)

**기능 설명**:

- 반복 그룹 전체를 한 번에 수정/삭제

**상세 요구사항**:

1. **전체 수정**

   - 모든 반복 인스턴스 동시 수정
   - 반복 패턴 변경 지원

2. **전체 삭제**
   - 반복 그룹의 모든 일정 삭제
   - 삭제 전 영향 범위 표시

## 비기능적 요구사항

### 성능 요구사항

1. **페이지 로딩 시간**: 2초 이내
2. **반복 일정 생성 시간**: 1초 이내 (최대 100개)
3. **일정 검색 응답 시간**: 100ms 이내
4. **메모리 사용량**: 브라우저 메모리 50MB 이내

### 사용성 요구사항

1. **직관적 인터페이스**: 첫 사용자도 5분 내 기본 기능 숙지
2. **반응형 디자인**: 데스크톱, 태블릿, 모바일 지원
3. **접근성**: WCAG 2.1 AA 준수
4. **다국어 지원**: 한국어 우선, 영어 지원

### 호환성 요구사항

1. **브라우저 지원**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
2. **운영체제**: Windows 10+, macOS 10.15+, iOS 13+, Android 10+

### 보안 요구사항

1. **데이터 검증**: 모든 입력값 클라이언트/서버 이중 검증
2. **XSS 방지**: 모든 사용자 입력 sanitization
3. **데이터 저장**: JSON 파일 기반 로컬 저장

## 기술 사양

### 아키텍처

- **Frontend**: React 19 + TypeScript
- **UI Library**: Material-UI 7.2.0
- **State Management**: React Hooks + Context API
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library
- **Backend**: Express.js (Node.js)
- **Data Storage**: JSON 파일 (realEvents.json)

### API 설계 (프론트엔드 관점)

> **중요**: 백엔드 구현은 고려하지 않습니다. API는 이미 구현되어 있다고 가정하고 프론트엔드 개발에만 집중합니다.

#### 기존 API (Mock/MSW로 시뮬레이션)

```typescript
// 단위 테스트용 API 인터페이스
GET /api/events - 모든 일정 조회
POST /api/events - 단일 일정 생성
PUT /api/events/:id - 단일 일정 수정
DELETE /api/events/:id - 단일 일정 삭제
```

#### 새로운 배치 API (Mock/MSW로 시뮬레이션)

```typescript
// 반복 일정용 배치 API 인터페이스
POST /api/events-list - 여러 일정 일괄 생성 (반복 일정용)
PUT /api/events-list - 여러 일정 일괄 수정 (반복 일정 전체 수정)
DELETE /api/events-list - 여러 일정 일괄 삭제 (반복 일정 전체 삭제)
```

#### MSW 모킹 전략

```typescript
// 테스트용 API 모킹 예시
export const handlers = [
  rest.post('/api/events-list', (req, res, ctx) => {
    const { events } = req.body;
    // 반복 일정 생성 시뮬레이션
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        events: events.map((event) => ({ ...event, id: uuid() })),
      })
    );
  }),
  // ... 기타 API 핸들러
];
```

### 데이터 모델

```typescript
export interface Event extends EventForm {
  id: string;
  repeat: RepeatInfo & {
    id?: string; // 반복 그룹 ID
  };
}

export interface RepeatInfo {
  type: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // 간격 (2일마다 = 2)
  endDate?: string;
  endCondition: 'date' | 'count';
  count?: number; // 반복 횟수 (최대 10)
  id?: string;

  // 고급 옵션들 (Epic 3)
  weeklyOptions?: {
    daysOfWeek: number[]; // 0=일요일, 1=월요일, ...
  };
  monthlyOptions?: {
    type: 'date' | 'weekday'; // 날짜 기준 vs 요일 기준
    weekdayOrdinal?: number; // 첫째, 둘째, ...
    weekday?: number; // 요일
  };
  exceptions?: string[]; // 제외할 날짜들 (YYYY-MM-DD)
}
```

### 컴포넌트 아키텍처

#### 새로운 컴포넌트

```
src/components/
├── RecurringEventIcon.tsx - 반복 일정 아이콘
├── RecurringEditDialog.tsx - 반복 일정 수정 다이얼로그
├── RecurringDeleteDialog.tsx - 반복 일정 삭제 다이얼로그
├── AdvancedRepeatSettings.tsx - 고급 반복 설정 (Epic 3)
└── RepeatActionDialog.tsx - 반복 작업 선택 다이얼로그 (Epic 3)
```

#### 새로운 훅

```
src/hooks/
└── useRecurringEvents.ts - 반복 일정 관리 로직
```

#### 새로운 유틸리티

```
src/utils/
└── recurringUtils.ts - 반복 날짜 계산 및 검증
```

## 개발 전략

### 개발 방법론

#### **TDD (Test-Driven Development) - 핵심 원칙**

**Kent Beck & Kent C. Dodds의 TDD 원칙을 엄격히 준수합니다:**

1. **Red-Green-Refactor 사이클**

   - 🔴 **Red**: 실패하는 테스트부터 작성
   - 🟢 **Green**: 테스트를 통과시키는 최소한의 코드 작성
   - 🔵 **Refactor**: 테스트 통과를 유지하면서 코드 개선

2. **React Testing Library 베스트 프랙티스** ([Kent C. Dodds 가이드](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) 준수)

   - **사용자 중심 테스트**: 사용자가 상호작용하는 방식대로 테스트
   - **`screen` 사용**: 쿼리는 `screen.getByRole()` 우선 사용
   - **실제 텍스트로 쿼리**: `testId` 대신 실제 표시되는 텍스트 사용
   - **`@testing-library/user-event` 사용**: `fireEvent` 대신 사용자 이벤트 시뮬레이션
   - **적절한 쿼리 선택**: `get*` vs `find*` vs `query*` 올바른 사용
   - **`waitFor` 올바른 사용**: 단일 assertion, side-effect 분리

3. **백엔드 독립적 개발**
   - **프론트엔드만 집중**: 백엔드 코드는 고려하지 않음
   - **MSW (Mock Service Worker)**: API 모킹으로 독립적 테스트
   - **서버 상태 시뮬레이션**: 다양한 서버 응답 시나리오 테스트

#### **클린 코드 원칙**

1. **가독성 우선**

   - 의도가 명확한 함수/변수명
   - 단일 책임 원칙 (SRP) 준수
   - 복잡한 로직은 작은 단위로 분해

2. **테스트 가능한 설계**

   - 순수 함수 우선 사용
   - 의존성 주입으로 테스트 용이성 확보
   - 비즈니스 로직과 UI 로직 분리

3. **점진적 배포**
   - Epic별 단계적 구현 및 배포
   - 각 단계마다 완전한 테스트 커버리지 확보

### 품질 보증

#### **테스트 전략 (Kent C. Dodds 원칙 기반)**

1. **테스트 피라미드 준수**

   - **Unit Tests (70%)**: 순수 함수, 유틸리티, 커스텀 훅
   - **Integration Tests (20%)**: 컴포넌트 상호작용, API 통합
   - **E2E Tests (10%)**: 핵심 사용자 시나리오

2. **테스트 작성 원칙**

   ```typescript
   // ✅ 좋은 예: 사용자 중심 테스트
   test('사용자가 반복 일정을 생성할 수 있다', async () => {
     render(<Calendar />);

     await user.click(screen.getByRole('button', { name: /일정 추가/i }));
     await user.type(screen.getByLabelText(/제목/i), '팀 미팅');
     await user.selectOptions(screen.getByLabelText(/반복 유형/i), 'weekly');

     await user.click(screen.getByRole('button', { name: /저장/i }));

     expect(screen.getByText('팀 미팅')).toBeInTheDocument();
     expect(screen.getByLabelText('반복 일정')).toBeInTheDocument();
   });
   ```

3. **React Testing Library 엄격 준수**
   - **ESLint 플러그인 사용**: `eslint-plugin-testing-library`, `eslint-plugin-jest-dom`
   - **쿼리 우선순위**: `getByRole` > `getByLabelText` > `getByPlaceholderText` > `getByTestId`
   - **Assertion 명시적 작성**: `expect().toBeInTheDocument()` 항상 명시
   - **올바른 Async 처리**: `findBy*` vs `waitFor` 적절한 사용

#### **코드 품질 기준**

1. **커버리지 목표**

   - **단위 테스트**: 95% 이상 (핵심 로직)
   - **통합 테스트**: 90% 이상 (컴포넌트 상호작용)
   - **E2E 테스트**: 80% 이상 (주요 사용자 플로우)

2. **성능 모니터링**

   - **렌더링 성능**: React DevTools Profiler 사용
   - **메모리 누수 검사**: 각 컴포넌트 언마운트 후 상태 확인
   - **알고리즘 성능**: 반복 날짜 계산 벤치마크 테스트

3. **접근성 보장**
   - **jest-axe**: 자동화된 접근성 테스트
   - **스크린 리더 호환성**: ARIA 속성 올바른 사용
   - **키보드 네비게이션**: Tab/Enter/Escape 키 지원

#### **Red-Green-Refactor 워크플로우**

```
📋 Story 개발 사이클:

1. 🔴 RED Phase
   - 실패하는 테스트 작성
   - 비즈니스 요구사항을 테스트로 표현
   - 테스트 실행하여 실패 확인

2. 🟢 GREEN Phase
   - 테스트를 통과시키는 최소한의 구현
   - 품질보다는 동작에 집중
   - 모든 테스트 통과 확인

3. 🔵 REFACTOR Phase
   - 코드 품질 개선 (가독성, 성능, 구조)
   - 테스트 통과 상태 유지
   - 클린 코드 원칙 적용

4. ✅ INTEGRATION Phase
   - 통합 테스트 작성 및 실행
   - 기존 기능과의 호환성 확인
   - 회귀 테스트 통과 검증
```

### 위험 관리 (TDD 중심)

#### **개발 위험 및 완화 전략**

1. **테스트 복잡성 위험**

   - **위험**: 반복 일정 알고리즘의 복잡한 테스트 시나리오
   - **완화**: Red-Green-Refactor 사이클로 단계별 구현, 순수 함수로 분리

2. **성능 위험**

   - **위험**: 대량 반복 일정 생성 시 브라우저 성능 저하
   - **완화**: 벤치마크 테스트 우선 작성, 최대 100개 제한, 가상화 적용

3. **사용성 위험**

   - **위험**: 복잡한 반복 설정으로 인한 사용자 혼란
   - **완화**: 사용자 중심 테스트 작성, UI/UX 단순화, 실시간 미리보기

4. **코드 품질 위험**
   - **위험**: 빠른 개발로 인한 기술 부채 증가
   - **완화**: 리팩터링 단계 필수화, 코드 리뷰, ESLint/Prettier 자동화

#### **테스트 실패 시나리오**

```typescript
// 예상 실패 시나리오별 테스트 전략
describe('반복 일정 위험 시나리오', () => {
  test('31일 매월 반복 - 2월 건너뜀 확인', () => {
    // RED: 실패하는 테스트로 시작
    // GREEN: 최소 구현으로 통과
    // REFACTOR: 엣지 케이스 처리 개선
  });

  test('100개 초과 생성 시 성능 저하 방지', () => {
    // 성능 임계점 테스트
  });

  test('네트워크 오류 시 부분 생성 롤백', () => {
    // 에러 복구 시나리오 테스트
  });
});
```

#### **품질 게이트**

- **각 Red-Green-Refactor 사이클마다**:
  - ✅ 모든 테스트 통과
  - ✅ ESLint/TypeScript 오류 제로
  - ✅ 성능 벤치마크 통과
  - ✅ 접근성 테스트 통과

## 출시 계획

### Phase 1: 기본 기능 안정화 (1주)

- Epic 1: 기본 일정 관리 기능 완성
- 기존 7주차 과제 요구사항 100% 보존
- 회귀 테스트 완료

### Phase 2: 핵심 반복 기능 (2주)

- Epic 2: 반복 일정 핵심 기능 완성
- 반복 생성, 시각적 구분, 단일 수정/삭제
- 성능 최적화 및 안정성 확보

### Phase 3: 고급 기능 (1주 - 선택적)

- Epic 3: 고급 반복 기능 구현
- 간격 설정, 전체 관리 기능
- 사용자 피드백 반영

## 성공 기준 (TDD 기반)

### **테스트 주도 성공 기준**

#### **1. Red-Green-Refactor 완성도**

- [ ] **Red Phase**: 모든 기능에 대해 실패하는 테스트 우선 작성 완료
- [ ] **Green Phase**: 모든 테스트 통과하는 최소 구현 완료
- [ ] **Refactor Phase**: 모든 코드가 클린 코드 원칙 준수

#### **2. React Testing Library 베스트 프랙티스 준수**

```typescript
// 성공 기준 체크리스트
✅ screen.getByRole() 우선 사용 (testId 사용 최소화)
✅ 사용자 중심 테스트 (실제 상호작용 시뮬레이션)
✅ @testing-library/user-event 사용
✅ 적절한 쿼리 선택 (get*/find*/query*)
✅ waitFor 올바른 사용 (단일 assertion)
✅ 명시적 assertion (.toBeInTheDocument() 등)
```

### **기능적 성공 기준 (테스트로 검증)**

- [ ] **모든 사용자 시나리오가 E2E 테스트로 커버됨**

  - 일정 생성부터 삭제까지 전체 플로우
  - 반복 일정의 모든 유형 (daily/weekly/monthly/yearly)
  - 특수 날짜 규칙 (31일, 윤년 2/29) 정확한 처리

- [ ] **엣지 케이스 100% 테스트 커버리지**
  ```typescript
  // 필수 테스트 시나리오
  test('31일 매월 반복 - 2월/4월/6월/9월/11월 건너뜀');
  test('윤년 2/29 매년 반복 - 평년에는 건너뜀');
  test('100개 초과 생성 시 오류 처리');
  test('네트워크 오류 시 부분 생성 롤백');
  test('동시 수정 시 충돌 해결');
  ```

### **성능 성공 기준 (벤치마크 테스트)**

- [ ] **알고리즘 성능 테스트 통과**

  ```typescript
  test('100개 반복 일정 생성 < 1초', () => {
    const startTime = performance.now();
    createRecurringEvents(eventData, 100);
    const endTime = performance.now();
    expect(endTime - startTime).toBeLessThan(1000);
  });
  ```

- [ ] **메모리 누수 테스트 통과**
  ```typescript
  test('컴포넌트 언마운트 후 메모리 정리 확인', () => {
    // 메모리 누수 검증 로직
  });
  ```

### **사용자 경험 성공 기준 (통합 테스트)**

- [ ] **접근성 테스트 100% 통과**

  ```typescript
  test('스크린 리더 호환성', async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('키보드 네비게이션 완전 지원', () => {
    // Tab/Enter/Escape 키 테스트
  });
  ```

- [ ] **사용자 워크플로우 테스트 완료**
  ```typescript
  test('신규 사용자도 5분 내 반복 일정 생성', async () => {
    // 실제 사용자 시나리오 시뮬레이션
    await user.click(screen.getByRole('button', { name: /일정 추가/i }));
    // ... 전체 플로우 테스트
    expect(screen.getByText('반복 일정이 생성되었습니다')).toBeInTheDocument();
  });
  ```

### **코드 품질 성공 기준**

- [ ] **테스트 커버리지 목표 달성**

  - Unit Tests: 95% 이상
  - Integration Tests: 90% 이상
  - E2E Tests: 80% 이상

- [ ] **정적 분석 도구 통과**

  - ESLint: 0 errors, 0 warnings
  - TypeScript: strict mode에서 0 errors
  - Prettier: 100% 포맷팅 준수

- [ ] **Kent C. Dodds 원칙 100% 준수**
  - Testing Library ESLint 플러그인 통과
  - 모든 테스트가 사용자 중심으로 작성됨
  - 실제 DOM 구조와 사용자 상호작용 기반 테스트

**최종 검증**: 모든 테스트가 CI/CD 파이프라인에서 자동으로 통과하며, 수동 테스트 없이도 프로덕션 배포 가능한 수준

## 결론

이 PRD는 **Kent Beck과 Kent C. Dodds의 TDD 원칙을 엄격히 준수**하여 개발되는 캘린더 애플리케이션의 완전한 요구사항을 정의합니다.

### **핵심 원칙**

1. **테스트 우선 개발**: 모든 기능은 실패하는 테스트부터 시작
2. **사용자 중심 테스트**: React Testing Library로 실제 사용자 상호작용 시뮬레이션
3. **클린 코드**: Red-Green-Refactor 사이클을 통한 지속적인 코드 품질 향상
4. **프론트엔드 집중**: 백엔드는 고려하지 않고 프론트엔드 개발에만 집중

### **성공의 정의**

성공은 **모든 테스트가 통과하고, 코드가 클린하며, 사용자가 실제로 사용 가능한 기능**이 완성되었을 때 달성됩니다. 단순한 기능 구현이 아닌, **지속 가능하고 유지보수 가능한 고품질 소프트웨어**의 완성을 목표로 합니다.

---

**"테스트가 없으면 기능이 아니다. 클린하지 않으면 완성이 아니다."** - TDD 개발 철학
