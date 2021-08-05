import {
  render,
  fireEvent,
} from '@testing-library/react';

import noop from 'lodash/noop';
import Harness from '../../test/jest/helpers/harness';

import ProviderSearchList from './provider-search-list';

const content = {
  id: 'provider-id',
  name: 'provider-name',
  packagesSelected: 10,
  packagesTotal: 100,
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

describe('Given ProviderSearchList', () => {
  const mockOnClickItem = jest.fn();

  const renderProviderSearchList = ({ ...props }) => render(
    <Harness>
      <ProviderSearchList
        collection={collection}
        fetch={noop}
        notFoundMessage="Not Found Message"
        onClickItem={mockOnClickItem}
        onUpdateOffset={noop}
        params={{}}
        {...props}
      />
    </Harness>
  );

  it('should render QueryList component', () => {
    const { getByText } = renderProviderSearchList();

    expect(getByText('QueryList component')).toBeDefined();
  });

  it('should display found provider information', () => {
    const { getByText } = renderProviderSearchList();

    expect(getByText('provider-name')).toBeDefined();
    expect(getByText('ui-eholdings.selectedCount')).toBeDefined();
    expect(getByText('ui-eholdings.label.totalPackages')).toBeDefined();
  });

  it('should have a link to the found provider', () => {
    const { getByRole, getAllByRole } = renderProviderSearchList();

    expect(getAllByRole('link')).toHaveLength(1);
    expect(getByRole('link')).toHaveAttribute('href', '/eholdings/providers/provider-id');
  });

  describe('when click on a provider', () => {
    it('should call onClickItem', () => {
      const { getByRole } = renderProviderSearchList();

      fireEvent.click(getByRole('link'));

      expect(mockOnClickItem).toHaveBeenCalled();
      expect(mockOnClickItem).toHaveBeenCalledTimes(1);
    });
  });
});
