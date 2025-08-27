import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import { Event } from '../types';

interface RecurringEditDialogProps {
  isOpen: boolean;
  targetEvent: Event;
  onCancel: () => void;
  onEditSingle: () => void;
}

export const RecurringEditDialog = ({
  isOpen,
  targetEvent,
  onCancel,
  onEditSingle,
}: RecurringEditDialogProps) => {
  return (
    <Dialog open={isOpen} onClose={onCancel} aria-labelledby="recurring-edit-dialog-title">
      <DialogTitle id="recurring-edit-dialog-title">반복 일정을 수정하시겠어요?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 1 }}>
          제목: {targetEvent.title}
        </Typography>
        <Typography variant="body2">
          날짜: {targetEvent.date} ({targetEvent.startTime}-{targetEvent.endTime})
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>취소</Button>
        <Button variant="contained" onClick={onEditSingle} color="primary">
          이 일정만 수정
        </Button>
      </DialogActions>
    </Dialog>
  );
};
