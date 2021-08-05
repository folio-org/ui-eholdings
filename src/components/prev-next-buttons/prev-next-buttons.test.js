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
    const { getByText } = renderPrevNextButtons();

    expect(getByText('ui-eholdings.previous')).toBeDefined();
    expect(getByText('ui-eholdings.next')).toBeDefined();
  });

  it('should disable previous button', () => {
    const { getByText } = renderPrevNextButtons();

    expect(getByText('ui-eholdings.previous').disabled).toBeTruthy();
    expect(getByText('ui-eholdings.next').disabled).toBeFalsy();
  });

  describe('when click on next button', () => {
    const mockSetPage = jest.fn();

    it('should handle setPage', () => {
      const { getByText } = renderPrevNextButtons({
        setPage: mockSetPage,
      });

      fireEvent.click(getByText('ui-eholdings.next'));

      expect(mockSetPage).toHaveBeenCalledWith(2);
    });

    it('should disable next button', () => {
      const { getByText } = renderPrevNextButtons({
        setPage: mockSetPage,
      });

      fireEvent.click(getByText('ui-eholdings.next'));

      expect(getByText('ui-eholdings.next').disabled).toBeTruthy();
    });
  });

  describe('when click on previous button', () => {
    const mockSetPage = jest.fn();

    it('should handle setPage', () => {
      const { getByText } = renderPrevNextButtons({
        page: 2,
        setPage: mockSetPage,
      });

      fireEvent.click(getByText('ui-eholdings.previous'));

      expect(mockSetPage).toHaveBeenCalledWith(1);
    });

    it('should disable next button', () => {
      const { getByText } = renderPrevNextButtons({
        setPage: mockSetPage,
      });

      fireEvent.click(getByText('ui-eholdings.previous'));

      expect(getByText('ui-eholdings.previous').disabled).toBeTruthy();
    });
  });
});
