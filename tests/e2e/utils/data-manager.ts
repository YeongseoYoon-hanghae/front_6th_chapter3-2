/**
 * E2E 테스트 데이터 관리자
 * 테스트 간 데이터 격리와 초기화를 담당
 */
export class TestDataManager {
  private initialState: { events: unknown[] };

  constructor() {
    this.initialState = { events: [] };
  }

  /**
   * 테스트 시작 전 깨끗한 상태로 초기화
   */
  async setupCleanState(): Promise<void> {
    // E2E 테스트에서는 API 인터셉팅으로 데이터를 관리하므로
    // 실제 파일 시스템 조작은 하지 않음
    console.log('🧹 E2E 테스트 데이터 상태 초기화');
  }

  /**
   * 테스트 완료 후 정리
   */
  async cleanup(): Promise<void> {
    console.log('✨ E2E 테스트 데이터 정리 완료');
  }

  /**
   * 초기 상태 반환
   */
  getInitialState() {
    return this.initialState;
  }
}
