# React 선언적 리팩터링 AI 에이전트 행동강령

## 🤖 AI 에이전트 실행 규칙

### 📋 **필수 스캔 체크리스트**

코드를 받으면 **반드시** 다음 순서로 스캔하고 변환하라:

1. **DOM 접근 패턴 탐지** → `document.`, `querySelector`, `getElementById` 발견 시 즉시 state/ref로 변환
2. **명령형 반복문 탐지** → `for`, `while`, `forEach` 발견 시 즉시 `map/filter/reduce`로 변환
3. **조건부 DOM 조작 탐지** → `if(조건) { element.style... }` 발견 시 즉시 조건부 렌더링으로 변환
4. **이벤트 핸들러 내 DOM 조작 탐지** → 핸들러 안의 모든 DOM 조작을 state 변경으로 변환
5. **클래스/스타일 조작 탐지** → `classList`, `style` 속성 조작을 조건부 className으로 변환

### ⚡ **즉시 변환 트리거 패턴**

```javascript
// 이런 패턴을 발견하면 무조건 변환
FORBIDDEN_PATTERNS = [
  /document\.(getElementById|querySelector|getElementsBy)/g,
  /\.style\.[a-zA-Z]/g,
  /\.classList\.(add|remove|toggle)/g,
  /\.innerHTML\s*=/g,
  /\.textContent\s*=/g,
  /for\s*\([^)]*\)\s*{[\s\S]*<[^>]*>/g, // JSX 생성하는 for문
  /if\s*\([^)]*\)\s*{[\s\S]*\.style/g, // 조건부 스타일 변경
];
```

### 🎯 **변환 액션 매트릭스**

| 발견한 패턴                       | 즉시 실행할 액션                                                             |
| --------------------------------- | ---------------------------------------------------------------------------- |
| `document.getElementById('x')`    | → `const xRef = useRef(); <div ref={xRef}>`                                  |
| `element.style.display = 'none'`  | → `const [visible, setVisible] = useState(true); {visible && <Component />}` |
| `for(let i=0; i<arr.length; i++)` | → `{arr.map((item, i) => <Component key={i} />)}`                            |
| `if(condition) { showElement() }` | → `{condition && <Element />}`                                               |
| `element.classList.add('active')` | → `className={isActive ? 'class active' : 'class'}`                          |

### 🚨 **절대 금지 코드 (Zero Tolerance)**

```javascript
// 발견 시 에러 발생시켜야 할 패턴들
ZERO_TOLERANCE_PATTERNS = [
  'document.getElementById',
  'document.querySelector',
  'element.style.property =',
  'element.innerHTML =',
  'element.classList.add',
  'element.appendChild',
  'element.removeChild',
];
```

### 🔄 **자동 변환 알고리즘**

```javascript
function autoRefactor(code) {
  // 1단계: DOM 접근 → ref/state 변환
  code = replaceDOMAccess(code);

  // 2단계: 명령형 루프 → 선언형 표현식 변환
  code = replaceImperativeLoops(code);

  // 3단계: 조건부 DOM 조작 → 조건부 렌더링 변환
  code = replaceConditionalDOM(code);

  // 4단계: 스타일 조작 → className 조건부 적용 변환
  code = replaceStyleManipulation(code);

  // 5단계: 이벤트 핸들러 정리
  code = cleanEventHandlers(code);

  return code;
}
```

### 📏 **품질 검증 규칙**

변환 후 다음 조건을 **모두** 만족해야 함:

- ✅ `document.` 키워드가 코드에 존재하지 않음
- ✅ `.style.` 속성 조작이 존재하지 않음
- ✅ JSX 생성하는 `for`/`while` 루프가 없음
- ✅ 모든 조건부 렌더링이 JSX 표현식 형태임
- ✅ 이벤트 핸들러에서는 state 변경만 수행함
- ✅ UI 상태가 단일 source of truth에서 파생됨

### 🎨 **고급 변환 패턴**

#### 패턴 A: 복잡한 DOM 조작

```javascript
// 발견 시
function updateUI() {
  const header = document.getElementById('header');
  const content = document.getElementById('content');

  if (isLoading) {
    header.style.opacity = '0.5';
    content.innerHTML = '<div>Loading...</div>';
  } else {
    header.style.opacity = '1';
    content.innerHTML = data.map((item) => `<div>${item.name}</div>`).join('');
  }
}

// 즉시 변환
const [isLoading, setIsLoading] = useState(false);
return (
  <div>
    <header style={{ opacity: isLoading ? 0.5 : 1 }}>Header</header>
    <div>
      {isLoading ? <div>Loading...</div> : data.map((item) => <div key={item.id}>{item.name}</div>)}
    </div>
  </div>
);
```

#### 패턴 B: 이벤트 기반 UI 변경

```javascript
// 발견 시
button.addEventListener('click', () => {
  const modal = document.querySelector('.modal');
  modal.style.display = 'block';
  modal.classList.add('fade-in');
});

// 즉시 변환
const [modalOpen, setModalOpen] = useState(false);
const handleClick = () => setModalOpen(true);
return (
  <button onClick={handleClick}>Open Modal</button>
  {modalOpen && <Modal className="fade-in" />}
);
```

### 🏃‍♂️ **실행 우선순위**

1. **긴급 (P0)**: DOM 직접 조작 제거
2. **높음 (P1)**: 명령형 반복문 변환
3. **중간 (P2)**: 조건부 렌더링 최적화
4. **낮음 (P3)**: 코드 가독성 향상

### 🚫 **예외 허용 사항 (매우 제한적)**

```javascript
// 오직 이런 경우만 DOM 접근 허용
useEffect(() => {
  // ✅ 서드파티 라이브러리 초기화
  const chart = new Chart(chartRef.current, options);

  // ✅ 포커스 관리 (접근성)
  inputRef.current?.focus();

  // ✅ 스크롤 위치 제어
  window.scrollTo(0, 0);

  return () => chart.destroy();
}, []);
```

---

## 🧠 클린코드와 선언적 코드에 대한 심화 이해

### 선언적 코드의 철학적 배경

**선언적 코드**는 단순히 문법적 변환이 아닌 **사고방식의 전환**입니다.

#### **명령형 사고** vs **선언형 사고**

```javascript
// 명령형 사고: "어떻게(How) 할 것인가?"
function renderUserList() {
  const container = document.getElementById('users');
  container.innerHTML = ''; // 기존 내용 제거

  for (let i = 0; i < users.length; i++) {
    // 단계별 실행
    const user = users[i];
    const div = document.createElement('div');
    div.className = user.isActive ? 'user active' : 'user';
    div.textContent = user.name;
    container.appendChild(div);
  }
}

// 선언형 사고: "무엇을(What) 원하는가?"
function UserList({ users }) {
  return (
    <div>
      {users.map((user) => (
        <div key={user.id} className={user.isActive ? 'user active' : 'user'}>
          {user.name}
        </div>
      ))}
    </div>
  );
}
```

### 클린코드와 선언적 코드의 상관관계

#### 1. **가독성 (Readability)**

```javascript
// 명령적 + 더러운 코드
let html = '';
for (let i = 0; i < items.length; i++) {
  if (items[i].visible) {
    html +=
      '<div class="item' + (items[i].active ? ' active' : '') + '">' + items[i].name + '</div>';
  }
}
document.getElementById('container').innerHTML = html;

// 선언적 + 클린 코드
const visibleItems = items.filter((item) => item.visible);
return (
  <div>
    {visibleItems.map((item) => (
      <ItemCard key={item.id} item={item} />
    ))}
  </div>
);
```

#### 2. **단일 책임 원칙 (Single Responsibility)**

```javascript
// 명령적: 하나의 함수가 너무 많은 일을 함
function handleUserAction() {
  // 1. 데이터 검증
  if (!validateUser()) return;

  // 2. DOM 조작
  const button = document.getElementById('submit');
  button.disabled = true;
  button.textContent = 'Processing...';

  // 3. API 호출
  fetch('/api/user').then((response) => {
    // 4. 추가 DOM 조작
    button.disabled = false;
    button.textContent = 'Submit';
    document.getElementById('result').innerHTML = 'Success!';
  });
}

// 선언적: 각각의 관심사가 분리됨
function UserForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    if (!validateUser()) return;

    setLoading(true);
    try {
      await submitUser();
      setResult('Success!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <SubmitButton loading={loading} />
      <ResultMessage message={result} />
    </form>
  );
}
```

#### 3. **예측 가능성 (Predictability)**

```javascript
// 명령적: 사이드 이펙트로 인한 예측 불가능한 상태
let globalState = { count: 0, users: [] };

function incrementAndUpdateDOM() {
  globalState.count++; // 전역 상태 변경
  document.getElementById('counter').textContent = globalState.count; // DOM 직접 변경

  if (globalState.count > 5) {
    document.getElementById('warning').style.display = 'block'; // 숨겨진 사이드 이펙트
  }
}

// 선언적: 순수 함수와 명시적 상태 관리
function Counter({ count, onIncrement }) {
  return (
    <div>
      <span id="counter">{count}</span>
      <button onClick={onIncrement}>+</button>
      {count > 5 && <Warning message="Count is too high!" />}
    </div>
  );
}
```

### 실무에서의 적용 원칙

#### **원칙 1: 상태와 UI의 완전한 동기화**

```javascript
// ❌ 상태와 UI가 분리된 경우
const [items, setItems] = useState([]);
const addItem = (item) => {
  setItems([...items, item]);
  // DOM도 별도로 업데이트 (동기화 문제 발생 가능)
  document.getElementById('count').textContent = items.length + 1;
};

// ✅ 단일 source of truth
const [items, setItems] = useState([]);
const itemCount = items.length; // derived state

return (
  <div>
    <span>총 {itemCount}개</span>
    <ItemList items={items} />
  </div>
);
```

#### **원칙 2: 컴포넌트는 props의 순수 함수여야 함**

```javascript
// ❌ 사이드 이펙트가 있는 컴포넌트
function UserCard({ user }) {
  // 렌더링 중 외부 상태 변경
  if (user.isVIP) {
    document.title = `VIP: ${user.name}`;
  }

  return <div>{user.name}</div>;
}

// ✅ 순수 함수 컴포넌트 + useEffect로 사이드 이펙트 분리
function UserCard({ user }) {
  useEffect(() => {
    if (user.isVIP) {
      document.title = `VIP: ${user.name}`;
    }
  }, [user.isVIP, user.name]);

  return <div>{user.name}</div>;
}
```

#### **원칙 3: 복잡한 로직은 커스텀 훅으로 추상화**

```javascript
// ❌ 컴포넌트에 비즈니스 로직이 섞임
function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});

  // 복잡한 필터링 로직
  const filteredProducts = products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.minPrice && product.price < filters.minPrice) return false;
    if (filters.inStock && !product.inStock) return false;
    return true;
  });

  return <div>{/* UI 렌더링 */}</div>;
}

// ✅ 로직과 UI 분리
function useProductFilter(products, filters) {
  return useMemo(
    () =>
      products.filter((product) => {
        if (filters.category && product.category !== filters.category) return false;
        if (filters.minPrice && product.price < filters.minPrice) return false;
        if (filters.inStock && !product.inStock) return false;
        return true;
      }),
    [products, filters]
  );
}

function ProductList() {
  const { products, loading } = useProducts();
  const { filters, updateFilter } = useFilters();
  const filteredProducts = useProductFilter(products, filters);

  return (
    <div>
      <FilterPanel filters={filters} onFilterChange={updateFilter} />
      <ProductGrid products={filteredProducts} />
    </div>
  );
}
```

### 성능과 가독성의 균형

#### **메모이제이션 활용**

```javascript
// 선언적이지만 성능이 좋지 않은 경우
function ExpensiveList({ items, searchTerm }) {
  const filteredItems = items
    .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.priority - b.priority);

  return (
    <div>
      {filteredItems.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  );
}

// 선언적 + 성능 최적화
function ExpensiveList({ items, searchTerm }) {
  const filteredItems = useMemo(
    () =>
      items
        .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.priority - b.priority),
    [items, searchTerm]
  );

  return (
    <div>
      {filteredItems.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  );
}
```

### 마무리: 선언적 코드의 본질

선언적 코드의 진정한 가치는 **"What"에 집중**할 수 있게 해준다는 점입니다.

- **What**: 사용자에게 어떤 UI를 보여줄 것인가?
- **How**: 그 UI를 어떻게 구현할 것인가? (React가 담당)

이러한 관심사의 분리를 통해 우리는 더 나은 사용자 경험을 설계하는데 집중할 수 있게 됩니다.
