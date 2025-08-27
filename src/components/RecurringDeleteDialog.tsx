import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import { Event } from '../types';

interface RecurringDeleteDialogProps {
  isOpen: boolean;
  targetEvent: Event;
  onCancel: () => void;
  onDeleteSingle: () => void;
}

export const RecurringDeleteDialog = ({
  isOpen,
  targetEvent,
  onCancel,
  onDeleteSingle,
}: RecurringDeleteDialogProps) => {
  return (
    <Dialog open={isOpen} onClose={onCancel} aria-labelledby="recurring-delete-dialog-title">
      <DialogTitle id="recurring-delete-dialog-title">반복 일정을 삭제하시겠어요?</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          이 작업은 되돌릴 수 없습니다.
        </Alert>
        <Typography variant="body2" sx={{ mb: 1 }}>
          제목: {targetEvent.title}
        </Typography>
        <Typography variant="body2">
          날짜: {targetEvent.date} ({targetEvent.startTime}-{targetEvent.endTime})
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>취소</Button>
        <Button variant="contained" onClick={onDeleteSingle} color="error">
          이 일정만 삭제
        </Button>
      </DialogActions>
    </Dialog>
  );
};
