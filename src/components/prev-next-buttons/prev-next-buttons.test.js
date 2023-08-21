import {
  fireEvent,
  render,
} from '@folio/jest-config-stripes/testing-library/react';
import noop from 'lodash/noop';

import PrevNextButtons from './prev-next-buttons';

const mockFetch = jest.fn();
const mockSetFocus = jest.fn();

describe('Given PrevNextButtons', () => {
  const renderPrevNextButtons = (props) => render(
    <PrevNextButtons
      page={1}
      fetch={noop}
      totalResults={150}
      isLoading={false}
      setFocus={noop}
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
    it('should handle fetch', () => {
      const { getByTestId } = renderPrevNextButtons({
        fetch: mockFetch,
      });

      fireEvent.click(getByTestId('next-button'));

      expect(mockFetch).toHaveBeenCalledWith(2);
    });

    it('should handle setFocus', () => {
      const { getByTestId } = renderPrevNextButtons({
        setFocus: mockSetFocus,
      });

      fireEvent.click(getByTestId('next-button'));

      expect(mockSetFocus).toHaveBeenCalled();
    });
  });

  describe('when click on previous button', () => {
    it('should handle fetch', () => {
      const { getByTestId } = renderPrevNextButtons({
        page: 2,
        fetch: mockFetch,
      });

      fireEvent.click(getByTestId('previous-button'));

      expect(mockFetch).toHaveBeenCalledWith(1);
    });

    it('should handle setFocus', () => {
      const { getByTestId } = renderPrevNextButtons({
        setFocus: mockSetFocus,
      });

      fireEvent.click(getByTestId('previous-button'));

      expect(mockSetFocus).toHaveBeenCalled();
    });

    it('should disable previous button', () => {
      const { getByTestId } = renderPrevNextButtons({
        fetch: mockFetch,
      });

      fireEvent.click(getByTestId('previous-button'));

      expect(getByTestId('previous-button').disabled).toBeTruthy();
    });
  });
});
