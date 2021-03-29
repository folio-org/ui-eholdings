import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  render,
  cleanup,
} from '@testing-library/react';

import noop from 'lodash/noop';

import ProviderShow from './provider-show';


jest.mock('../../query-list', () => (<span>Query list</span>));

const renderProviderShow = (props = {}) => render(
  <MemoryRouter>
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
  </MemoryRouter>
);

describe('Given ProviderShow', () => {
  let component;

  afterEach(() => {
    cleanup();
  });

  it('should show pane title', () => {
    component = renderProviderShow();

    expect(component.getByText('API DEV GOVERNMENT CUSTOMER')).toBeDefined();
  });
});
