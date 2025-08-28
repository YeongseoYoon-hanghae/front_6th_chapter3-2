import type { Page } from '@playwright/test';

// 공휴일 데이터
const holidaysData = {
  '2025-08-15': '광복절',
};

/**
 * 공휴일 데이터 API 인터셉터
 * 캘린더에서 공휴일 표시를 위해 사용
 */
const getHolidays = async (page: Page) => {
  await page.route('/api/holidays', async (route) => {
    // 쿼리 파라미터에서 년/월 정보 추출
    const url = new URL(route.request().url());
    const year = url.searchParams.get('year') || '2025';
    const month = url.searchParams.get('month') || '08';

    // 해당 년/월의 공휴일 필터링
    const filteredHolidays = Object.entries(holidaysData)
      .filter(([date]) => date.startsWith(`${year}-${month.padStart(2, '0')}`))
      .reduce((acc, [date, name]) => ({ ...acc, [date]: name }), {});

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(filteredHolidays),
    });
  });
};

/**
 * 공휴일 API 에러 시뮬레이션
 */
const getHolidaysError = async (page: Page) => {
  await page.route('/api/holidays', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: '공휴일 데이터를 불러올 수 없습니다.' }),
    });
  });
};

export const holidayApis = [getHolidays];

export const customHolidayApis = {
  getHolidays,
  getHolidaysError,
};
