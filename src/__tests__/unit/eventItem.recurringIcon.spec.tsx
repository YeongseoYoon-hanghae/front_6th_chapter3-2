import { render, screen } from '@testing-library/react';

import { EventItem } from '../../components/EventItem';
import { Event } from '../../types';

const baseEvent: Event = {
  id: '1',
  title: '회의',
  date: '2025-10-15',
  startTime: '09:00',
  endTime: '10:00',
  description: '',
  location: '',
  category: '업무',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 10,
};

describe('EventItem', () => {
  it('비반복 이벤트면 아이콘이 표시되지 않는다', () => {
    render(<EventItem event={baseEvent} isNotified={false} />);
    expect(screen.queryByLabelText('반복 일정')).toBeNull();
  });

  it('반복 이벤트면 아이콘이 표시된다', () => {
    const repeating: Event = { ...baseEvent, repeat: { type: 'daily', interval: 1 } };
    render(<EventItem event={repeating} isNotified={false} />);
    expect(screen.getByLabelText('반복 일정 아이콘')).toBeInTheDocument();
  });
});
