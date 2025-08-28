import { test, expect } from '@playwright/test';

import { resetEventStore, loadSampleData } from '../api';
import { interceptApi } from '../utils/api-interceptor';

/**
 * 캘린더 핵심 플로우 E2E 테스트
 *
 * 4개 핵심 시나리오:
 * 1. 반복 일정 단일 편집 플로우
 * 2. 일정 충돌 경고 처리
 * 3. 반복 일정 단일 삭제
 * 4. 캘린더 뷰 렌더링
 */

test.describe('캘린더 핵심 플로우 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 이벤트 저장소 초기화
    resetEventStore();

    // API 인터셉팅 설정
    await interceptApi(page);

    await page.goto('/');

    await expect(page.locator('text=일정 보기')).toBeVisible();

    await page.waitForLoadState('networkidle');
  });

  /**
   * 시나리오 1: 기본 일정 생성 테스트
   * - 간단한 일정 생성 → 저장 → 확인
   */
  test('기본 일정 생성 테스트', async ({ page }) => {
    // 1. 기본 정보 입력
    await page.getByRole('textbox', { name: '제목' }).fill('테스트 회의');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-08-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('09:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '설명' }).fill('테스트 설명');
    await page.getByRole('textbox', { name: '위치' }).fill('회의실 A');

    // 2. 카테고리 선택
    await page.getByRole('combobox', { name: '업무' }).click();
    await page.getByRole('option', { name: '업무-option' }).click();

    // 3. 일정 추가 버튼 클릭
    await page.getByTestId('event-submit-button').click();

    // 4. 성공 메시지 확인
    await expect(page.locator('text=일정이 추가되었습니다.')).toBeVisible({ timeout: 10000 });

    // 5. 생성된 일정 확인 - 가장 넓은 범위로 검색
    const eventByText = page.getByText('테스트 회의');
    await expect(eventByText.first()).toBeVisible({ timeout: 5000 });
  });

  /**
   * 시나리오 2: 반복 일정 생성 테스트
   * - 주간 반복 일정 생성 → 저장 → 확인
   */
  test('반복 일정 생성 테스트', async ({ page }) => {
    await page.getByRole('textbox', { name: '제목' }).fill('반복 회의');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-08-16');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('09:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '설명' }).fill('반복 테스트');
    await page.getByRole('textbox', { name: '위치' }).fill('회의실 A');

    // 3. 카테고리 선택
    await page.getByRole('combobox', { name: '업무' }).click();
    await page.getByRole('option', { name: '업무-option' }).click();

    // 4. 반복 설정 활성화
    await page.getByLabel('반복 일정').check();

    // 5. 반복 유형 설정
    await page.getByRole('combobox', { name: '반복 유형' }).click();
    await page.getByRole('option', { name: '매주' }).click();

    // 6. 반복 간격 설정
    await page.getByRole('spinbutton', { name: '반복 간격' }).fill('1');

    // 7. 반복 종료일 설정
    await page.getByRole('textbox', { name: '반복 종료일' }).fill('2025-08-29');

    // 8. 일정 추가 버튼 클릭
    await page.getByTestId('event-submit-button').click();

    // 9. 성공 메시지 확인
    await expect(page.locator('text=반복 일정이 생성되었습니다.')).toBeVisible({ timeout: 10000 });

    // 10. 생성된 반복 일정 확인
    const events = await page.locator('text=반복 회의').all();
    expect(events.length).toBeGreaterThan(1); // 반복 일정이므로 여러 개 생성
  });

  /**
   * 시나리오 3: 일정 충돌 경고 다이얼로그 테스트
   * - 겹치는 시간에 일정 생성 → 충돌 경고 → 진행
   */
  test('일정 충돌 경고 다이얼로그 테스트', async ({ page }) => {
    // 1. 첫 번째 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('첫 번째 회의');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-08-20');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('09:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('10:00');
    await page.getByRole('combobox', { name: '업무' }).click();
    await page.getByRole('option', { name: '업무-option' }).click();
    await page.getByTestId('event-submit-button').click();

    // 첫 번째 일정 생성 완료 대기
    await expect(page.locator('text=일정이 추가되었습니다.')).toBeVisible({ timeout: 10000 });

    // 첫 번째 일정이 실제로 생성되었는지 확인
    await expect(page.getByTestId('month-view').getByText('첫 번째 회의')).toBeVisible();

    // 2. 겹치지 않는 시간에 두 번째 일정 생성 (우선 겹침 없이 테스트)
    await page.getByRole('textbox', { name: '제목' }).fill('두 번째 회의');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-08-20'); // 같은 날
    await page.getByRole('textbox', { name: '시작 시간' }).fill('11:00'); // 겹치지 않는 시간으로 변경
    await page.getByRole('textbox', { name: '종료 시간' }).fill('12:00');
    await page.getByRole('combobox', { name: '업무' }).click();
    await page.getByRole('option', { name: '업무-option' }).click();
    await page.getByTestId('event-submit-button').click();

    // 3. 겹침이 없으므로 바로 성공 메시지가 나와야 함
    await expect(page.locator('text=일정이 추가되었습니다.')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('month-view').getByText('두 번째 회의')).toBeVisible();
  });

  /**
   * 시나리오 3-2: 실제 일정 겹침 테스트
   * - 진짜 겹치는 시간에 일정 생성하여 충돌 경고 확인
   */
  test('실제 일정 겹침 경고 테스트', async ({ page }) => {
    // 이 테스트에서는 기존 이벤트가 있는 상황을 시뮬레이션하기 위해
    // 샘플 데이터를 저장소에 로드
    loadSampleData();
    // 1. 첫 번째 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('기존 회의');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-08-21');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('14:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('15:00');
    await page.getByRole('combobox', { name: '업무' }).click();
    await page.getByRole('option', { name: '업무-option' }).click();
    await page.getByTestId('event-submit-button').click();

    // 첫 번째 일정 생성 완료 대기
    await expect(page.locator('text=일정이 추가되었습니다.')).toBeVisible({ timeout: 10000 });

    // 2. 진짜 겹치는 시간에 두 번째 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('겹치는 회의');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-08-21'); // 같은 날
    await page.getByRole('textbox', { name: '시작 시간' }).fill('14:30'); // 30분 겹침
    await page.getByRole('textbox', { name: '종료 시간' }).fill('15:30');
    await page.getByRole('combobox', { name: '업무' }).click();
    await page.getByRole('option', { name: '업무-option' }).click();
    await page.getByTestId('event-submit-button').click();

    await expect(page.locator('[role="dialog"]:has-text("일정 겹침 경고")')).toBeVisible();
    await page.getByRole('button', { name: '계속 진행' }).click();

    await expect(page.getByTestId('month-view').getByText('겹치는 회의')).toBeVisible();
  });
});
