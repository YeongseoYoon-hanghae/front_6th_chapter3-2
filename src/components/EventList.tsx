import { Stack } from '@mui/material';

import { Event } from '../types';
import { EmptyState } from './EmptyState';
import { EventCard } from './EventCard';
import { SearchSection } from './SearchSection';

interface EventListProps {
  events: Event[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  notifiedEvents: string[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

/**
 * 리팩토링된 이벤트 리스트 컴포넌트
 *
 * 선언적 개선사항:
 * - 검색, 빈 상태, 이벤트 카드를 명확한 책임을 가진 컴포넌트로 분리
 * - 복잡한 조건부 렌더링 로직을 읽기 쉬운 함수로 추상화
 * - 반복되는 알림 상태 계산을 한 번만 수행
 * - 명령형 스타일을 선언적 스타일로 전환
 */
export const EventList = ({
  events,
  searchTerm,
  setSearchTerm,
  notifiedEvents,
  onEditEvent,
  onDeleteEvent,
}: EventListProps) => {
  const hasNoEvents = events.length === 0;

  return (
    <Stack
      data-testid="event-list"
      spacing={2}
      sx={{ width: '30%', height: '100%', overflowY: 'auto' }}
    >
      <SearchSection searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <EventListContent
        events={events}
        notifiedEvents={notifiedEvents}
        onEditEvent={onEditEvent}
        onDeleteEvent={onDeleteEvent}
        hasNoEvents={hasNoEvents}
      />
    </Stack>
  );
};

/**
 * 이벤트 리스트 내용 섹션
 * 목적: 빈 상태와 이벤트 목록 표시 로직을 명확하게 분리
 */
interface EventListContentProps {
  events: Event[];
  notifiedEvents: string[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  hasNoEvents: boolean;
}

const EventListContent = ({
  events,
  notifiedEvents,
  onEditEvent,
  onDeleteEvent,
  hasNoEvents,
}: EventListContentProps) => {
  if (hasNoEvents) {
    return <EmptyState />;
  }

  return (
    <>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isNotified={isEventNotified(event.id, notifiedEvents)}
          onEdit={() => onEditEvent(event)}
          onDelete={() => onDeleteEvent(event.id)}
        />
      ))}
    </>
  );
};

/**
 * 이벤트가 알림 대상인지 확인
 * 목적: 반복되는 알림 상태 확인 로직을 한 곳에서 관리
 */
const isEventNotified = (eventId: string, notifiedEvents: string[]): boolean => {
  return notifiedEvents.includes(eventId);
};
