import {
  render,
  fireEvent,
} from '@testing-library/react';

import Harness from '../../test/jest/helpers/harness';

import PackageSearchList from './package-search-list';

const content = {
  id: 'package-id',
  name: 'package-name',
  providerName: 'package-provider-name',
  isSelected: true,
  selectedCount: 1,
  titleCount: 2,
  visibilityData: {
    isHidden: false,
  },
};

const collection = {
  pages: [
    {
      records: [
        {
          ...content,
        },
      ],
    },
  ],
};

jest.mock('./query-list', () => ({ renderItem }) => (
  <>
    <span>QueryList component</span>
    {renderItem({ content })}
  </>
));

describe('Given PackageSearchList', () => {
  const mockOnClickItem = jest.fn();

  const renderPackageSearchList = ({ ...props }) => render(
    <Harness>
      <PackageSearchList
        collection={collection}
        fetch={() => {}}
        notFoundMessage="Not Found Message"
        onClickItem={mockOnClickItem}
        onUpdateOffset={() => {}}
        params={{}}
        {...props}
      />
    </Harness>
  );

  it('should render QueryList component', () => {
    const { getByText } = renderPackageSearchList();

    expect(getByText('QueryList component')).toBeDefined();
  });

  it('should display found package information', () => {
    const { getByText } = renderPackageSearchList();

    expect(getByText('package-name')).toBeDefined();
    expect(getByText('package-provider-name')).toBeDefined();
    expect(getByText('ui-eholdings.selectedCount')).toBeDefined();
    expect(getByText('ui-eholdings.label.totalTitles')).toBeDefined();
  });

  it('should have a link to the found package', () => {
    const { getByRole, getAllByRole } = renderPackageSearchList();

    expect(getAllByRole('link')).toHaveLength(1);
    expect(getByRole('link')).toHaveAttribute('href', '/eholdings/packages/package-id');
  });

  describe('when click on a package', () => {
    it('should call onClickItem', () => {
      const { getByRole } = renderPackageSearchList();

      fireEvent.click(getByRole('link'));

      expect(mockOnClickItem).toHaveBeenCalled();
      expect(mockOnClickItem).toHaveBeenCalledTimes(1);
    });
  });
});
