import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import {
  render,
  cleanup,
} from '@testing-library/react';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes-components';

import PackageShow from './index';
import {
  openEditShortcut,
  collapseAllShortcut,
} from '../../../../test/jest/utilities';
import IntlProvider from '../../../../test/jest/helpers/intl';

jest.mock('../../query-list', () => () => (<div>Query List</div>));
jest.mock('../../utilities', () => ({
  processErrors: jest.fn(() => []),
  handleSaveKeyFormSubmit: jest.fn(() => []),
}));
// jest.mock('../../../features', () => ({
//   AgreementsAccordion: () => <div>AgreementsAccordion</div>,
//   UsageConsolidationAccordion: () => <div>UsageConsolidationAccordion</div>,
// }));
jest.mock('../../../features/agreements-accordion', () => () => <div>AgreementsAccordion</div>);
jest.mock('../../../features/usage-consolidation-accordion', () => () => <div>UsageConsolidationAccordion</div>);

const mockOnEdit = jest.fn();
const mockAccessStatusTypes = {
  isDeleted: false,
  isLoading: false,
  items: {
    data: [],
  }
};
const mockCostPerUse = {
  errors: [],
  isFailed: false,
};
const mockModel = {
  resources: [],
  name: 'Test',
  request: {
    isRejected: false
  },
  isSelected: true,
  isLoaded: true,
  isLoading: false,
  visibilityData: {},
  customCoverage: {},
};

// const mockStore = createStore(jest.fn(() => {
//   return {
//     usageConsolidation: jest.fn(() => ({
//       data: {}
//     }))
//   };
// }), {
//   eholdings: {
//     data: {
//       usageConsolidation: {
//         data: {}
//       }
//     }
//   }
// });

const renderPackageShow = () => render(
  <MemoryRouter>
    {/* <Provider store={mockStore}> */}
    <IntlProvider>
      <CommandList commands={defaultKeyboardShortcuts}>
        <PackageShow
          accessStatusTypes={mockAccessStatusTypes}
          addPackageToHoldings={jest.fn()}
          costPerUse={mockCostPerUse}
          fetchCostPerUsePackageTitles={jest.fn()}
          fetchPackageCostPerUse={jest.fn()}
          fetchPackageTitles={jest.fn()}
          updateFolioTags={jest.fn()}
          toggleSelected={jest.fn()}
          loadMoreCostPerUsePackageTitles={jest.fn()}
          model={mockModel}
          packageTitles={{}}
          provider={{}}
          proxyTypes={{}}
          onEdit={mockOnEdit}
        />
      </CommandList>
    </IntlProvider>
    {/* </Provider> */}
  </MemoryRouter>
);

describe('Package Show', () => {
  afterEach(cleanup);

  it('should render Package Show page', () => {
    const { getByTestId } = renderPackageShow();

    expect(getByTestId('data-test-eholdings-details-view-package')).toBeDefined();
  });

  it('should render Edit Package Show', () => {
    const { getByTestId } = renderPackageShow();
    const packageShowPage = getByTestId('data-test-eholdings-details-view-package');

    openEditShortcut(packageShowPage);

    expect(mockOnEdit).toHaveBeenCalled();
  });

  it('should collapse all accordions', () => {
    const { getByTestId, getByText } = renderPackageShow();
    const packageShowPage = getByTestId('data-test-eholdings-details-view-package');
    const collapseAllBtn = getByText('Collapse all');
    const expandAllBtn = getByText('Expand all');

    expect(collapseAllBtn).toBeInTheDocument();

    collapseAllShortcut(packageShowPage);

    expect(expandAllBtn).toBeInTheDocument();
  });
});
