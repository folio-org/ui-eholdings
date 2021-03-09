import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
} from '@testing-library/react';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes-components';

import PackageShow from './index';

// jest.mock('../../details-view', () => <div>Details View</div>);

const mockOnEdit = jest.fn();

const renderPackageShow = () => render(
  <MemoryRouter>
    <CommandList commands={defaultKeyboardShortcuts}>
      <PackageShow
        accessStatusTypes={{}}
        addPackageToHoldings={jest.fn()}
        costPerUse={{}}
        fetchCostPerUsePackageTitles={jest.fn()}
        fetchPackageCostPerUse={jest.fn()}
        fetchPackageTitles={jest.fn()}
        loadMoreCostPerUsePackageTitles={jest.fn()}
        model={{}}
        packageTitles={{}}
        onEdit={mockOnEdit}
      />
    </CommandList>
  </MemoryRouter>
);

describe('Package Show', () => {
  afterEach(cleanup);

  it('should render Package Show page', () => {
    const { getByTestId } = renderPackageShow();

    expect(getByTestId('data-test-eholdings-details-view-package')).toBeDefined();
  });
});
