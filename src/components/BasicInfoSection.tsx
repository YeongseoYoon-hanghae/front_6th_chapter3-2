import { FormControl, FormLabel, MenuItem, Select, Stack, TextField } from '@mui/material';

const categories = ['업무', '개인', '가족', '기타'];

interface BasicInfoSectionProps {
  title: string;
  onTitleChange: (title: string) => void;
  date: string;
  onDateChange: (date: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  location: string;
  onLocationChange: (location: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
}

/**
 * 이벤트 기본 정보 입력 섹션
 *
 * 선언적 개선사항:
 * - 기본 정보 관련 모든 필드를 하나의 명확한 섹션으로 그룹화
 * - 카테고리 선택 로직을 내부에서 처리
 * - 의미 있는 prop 이름들 (onTitleChange vs setTitle)
 * - 재사용 가능한 독립적 컴포넌트
 */
export const BasicInfoSection = ({
  title,
  onTitleChange,
  date,
  onDateChange,
  description,
  onDescriptionChange,
  location,
  onLocationChange,
  category,
  onCategoryChange,
}: BasicInfoSectionProps) => {
  return (
    <Stack spacing={2}>
      <TitleField value={title} onChange={onTitleChange} />
      <DateField value={date} onChange={onDateChange} />
      <DescriptionField value={description} onChange={onDescriptionChange} />
      <LocationField value={location} onChange={onLocationChange} />
      <CategoryField value={category} onChange={onCategoryChange} />
    </Stack>
  );
};

/**
 * 제목 입력 필드
 * 목적: 제목 입력의 명확한 책임 분리
 */
const TitleField = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <FormControl fullWidth>
    <FormLabel htmlFor="title">제목</FormLabel>
    <TextField id="title" size="small" value={value} onChange={(e) => onChange(e.target.value)} />
  </FormControl>
);

/**
 * 날짜 입력 필드
 * 목적: 날짜 입력의 명확한 책임 분리
 */
const DateField = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <FormControl fullWidth>
    <FormLabel htmlFor="date">날짜</FormLabel>
    <TextField
      id="date"
      size="small"
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </FormControl>
);

/**
 * 설명 입력 필드
 * 목적: 설명 입력의 명확한 책임 분리
 */
const DescriptionField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <FormControl fullWidth>
    <FormLabel htmlFor="description">설명</FormLabel>
    <TextField
      id="description"
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </FormControl>
);

/**
 * 위치 입력 필드
 * 목적: 위치 입력의 명확한 책임 분리
 */
const LocationField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <FormControl fullWidth>
    <FormLabel htmlFor="location">위치</FormLabel>
    <TextField
      id="location"
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </FormControl>
);

/**
 * 카테고리 선택 필드
 * 목적: 카테고리 선택의 모든 로직을 내부에서 처리
 */
const CategoryField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <FormControl fullWidth>
    <FormLabel id="category-label">카테고리</FormLabel>
    <Select
      id="category"
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-labelledby="category-label"
      aria-label="카테고리"
    >
      {categories.map((cat) => (
        <MenuItem key={cat} value={cat} aria-label={`${cat}-option`}>
          {cat}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);
