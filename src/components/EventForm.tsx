import { Button, Stack, Typography } from '@mui/material';
import React from 'react';

import { Event, RepeatType, WeeklyOptions } from '../types';
import { BasicInfoSection } from './BasicInfoSection';
import { NotificationSection } from './NotificationSection';
import { RepeatSection } from './RepeatSection';
import { TimeSection } from './TimeSection';

interface EventFormProps {
  title: string;
  setTitle: (title: string) => void;
  date: string;
  setDate: (date: string) => void;
  startTime: string;
  endTime: string;
  description: string;
  setDescription: (description: string) => void;
  location: string;
  setLocation: (location: string) => void;
  category: string;
  setCategory: (category: string) => void;
  isRepeating: boolean;
  setIsRepeating: (isRepeating: boolean) => void;
  notificationTime: number;
  setNotificationTime: (time: number) => void;

  startTimeError: string | null;
  endTimeError: string | null;
  handleStartTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEndTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  editingEvent: Event | null;
  isSingleEdit?: boolean;

  onSubmit: () => void;

  repeatType: RepeatType;
  repeatInterval: number;
  repeatEndDate: string;
  setRepeatType: (type: RepeatType) => void;
  setRepeatInterval: (interval: number) => void;
  setRepeatEndDate: (endDate: string) => void;

  // 주간 반복 관련 props
  weeklyOptions?: WeeklyOptions;
  setWeeklyOptions: (options: WeeklyOptions | undefined) => void;
  weeklyOptionsError?: string;
}

/**
 * 리팩토링된 이벤트 폼 컴포넌트
 *
 * 선언적 개선사항:
 * - 4개의 큰 의미 있는 섹션으로 분리 (BasicInfo, Time, Repeat, Notification)
 * - 20개+ props를 섹션별로 그룹화하여 가독성 향상
 * - 복잡한 조건부 렌더링을 명확한 컴포넌트로 추상화
 * - 각 섹션이 독립적으로 테스트 가능한 구조
 * - 중복 로직 제거 (시간 입력 필드 등)
 */
export const EventForm = ({
  title,
  setTitle,
  date,
  setDate,
  startTime,
  endTime,
  description,
  setDescription,
  location,
  setLocation,
  category,
  setCategory,
  isRepeating,
  setIsRepeating,
  notificationTime,
  setNotificationTime,
  startTimeError,
  endTimeError,
  handleStartTimeChange,
  handleEndTimeChange,
  editingEvent,
  isSingleEdit = false,
  onSubmit,
  repeatType,
  repeatInterval,
  repeatEndDate,
  setRepeatType,
  setRepeatInterval,
  setRepeatEndDate,
  weeklyOptions,
  setWeeklyOptions,
  weeklyOptionsError,
}: EventFormProps) => {
  const formMode = createFormMode(isSingleEdit);
  const formTitle = createFormTitle(editingEvent);

  return (
    <Stack spacing={2} sx={{ width: '20%' }} data-testid={`event-form-${formMode}`}>
      <FormHeader title={formTitle} />

      <BasicInfoSection
        title={title}
        onTitleChange={setTitle}
        date={date}
        onDateChange={setDate}
        description={description}
        onDescriptionChange={setDescription}
        location={location}
        onLocationChange={setLocation}
        category={category}
        onCategoryChange={setCategory}
      />

      <TimeSection
        startTime={startTime}
        endTime={endTime}
        startTimeError={startTimeError}
        endTimeError={endTimeError}
        onStartTimeChange={handleStartTimeChange}
        onEndTimeChange={handleEndTimeChange}
      />

      <RepeatSection
        isRepeating={isRepeating}
        onIsRepeatingChange={setIsRepeating}
        repeatType={repeatType}
        onRepeatTypeChange={setRepeatType}
        repeatInterval={repeatInterval}
        onRepeatIntervalChange={setRepeatInterval}
        repeatEndDate={repeatEndDate}
        onRepeatEndDateChange={setRepeatEndDate}
        weeklyOptions={weeklyOptions}
        onWeeklyOptionsChange={setWeeklyOptions}
        weeklyOptionsError={weeklyOptionsError}
      />

      <NotificationSection
        notificationTime={notificationTime}
        onNotificationTimeChange={setNotificationTime}
      />

      <SubmitButton onSubmit={onSubmit} isEditing={!!editingEvent} />
    </Stack>
  );
};

/**
 * 폼 헤더 컴포넌트
 * 목적: 폼 제목 표시의 명확한 책임 분리
 */
const FormHeader = ({ title }: { title: string }) => <Typography variant="h4">{title}</Typography>;

/**
 * 제출 버튼 컴포넌트
 * 목적: 제출 버튼의 상태별 텍스트를 명확하게 관리
 */
const SubmitButton = ({ onSubmit, isEditing }: { onSubmit: () => void; isEditing: boolean }) => (
  <Button data-testid="event-submit-button" onClick={onSubmit} variant="contained" color="primary">
    {isEditing ? '일정 수정' : '일정 추가'}
  </Button>
);

// === 선언적 헬퍼 함수들 ===

/**
 * 폼 모드를 생성합니다
 * 목적: 폼 모드 결정 로직을 명확하게 표현
 */
const createFormMode = (isSingleEdit: boolean): string => {
  return isSingleEdit ? 'single-edit' : 'normal-edit';
};

/**
 * 폼 제목을 생성합니다
 * 목적: 편집/추가 상태에 따른 제목 결정 로직을 분리
 */
const createFormTitle = (editingEvent: Event | null): string => {
  return editingEvent ? '일정 수정' : '일정 추가';
};
