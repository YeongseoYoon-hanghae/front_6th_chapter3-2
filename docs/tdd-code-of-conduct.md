# 테스트 코드 & 개발 행동 강령

**Kent Beck과 Kent C. Dodds의 TDD 원칙 기반**

## 🎯 핵심 원칙

### **"테스트가 없으면 기능이 아니다. 클린하지 않으면 완성이 아니다."**

모든 코드 작성은 **신뢰성(Confidence)**를 높이는 것이 목표입니다. 테스트와 코드 모든 결정은 "이것이 사용자에게 더 나은 경험을 제공하는가?"라는 질문에 답할 수 있어야 합니다.

## 🔴🟢🔵 Red-Green-Refactor 사이클

### **1. 🔴 RED Phase: 실패하는 테스트 작성**

```typescript
// ✅ 좋은 예: 명확한 의도를 가진 실패 테스트
describe('반복 일정 생성', () => {
  test('사용자가 매주 반복 일정을 생성할 수 있다', async () => {
    // Given: 사용자가 일정 생성 폼에 있을 때
    render(<Calendar />);

    // When: 반복 일정을 설정하고 저장하면
    await user.click(screen.getByRole('button', { name: /일정 추가/i }));
    await user.type(screen.getByLabelText(/제목/i), '팀 미팅');
    await user.selectOptions(screen.getByLabelText(/반복 유형/i), 'weekly');
    await user.click(screen.getByRole('button', { name: /저장/i }));

    // Then: 반복 일정이 생성되고 시각적으로 구분된다
    expect(screen.getByText('팀 미팅')).toBeInTheDocument();
    expect(screen.getByLabelText('반복 일정 아이콘')).toBeInTheDocument();
  });
});
```

**RED Phase 체크리스트:**

- [ ] 테스트 이름이 사용자 시나리오를 명확히 설명하는가?
- [ ] Given-When-Then 구조로 작성했는가?
- [ ] 구현 세부사항이 아닌 사용자 관점에서 작성했는가?
- [ ] 테스트를 실행하면 실패하는가?

### **2. 🟢 GREEN Phase: 테스트를 통과시키는 최소 구현**

```typescript
// ✅ 좋은 예: 테스트만 통과시키는 최소 구현
export const useRecurringEvents = () => {
  const createRecurringEvent = async (eventData) => {
    // 가장 단순한 구현으로 시작
    if (eventData.repeat.type === 'weekly') {
      return { success: true, id: 'temp-id' };
    }
    return { success: false };
  };

  return { createRecurringEvent };
};
```

**GREEN Phase 체크리스트:**

- [ ] 테스트가 통과하는가?
- [ ] 가장 간단한 구현인가? (복잡한 로직 금지)
- [ ] 다른 테스트를 깨뜨리지 않는가?
- [ ] 하드코딩이어도 괜찮다 (리팩터링에서 개선)

### **3. 🔵 REFACTOR Phase: 클린 코드로 개선**

```typescript
// ✅ 좋은 예: 단일 책임 원칙을 따르는 리팩터링
// 📁 utils/recurringDateCalculator.ts - 날짜 계산만 담당
export const calculateWeeklyDates = (startDate: string, endDate: string): string[] => {
  // 순수 함수: 입력이 같으면 출력도 같음
  const dates: string[] = [];
  let current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 7);
  }

  return dates;
};

// 📁 hooks/useRecurringEvents.ts - 상태 관리만 담당
export const useRecurringEvents = () => {
  const createRecurringEvent = async (eventData) => {
    if (eventData.repeat.type === 'weekly') {
      const dates = calculateWeeklyDates(eventData.date, eventData.repeat.endDate);
      return await createEventsBatch(dates.map((date) => ({ ...eventData, date })));
    }
    return { success: false };
  };

  return { createRecurringEvent };
};
```

**REFACTOR Phase 체크리스트:**

- [ ] 함수/클래스가 하나의 책임만 가지는가? (SRP)
- [ ] 함수명이 하는 일을 정확히 설명하는가?
- [ ] 중복 코드를 제거했는가? (DRY)
- [ ] 모든 테스트가 여전히 통과하는가?

## 🚫 Kent C. Dodds - 피해야 할 실수들

### **실수 1: 구현 세부사항 테스트 (HIGH 위험)**

```typescript
// ❌ 나쁜 예: 내부 상태와 메서드 테스트
test('increment 메서드가 count를 증가시킨다', () => {
  const wrapper = mount(<Counter />);
  expect(wrapper.instance().state.count).toBe(0); // 구현 세부사항!
  wrapper.instance().increment(); // 구현 세부사항!
  expect(wrapper.instance().state.count).toBe(1);
});

// ✅ 좋은 예: 사용자 관점에서 테스트
test('사용자가 버튼을 클릭하면 숫자가 증가한다', async () => {
  render(<Counter />);
  const button = screen.getByRole('button');

  expect(button).toHaveTextContent('0');
  await user.click(button);
  expect(button).toHaveTextContent('1');
});
```

### **실수 2: 100% 코드 커버리지 강박 (MEDIUM 위험)**

```typescript
// ❌ 나쁜 예: 커버리지만 늘리는 무의미한 테스트
test('About 페이지가 렌더링된다', () => {
  render(<AboutPage />);
  expect(screen.getByText('About Us')).toBeInTheDocument();
});

// ✅ 좋은 예: 핵심 비즈니스 로직에 집중
test('결제 프로세스가 성공적으로 완료된다', async () => {
  // 중요한 비즈니스 로직 테스트
  render(<CheckoutPage />);
  await completePaymentFlow();
  expect(screen.getByText('결제가 완료되었습니다')).toBeInTheDocument();
});
```

### **실수 3: React Testing Library 잘못된 사용**

```typescript
// ❌ 나쁜 예들
import { render, screen, cleanup } from '@testing-library/react'; // cleanup 불필요
import { fireEvent } from '@testing-library/react'; // user-event 사용해야 함

afterEach(cleanup); // ❌ 자동으로 처리됨

test('잘못된 테스트 패턴', () => {
  const wrapper = render(<Component />); // ❌ wrapper 변수명
  const { getByTestId } = render(<Component />); // ❌ screen 사용해야 함

  expect(wrapper.queryByRole('button')).toBeInTheDocument(); // ❌ query* 잘못 사용

  fireEvent.click(getByTestId('submit')); // ❌ fireEvent + testId
});

// ✅ 좋은 예
import { render, screen } from '@testing-library/react';
import { user } from '@testing-library/user-event';

test('올바른 테스트 패턴', async () => {
  render(<Component />);

  const submitButton = screen.getByRole('button', { name: /제출/i });
  expect(submitButton).toBeInTheDocument();

  await user.click(submitButton);

  expect(screen.getByText('제출되었습니다')).toBeInTheDocument();
});
```

## 📋 React Testing Library 체크리스트

### **쿼리 우선순위 (중요도 순)**

1. **`getByRole`** - 접근성 기반 (최우선)
2. **`getByLabelText`** - 폼 요소
3. **`getByPlaceholderText`** - 입력 필드
4. **`getByText`** - 표시되는 텍스트
5. **`getByTestId`** - 최후의 수단

```typescript
// ✅ 쿼리 우선순위 준수 예시
test('사용자 등록 폼 테스트', async () => {
  render(<RegisterForm />);

  // 1순위: getByRole 사용
  const submitButton = screen.getByRole('button', { name: /가입하기/i });

  // 2순위: getByLabelText 사용
  const emailInput = screen.getByLabelText(/이메일/i);
  const passwordInput = screen.getByLabelText(/비밀번호/i);

  // 3순위: getByPlaceholderText 사용 (label이 없는 경우만)
  const searchInput = screen.getByPlaceholderText(/검색어를 입력하세요/i);

  // 실제 사용자 상호작용 시뮬레이션
  await user.type(emailInput, 'test@example.com');
  await user.type(passwordInput, 'password123');
  await user.click(submitButton);

  // 명시적 assertion
  expect(screen.getByText('가입이 완료되었습니다')).toBeInTheDocument();
});
```

### **ESLint 플러그인 필수 사용**

```json
// .eslintrc.js
{
  "extends": ["@testing-library/react", "@testing-library/jest-dom"]
}
```

### **waitFor 올바른 사용법**

```typescript
// ❌ 잘못된 waitFor 사용
await waitFor(() => {
  fireEvent.click(button); // side-effect in waitFor!
  expect(screen.getByText('로딩 중')).toBeInTheDocument();
  expect(screen.getByText('완료')).toBeInTheDocument(); // 여러 assertion!
});

// ✅ 올바른 waitFor 사용
fireEvent.click(button); // side-effect는 밖에서
await waitFor(() => expect(screen.getByText('완료')).toBeInTheDocument()); // 단일 assertion
expect(screen.getByText('상태 메시지')).toBeInTheDocument(); // 추가 검증은 밖에서
```

## 🎯 클린 코드 원칙

### **1. 단일 책임 원칙 (SRP)**

```typescript
// ❌ 나쁜 예: 여러 책임을 가진 함수
function processRecurringEvent(eventData) {
  // 1. 날짜 계산
  const dates = [];
  let current = new Date(eventData.startDate);
  while (current <= new Date(eventData.endDate)) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 7);
  }

  // 2. API 호출
  return fetch('/api/events-list', {
    method: 'POST',
    body: JSON.stringify({ events: dates.map((date) => ({ ...eventData, date })) }),
  });

  // 3. 에러 처리
  // ...
}

// ✅ 좋은 예: 각각 하나의 책임만 담당
// 📁 utils/dateCalculator.ts - 날짜 계산만 담당
export const calculateWeeklyDates = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  let current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 7);
  }

  return dates;
};

// 📁 api/eventsApi.ts - API 호출만 담당
export const createEventsBatch = async (events: EventData[]): Promise<BatchResponse> => {
  const response = await fetch('/api/events-list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

// 📁 hooks/useRecurringEvents.ts - 상태 관리와 오케스트레이션만 담당
export const useRecurringEvents = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRecurringEvents = useCallback(async (eventData: EventForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const dates = calculateWeeklyDates(eventData.date, eventData.repeat.endDate);
      const eventsToCreate = dates.map((date) => ({ ...eventData, date }));
      const result = await createEventsBatch(eventsToCreate);

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createRecurringEvents, isLoading, error };
};
```

### **2. 의미있는 이름 사용**

```typescript
// ❌ 나쁜 예: 의미 없는 이름
const processData = (d, t) => {
  const result = [];
  let curr = new Date(d);
  while (curr <= new Date(t)) {
    result.push(curr.toISOString().split('T')[0]);
    curr.setDate(curr.getDate() + 7);
  }
  return result;
};

// ✅ 좋은 예: 의도가 명확한 이름
const calculateWeeklyRecurringDates = (startDate: string, endDate: string): string[] => {
  const recurringDates: string[] = [];
  let currentDate = new Date(startDate);
  const finalDate = new Date(endDate);

  while (currentDate <= finalDate) {
    const dateString = currentDate.toISOString().split('T')[0];
    recurringDates.push(dateString);
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return recurringDates;
};
```

### **3. 순수 함수 우선 사용**

```typescript
// ✅ 좋은 예: 순수 함수 (테스트하기 쉬움)
export const calculateMonthlyDates = (
  startDate: string,
  endDate: string,
  dayOfMonth: number
): string[] => {
  // 입력이 같으면 출력도 항상 같음
  // 부작용(side effect) 없음
  const dates: string[] = [];
  let current = new Date(startDate);
  const end = new Date(endDate);

  // 첫 번째 유효한 날짜 찾기
  current.setDate(dayOfMonth);
  if (current < new Date(startDate)) {
    current.setMonth(current.getMonth() + 1);
    current.setDate(dayOfMonth);
  }

  while (current <= end) {
    // 31일 특수 처리: 해당 월에 31일이 없으면 건너뛰기
    if (dayOfMonth === 31 && current.getDate() !== 31) {
      current.setMonth(current.getMonth() + 1);
      current.setDate(dayOfMonth);
      continue;
    }

    dates.push(current.toISOString().split('T')[0]);
    current.setMonth(current.getMonth() + 1);
    current.setDate(dayOfMonth);
  }

  return dates;
};

// 순수 함수 테스트 예시
describe('calculateMonthlyDates', () => {
  test('31일 매월 반복 시 31일이 없는 달은 건너뛴다', () => {
    const result = calculateMonthlyDates('2024-01-31', '2024-06-30', 31);

    // 2월, 4월, 6월은 31일이 없으므로 제외
    expect(result).toEqual(['2024-01-31', '2024-03-31', '2024-05-31']);
  });

  test('동일한 입력에 대해 항상 같은 출력을 반환한다', () => {
    const input = ['2024-01-01', '2024-12-31', 15] as const;

    const result1 = calculateMonthlyDates(...input);
    const result2 = calculateMonthlyDates(...input);

    expect(result1).toEqual(result2);
  });
});
```

## ✅ 코드 리뷰 체크리스트

### **테스트 코드 리뷰**

- [ ] Red-Green-Refactor 사이클을 따랐는가?
- [ ] 테스트 이름이 사용자 시나리오를 설명하는가?
- [ ] Given-When-Then 구조로 작성되었는가?
- [ ] 구현 세부사항이 아닌 동작을 테스트하는가?
- [ ] screen.getByRole을 우선 사용했는가?
- [ ] @testing-library/user-event를 사용했는가?
- [ ] waitFor을 올바르게 사용했는가? (단일 assertion, side-effect 분리)
- [ ] 명시적 assertion을 사용했는가? (.toBeInTheDocument() 등)

### **프로덕션 코드 리뷰**

- [ ] 각 함수가 하나의 책임만 가지는가? (SRP)
- [ ] 함수/변수명이 의도를 명확히 드러내는가?
- [ ] 순수 함수로 작성 가능한 로직은 순수 함수로 분리했는가?
- [ ] 복잡한 로직을 작은 단위로 분해했는가?
- [ ] 중복 코드를 제거했는가? (DRY)
- [ ] 타입 안전성을 확보했는가? (TypeScript strict mode)

## 🎯 결론

**"코드는 컴퓨터가 이해할 수 있도록 작성하는 것이 아니라, 사람이 이해할 수 있도록 작성하는 것이다."** - Kent Beck

모든 코드와 테스트는 **다음 개발자(미래의 나 포함)가 쉽게 이해하고 수정할 수 있도록** 작성해야 합니다. 테스트는 코드의 **살아있는 문서**이자 **안전망**입니다.

### **기억할 핵심 메시지**

1. **테스트 우선** - 구현보다 테스트를 먼저 작성
2. **사용자 관점** - 구현이 아닌 사용자가 경험하는 것을 테스트
3. **단일 책임** - 하나의 함수는 하나의 일만
4. **의미있는 이름** - 코드가 스스로 설명하도록
5. **지속적인 개선** - 리팩터링을 통한 끊임없는 품질 향상

**참고 자료:**

- [Kent C. Dodds - Common Testing Mistakes](https://kentcdodds.com/blog/common-testing-mistakes)
- [Kent C. Dodds - Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
