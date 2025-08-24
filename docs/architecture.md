# 반복 일정 기능 추가 - Brownfield Architecture

## 개요

기존 캘린더 애플리케이션에 반복 일정 기능을 추가하는 Brownfield 아키텍처 문서입니다. 백엔드 팀의 부재로 인해 프론트엔드 중심의 솔루션을 설계합니다.

## 현재 시스템 분석

### 기존 기술 스택

- **Frontend**: React 19 + TypeScript + Material-UI 7.2.0
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library
- **Backend**: Express.js (Node.js)
- **Data Storage**: JSON 파일 (realEvents.json)

### 현재 아키텍처 특징

- 단일 컴포넌트 (App.tsx) 중심의 구조
- 커스텀 훅 기반 상태 관리
- REST API를 통한 단일 이벤트 CRUD
- Material-UI 기반 UI 구성

## 제약사항

### 1. 백엔드 팀 부재

- 복잡한 반복 로직 구현 불가
- 기존 API 구조 유지 필요
- 새로운 배치 API만 제공 가능

### 2. 기존 시스템 호환성

- 7주차 과제 요구사항 완전 보존
- 기존 단일 일정 기능 무결성 유지
- 사용자 인터페이스 일관성 유지

## 통합 전략

### 1. 코드 통합

**기존 코드 확장 방식**

- App.tsx: 반복 설정 UI 추가
- types.ts: RepeatInfo 인터페이스 확장
- 새로운 훅: useRecurringEvents 추가
- 새로운 유틸리티: recurringUtils.ts 추가

### 2. 데이터베이스 통합

**JSON 파일 구조 확장**

```json
{
  "events": [
    {
      "id": "event-uuid",
      "title": "회의",
      "date": "2024-12-20",
      "repeat": {
        "type": "weekly",
        "interval": 1,
        "endDate": "2024-12-31",
        "endCondition": "date",
        "id": "repeat-group-uuid"
      }
    }
  ]
}
```

### 3. API 통합

**기존 API 유지**

- GET /api/events
- POST /api/events (단일)
- PUT /api/events/:id
- DELETE /api/events/:id

**새로운 배치 API 추가**

- POST /api/events-list (배치 생성)
- PUT /api/events-list (배치 수정)
- DELETE /api/events-list (배치 삭제)

### 4. UI 통합

**기존 UI 확장**

- 반복 설정 폼 활성화 (현재 주석 처리됨)
- 반복 일정 시각적 구분 (아이콘 추가)
- 반복 일정 수정/삭제 다이얼로그

## 주요 아키텍처 결정사항

### 1. 프론트엔드 중심 반복 로직

**결정**: 모든 반복 날짜 계산을 프론트엔드에서 수행
**이유**: 백엔드 복잡도 최소화, 빠른 구현 가능
**트레이드오프**: 클라이언트 부담 증가, 서버 검증 부족

### 2. 배치 API 활용

**결정**: 반복 일정은 개별 이벤트로 생성하여 배치 API로 처리
**이유**: 기존 단일 이벤트 로직 재사용 가능
**트레이드오프**: 네트워크 비용, 데이터 중복

### 3. 반복 그룹 ID 시스템

**결정**: UUID 기반 그룹 ID로 반복 일정 관리
**이유**: 단순하고 효과적인 그룹핑 방식
**트레이드오프**: 수동 관리 필요

### 4. TDD 개발 방식

**결정**: 새로운 반복 기능은 모두 TDD로 개발
**이유**: 복잡한 날짜 계산 로직의 신뢰성 확보
**트레이드오프**: 개발 시간 증가

## 구현 가이드라인

### 새로 생성할 파일

```
src/
├── hooks/
│   └── useRecurringEvents.ts          # 반복 일정 전용 훅
├── utils/
│   └── recurringUtils.ts              # 반복 날짜 계산 로직
├── components/
│   ├── RecurringEventIcon.tsx         # 반복 아이콘 컴포넌트
│   ├── RecurringEditDialog.tsx        # 수정 확인 다이얼로그
│   └── RecurringDeleteDialog.tsx      # 삭제 확인 다이얼로그
└── services/
    └── RecurringEventManager.ts       # 반복 일정 비즈니스 로직
```

### 확장할 기존 파일

```
src/
├── App.tsx                            # 반복 UI 추가
├── types.ts                           # RepeatInfo 확장
└── hooks/
    ├── useEventForm.ts                # 반복 폼 상태 관리
    └── useEventOperations.ts          # 배치 API 연동
```

### 핵심 타입 확장

```typescript
// 기존
export interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endDate?: string;
}

// 확장
export interface RepeatInfo {
  type: RepeatType;
  interval: number;
  endDate?: string;
  endCondition: 'date';
  id?: string; // 반복 그룹 ID
}
```

## 위험 요소 및 완화 방안

### 1. 성능 위험

**위험**: 대량 반복 일정 생성 시 성능 저하
**완화**: 최대 개수 제한 (100개), 생성 시간 1초 이내

### 2. 데이터 일관성 위험

**위험**: 반복 그룹 데이터 불일치
**완화**: 클라이언트 검증 로직, 데이터 무결성 검사

### 3. 사용자 경험 위험

**위험**: 복잡한 반복 설정으로 인한 사용성 저하
**완화**: 단계별 UI, 미리보기 기능, 명확한 피드백

### 4. 기존 기능 회귀 위험

**위험**: 새 기능 추가로 기존 기능 영향
**완화**: 철저한 회귀 테스트, 기능 플래그

## 테스트 전략

### 1. 단위 테스트

- 반복 날짜 계산 로직 (특수 규칙 포함)
- 반복 그룹 관리 로직
- 폼 검증 로직

### 2. 통합 테스트

- 배치 API 호출 및 응답 처리
- 반복 일정 생성/수정/삭제 플로우
- 기존 기능과의 상호작용

### 3. E2E 테스트

- 반복 일정 전체 사용자 플로우
- 기존 기능 회귀 방지
- 브라우저 호환성

## 개발 우선순위

### Phase 1: 핵심 반복 기능 (Epic 2)

1. 반복 날짜 계산 로직
2. 배치 API 통합
3. 반복 설정 UI
4. 반복 일정 시각적 구분

### Phase 2: 반복 일정 관리

1. 단일 인스턴스 수정
2. 단일 인스턴스 삭제
3. 반복 확인 다이얼로그

### Phase 3: 고급 기능 (Epic 3 - 선택적)

1. 반복 간격 설정
2. 전체 반복 일정 관리
3. 예외 날짜 처리

## 성능 목표

- 반복 일정 생성: 1초 이내 (최대 100개)
- 반복 날짜 계산: 100ms 이내
- UI 응답성: 메인 스레드 블로킹 없음
- 메모리 사용량: 기존 대비 20% 이내 증가

이 아키텍처는 제약사항 하에서 최적의 반복 일정 기능을 제공하기 위한 실용적인 접근 방식입니다.
