import { FormControl, FormLabel, TextField } from '@mui/material';

interface SearchSectionProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

/**
 * 검색 섹션 컴포넌트
 *
 * 선언적 개선사항:
 * - 검색 관련 모든 UI를 하나의 명확한 섹션으로 그룹화
 * - 의미 있는 prop 이름 (onSearchChange)
 * - 재사용 가능한 독립적 컴포넌트
 */
export const SearchSection = ({ searchTerm, onSearchChange }: SearchSectionProps) => {
  return (
    <FormControl fullWidth>
      <FormLabel htmlFor="search">일정 검색</FormLabel>
      <TextField
        id="search"
        size="small"
        placeholder="검색어를 입력하세요"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </FormControl>
  );
};
