import { FormControl, FormLabel, MenuItem, Select } from '@mui/material';

const notificationOptions = [
  { value: 1, label: '1분 전' },
  { value: 10, label: '10분 전' },
  { value: 60, label: '1시간 전' },
  { value: 120, label: '2시간 전' },
  { value: 1440, label: '1일 전' },
];

interface NotificationSectionProps {
  notificationTime: number;
  onNotificationTimeChange: (time: number) => void;
}

/**
 * 알림 설정 섹션
 *
 * 선언적 개선사항:
 * - 알림 시간 옵션을 내부에서 관리
 * - 알림 관련 모든 로직을 하나의 섹션에서 처리
 * - 단순하고 명확한 인터페이스
 */
export const NotificationSection = ({
  notificationTime,
  onNotificationTimeChange,
}: NotificationSectionProps) => {
  return (
    <FormControl fullWidth>
      <FormLabel htmlFor="notification">알림 설정</FormLabel>
      <Select
        id="notification"
        size="small"
        value={notificationTime}
        onChange={(e) => onNotificationTimeChange(Number(e.target.value))}
      >
        {notificationOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
