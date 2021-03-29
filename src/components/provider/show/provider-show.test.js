import React from 'react';
import noop from 'lodash/noop';
import {
  render,
  cleanup,
  fireEvent,
} from '@testing-library/react';

import ProviderShow from './provider-show';

import { buildStripes } from '../../../../test/jest/__mock__/stripesCore.mock';
import { collapseAllShortcut } from '../../../../test/jest/utilities';
import Harness from '../../../../test/jest/helpers/harness';

const mockExpandAllFunction = jest.fn();

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  expandAllFunction: mockExpandAllFunction,
}));

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  NotesSmartAccordion: ({ open }) => open ? (<span>NotesSmartAccordion</span>) : null,
}));

jest.mock('./components/provider-information', () => ({ open }) => open ? (<span>ProviderInformation</span>) : null);

jest.mock('./components/provider-settings', () => ({ open }) => open ? (<span>ProviderSettings</span>) : null);

jest.mock('../../query-list', () => () => (<span>QueryList</span>));

jest.mock('../../tags', () => ({ open }) => open ? (<span>TagsAccordion</span>) : null);

const renderProviderShow = (props = {}) => render(
  <Harness>
    <ProviderShow
      fetchPackages={noop}
      listType={'List type'}
      model={{
        id: '123356',
        data: {
          id: '123356',
          isLoading: false,
          isLoaded: true,
          isSaving: false,
          attributes: {
            name: 'API DEV GOVERNMENT CUSTOMER',
            packagesTotal: 151,
            packagesSelected: 151,
            supportsCustomPackages: true,
            proxy: {
              id: '<n>',
              inherited: true,
            },
            tags: {
              tagList: [],
            },
          },
          relationships: {
            packages: {
              data: [{
                type: 'packages',
                id: '123356-3319598',
              }, {
                type: 'packages',
                id: '123356-3509156',
              }],
              meta: {
                included: true,
              },
            },
          },
        },
        name: 'API DEV GOVERNMENT CUSTOMER',
        packagesSelected: 151,
        packagesTotal: 151,
        providerToken: {},
        proxy: null,
        tags: null,
        request: {
          timestamp: 0,
          type: 'find',
          params: {
            id: '123356',
          },
          isPending: false,
          isResolved: false,
          isRejected: false,
          records: [],
          meta: {},
          errors: [],
        },
        destroy: {
          timestamp: 0,
          type: 'destroy',
          params: {
            id: '123356',
          },
          isPending: false,
          isResolved: false,
          isRejected: false,
          records: [],
          meta: {},
          errors: [],
        },
        update: {
          timestamp: 0,
          type: 'update',
          params: {
            id: '123356',
          },
          isPending: false,
          isResolved: false,
          isRejected: false,
          records: [],
          meta: {},
          errors: [],
        },
        isLoaded: true,
        isLoading: false,
      }}
      onEdit={noop}
      packages={{
        type: 'packages',
        params: {
          filter: {},
          page: 1,
        },
        path: '/eholdings/providers/123356/packages',
        pages: [{
          records: [{
            id: '123356-3319598',
          }],
        }],
        records: [],
        pageSize: 25,
        currentPage: 1,
        key: 'packages::/eholdings/providers/123356/packages?',
      }}
      proxyTypes={{
        type: 'proxyTypes',
        params: {},
        path: '/eholdings/proxy-types',
        pages: [],
        records: [],
        pageSize: 25,
        currentPage: 1,
        key: 'proxyTypes::/eholdings/proxy-types?',
      }}
      rootProxy={{
        id: 'root-proxy',
        data: {
          id: 'root-proxy',
          isLoading: false,
          isLoaded: true,
          isSaving: false,
          attributes: {
            id: 'root-proxy',
            proxyTypeId: '<n>',
          },
          relationships: {},
        },
        proxyTypeId: '<n>',
      }}
      updateFolioTags={noop}
      {...props}
    />
  </Harness>
);

describe('Given ProviderShow', () => {
  let component;

  afterEach(() => {
    cleanup();
  });

  it('should show pane title', () => {
    component = renderProviderShow();

    expect(component.getAllByText('API DEV GOVERNMENT CUSTOMER')).toBeDefined();
  });

  it('should render QueryList', () => {
    component = renderProviderShow();

    expect(component.getByText('QueryList')).toBeDefined();
  });

  describe('when user has not edit permissions', () => {
    it('should not render edit button', () => {
      const stripes = buildStripes({
        hasPerm: () => false,
      });

      component = renderProviderShow({ stripes });

      expect(component.queryByTestId('provider-edit-link')).toBeNull();
    });
  });
/*
  describe('when use collapse all shortcut', () => {
    it('should call expandAllFunction', async () => {
      const { getByTestId } = renderProviderShow();
      const div = getByTestId('provider-content');

      collapseAllShortcut(div);

      expect(mockExpandAllFunction).toHaveBeenCalled();
    });
  });
*/
  describe('when click on "Collapse All', () => {
    it('should collapse all accordions', async () => {
      const {
        getByText,
        queryByText,
      } = renderProviderShow();
  
      fireEvent.click(getByText('stripes-components.collapseAll'));

      expect(queryByText('ProviderInformation')).toBeNull();
      expect(queryByText('ProviderSettings')).toBeNull();
      expect(queryByText('NotesSmartAccordion')).toBeNull();
      expect(queryByText('TagsAccordion')).toBeNull();
    });
  });
});
