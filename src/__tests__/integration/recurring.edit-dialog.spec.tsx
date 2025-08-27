import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { OverlayProvider } from 'overlay-kit';
import { vi } from 'vitest';

import { setupMockHandlerBatchCreation } from '../../__mocks__/handlersUtils';
import App from '../../App';

const theme = createTheme();

const setup = () => {
  const user = userEvent.setup();
  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <OverlayProvider>
          <App />
        </OverlayProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
  return { user };
};

describe('2.3.1 반복 일정 수정 감지 및 확인 다이얼로그', () => {
  it('반복 일정 편집 클릭이면 다이얼로그가 표시된다', async () => {
    vi.setSystemTime(new Date('2025-10-01'));
    setupMockHandlerBatchCreation([]);
    const { user } = setup();

    // Given 반복 일정 하나 저장
    await user.type(screen.getByLabelText('제목'), '반복 회의');
    await user.type(screen.getByLabelText('날짜'), '2025-10-01');
    await user.type(screen.getByLabelText('시작 시간'), '09:00');
    await user.type(screen.getByLabelText('종료 시간'), '10:00');
    await user.type(screen.getByLabelText('설명'), '반복 테스트');
    await user.type(screen.getByLabelText('위치'), '회의실 A');
    await user.click(screen.getByLabelText('반복 유형'));
    await user.click(screen.getByRole('option', { name: '매주' }));
    await user.clear(screen.getByLabelText('반복 간격'));
    await user.type(screen.getByLabelText('반복 간격'), '1');
    await user.type(screen.getByLabelText('반복 종료일'), '2025-10-29');
    await user.click(screen.getByTestId('event-submit-button'));
    await screen.findByText('반복 일정이 생성되었습니다.');

    // When 리스트 첫 항목의 Edit 클릭
    const editButtons = await screen.findAllByLabelText('Edit event');
    await user.click(editButtons[0]);

    // Then 다이얼로그 표시
    expect(
      await screen.findByRole('dialog', { name: /반복 일정을 수정하시겠어요/ })
    ).toBeInTheDocument();
  });

  it('이 일정만 수정 선택이면 편집 모드로 진입한다', async () => {
    vi.setSystemTime(new Date('2025-10-01'));
    setupMockHandlerBatchCreation([]);
    const { user } = setup();

    // Given 반복 일정 생성
    await user.type(screen.getByLabelText('제목'), '반복 회의');
    await user.type(screen.getByLabelText('날짜'), '2025-10-01');
    await user.type(screen.getByLabelText('시작 시간'), '09:00');
    await user.type(screen.getByLabelText('종료 시간'), '10:00');
    await user.type(screen.getByLabelText('설명'), '반복 테스트');
    await user.type(screen.getByLabelText('위치'), '회의실 A');
    await user.click(screen.getByLabelText('반복 유형'));
    await user.click(screen.getByRole('option', { name: '매주' }));
    await user.clear(screen.getByLabelText('반복 간격'));
    await user.type(screen.getByLabelText('반복 간격'), '1');
    await user.type(screen.getByLabelText('반복 종료일'), '2025-10-29');
    await user.click(screen.getByTestId('event-submit-button'));
    await screen.findByText('반복 일정이 생성되었습니다.');

    // When 편집 클릭 후 "이 일정만 수정" 선택
    const editButtons = await screen.findAllByLabelText('Edit event');
    await user.click(editButtons[0]);
    const onlyThisBtn = await screen.findByRole('button', { name: '이 일정만 수정' });
    await user.click(onlyThisBtn);

    // Then 편집 모드 진입(제목 입력창이 해당 일정 제목으로 채워짐)
    expect(await screen.findByDisplayValue('반복 회의')).toBeInTheDocument();
  });

  it('취소 선택이면 변경 없이 종료된다', async () => {
    vi.setSystemTime(new Date('2025-10-01'));
    setupMockHandlerBatchCreation([]);
    const { user } = setup();

    // Given 반복 일정 생성
    await user.type(screen.getByLabelText('제목'), '반복 회의');
    await user.type(screen.getByLabelText('날짜'), '2025-10-01');
    await user.type(screen.getByLabelText('시작 시간'), '09:00');
    await user.type(screen.getByLabelText('종료 시간'), '10:00');
    await user.type(screen.getByLabelText('설명'), '반복 테스트');
    await user.type(screen.getByLabelText('위치'), '회의실 A');
    await user.click(screen.getByLabelText('반복 유형'));
    await user.click(screen.getByRole('option', { name: '매주' }));
    await user.clear(screen.getByLabelText('반복 간격'));
    await user.type(screen.getByLabelText('반복 간격'), '1');
    await user.type(screen.getByLabelText('반복 종료일'), '2025-10-29');
    await user.click(screen.getByTestId('event-submit-button'));
    await screen.findByText('반복 일정이 생성되었습니다.');

    // When 편집 클릭 후 "취소" 선택
    const editButtons = await screen.findAllByLabelText('Edit event');
    await user.click(editButtons[0]);
    const cancelBtn = await screen.findByRole('button', { name: '취소' });
    await user.click(cancelBtn);

    // Then 다이얼로그가 사라지고, 폼은 편집 모드로 진입하지 않음(제목 입력값이 비어 있음)
    await waitForElementToBeRemoved(() =>
      screen.getByRole('dialog', { name: /반복 일정을 수정하시겠어요/ })
    );
    expect(screen.getByLabelText('제목')).toHaveValue('');
  });
});
