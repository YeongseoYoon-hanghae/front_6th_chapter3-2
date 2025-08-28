import { Delete, Edit, Notifications } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material';

import { Event } from '../types';
import { RecurringEventIcon } from './RecurringEventIcon';

interface EventCardProps {
  event: Event;
  isNotified: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * 개별 이벤트 카드 컴포넌트
 *
 * 선언적 개선사항:
 * - 알림 상태를 prop으로 받아 조건부 로직 단순화
 * - 반복 정보 텍스트 생성을 별도 함수로 분리
 * - 알림 시간 라벨 계산을 최적화
 * - 명확한 의도를 가진 서브 컴포넌트로 구조화
 */
export const EventCard = ({ event, isNotified, onEdit, onDelete }: EventCardProps) => {
  return (
    <Box data-testid="event-item" sx={{ border: 1, borderRadius: 2, p: 3, width: '100%' }}>
      <Stack direction="row" justifyContent="space-between">
        <EventDetails event={event} isNotified={isNotified} />
        <EventActions onEdit={onEdit} onDelete={onDelete} />
      </Stack>
    </Box>
  );
};

/**
 * 이벤트 상세 정보 섹션
 * 목적: 이벤트의 모든 정보를 체계적으로 표시
 */
const EventDetails = ({ event, isNotified }: { event: Event; isNotified: boolean }) => (
  <Stack>
    <EventHeader event={event} isNotified={isNotified} />
    <EventBasicInfo event={event} />
    <EventRepeatInfo event={event} />
    <EventNotificationInfo event={event} />
  </Stack>
);

/**
 * 이벤트 헤더 (제목, 알림, 반복 아이콘)
 * 목적: 가장 중요한 정보들을 한 줄에 표시
 */
const EventHeader = ({ event, isNotified }: { event: Event; isNotified: boolean }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    {isNotified && <Notifications color="error" />}
    {isRecurringEvent(event) && <RecurringEventIcon event={event} size="small" />}
    <Typography
      fontWeight={isNotified ? 'bold' : 'normal'}
      color={isNotified ? 'error' : 'inherit'}
    >
      {event.title}
    </Typography>
  </Stack>
);

/**
 * 이벤트 기본 정보 (날짜, 시간, 설명, 위치, 카테고리)
 * 목적: 핵심 정보들을 읽기 쉽게 표시
 */
const EventBasicInfo = ({ event }: { event: Event }) => (
  <>
    <Typography>{event.date}</Typography>
    <Typography>
      {event.startTime} - {event.endTime}
    </Typography>
    <Typography>{event.description}</Typography>
    <Typography>{event.location}</Typography>
    <Typography>카테고리: {event.category}</Typography>
  </>
);

/**
 * 반복 일정 정보
 * 목적: 복잡한 반복 정보 로직을 깔끔한 함수로 처리
 */
const EventRepeatInfo = ({ event }: { event: Event }) => {
  if (!isRecurringEvent(event)) return null;

  const repeatText = formatRepeatText(event.repeat);
  return <Typography>{repeatText}</Typography>;
};

/**
 * 알림 정보
 * 목적: 알림 시간을 사용자 친화적으로 표시
 */
const EventNotificationInfo = ({ event }: { event: Event }) => {
  const notificationLabel = getNotificationLabel(event.notificationTime);
  return <Typography>알림: {notificationLabel}</Typography>;
};

/**
 * 이벤트 액션 버튼들
 * 목적: 편집/삭제 액션을 명확하게 분리
 */
const EventActions = ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => (
  <Stack>
    <IconButton aria-label="Edit event" onClick={onEdit}>
      <Edit />
    </IconButton>
    <IconButton aria-label="Delete event" onClick={onDelete}>
      <Delete />
    </IconButton>
  </Stack>
);

// === 선언적 헬퍼 함수들 ===

/**
 * 반복 일정인지 확인
 * 목적: 명확한 의도 표현
 */
const isRecurringEvent = (event: Event): boolean => {
  return event.repeat.type !== 'none';
};

/**
 * 반복 정보를 읽기 쉬운 텍스트로 변환
 * 목적: 복잡한 문자열 조합 로직을 한 곳에서 관리
 */
const formatRepeatText = (repeat: Event['repeat']): string => {
  const typeLabels = {
    daily: '일',
    weekly: '주',
    monthly: '월',
    yearly: '년',
  } as const;

  const typeLabel = typeLabels[repeat.type as keyof typeof typeLabels];
  const endDateText = repeat.endDate ? ` (종료: ${repeat.endDate})` : '';

  return `반복: ${repeat.interval}${typeLabel}마다${endDateText}`;
};

/**
 * 알림 시간을 사용자 친화적 라벨로 변환
 * 목적: 반복적인 배열 검색을 최적화하고 의도를 명확히 표현
 */
const getNotificationLabel = (notificationTime: number): string => {
  const labels: Record<number, string> = {
    1: '1분 전',
    10: '10분 전',
    60: '1시간 전',
    120: '2시간 전',
    1440: '1일 전',
  };

  return labels[notificationTime] || '알 수 없음';
};
