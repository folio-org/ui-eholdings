import {
  render,
  cleanup,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import PackageFilterModal from './package-filter-modal';
import Harness from '../../../../../test/jest/helpers/harness';

const mockOnSubmit = jest.fn();

const renderPackageFilterModal = (props) => render(
  <Harness>
    <PackageFilterModal
      allPackages={[{
        id: 'id-1',
        packageName: 'name-1',
      }, {
        id: 'id-2',
        packageName: 'name-2',
      }, {
        id: 'id-3',
        packageName: 'name-3',
      }]}
      filterCount={10}
      onSubmit={mockOnSubmit}
      selectedPackages={[]}
      {...props}
    />
  </Harness>
);

describe('Given PackageFilterModal', () => {
  afterEach(() => {
    cleanup();
    mockOnSubmit.mockClear();
  });

  it('should display applied filters count', () => {
    const { getByText } = renderPackageFilterModal();

    expect(getByText('10')).toBeDefined();
  });

  describe('when clicking on badge', () => {
    it('should show modal', () => {
      const { getByText } = renderPackageFilterModal();

      fireEvent.click(getByText('10'));

      expect(getByText('ui-eholdings.filter.filterType.packages')).toBeDefined();
    });
  });

  describe('when selected packages exist', () => {
    it('should show packages in multiselect', () => {
      const {
        getAllByText,
        getByText,
      } = renderPackageFilterModal({
        selectedPackages: [{
          id: 'id-1',
          packageName: 'name-1',
        }, {
          id: 'id-2',
          packageName: 'name-2',
        }],
      });

      fireEvent.click(getByText('10'));

      expect(getAllByText('name-1')).toHaveLength(2);
      expect(getAllByText('name-2')).toHaveLength(2);
    });
  });

  describe('when clicking on Reset all button', () => {
    it('should close the modal', () => {
      const {
        getByText,
        queryByText,
      } = renderPackageFilterModal();

      fireEvent.click(getByText('10'));
      fireEvent.click(getByText('ui-eholdings.filter.resetAll'));

      expect(queryByText('ui-eholdings.filter.filterType.packages')).toBeNull();
    });
  });

  describe('when submitting the form', () => {
    it('should call onSubmit with correct parameters', () => {
      const { getByText } = renderPackageFilterModal();

      fireEvent.click(getByText('10'));
      fireEvent.click(getByText('name-3'));
      fireEvent.click(getByText('ui-eholdings.filter.search'));

      expect(mockOnSubmit).toBeCalledWith([{ id: 'id-3', packageName: 'name-3' }], 1);
    });
  });
});
