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

import ProviderShow from './provider-show';
import Harness from '../../../../test/jest/helpers/harness';
import { collapseAllShortcut } from '../../../../test/jest/utilities';
import buildStripes from '../../../../test/jest/__mock__/stripesCore.mock';

jest.mock('./components/provider-information', () => ({ isOpen, onToggle }) => (
  <>
    <button
      type="button"
      onClick={() => onToggle({ id: 'providerShowProviderInformation' })}
    >
      ProviderInformation
    </button>
    {isOpen ? <span>content of ProviderInformation</span> : null}
  </>
));

jest.mock('./components/provider-settings', () => ({ isOpen }) => (isOpen ? (<span>content of ProviderSettings</span>) : null));

jest.mock('../../tags', () => ({ open }) => (open ? (<span>content of TagsAccordion</span>) : null));

const model = {
  id: '123356',
  name: 'API DEV GOVERNMENT CUSTOMER',
  packagesSelected: 151,
  packagesTotal: 151,
  isLoaded: true,
  isLoading: false,
  destroy: {
    timestamp: 0,
    isRejected: false,
    errors: [],
  },
  update: {
    timestamp: 0,
    isRejected: false,
    errors: [],
  },
  request: {
    timestamp: 0,
    isRejected: false,
    errors: [],
  },
};

const providerPackages = {
  errors: [],
  hasFailed: false,
  hasLoaded: true,
  isLoading: false,
  page: 1,
  items: [
    {
      id: 'package-id1',
      attributes: {
        name: 'package-name',
        isSelected: true,
        selectedCount: 10,
        titleCount: 100,
        visibilityData: {
          isHidden: true,
        },
        tags: {
          tagList: [],
        },
      },
      type: 'packages',
    },
  ],
  totalResults: 151,
};

describe('Given ProviderShow', () => {
  afterEach(cleanup);

  const renderProviderShow = (props = {}) => render(
    <Harness>
      <CommandList commands={defaultKeyboardShortcuts}>
        <ProviderShow
          fetchPackages={noop}
          onEdit={noop}
          updateFolioTags={noop}
          listType="package"
          model={model}
          providerPackages={providerPackages}
          proxyTypes={{}}
          rootProxy={{}}
          {...props}
        />
      </CommandList>
    </Harness>
  );

  it('should show pane title', () => {
    const { getAllByText } = renderProviderShow();

    expect(getAllByText('API DEV GOVERNMENT CUSTOMER')).toBeDefined();
  });

  it('should render correct link', () => {
    const { getByTestId } = renderProviderShow();

    expect(getByTestId('search-package-list-item-link')).toHaveAttribute('href', '/eholdings/packages/package-id1');
  });

  describe('when user has not edit permissions', () => {
    it('should not render edit button', () => {
      const stripes = buildStripes({
        hasPerm: () => false,
      });
      const { queryByTestId } = renderProviderShow({ stripes });

      expect(queryByTestId('provider-edit-link')).toBeNull();
    });
  });

  describe('when use collapse all shortcut', () => {
    it('should call expandAllFunction', async () => {
      const {
        getByTestId,
        queryByText,
      } = renderProviderShow();
      const testDiv = getByTestId('provider-content');

      collapseAllShortcut(testDiv);

      expect(queryByText('content of ProviderInformation')).toBeNull();
      expect(queryByText('content of ProviderSettings')).toBeNull();
      expect(queryByText('content of NotesSmartAccordion')).toBeNull();
      expect(queryByText('content of TagsAccordion')).toBeNull();
    });
  });

  describe('when click on "Collapse All', () => {
    it('should collapse all accordions', async () => {
      const {
        getByText,
        queryByText,
      } = renderProviderShow();

      fireEvent.click(getByText('stripes-components.collapseAll'));

      expect(queryByText('content of ProviderIncormation')).toBeNull();
      expect(queryByText('content of ProviderSettings')).toBeNull();
      expect(queryByText('content of NotesSmartAccordion')).toBeNull();
      expect(queryByText('content of TagsAccordion')).toBeNull();
    });
  });

  describe('when click on accordion header', () => {
    it('should close current accordion', () => {
      const {
        getByText,
        queryByText,
      } = renderProviderShow();

      fireEvent.click(getByText('ProviderInformation'));

      expect(queryByText('content of ProviderInformation')).toBeNull();
    });
  });

  describe('when record freshly saved', () => {
    it('should render toast notification', () => {
      const { getByText } = renderProviderShow({ isFreshlySaved: true });

      expect(getByText('ui-eholdings.provider.toast.isFreshlySaved')).toBeDefined();
    });
  });
});
