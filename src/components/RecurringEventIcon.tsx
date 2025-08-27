import { Cached, Event as EventIcon, Loop, Repeat } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
import React from 'react';

import { REPEAT_LABEL_MAP } from '../policy';
import { Event } from '../types';

type IconSize = 'small' | 'medium' | 'large';

interface RecurringEventIconProps {
  event: Event;
  size?: IconSize;
  position?: 'top-right' | 'inline';
  color?: string;
}

const getIconByType = (type: Event['repeat']['type']) => {
  switch (type) {
    case 'daily':
      return <Repeat fontSize="inherit" />;
    case 'weekly':
      return <Loop fontSize="inherit" />;
    case 'monthly':
      return <Cached fontSize="inherit" />;
    case 'yearly':
      return <EventIcon fontSize="inherit" />;
    default:
      return <Repeat fontSize="inherit" />;
  }
};

const toPx = (size: IconSize) => {
  switch (size) {
    case 'small':
      return 16;
    case 'large':
      return 28;
    case 'medium':
    default:
      return 20;
  }
};

export const RecurringEventIcon: React.FC<RecurringEventIconProps> = ({
  event,
  size = 'medium',
  position = 'inline',
  color = 'text.secondary',
}) => {
  if (event.repeat.type === 'none') return null;

  const icon = getIconByType(event.repeat.type);
  const pixel = toPx(size);

  const tooltip = `반복: ${
    REPEAT_LABEL_MAP[event.repeat.type as Exclude<Event['repeat']['type'], 'none'>]
  }${
    event.repeat.interval && event.repeat.interval !== 1 ? ` (간격 ${event.repeat.interval})` : ''
  }${event.repeat.endDate ? `, 종료 ${event.repeat.endDate}` : ''}`;

  return (
    <Tooltip title={tooltip} placement="top" arrow disableInteractive>
      <Box
        aria-label="반복 일정"
        role="img"
        tabIndex={0}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: position === 'top-right' ? 'absolute' : 'relative',
          top: position === 'top-right' ? 4 : 'auto',
          right: position === 'top-right' ? 4 : 'auto',
          width: { xs: pixel - 4, sm: pixel, md: pixel },
          height: { xs: pixel - 4, sm: pixel, md: pixel },
          fontSize: { xs: pixel - 4, sm: pixel, md: pixel },
          color,
          outline: 'none',
          '&:focus-visible': { boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.6)', borderRadius: 1 },
        }}
      >
        {icon}
      </Box>
    </Tooltip>
  );
};

export default RecurringEventIcon;
