import { useMemo, useState } from 'react';

import { CalendarViewType, Event } from '../types';
import { getFilteredEvents } from '../utils/eventUtils';

export const useSearch = (events: Event[], currentDate: Date, view: CalendarViewType) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = useMemo(() => {
    return getFilteredEvents(events, searchTerm, currentDate, view);
  }, [events, searchTerm, currentDate, view]);

  return {
    searchTerm,
    setSearchTerm,
    filteredEvents,
  };
};
