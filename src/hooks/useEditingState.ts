import { useState } from 'react';

import { Event } from '../types';

interface EditingState {
  editingEvent: Event | null;
  isEditing: boolean;
  isSingleEdit: boolean;
}

export const useEditingState = () => {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSingleEdit, setIsSingleEdit] = useState(false);

  const isEditing = editingEvent !== null;

  // 일반 편집 시작
  const startEdit = (event: Event) => {
    setEditingEvent(event);
    setIsSingleEdit(false);
  };

  // 기존 호환성을 위한 startEditing 함수 유지
  const startEditing = (event: Event) => {
    startEdit(event);
  };

  // 단일 편집 시작
  const startSingleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsSingleEdit(true);
  };

  // 편집 종료
  const stopEditing = () => {
    setEditingEvent(null);
    setIsSingleEdit(false);
  };

  return {
    editingEvent,
    isEditing,
    isSingleEdit,
    startEdit,
    startEditing, // 기존 호환성 유지
    startSingleEdit,
    stopEditing,
    setEditingEvent,
  };
};
