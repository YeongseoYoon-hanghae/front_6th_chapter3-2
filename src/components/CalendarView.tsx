import { CalendarViewType, Event } from '../types';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';

interface CalendarViewProps {
  view: CalendarViewType;
  currentDate: Date;
  filteredEvents: Event[];
  notifiedEvents: string[];
  holidays: Record<string, string>;
}

export const CalendarView = ({
  view,
  currentDate,
  filteredEvents,
  notifiedEvents,
  holidays,
}: CalendarViewProps) => {
  return (
    <>
      {view === CalendarViewType.WEEK && (
        <WeekView
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
        />
      )}
      {view === CalendarViewType.MONTH && (
        <MonthView
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          holidays={holidays}
        />
      )}
    </>
  );
};
