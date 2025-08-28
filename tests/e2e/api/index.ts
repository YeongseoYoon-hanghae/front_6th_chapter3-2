import { eventApis } from './events';
import { holidayApis } from './holidays';

/**
 * 기본 API 인터셉터 목록
 * - 모든 기본 API 엔드포인트를 포함
 * - 테스트에서 기본적으로 사용됨
 */
export const mockApis = [...eventApis, ...holidayApis];

// 개별 API 그룹 export
export {
  eventApis,
  eventApisWithSampleData,
  customEventApis,
  resetEventStore,
  loadSampleData,
} from './events';
export { holidayApis, customHolidayApis } from './holidays';
