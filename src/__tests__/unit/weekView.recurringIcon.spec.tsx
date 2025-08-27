import { render, screen } from '@testing-library/react';

import { WeekView } from '../../components/WeekView';
import { Event } from '../../types';

describe('WeekView - Recurring Icon', () => {
  it('주간 뷰에서 반복 일정 카드에 아이콘이 표시된다', () => {
    const currentDate = new Date('2025-10-15T00:00:00Z');
    const events: Event[] = [
      {
        id: '1',
        title: '반복 회의',
        date: '2025-10-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '',
        category: '업무',
        repeat: { type: 'daily', interval: 1 },
        notificationTime: 10,
      },
    ];

    render(<WeekView currentDate={currentDate} filteredEvents={events} notifiedEvents={[]} />);

    expect(screen.getByLabelText('반복 일정 아이콘')).toBeInTheDocument();
  });
});
