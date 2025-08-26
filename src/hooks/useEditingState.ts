import { useState } from 'react';

import { Event } from '../types';

export const useEditingState = () => {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const startEditing = (event: Event) => {
    setEditingEvent(event);
  };

  const stopEditing = () => {
    setEditingEvent(null);
  };

  const isEditing = editingEvent !== null;

  return {
    editingEvent,
    isEditing,
    startEditing,
    stopEditing,
    setEditingEvent,
  };
};
