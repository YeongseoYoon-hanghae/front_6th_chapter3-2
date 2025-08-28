# Epic 4: 반복 일정 편집 시 설정 유지 기능

## Epic 개요

### Epic 제목

**반복 일정 편집 시 반복 설정 유지 기능 - Brownfield Enhancement**

### Epic 설명

반복 일정 수정 시 사용자가 개별 인스턴스 변환 대신 전체 반복 그룹을 유지하며 편집할 수 있도록 하여, 더 유연하고 직관적인 반복 일정 관리 경험을 제공합니다.

### 비즈니스 가치

- 사용자가 반복 일정 수정 시 설정을 다시 입력하지 않아도 되는 편의성 제공
- 반복 일정 → 단일 일정 전환 강제로 인한 사용자 불편 해소
- 직관적이고 예측 가능한 편집 경험으로 사용자 만족도 향상
- 기존 시스템과의 완전한 호환성 유지로 위험 최소화

### 성공 지표

- 반복 일정 편집 사용자 만족도: 4.5/5.0 이상
- 반복 설정 재입력 시간 단축: 80% 이상
- 편집 의도와 결과 일치도: 95% 이상
- 기존 기능 회귀 버그: 0건

## 기존 시스템 컨텍스트

### 현재 관련 기능

- **Story 2.3**: 반복 일정 단일 수정 (반복→단일 전환만 가능)
- **RecurringEditDialog**: "이 일정만 수정" 옵션만 제공
- **EventForm/RecurringEventForm**: 기존 반복 설정 로드 미지원

### 기술 스택

- React + TypeScript 기반 캘린더 애플리케이션
- useEventOperations 훅 활용
- Material-UI 컴포넌트
- PUT `/api/events/:id` API 연동

### 통합 포인트

- RecurringEditDialog 컴포넌트 확장
- EventForm 컴포넌트 반복 설정 로드 로직 추가
- useEventForm 훅 확장
- 기존 PUT API 활용 (변경 없음)

## 개선 세부사항

### 추가할 기능

1. **반복 편집 모드 선택 확장**

   - "모든 반복 일정 수정" 옵션 추가
   - 사용자가 단일 전환 vs 전체 편집 중 선택 가능

2. **반복 설정 유지 편집 폼**

   - 반복 일정 편집 시 기존 반복 설정이 폼에 로드됨
   - 반복 체크박스가 활성화된 상태로 시작
   - 반복 유형, 종료 날짜 등 기존 설정 표시

3. **반복 전체 수정 API 연동**
   - 반복 그룹 전체를 업데이트하는 로직 구현
   - 기존 repeat.id를 유지하며 모든 인스턴스 수정
   - 충돌 검증 및 에러 핸들링

### 통합 방식

- 기존 RecurringEditDialog에 옵션 추가
- EventForm에 반복 설정 프리로드 로직 통합
- useEventOperations 훅에 전체 수정 로직 추가

### 성공 기준

- 사용자가 반복 유형, 종료 날짜 등 반복 설정을 유지하며 제목, 시간 등 수정 가능
- 반복 그룹 전체에 변경사항 일관되게 적용
- 기존 단일 전환 기능과 완전 호환

## User Stories

### Story 2.5.1: 반복 편집 모드 선택 확장

**Story**: 캘린더 사용자로서, 반복 일정을 수정할 때 "모든 반복 일정 수정" 옵션을 선택할 수 있어서, 전체 반복 시리즈를 한 번에 업데이트할 수 있다.

**Priority**: Must Have (P0)

**Acceptance Criteria**:

1. 반복 일정 수정 시 확인 다이얼로그에 "모든 반복 일정 수정" 옵션이 추가된다
2. "이 일정만 수정" 선택 시 기존 단일 전환 로직이 동작한다 (기존 기능 유지)
3. "모든 반복 일정 수정" 선택 시 반복 설정 편집 모드로 진입한다
4. 취소 선택 시 변경 없이 다이얼로그가 닫힌다

**Technical Requirements**:

- RecurringEditDialog 컴포넌트 확장
- 새로운 사용자 선택 옵션: 'single' | 'all' | 'cancel'
- 기존 로직과의 완전 호환성 유지

**Definition of Done**:

- [ ] RecurringEditDialog에 "모든 반복 일정 수정" 라디오 버튼 추가
- [ ] 선택 옵션에 따른 분기 처리 로직 구현
- [ ] 기존 단일 전환 기능 정상 동작 검증
- [ ] UI/UX가 기존 패턴과 일치

### Story 2.5.2: 반복 설정 유지 편집 폼

**Story**: 캘린더 사용자로서, 반복 일정 전체 수정 시 기존 반복 설정이 폼에 미리 로드되어서, 설정을 다시 입력하지 않고 원하는 부분만 수정할 수 있다.

**Priority**: Must Have (P0)

**Acceptance Criteria**:

1. 전체 수정 모드 진입 시 EventForm에 기존 이벤트 데이터가 로드된다
2. 반복 체크박스가 자동으로 활성화된 상태로 시작한다
3. 기존 반복 유형(매일/매주/매월/매년)이 선택된 상태로 표시된다
4. 기존 반복 종료 날짜가 입력된 상태로 표시된다
5. 사용자가 반복 설정을 변경하거나 유지할 수 있다

**Technical Requirements**:

- EventForm 컴포넌트에 반복 설정 프리로드 로직 추가
- useEventForm 훅 확장 (기존 이벤트 데이터 로드 지원)
- RecurringEventForm과의 통합

**Definition of Done**:

- [ ] 전체 수정 모드에서 기존 이벤트 데이터 자동 로드
- [ ] 반복 설정이 정확히 폼에 반영됨
- [ ] 사용자가 일부 설정만 변경 가능
- [ ] 폼 검증 로직이 정상 동작

### Story 2.5.3: 반복 전체 수정 API 연동

**Story**: 캘린더 사용자로서, 반복 일정 전체 수정 완료 시 모든 반복 인스턴스가 동시에 업데이트되어서, 일관된 변경사항을 확인할 수 있다.

**Priority**: Must Have (P0)

**Acceptance Criteria**:

1. 전체 수정 완료 시 동일한 repeat.id를 가진 모든 이벤트가 업데이트된다
2. 기존 PUT `/api/events/:id` API를 활용하여 각 인스턴스를 수정한다
3. 일부 수정 실패 시 성공한 변경사항은 유지되고 실패 원인이 사용자에게 알려진다
4. 수정 완료 시 캘린더 뷰가 즉시 업데이트된다
5. 반복 그룹의 무결성이 유지된다

**Technical Requirements**:

- useEventOperations 훅에 전체 수정 로직 추가
- 배치 업데이트 처리 (기존 PUT API 연속 호출)
- 에러 핸들링 및 사용자 피드백
- 캘린더 뷰 즉시 업데이트

**Definition of Done**:

- [ ] 반복 그룹 전체 수정 로직 구현
- [ ] repeat.id 기반 인스턴스 검색 및 업데이트
- [ ] 부분 실패 시 적절한 에러 처리
- [ ] 수정 완료 시 성공 피드백 제공
- [ ] 반복 그룹 데이터 무결성 검증

## 기술적 세부사항

### 확장된 컴포넌트 아키텍처

#### RecurringEditDialog 확장

```typescript
export const RecurringEditDialog = ({
  event,
  isOpen,
  onClose,
  onEditSingle,
  onEditAll, // 새로 추가
}: {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onEditSingle: () => void;
  onEditAll: () => void; // 새로 추가
}) => {
  const [selectedOption, setSelectedOption] = useState<'single' | 'all'>('single');

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>반복 일정 수정</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <RadioGroup
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value as 'single' | 'all')}
          >
            <FormControlLabel
              value="single"
              control={<Radio />}
              label="이 일정만 수정 (반복 해제)"
            />
            <FormControlLabel value="all" control={<Radio />} label="모든 반복 일정 수정" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button
          onClick={selectedOption === 'single' ? onEditSingle : onEditAll}
          variant="contained"
        >
          수정
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```

#### useEventOperations 훅 확장

```typescript
export const useEventOperations = () => {
  // 기존 로직...

  const editAllRecurringInstances = async (event: Event, updatedData: Partial<Event>) => {
    try {
      // 1. 동일한 repeat.id를 가진 모든 이벤트 찾기
      const recurringEvents = events.filter((e) => e.repeat.id && e.repeat.id === event.repeat.id);

      // 2. 각 인스턴스에 변경사항 적용
      const updatePromises = recurringEvents.map(async (instance) => {
        const updatedEvent = {
          ...instance,
          ...updatedData,
          // repeat.id는 유지
          repeat: {
            ...instance.repeat,
            ...updatedData.repeat,
            id: instance.repeat.id,
          },
        };

        // 3. 기존 PUT API 호출
        const response = await fetch(`/api/events/${instance.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedEvent),
        });

        if (!response.ok) {
          throw new Error(`Failed to update event ${instance.id}`);
        }

        return response.json();
      });

      // 4. 모든 업데이트 실행
      const results = await Promise.allSettled(updatePromises);

      // 5. 결과 처리
      const successful = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      if (failed > 0) {
        showNotification(
          `${successful}개 일정이 수정되었습니다. ${failed}개 일정 수정에 실패했습니다.`,
          'warning'
        );
      } else {
        showNotification(`${successful}개 반복 일정이 모두 수정되었습니다.`, 'success');
      }

      // 6. 캘린더 새로고침
      await fetchEvents();
    } catch (error) {
      console.error('Error updating recurring events:', error);
      showNotification('반복 일정 수정 중 오류가 발생했습니다.', 'error');
    }
  };

  return {
    // 기존 함수들...
    editAllRecurringInstances, // 새로 추가
  };
};
```

#### EventForm 컴포넌트 확장

```typescript
export const EventForm = ({
  event, // 기존 이벤트 데이터 (전체 수정 모드에서 전달)
  isEditingRecurring = false, // 반복 전체 수정 모드 여부
  onSubmit,
  onCancel,
}: {
  event?: Event;
  isEditingRecurring?: boolean;
  onSubmit: (eventData: Event) => void;
  onCancel: () => void;
}) => {
  const { formData, setFormData, isRecurring, setIsRecurring } = useEventForm(event); // 기존 이벤트 데이터로 초기화

  // 반복 전체 수정 모드에서는 반복 설정 활성화
  useEffect(() => {
    if (isEditingRecurring && event?.repeat.type !== 'none') {
      setIsRecurring(true);
    }
  }, [isEditingRecurring, event, setIsRecurring]);

  return (
    <form onSubmit={handleSubmit}>
      {/* 기존 폼 필드들... */}

      <FormControlLabel
        control={
          <Checkbox
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            disabled={isEditingRecurring} // 전체 수정 모드에서는 비활성화
          />
        }
        label="반복 일정"
      />

      {isRecurring && (
        <RecurringEventForm
          repeatInfo={formData.repeat}
          onChange={(repeat) => setFormData({ ...formData, repeat })}
        />
      )}

      {/* 제출 버튼들... */}
    </form>
  );
};
```

#### useEventForm 훅 확장

```typescript
export const useEventForm = (initialEvent?: Event) => {
  const [formData, setFormData] = useState<EventForm>(() => {
    if (initialEvent) {
      // 기존 이벤트 데이터로 초기화
      return {
        title: initialEvent.title,
        date: initialEvent.date,
        startTime: initialEvent.startTime,
        endTime: initialEvent.endTime,
        description: initialEvent.description,
        location: initialEvent.location,
        category: initialEvent.category,
        repeat: initialEvent.repeat,
      };
    } else {
      // 새 이벤트 기본값
      return {
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        description: '',
        location: '',
        category: '업무',
        repeat: {
          type: 'none',
          interval: 1,
          endCondition: 'date',
        },
      };
    }
  });

  const [isRecurring, setIsRecurring] = useState(() => {
    return initialEvent?.repeat.type !== 'none' && initialEvent?.repeat.type !== undefined;
  });

  // 기존 로직...

  return {
    formData,
    setFormData,
    isRecurring,
    setIsRecurring,
    // 기존 함수들...
  };
};
```

### 데이터 플로우

#### 반복 전체 수정 플로우

```
1. 사용자가 반복 일정 편집 버튼 클릭
   ↓
2. RecurringEditDialog 표시
   - "이 일정만 수정" (기존)
   - "모든 반복 일정 수정" (신규)
   ↓
3a. "이 일정만 수정" 선택
   → 기존 단일 전환 로직 실행

3b. "모든 반복 일정 수정" 선택
   ↓
4. EventForm 열림 (기존 데이터 로드)
   - 반복 체크박스 활성화
   - 기존 반복 설정 표시
   ↓
5. 사용자가 원하는 필드 수정
   - 제목, 시간, 설명 등 변경 가능
   - 반복 설정도 변경 가능
   ↓
6. 저장 버튼 클릭
   ↓
7. editAllRecurringInstances 실행
   - repeat.id로 모든 인스턴스 검색
   - 각 인스턴스에 변경사항 적용
   - PUT API 연속 호출
   ↓
8. 결과 처리 및 피드백
   - 성공/실패 개수 표시
   - 캘린더 뷰 업데이트
```

## 호환성 요구사항

### API 호환성

- ✅ 기존 PUT `/api/events/:id` API 변경 없음
- ✅ 새로운 API 엔드포인트 추가 불필요
- ✅ 기존 응답 구조 유지

### 데이터 호환성

- ✅ Event 타입 구조 변경 없음
- ✅ repeat.id 기반 그룹 관리 유지
- ✅ 기존 반복 일정 데이터 영향 없음

### UI 호환성

- ✅ 기존 Material-UI 디자인 패턴 유지
- ✅ RecurringEditDialog 기존 UI 확장
- ✅ EventForm 기존 레이아웃 유지

### 기능 호환성

- ✅ 기존 단일 전환 기능 완전 보존
- ✅ 기존 반복 생성 로직 영향 없음
- ✅ 기존 삭제 기능 영향 없음

## 위험 완화

### 주요 위험

**위험**: 반복 그룹 데이터 불일치 발생 가능성  
**완화 방안**:

- 클라이언트 단 검증 로직 + 반복 그룹 무결성 체크
- 부분 실패 시 명확한 사용자 피드백
- repeat.id 기반 정확한 그룹 식별

**롤백 계획**:

- 기능 플래그로 기존 단일 전환 모드로 복구 가능
- 새로운 UI 옵션만 숨김 처리하여 기존 기능 복원

## 테스트 전략

### 단위 테스트

- [ ] RecurringEditDialog 옵션 선택 테스트
- [ ] useEventForm 기존 데이터 로드 테스트
- [ ] editAllRecurringInstances 로직 테스트
- [ ] 부분 실패 시나리오 핸들링 테스트

### 통합 테스트

- [ ] 전체 수정 플로우 E2E 테스트
- [ ] 기존 단일 전환 기능 회귀 테스트
- [ ] API 연동 및 데이터 동기화 테스트
- [ ] 에러 시나리오 및 복구 테스트

### 호환성 테스트

- [ ] 기존 반복 일정과의 호환성 검증
- [ ] 다양한 반복 유형별 동작 확인
- [ ] 브라우저별 UI 호환성 테스트

## 완료 정의

### 기능적 완료 기준

- ✅ 반복 편집 다이얼로그에 전체 편집 옵션 추가
- ✅ 반복 설정이 유지된 상태로 편집 폼 로드
- ✅ 반복 그룹 전체 수정 시 모든 인스턴스 동기화
- ✅ 기존 단일 전환 기능과 호환성 유지
- ✅ 반복 그룹 무결성 검증 완료

### 품질 완료 기준

- ✅ 단위 테스트 커버리지 90% 이상
- ✅ 통합 테스트 100% 통과
- ✅ 기존 기능 회귀 테스트 100% 통과
- ✅ 성능 영향도 5% 이내

### 사용자 경험 완료 기준

- ✅ 반복 설정 재입력 시간 80% 단축
- ✅ 편집 의도와 결과 일치도 95% 이상
- ✅ 사용자 테스트 만족도 4.5/5.0 이상

## Dependencies

### 선행 조건

- Story 2.3 (반복 일정 단일 수정) 완료
- RecurringEditDialog 컴포넌트 구현 완료
- useEventOperations 훅 기본 기능 완료

### 후행 의존성

- Epic 3의 고급 반복 기능과 통합 가능
- 향후 배치 API 개선 시 성능 최적화 가능

## 예상 소요 시간

### 개발 시간 (총 4일)

- Story 2.5.1 (편집 모드 선택): 1일
- Story 2.5.2 (설정 유지 폼): 2일
- Story 2.5.3 (API 연동): 1일

### 테스트 시간 (총 2일)

- 단위 테스트: 1일
- 통합 및 호환성 테스트: 1일

## Success Criteria

### 기능적 성공 기준

- [ ] 반복 전체 수정 기능 정확 동작
- [ ] 기존 단일 전환 기능 100% 유지
- [ ] 반복 그룹 데이터 무결성 유지
- [ ] 에러 처리 및 복구 완벽 동작

### 사용자 경험 성공 기준

- [ ] 편집 작업 완료 시간: 평균 50% 단축
- [ ] 사용자 의도 달성률: 95% 이상
- [ ] 기능 이해도: 첫 사용 시 90% 성공률
- [ ] 사용자 만족도: 4.5/5.0 이상

### 기술적 성공 기준

- [ ] 반복 그룹 업데이트 시간: 3초 이내
- [ ] API 호출 실패율: 1% 이하
- [ ] 메모리 사용량 증가: 10% 이내
- [ ] 기존 기능 성능 영향: 5% 이내

## Business Impact

### 직접적 가치

- 반복 일정 편집 시 사용자 불편 해소로 사용성 개선
- 설정 재입력 시간 단축으로 생산성 향상
- 직관적인 편집 경험으로 사용자 만족도 증대

### 간접적 가치

- 기존 시스템 안정성 유지로 신뢰성 확보
- 점진적 기능 개선으로 낮은 위험 대비 높은 효과
- 향후 고급 반복 기능 확장의 기반 마련

이 Epic은 사용자의 실제 요구사항을 반영한 실용적인 개선사항으로, 기존 시스템의 안정성을 해치지 않으면서도 사용자 경험을 크게 향상시킬 수 있는 가치 있는 기능입니다.
