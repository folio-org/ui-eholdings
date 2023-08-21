import { MemoryRouter } from 'react-router-dom';
import noop from 'lodash/noop';
import {
  render,
  cleanup,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

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

const ResultsView = () => <span>resultsView</span>;
const PaneTitle = () => <span>resultPaneTitle</span>;

const renderSearchPaneset = (props = {}) => render(
  <MemoryRouter>
    <CommandList commands={defaultKeyboardShortcuts}>
      <SearchPaneset
        history={historyMock}
        resultsType={searchTypes.PROVIDERS}
        resultsLabel="Providers"
        resultsPaneTitle={PaneTitle}
        resultsView={ResultsView}
        isLoading={false}
        updateFilters={noop}
        searchForm={<div>searchForm</div>}
        {...props}
      />
    </CommandList>
  </MemoryRouter>
);

describe('Given SearchPaneset', () => {
  afterEach(cleanup);

  it('should render search-pane', () => {
    const { getByTestId } = renderSearchPaneset();

    expect(getByTestId('data-test-eholdings-search-pane')).toBeDefined();
  });

  it('should not call history push for Providers', () => {
    const { getByTestId } = renderSearchPaneset();
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

  describe('when some filters are choosed and they are hide', () => {
    it('should show ExpandFiltersPaneButton', () => {
      const { container } = renderSearchPaneset({
        hideFilters: true,
      });

      expect(container.querySelector('[data-test-expand-filter-pane-button=true]')).toBeDefined();
    });

    describe('when click on ExpandFiltersPaneButton', () => {
      it('should handle updateFilters', () => {
        const mockUpdateFilters = jest.fn();
        const { container } = renderSearchPaneset({
          hideFilters: true,
          updateFilters: mockUpdateFilters,
        });

        fireEvent.click(container.querySelector('[data-test-expand-filter-pane-button=true]'));

        expect(mockUpdateFilters).toHaveBeenCalled();
      });
    });
  });

  describe('when component is loading', () => {
    it('should show loading message', () => {
      const { getByText } = renderSearchPaneset({
        isLoading: true,
      });

      expect(getByText('ui-eholdings.search.loading')).toBeDefined();
    });
  });

  describe('when resultView is not present', () => {
    it('should show enter query message', () => {
      const { getByText } = renderSearchPaneset({
        resultsView: null,
      });

      expect(getByText('ui-eholdings.search.enterQuery')).toBeDefined();
    });
  });
});
