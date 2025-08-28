import { useState } from 'react';

import { Event } from '../types';

export const useEditingState = () => {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSingleEdit, setIsSingleEdit] = useState(false);

  const isEditing = editingEvent !== null;

  const startEdit = (event: Event) => {
    setEditingEvent(event);
    setIsSingleEdit(false);
  };

  const startEditing = (event: Event) => {
    startEdit(event);
  };

  const startSingleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsSingleEdit(true);
  };

  const stopEditing = () => {
    setEditingEvent(null);
    setIsSingleEdit(false);
  };

  return {
    editingEvent,
    isEditing,
    isSingleEdit,
    startEdit,
    startEditing,
    startSingleEdit,
    stopEditing,
    setEditingEvent,
  };
};
