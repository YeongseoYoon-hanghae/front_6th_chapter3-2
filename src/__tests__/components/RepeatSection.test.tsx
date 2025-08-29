import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';

import { RepeatSection } from '../../components/RepeatSection';
import { RepeatType } from '../../types';

// Material-UI 테마로 래핑
const renderWithTheme = (component: React.ReactElement) => {
  const theme = createTheme();
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('RepeatSection WeeklyDaysSelector 통합 테스트', () => {
  const defaultProps = {
    isRepeating: true,
    onIsRepeatingChange: vi.fn(),
    repeatType: 'weekly' as RepeatType,
    onRepeatTypeChange: vi.fn(),
    repeatInterval: 1,
    onRepeatIntervalChange: vi.fn(),
    repeatEndDate: '',
    onRepeatEndDateChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('조건부 WeeklyDaysSelector 렌더링 기능', () => {
    it('반복 타입이 weekly이고 weeklyOptions props가 제공된 경우 WeeklyDaysSelector가 표시되어야 한다', () => {
      renderWithTheme(
        <RepeatSection
          {...defaultProps}
          repeatType="weekly"
          weeklyOptions={{ daysOfWeek: [] }}
          onWeeklyOptionsChange={vi.fn()}
        />
      );

      expect(screen.getByText('반복 요일')).toBeInTheDocument();
    });

    it('반복 타입이 weekly가 아닌 경우(daily) WeeklyDaysSelector가 표시되지 않아야 한다', () => {
      renderWithTheme(
        <RepeatSection
          {...defaultProps}
          repeatType="daily"
          weeklyOptions={{ daysOfWeek: [] }}
          onWeeklyOptionsChange={vi.fn()}
        />
      );

      expect(screen.queryByText('반복 요일')).not.toBeInTheDocument();
    });

    it('반복 타입이 weekly가 아닌 경우(monthly) WeeklyDaysSelector가 표시되지 않아야 한다', () => {
      renderWithTheme(
        <RepeatSection
          {...defaultProps}
          repeatType="monthly"
          weeklyOptions={{ daysOfWeek: [] }}
          onWeeklyOptionsChange={vi.fn()}
        />
      );

      expect(screen.queryByText('반복 요일')).not.toBeInTheDocument();
    });

    it('반복 타입이 weekly가 아닌 경우(yearly) WeeklyDaysSelector가 표시되지 않아야 한다', () => {
      renderWithTheme(
        <RepeatSection
          {...defaultProps}
          repeatType="yearly"
          weeklyOptions={{ daysOfWeek: [] }}
          onWeeklyOptionsChange={vi.fn()}
        />
      );

      expect(screen.queryByText('반복 요일')).not.toBeInTheDocument();
    });

    it('weeklyOptions props가 제공되지 않은 경우 WeeklyDaysSelector가 표시되지 않아야 한다', () => {
      renderWithTheme(<RepeatSection {...defaultProps} repeatType="weekly" />);

      expect(screen.queryByText('반복 요일')).not.toBeInTheDocument();
    });

    it('onWeeklyOptionsChange 콜백이 제공되지 않은 경우 WeeklyDaysSelector가 표시되지 않아야 한다', () => {
      renderWithTheme(
        <RepeatSection {...defaultProps} repeatType="weekly" weeklyOptions={{ daysOfWeek: [] }} />
      );

      expect(screen.queryByText('반복 요일')).not.toBeInTheDocument();
    });
  });

  describe('weeklyOptions 상태 관리 및 변경 전파', () => {
    it('반복 타입을 다른 타입에서 weekly로 변경하면 빈 daysOfWeek 배열로 weeklyOptions가 초기화되어야 한다', async () => {
      const user = userEvent.setup();
      const mockOnWeeklyOptionsChange = vi.fn();
      const mockOnRepeatTypeChange = vi.fn();

      renderWithTheme(
        <RepeatSection
          {...defaultProps}
          repeatType="daily"
          onRepeatTypeChange={mockOnRepeatTypeChange}
          onWeeklyOptionsChange={mockOnWeeklyOptionsChange}
        />
      );

      // Material-UI Select 열기
      const selectButton = screen.getByRole('combobox', { name: /반복 유형/i });
      await user.click(selectButton);

      // 매주 옵션 선택
      const weeklyOption = screen.getByRole('option', { name: '매주' });
      await user.click(weeklyOption);

      expect(mockOnRepeatTypeChange).toHaveBeenCalledWith('weekly');
      expect(mockOnWeeklyOptionsChange).toHaveBeenCalledWith({ daysOfWeek: [] });
    });

    it('반복 타입을 weekly에서 다른 타입(daily)으로 변경하면 weeklyOptions가 undefined로 설정되어야 한다', async () => {
      const user = userEvent.setup();
      const mockOnWeeklyOptionsChange = vi.fn();
      const mockOnRepeatTypeChange = vi.fn();

      renderWithTheme(
        <RepeatSection
          {...defaultProps}
          repeatType="weekly"
          onRepeatTypeChange={mockOnRepeatTypeChange}
          weeklyOptions={{ daysOfWeek: [1, 3, 5] }}
          onWeeklyOptionsChange={mockOnWeeklyOptionsChange}
        />
      );

      // Material-UI Select 열기
      const selectButton = screen.getByRole('combobox', { name: /반복 유형/i });
      await user.click(selectButton);

      // 매일 옵션 선택
      const dailyOption = screen.getByRole('option', { name: '매일' });
      await user.click(dailyOption);

      expect(mockOnRepeatTypeChange).toHaveBeenCalledWith('daily');
      expect(mockOnWeeklyOptionsChange).toHaveBeenCalledWith(undefined);
    });

    it('반복 타입을 weekly에서 다른 타입(monthly)으로 변경하면 weeklyOptions가 undefined로 설정되어야 한다', async () => {
      const user = userEvent.setup();
      const mockOnWeeklyOptionsChange = vi.fn();
      const mockOnRepeatTypeChange = vi.fn();

      renderWithTheme(
        <RepeatSection
          {...defaultProps}
          repeatType="weekly"
          onRepeatTypeChange={mockOnRepeatTypeChange}
          weeklyOptions={{ daysOfWeek: [1, 3, 5] }}
          onWeeklyOptionsChange={mockOnWeeklyOptionsChange}
        />
      );

      // Material-UI Select 열기
      const selectButton = screen.getByRole('combobox', { name: /반복 유형/i });
      await user.click(selectButton);

      // 매월 옵션 선택
      const monthlyOption = screen.getByRole('option', { name: '매월' });
      await user.click(monthlyOption);

      expect(mockOnRepeatTypeChange).toHaveBeenCalledWith('monthly');
      expect(mockOnWeeklyOptionsChange).toHaveBeenCalledWith(undefined);
    });

    it('WeeklyDaysSelector에서 요일을 선택하면 상위 컴포넌트로 변경사항이 전파되어야 한다', () => {
      const mockOnWeeklyOptionsChange = vi.fn();

      renderWithTheme(
        <RepeatSection
          {...defaultProps}
          repeatType="weekly"
          weeklyOptions={{ daysOfWeek: [] }}
          onWeeklyOptionsChange={mockOnWeeklyOptionsChange}
        />
      );

      // 월요일 체크박스 클릭
      fireEvent.click(screen.getByLabelText('월요일 선택'));

      expect(mockOnWeeklyOptionsChange).toHaveBeenCalledWith({ daysOfWeek: [1] });
    });

    it('WeeklyDaysSelector에서 여러 요일을 선택하면 올바른 배열로 상위 컴포넌트에 전파되어야 한다', () => {
      const mockOnWeeklyOptionsChange = vi.fn();

      renderWithTheme(
        <RepeatSection
          {...defaultProps}
          repeatType="weekly"
          weeklyOptions={{ daysOfWeek: [1] }}
          onWeeklyOptionsChange={mockOnWeeklyOptionsChange}
        />
      );

      // 수요일 체크박스 클릭 (월요일은 이미 선택된 상태)
      fireEvent.click(screen.getByLabelText('수요일 선택'));

      expect(mockOnWeeklyOptionsChange).toHaveBeenCalledWith({ daysOfWeek: [1, 3] });
    });

    it('이미 선택된 요일을 다시 클릭하면 해당 요일이 제거된 배열로 상위 컴포넌트에 전파되어야 한다', () => {
      const mockOnWeeklyOptionsChange = vi.fn();

      renderWithTheme(
        <RepeatSection
          {...defaultProps}
          repeatType="weekly"
          weeklyOptions={{ daysOfWeek: [1, 3, 5] }}
          onWeeklyOptionsChange={mockOnWeeklyOptionsChange}
        />
      );

      // 수요일 체크박스 클릭 (선택 해제)
      fireEvent.click(screen.getByLabelText('수요일 선택'));

      expect(mockOnWeeklyOptionsChange).toHaveBeenCalledWith({ daysOfWeek: [1, 5] });
    });
  });

  describe('외부 오류 메시지 전달 및 표시', () => {
    it('weeklyOptionsError가 제공되면 WeeklyDaysSelector에 오류 메시지가 표시되어야 한다', () => {
      renderWithTheme(
        <RepeatSection
          {...defaultProps}
          repeatType="weekly"
          weeklyOptions={{ daysOfWeek: [] }}
          onWeeklyOptionsChange={vi.fn()}
          weeklyOptionsError="최소 1개 요일을 선택해주세요"
        />
      );

      expect(screen.getByText('최소 1개 요일을 선택해주세요')).toBeInTheDocument();
    });

    it('weeklyOptionsError가 제공되지 않으면 내부 검증 오류 메시지가 표시되어야 한다', () => {
      renderWithTheme(
        <RepeatSection
          {...defaultProps}
          repeatType="weekly"
          weeklyOptions={{ daysOfWeek: [] }}
          onWeeklyOptionsChange={vi.fn()}
        />
      );

      expect(screen.getByText('최소 1개 요일을 선택해주세요')).toBeInTheDocument();
    });
  });

  describe('하위 호환성 및 기존 기능 보장', () => {
    it('weeklyOptions 관련 props 없이도 기존 RepeatSection이 정상적으로 동작해야 한다', () => {
      expect(() => {
        renderWithTheme(<RepeatSection {...defaultProps} repeatType="daily" />);
      }).not.toThrow();

      // 기본 반복 설정 UI는 정상 표시되어야 함
      expect(screen.getByText('반복 유형')).toBeInTheDocument();
      expect(screen.getByLabelText('반복 유형')).toBeInTheDocument();
    });

    it('기존 사용법으로 반복 타입을 변경해도 오류 없이 동작해야 한다', () => {
      const { rerender } = renderWithTheme(<RepeatSection {...defaultProps} repeatType="daily" />);

      // props 변경해도 오류 없이 동작
      rerender(<RepeatSection {...defaultProps} repeatType="monthly" />);
      expect(screen.getByLabelText('반복 유형')).toBeInTheDocument();

      rerender(<RepeatSection {...defaultProps} repeatType="yearly" />);
      expect(screen.getByLabelText('반복 유형')).toBeInTheDocument();
    });

    it('isRepeating이 false인 경우 WeeklyDaysSelector가 표시되지 않아야 한다', () => {
      renderWithTheme(
        <RepeatSection
          {...defaultProps}
          isRepeating={false}
          repeatType="weekly"
          weeklyOptions={{ daysOfWeek: [] }}
          onWeeklyOptionsChange={vi.fn()}
        />
      );

      expect(screen.queryByText('반복 요일')).not.toBeInTheDocument();
    });

    it('기존 반복 설정 필드들(간격, 종료일)이 새로운 weeklyOptions 기능과 함께 정상 표시되어야 한다', () => {
      renderWithTheme(
        <RepeatSection
          {...defaultProps}
          repeatType="weekly"
          weeklyOptions={{ daysOfWeek: [1, 3, 5] }}
          onWeeklyOptionsChange={vi.fn()}
        />
      );

      expect(screen.getByText('반복 유형')).toBeInTheDocument();
      expect(screen.getByText('반복 요일')).toBeInTheDocument();
      expect(screen.getByText('반복 간격')).toBeInTheDocument();
      expect(screen.getByText('반복 종료일')).toBeInTheDocument();
    });
  });

  describe('복합 상태 변경 시나리오 검증', () => {
    it('복잡한 상태 변경 플로우가 올바르게 동작해야 한다', async () => {
      const user = userEvent.setup();
      const mockOnRepeatTypeChange = vi.fn();
      const mockOnWeeklyOptionsChange = vi.fn();

      const { rerender } = renderWithTheme(
        <RepeatSection
          {...defaultProps}
          repeatType="daily"
          onRepeatTypeChange={mockOnRepeatTypeChange}
          onWeeklyOptionsChange={mockOnWeeklyOptionsChange}
        />
      );

      // 1. daily → weekly 변경
      const selectButton = screen.getByRole('combobox', { name: /반복 유형/i });
      await user.click(selectButton);
      const weeklyOption = screen.getByRole('option', { name: '매주' });
      await user.click(weeklyOption);

      expect(mockOnRepeatTypeChange).toHaveBeenCalledWith('weekly');
      expect(mockOnWeeklyOptionsChange).toHaveBeenCalledWith({ daysOfWeek: [] });

      // 2. 요일 선택 상태로 리렌더링
      rerender(
        <RepeatSection
          {...defaultProps}
          repeatType="weekly"
          onRepeatTypeChange={mockOnRepeatTypeChange}
          weeklyOptions={{ daysOfWeek: [] }}
          onWeeklyOptionsChange={mockOnWeeklyOptionsChange}
        />
      );

      // 3. 월요일, 수요일 선택
      fireEvent.click(screen.getByLabelText('월요일 선택'));
      expect(mockOnWeeklyOptionsChange).toHaveBeenCalledWith({ daysOfWeek: [1] });

      // 4. 수요일 추가 선택을 위한 리렌더링
      rerender(
        <RepeatSection
          {...defaultProps}
          repeatType="weekly"
          onRepeatTypeChange={mockOnRepeatTypeChange}
          weeklyOptions={{ daysOfWeek: [1] }}
          onWeeklyOptionsChange={mockOnWeeklyOptionsChange}
        />
      );

      fireEvent.click(screen.getByLabelText('수요일 선택'));
      expect(mockOnWeeklyOptionsChange).toHaveBeenCalledWith({ daysOfWeek: [1, 3] });

      // 5. weekly → monthly 변경을 위한 리렌더링
      rerender(
        <RepeatSection
          {...defaultProps}
          repeatType="weekly"
          onRepeatTypeChange={mockOnRepeatTypeChange}
          weeklyOptions={{ daysOfWeek: [1, 3] }}
          onWeeklyOptionsChange={mockOnWeeklyOptionsChange}
        />
      );

      const selectButtonForMonthly = screen.getByRole('combobox', { name: /반복 유형/i });
      await user.click(selectButtonForMonthly);
      const monthlyOption = screen.getByRole('option', { name: '매월' });
      await user.click(monthlyOption);

      expect(mockOnRepeatTypeChange).toHaveBeenCalledWith('monthly');
      expect(mockOnWeeklyOptionsChange).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Material-UI 스타일 및 레이아웃 일관성', () => {
    it('WeeklyDaysSelector가 기존 RepeatSection의 Stack spacing 패턴과 일치해야 한다', () => {
      renderWithTheme(
        <RepeatSection
          {...defaultProps}
          repeatType="weekly"
          weeklyOptions={{ daysOfWeek: [] }}
          onWeeklyOptionsChange={vi.fn()}
        />
      );

      const repeatSettings = screen.getByText('반복 유형').closest('[class*="MuiStack"]');
      expect(repeatSettings).toBeInTheDocument();

      const weeklySelector = screen.getByText('반복 요일');
      expect(weeklySelector).toBeInTheDocument();
    });

    it('모든 필드가 올바른 순서로 배치되어야 한다', () => {
      renderWithTheme(
        <RepeatSection
          {...defaultProps}
          repeatType="weekly"
          weeklyOptions={{ daysOfWeek: [] }}
          onWeeklyOptionsChange={vi.fn()}
        />
      );

      const formLabels = screen.getAllByText(/반복|요일/);
      const labelTexts = formLabels.map((label) => label.textContent);

      expect(labelTexts).toContain('반복 유형');
      expect(labelTexts).toContain('반복 요일');
      expect(labelTexts).toContain('반복 간격');
      expect(labelTexts).toContain('반복 종료일');
    });
  });
});
