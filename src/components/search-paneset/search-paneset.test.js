import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
} from '@testing-library/react';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes-components';

import SearchPaneset from './index';

import { searchTypes } from '../../constants';
import { openNewShortcut } from '../../../test/jest/utilities';

const historyMock = {
  push: jest.fn(),
};

const renderSearchPaneset = ({
  resultsType,
  label,
}) => render(
  <MemoryRouter>
    <CommandList commands={defaultKeyboardShortcuts}>
      <SearchPaneset
        history={historyMock}
        resultsType={resultsType}
        resultsLabel={label}
        isLoading={false}
        updateFilters={jest.fn()}
        searchForm={<div>searchForm</div>}
      />
    </CommandList>
  </MemoryRouter>
);

describe('Search Paneset', () => {
  afterEach(cleanup);

  it('should render search-pane', () => {
    const { getByTestId } = renderSearchPaneset({
      resultsType: searchTypes.PROVIDERS,
      label: 'Providers',
    });

    expect(getByTestId('data-test-eholdings-search-pane')).toBeDefined();
  });

  it('should not call history push for Providers', () => {
    const { getByTestId } = renderSearchPaneset({
      resultsType: searchTypes.PROVIDERS,
      label: 'Providers',
    });
    const paneset = getByTestId('data-test-eholdings-search-pane');

    openNewShortcut(paneset);

    expect(historyMock.push).not.toHaveBeenCalled();
  });

  it('should call history push for Packages', () => {
    const { getByTestId } = renderSearchPaneset({
      resultsType: searchTypes.PACKAGES,
      label: 'Packages',
    });
    const paneset = getByTestId('data-test-eholdings-search-pane');

    openNewShortcut(paneset);

    expect(historyMock.push).toHaveBeenCalled();
  });

  it('should call history push for Titles', () => {
    const { getByTestId } = renderSearchPaneset({
      resultsType: searchTypes.TITLES,
      label: 'Titles',
    });
    const paneset = getByTestId('data-test-eholdings-search-pane');

    openNewShortcut(paneset);

    expect(historyMock.push).toHaveBeenCalled();
  });
});
