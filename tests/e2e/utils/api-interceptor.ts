import type { Page } from '@playwright/test';

import { mockApis } from '../api';

/**
 * API 인터셉팅 유틸리티
 *
 * 사용법:
 * ```typescript
 * // 기본 빈 API 응답 사용
 * await interceptApi(page);
 *
 * // 샘플 데이터가 포함된 API 응답 사용
 * await interceptApi(page, eventApisWithSampleData);
 *
 * // 특정 커스텀 API만 추가
 * await interceptApi(page, [customEventApis.getSampleEvents]);
 * ```
 *
 * @param page Playwright Page 객체
 * @param customApiList 추가로 적용할 커스텀 API 인터셉터 목록
 */
export const interceptApi = async (
  page: Page,
  customApiList: ((page: Page) => Promise<void>)[] = []
) => {
  // 기본 API 인터셉터와 커스텀 API 인터셉터를 모두 적용
  await Promise.all([...mockApis, ...customApiList].flat().map((api) => api(page)));
};

/**
 * 특정 API만 인터셉팅
 * @param page Playwright Page 객체
 * @param apiList 적용할 API 인터셉터 목록
 */
export const interceptSpecificApis = async (
  page: Page,
  apiList: ((page: Page) => Promise<void>)[]
) => {
  await Promise.all(apiList.map((api) => api(page)));
};

/**
 * 모든 API 인터셉팅 해제
 * @param page Playwright Page 객체
 */
export const clearApiInterception = async (page: Page) => {
  await page.unrouteAll();
};
