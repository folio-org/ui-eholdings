import {
  fireEvent,
  render,
} from '@testing-library/react';
import noop from 'lodash/noop';

import PrevNextButtons from './prev-next-buttons';

const mockFetch = jest.fn();

describe('Given PrevNextButtons', () => {
  const renderPrevNextButtons = (props) => render(
    <PrevNextButtons
      page={1}
      fetch={noop}
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
    it('should handle fetch', () => {
      const { getByTestId } = renderPrevNextButtons({
        fetch: mockFetch,
      });

      fireEvent.click(getByTestId('next-button'));

      expect(mockFetch).toHaveBeenCalledWith(2);
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

    it('should disable previous button', () => {
      const { getByTestId } = renderPrevNextButtons({
        fetch: mockFetch,
      });

      fireEvent.click(getByTestId('previous-button'));

      expect(getByTestId('previous-button').disabled).toBeTruthy();
    });
  });
});
