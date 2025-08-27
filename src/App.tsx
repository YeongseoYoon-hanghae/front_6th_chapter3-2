import { Box, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { overlay } from 'overlay-kit';

import { CalendarNavigation } from './components/CalendarNavigation';
import { CalendarView } from './components/CalendarView';
import { EventForm } from './components/EventForm';
import { EventList } from './components/EventList';
import { NotificationPanel } from './components/NotificationPanel';
import { OverlapWarningDialog } from './components/OverlapWarningDialog';
import { RecurringEditDialog } from './components/RecurringEditDialog';
import { useCalendarView } from './hooks/useCalendarView.ts';
import { useEventForm } from './hooks/useEventForm.ts';
import { useEventOperations } from './hooks/useEventOperations.ts';
import { useNotifications } from './hooks/useNotifications.ts';
import { useSearch } from './hooks/useSearch.ts';
import { Event, EventForm as EventFormType } from './types';
import { findOverlappingEvents } from './utils/eventOverlap';
import { calculateRecurringDates, convertToSingleEvent } from './utils/recurringUtils';

function App() {
  const {
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
    repeatType,
    setRepeatType,
    repeatInterval,
    setRepeatInterval,
    repeatEndDate,
    setRepeatEndDate,
    notificationTime,
    setNotificationTime,
    startTimeError,
    endTimeError,
    editingEvent,
    setEditingEvent,
    handleStartTimeChange,
    handleEndTimeChange,
    resetForm,
    editEvent,
  } = useEventForm();

  const { events, saveEvent, deleteEvent, createRecurringEvents } = useEventOperations(
    Boolean(editingEvent),
    () => setEditingEvent(null)
  );

  const { notifications, notifiedEvents, setNotifications } = useNotifications(events);
  const { view, setView, currentDate, holidays, navigate } = useCalendarView();
  const { searchTerm, filteredEvents, setSearchTerm } = useSearch(events, currentDate, view);

  const { enqueueSnackbar } = useSnackbar();

  const addOrUpdateEvent = async () => {
    if (!title || !date || !startTime || !endTime) {
      enqueueSnackbar('필수 정보를 모두 입력해주세요.', { variant: 'error' });
      return;
    }

    if (startTimeError || endTimeError) {
      enqueueSnackbar('시간 설정을 확인해주세요.', { variant: 'error' });
      return;
    }

    const eventData: Event | EventFormType = {
      id: editingEvent ? editingEvent.id : undefined,
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeat: {
        type: isRepeating ? repeatType : 'none',
        interval: repeatInterval,
        endDate: repeatEndDate || undefined,
      },
      notificationTime,
    };

    // 반복 일정 생성 경로: 신규 생성이면서 반복 일정이 활성화된 경우에만 배치 API 사용
    const shouldCreateBatch = !editingEvent && isRepeating && repeatInterval > 0;

    const overlapping = findOverlappingEvents(eventData, events);
    if (overlapping.length > 0) {
      overlay.open(({ isOpen, close }) => (
        <OverlapWarningDialog
          isOpen={isOpen}
          overlappingEvents={overlapping}
          onClose={close}
          onConfirm={async () => {
            close();
            if (shouldCreateBatch) {
              const baseEvent: EventFormType = {
                title,
                date,
                startTime,
                endTime,
                description,
                location,
                category,
                repeat: {
                  type: repeatType,
                  interval: repeatInterval,
                  endDate: repeatEndDate || undefined,
                },
                notificationTime,
              };
              const end = repeatEndDate || '2025-10-30';
              const dates = calculateRecurringDates(date, end, repeatType, repeatInterval);
              await createRecurringEvents(baseEvent, dates);
            } else {
              await saveEvent(eventData);
            }
            resetForm();
          }}
        />
      ));
    } else {
      if (shouldCreateBatch) {
        const baseEvent: EventFormType = {
          title,
          date,
          startTime,
          endTime,
          description,
          location,
          category,
          repeat: {
            type: repeatType,
            interval: repeatInterval,
            endDate: repeatEndDate || undefined,
          },
          notificationTime,
        };
        const end = repeatEndDate || '2025-10-30';
        const dates = calculateRecurringDates(date, end, repeatType, repeatInterval);
        await createRecurringEvents(baseEvent, dates);
      } else {
        await saveEvent(eventData);
      }
      resetForm();
    }
  };

  // 반복 일정 편집 확인 다이얼로그 열기 로직
  const handleEditRecurringEvent = (event: Event) => {
    if (event.repeat.type !== 'none') {
      overlay.open(({ isOpen, close }) => (
        <RecurringEditDialog
          isOpen={isOpen}
          targetEvent={event}
          onCancel={close}
          onEditSingle={() => {
            close();

            const single = convertToSingleEvent(event);
            editEvent(single);
          }}
        />
      ));
    } else {
      editEvent(event);
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', margin: 'auto', p: 5 }}>
      <Stack direction="row" spacing={6} sx={{ height: '100%' }}>
        <EventForm
          title={title}
          setTitle={setTitle}
          date={date}
          setDate={setDate}
          startTime={startTime}
          endTime={endTime}
          description={description}
          setDescription={setDescription}
          location={location}
          setLocation={setLocation}
          category={category}
          setCategory={setCategory}
          isRepeating={isRepeating}
          setIsRepeating={setIsRepeating}
          notificationTime={notificationTime}
          setNotificationTime={setNotificationTime}
          startTimeError={startTimeError}
          endTimeError={endTimeError}
          handleStartTimeChange={handleStartTimeChange}
          handleEndTimeChange={handleEndTimeChange}
          editingEvent={editingEvent}
          onSubmit={addOrUpdateEvent}
          repeatType={repeatType}
          repeatInterval={repeatInterval}
          repeatEndDate={repeatEndDate}
          setRepeatType={setRepeatType}
          setRepeatInterval={setRepeatInterval}
          setRepeatEndDate={setRepeatEndDate}
        />

        <Stack flex={1} spacing={5}>
          <Typography variant="h4">일정 보기</Typography>

          <CalendarNavigation view={view} onViewChange={setView} onNavigate={navigate} />

          <CalendarView
            view={view}
            currentDate={currentDate}
            filteredEvents={filteredEvents}
            notifiedEvents={notifiedEvents}
            holidays={holidays}
          />
        </Stack>

        <EventList
          events={filteredEvents}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          notifiedEvents={notifiedEvents}
          onEditEvent={handleEditRecurringEvent}
          onDeleteEvent={deleteEvent}
        />
      </Stack>

      <NotificationPanel
        notifications={notifications}
        onRemoveNotification={(index) =>
          setNotifications((prev) => prev.filter((_, i) => i !== index))
        }
      />
    </Box>
  );
}

export default App;
