import {
  fireEvent,
  render,
} from '@testing-library/react';
import noop from 'lodash/noop';

import PrevNextButtons from './prev-next-buttons';

describe('Given PrevNextButtons', () => {
  const renderPrevNextButtons = (props) => render(
    <PrevNextButtons
      page={1}
      setPage={noop}
      totalResults={150}
      isLoading={false}
      {...props}
    />
  );

  it('should render PrevNextButtons', () => {
    const { getByTestId } = renderPrevNextButtons();

    expect(getByTestId('previous-button')).toBeDefined();
    expect(getByTestId('next-button')).toBeDefined();
  });

  it('should disable previous button', () => {
    const { getByTestId } = renderPrevNextButtons();

    expect(getByTestId('previous-button').disabled).toBeTruthy();
    expect(getByTestId('next-button').disabled).toBeFalsy();
  });

  describe('when click on next button', () => {
    const mockSetPage = jest.fn();

    it('should handle setPage', () => {
      const { getByTestId } = renderPrevNextButtons({
        setPage: mockSetPage,
      });

      fireEvent.click(getByTestId('next-button'));

      expect(mockSetPage).toHaveBeenCalledWith(2);
    });

    it('should disable next button', () => {
      const { getByTestId } = renderPrevNextButtons({
        setPage: mockSetPage,
      });

      fireEvent.click(getByTestId('next-button'));

      expect(getByTestId('next-button').disabled).toBeTruthy();
    });
  });

  describe('when click on previous button', () => {
    const mockSetPage = jest.fn();

    it('should handle setPage', () => {
      const { getByTestId } = renderPrevNextButtons({
        page: 2,
        setPage: mockSetPage,
      });

      fireEvent.click(getByTestId('previous-button'));

      expect(mockSetPage).toHaveBeenCalledWith(1);
    });

    it('should disable previous button', () => {
      const { getByTestId } = renderPrevNextButtons({
        setPage: mockSetPage,
      });

      fireEvent.click(getByTestId('previous-button'));

      expect(getByTestId('previous-button').disabled).toBeTruthy();
    });
  });
});
