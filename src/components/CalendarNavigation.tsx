import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { IconButton, MenuItem, Select, Stack } from '@mui/material';

import { CalendarViewType } from '../types';

interface CalendarNavigationProps {
  view: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export const CalendarNavigation = ({ view, onViewChange, onNavigate }: CalendarNavigationProps) => {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
      <IconButton aria-label="Previous" onClick={() => onNavigate('prev')}>
        <ChevronLeft />
      </IconButton>
      <Select
        size="small"
        aria-label="뷰 타입 선택"
        value={view}
        onChange={(e) => onViewChange(e.target.value)}
      >
        <MenuItem value="week" aria-label="week-option">
          Week
        </MenuItem>
        <MenuItem value="month" aria-label="month-option">
          Month
        </MenuItem>
      </Select>
      <IconButton aria-label="Next" onClick={() => onNavigate('next')}>
        <ChevronRight />
      </IconButton>
    </Stack>
  );
};
