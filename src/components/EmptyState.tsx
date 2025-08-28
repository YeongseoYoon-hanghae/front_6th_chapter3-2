import { Typography } from '@mui/material';

interface EmptyStateProps {
  message?: string;
}

/**
 * 빈 상태 표시 컴포넌트
 *
 * 선언적 개선사항:
 * - 빈 상태에 대한 명확한 의미 전달
 * - 메시지 커스터마이징 가능
 * - 향후 확장 가능한 구조 (아이콘, 액션 등)
 */
export const EmptyState = ({ message = '검색 결과가 없습니다.' }: EmptyStateProps) => {
  return <Typography>{message}</Typography>;
};
