import type { Page } from '@playwright/test';

/**
 * 상태를 유지하는 이벤트 API 인터셉터 클래스
 */
class EventApiInterceptor {
  private events: Record<string, unknown>[] = [];

  /**
   * 이벤트 저장소 초기화
   */
  reset() {
    this.events = [];
  }

  /**
   * 샘플 데이터 로드
   */
  loadSampleData() {
    this.events = [
      {
        id: 'test-event-001',
        title: '테스트 회의',
        date: '2025-08-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '테스트용 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];
  }

  /**
   * 모든 이벤트 관련 API를 인터셉트
   */
  async interceptAllEventApis(page: Page) {
    await page.route('/api/events', async (route) => {
      const method = route.request().method();

      if (method === 'GET') {
        // GET: 현재 저장된 이벤트 목록 반환
        console.log('📋 GET /api/events - 반환되는 이벤트 수:', this.events.length);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ events: this.events }),
        });
      } else if (method === 'POST') {
        // POST: 새 이벤트 추가
        const requestBody = await route.request().postDataJSON();
        const newEvent = {
          id: `test-generated-${Date.now()}`,
          ...requestBody,
        };

        // 상태에 추가
        this.events.push(newEvent);
        console.log('➕ POST /api/events - 이벤트 추가됨. 총 이벤트 수:', this.events.length);
        console.log('➕ 추가된 이벤트:', newEvent.title);

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(newEvent),
        });
      } else if (method === 'PUT') {
        // PUT: 이벤트 수정
        const requestBody = await route.request().postDataJSON();
        const url = route.request().url();
        const eventId = url.split('/').pop();

        const eventIndex = this.events.findIndex(
          (event: Record<string, unknown>) => (event.id as string) === eventId
        );
        if (eventIndex > -1) {
          this.events[eventIndex] = { ...this.events[eventIndex], ...requestBody };

          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(this.events[eventIndex]),
          });
        } else {
          await route.fulfill({ status: 404 });
        }
      } else if (method === 'DELETE') {
        // DELETE: 이벤트 삭제
        const url = route.request().url();
        const eventId = url.split('/').pop();

        this.events = this.events.filter(
          (event: Record<string, unknown>) => (event.id as string) !== eventId
        );

        await route.fulfill({ status: 204 });
      } else {
        await route.continue();
      }
    });

    // 반복 이벤트 생성 API
    await page.route('/api/events-list', async (route) => {
      const method = route.request().method();

      if (method === 'POST') {
        const requestBody = await route.request().postDataJSON();
        const newEvents = requestBody.events.map(
          (event: Record<string, unknown>, index: number) => {
            const eventRepeat = event.repeat as Record<string, unknown>;
            return {
              ...event,
              id: `test-recurring-${Date.now()}-${index}`,
              repeat: {
                ...eventRepeat,
                id: eventRepeat.type !== 'none' ? `recurring-group-${Date.now()}` : undefined,
              },
            };
          }
        );

        // 상태에 추가
        this.events.push(...newEvents);

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(newEvents),
        });
      } else if (method === 'DELETE') {
        const requestBody = await route.request().postDataJSON();
        this.events = this.events.filter(
          (event: Record<string, unknown>) => !requestBody.eventIds.includes(event.id as string)
        );

        await route.fulfill({ status: 204 });
      } else {
        await route.continue();
      }
    });
  }
}

// 전역 인터셉터 인스턴스
const eventInterceptor = new EventApiInterceptor();

/**
 * 상태를 유지하는 동적 이벤트 API 그룹
 */
const setupDynamicEventApis = async (page: Page) => {
  await eventInterceptor.interceptAllEventApis(page);
};

/**
 * 샘플 데이터가 포함된 이벤트 API 그룹
 */
const setupSampleEventApis = async (page: Page) => {
  eventInterceptor.loadSampleData();
  await eventInterceptor.interceptAllEventApis(page);
};

// 이벤트 저장소 제어 함수들
export const resetEventStore = () => eventInterceptor.reset();
export const loadSampleData = () => eventInterceptor.loadSampleData();

export const eventApis = [setupDynamicEventApis];

export const eventApisWithSampleData = [setupSampleEventApis];

export const customEventApis = {
  setupDynamicEventApis,
  setupSampleEventApis,
  resetEventStore,
  loadSampleData,
};
