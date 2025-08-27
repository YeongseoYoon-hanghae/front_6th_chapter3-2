import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RecurringEventIcon } from '../../components/RecurringEventIcon';
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

describe('RecurringEventIcon', () => {
  it('비반복 이벤트면 아이콘을 렌더링하지 않는다', () => {
    render(<RecurringEventIcon event={baseEvent} />);
    expect(screen.queryByLabelText('반복 일정')).toBeNull();
  });

  it('반복 이벤트면 아이콘을 렌더링한다', () => {
    const event: Event = { ...baseEvent, repeat: { type: 'daily', interval: 1 } };
    render(<RecurringEventIcon event={event} size="small" />);
    expect(screen.getByLabelText('반복 일정 아이콘')).toBeInTheDocument();
  });

  it('툴팁에 반복 정보를 노출한다', async () => {
    const user = userEvent.setup();
    const event: Event = { ...baseEvent, repeat: { type: 'weekly', interval: 1 } };
    render(<RecurringEventIcon event={event} />);
    await user.hover(screen.getByLabelText('반복 일정 아이콘'));
    expect(await screen.findByText(/반복:/)).toBeInTheDocument();
  });
});
