import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import {
  WeeklyDaysSelector,
  formatSelectedDays,
  validateSelectedDays,
} from '../../components/WeeklyDaysSelector';

const renderWithTheme = (component: React.ReactElement) => {
  const theme = createTheme();
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('WeeklyDaysSelector', () => {
  const defaultProps = {
    selectedDays: [],
    onSelectionChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('컴포넌트 기본 렌더링 및 UI 요소 표시', () => {
    it('7개 요일 체크박스가 일요일부터 토요일까지 순서대로 표시되어야 한다', () => {
      renderWithTheme(<WeeklyDaysSelector {...defaultProps} />);

      const expectedDays = ['일', '월', '화', '수', '목', '금', '토'];
      expectedDays.forEach((day) => {
        expect(screen.getByLabelText(`${day}요일 선택`)).toBeInTheDocument();
      });
    });

    it('사용자가 이해할 수 있도록 "반복 요일" 레이블이 명확하게 표시되어야 한다', () => {
      renderWithTheme(<WeeklyDaysSelector {...defaultProps} />);
      expect(screen.getByText('반복 요일')).toBeInTheDocument();
    });

    it('selectedDays prop에 전달된 요일들에 대해서만 체크박스가 선택된 상태로 표시되어야 한다', () => {
      renderWithTheme(<WeeklyDaysSelector {...defaultProps} selectedDays={[1, 3, 5]} />);

      expect(screen.getByLabelText('월요일 선택')).toBeChecked();
      expect(screen.getByLabelText('수요일 선택')).toBeChecked();
      expect(screen.getByLabelText('금요일 선택')).toBeChecked();
      expect(screen.getByLabelText('일요일 선택')).not.toBeChecked();
    });

    it('selectedDays가 빈 배열일 때는 모든 체크박스가 선택되지 않은 초기 상태로 표시되어야 한다', () => {
      renderWithTheme(<WeeklyDaysSelector {...defaultProps} />);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeChecked();
      });
    });
  });

  describe('사용자 상호작용 및 체크박스 동작 검증', () => {
    it('사용자가 체크박스를 클릭하면 onSelectionChange 콜백이 올바른 요일 배열과 함께 호출되어야 한다', () => {
      const mockOnChange = vi.fn();
      renderWithTheme(<WeeklyDaysSelector {...defaultProps} onSelectionChange={mockOnChange} />);

      fireEvent.click(screen.getByLabelText('월요일 선택'));
      expect(mockOnChange).toHaveBeenCalledWith([1]);
    });

    it('이미 선택된 요일의 체크박스를 다시 클릭하면 해당 요일이 선택 해제되고 onSelectionChange가 호출되어야 한다', () => {
      const mockOnChange = vi.fn();
      renderWithTheme(
        <WeeklyDaysSelector
          {...defaultProps}
          selectedDays={[1, 3]}
          onSelectionChange={mockOnChange}
        />
      );

      fireEvent.click(screen.getByLabelText('월요일 선택'));
      expect(mockOnChange).toHaveBeenCalledWith([3]);
    });

    it('여러 요일이 선택된 상태에서 새로운 요일을 추가하면 정렬된 배열이 onSelectionChange로 전달되어야 한다', () => {
      const mockOnChange = vi.fn();
      renderWithTheme(
        <WeeklyDaysSelector
          {...defaultProps}
          selectedDays={[5, 1]}
          onSelectionChange={mockOnChange}
        />
      );

      fireEvent.click(screen.getByLabelText('수요일 선택'));
      expect(mockOnChange).toHaveBeenCalledWith([1, 3, 5]);
    });

    it('disabled 상태에서는 체크박스 클릭이 무시되고 onSelectionChange 콜백이 호출되지 않아야 한다', () => {
      const mockOnChange = vi.fn();
      renderWithTheme(
        <WeeklyDaysSelector {...defaultProps} disabled={true} onSelectionChange={mockOnChange} />
      );

      fireEvent.click(screen.getByLabelText('월요일 선택'));
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('사용자가 연속으로 여러 요일을 선택할 때마다 누적된 선택 상태가 올바르게 관리되어야 한다', () => {
      const mockOnChange = vi.fn();
      const { rerender } = renderWithTheme(
        <WeeklyDaysSelector {...defaultProps} onSelectionChange={mockOnChange} />
      );

      // 월요일 선택
      fireEvent.click(screen.getByLabelText('월요일 선택'));
      expect(mockOnChange).toHaveBeenCalledWith([1]);

      // 수요일 선택 (이미 월요일이 선택된 상태)
      rerender(
        <WeeklyDaysSelector {...defaultProps} selectedDays={[1]} onSelectionChange={mockOnChange} />
      );
      fireEvent.click(screen.getByLabelText('수요일 선택'));
      expect(mockOnChange).toHaveBeenCalledWith([1, 3]);

      // 금요일 선택 (이미 월, 수가 선택된 상태)
      rerender(
        <WeeklyDaysSelector
          {...defaultProps}
          selectedDays={[1, 3]}
          onSelectionChange={mockOnChange}
        />
      );
      fireEvent.click(screen.getByLabelText('금요일 선택'));
      expect(mockOnChange).toHaveBeenCalledWith([1, 3, 5]);
    });
  });

  describe('입력 유효성 검증 및 오류 메시지 표시 로직', () => {
    it('사용자가 요일을 선택하지 않았을 때는 "최소 1개 요일을 선택해주세요"라는 안내 메시지가 표시되어야 한다', () => {
      renderWithTheme(<WeeklyDaysSelector {...defaultProps} selectedDays={[]} />);
      expect(screen.getByText('최소 1개 요일을 선택해주세요')).toBeInTheDocument();
    });

    it('외부에서 error prop으로 전달된 사용자 정의 오류 메시지가 우선적으로 표시되어야 한다', () => {
      renderWithTheme(<WeeklyDaysSelector {...defaultProps} error="사용자 정의 오류" />);
      expect(screen.getByText('사용자 정의 오류')).toBeInTheDocument();
    });

    it('사용자가 최소 1개 요일을 선택하면 내부 검증 오류 메시지가 자동으로 사라져야 한다', () => {
      renderWithTheme(<WeeklyDaysSelector {...defaultProps} selectedDays={[1]} />);
      expect(screen.queryByText('최소 1개 요일을 선택해주세요')).not.toBeInTheDocument();
    });

    it('외부 오류가 설정된 경우에는 내부 검증 오류 메시지가 표시되지 않고 외부 오류만 표시되어야 한다', () => {
      renderWithTheme(<WeeklyDaysSelector {...defaultProps} selectedDays={[]} error="외부 오류" />);
      expect(screen.getByText('외부 오류')).toBeInTheDocument();
      expect(screen.queryByText('최소 1개 요일을 선택해주세요')).not.toBeInTheDocument();
    });
  });

  describe('선택된 요일 상태 관리 및 데이터 일관성 유지', () => {
    it('selectedDays prop으로 전달된 요일 배열이 순서와 관계없이 UI에서는 항상 정렬된 상태로 표시되어야 한다', () => {
      const mockOnChange = vi.fn();
      renderWithTheme(
        <WeeklyDaysSelector
          {...defaultProps}
          selectedDays={[5, 1, 3]}
          onSelectionChange={mockOnChange}
        />
      );

      // 이미 정렬된 상태로 표시되어야 함
      expect(screen.getByLabelText('월요일 선택')).toBeChecked();
      expect(screen.getByLabelText('수요일 선택')).toBeChecked();
      expect(screen.getByLabelText('금요일 선택')).toBeChecked();
    });

    it('selectedDays가 빈 배열인 초기 상태에서도 체크박스 클릭이 정상적으로 동작하고 올바른 결과를 반환해야 한다', () => {
      const mockOnChange = vi.fn();
      renderWithTheme(<WeeklyDaysSelector {...defaultProps} onSelectionChange={mockOnChange} />);

      fireEvent.click(screen.getByLabelText('월요일 선택'));
      expect(mockOnChange).toHaveBeenCalledWith([1]);
    });

    it('모든 요일이 선택된 상태에서 특정 요일을 해제하면 나머지 요일들만 포함된 배열이 onSelectionChange로 전달되어야 한다', () => {
      const mockOnChange = vi.fn();
      renderWithTheme(
        <WeeklyDaysSelector
          {...defaultProps}
          selectedDays={[0, 1, 2, 3, 4, 5, 6]}
          onSelectionChange={mockOnChange}
        />
      );

      // 하나를 해제해보기
      fireEvent.click(screen.getByLabelText('월요일 선택'));
      expect(mockOnChange).toHaveBeenCalledWith([0, 2, 3, 4, 5, 6]);
    });
  });

  describe('에러 상태 및 사용자 피드백 메시지 표시', () => {
    it('사용자가 요일을 선택하지 않은 상태에서는 적절한 안내 메시지가 표시되어 사용자에게 다음 단계를 안내해야 한다', () => {
      renderWithTheme(<WeeklyDaysSelector {...defaultProps} selectedDays={[]} />);

      // 에러 메시지가 표시되는지 확인
      expect(screen.getByText('최소 1개 요일을 선택해주세요')).toBeInTheDocument();
    });

    it('외부 시스템에서 전달된 오류 메시지가 사용자에게 명확하게 표시되어야 한다', () => {
      renderWithTheme(<WeeklyDaysSelector {...defaultProps} error="외부 오류" />);

      // 외부 오류 메시지가 표시되는지 확인
      expect(screen.getByText('외부 오류')).toBeInTheDocument();
    });
  });
});

describe('formatSelectedDays 유틸리티 함수 - 선택된 요일을 사용자 친화적인 한국어 문자열로 변환', () => {
  it('여러 요일이 선택된 경우 각 요일을 쉼표로 구분하여 "월, 수, 금" 형태의 읽기 쉬운 문자열로 변환해야 한다', () => {
    expect(formatSelectedDays([1, 3, 5])).toBe('월, 수, 금');
  });

  it('선택된 요일이 없는 경우 빈 문자열을 반환하여 UI에서 "선택된 요일 없음" 상태를 표현할 수 있어야 한다', () => {
    expect(formatSelectedDays([])).toBe('');
  });

  it('입력 배열의 순서와 관계없이 항상 정렬된 순서로 "월, 수, 금" 형태의 일관된 결과를 반환해야 한다', () => {
    expect(formatSelectedDays([5, 1, 3])).toBe('월, 수, 금');
  });

  it('단일 요일만 선택된 경우 쉼표 없이 "화"와 같이 간결하게 표시해야 한다', () => {
    expect(formatSelectedDays([2])).toBe('화');
  });

  it('연속된 요일들이 선택된 경우 "월, 화, 수, 목, 금"과 같이 자연스러운 순서로 표시되어야 한다', () => {
    expect(formatSelectedDays([1, 2, 3, 4, 5])).toBe('월, 화, 수, 목, 금');
  });

  it('주말만 선택된 경우 "일, 토"와 같이 특별한 의미를 가진 요일 그룹을 명확하게 표현해야 한다', () => {
    expect(formatSelectedDays([0, 6])).toBe('일, 토');
  });
});

describe('validateSelectedDays 유틸리티 함수 - 요일 선택 데이터의 유효성 검증 및 오류 메시지 생성', () => {
  it('사용자가 요일을 선택하지 않은 경우 isValid: false와 함께 적절한 안내 메시지를 반환해야 한다', () => {
    const result = validateSelectedDays([]);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('최소 1개 요일을 선택해주세요');
  });

  it('0-6 범위 내의 유효한 요일 번호들로 구성된 배열에 대해서는 isValid: true와 함께 오류 메시지 없이 반환되어야 한다', () => {
    const result = validateSelectedDays([1, 3, 5]);
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeUndefined();
  });

  it('7 이상의 유효하지 않은 요일 번호가 포함된 경우 isValid: false와 함께 구체적인 오류 메시지를 반환해야 한다', () => {
    const result = validateSelectedDays([1, 7, 5]);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('유효하지 않은 요일이 선택되었습니다');
  });

  it('음수 값의 요일 번호가 포함된 경우 isValid: false와 함께 구체적인 오류 메시지를 반환해야 한다', () => {
    const result = validateSelectedDays([1, -1, 5]);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('유효하지 않은 요일이 선택되었습니다');
  });

  it('요일 번호의 경계값(0: 일요일, 6: 토요일)에 대해서는 정상적으로 유효한 것으로 인식하고 처리해야 한다', () => {
    expect(validateSelectedDays([0])).toEqual({ isValid: true });
    expect(validateSelectedDays([6])).toEqual({ isValid: true });
    expect(validateSelectedDays([0, 6])).toEqual({ isValid: true });
  });
});
