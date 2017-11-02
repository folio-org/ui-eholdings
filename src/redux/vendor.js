import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import {
  createRequestCreator,
  createRequestReducer,
  createRequestEpic
} from './request';
import { normalizeJsonApiResource } from './utilities';

// vendor action creators
export const getVendor = createRequestCreator('vendor');
export const getVendorPackages = createRequestCreator('vendor-packages');

// vendor reducer
export const vendorReducer = combineReducers({
  record: createRequestReducer({
    name: 'vendor',
    initialContent: {}
  }),
  packages: createRequestReducer({
    name: 'vendor-packages',
    initialContent: []
  })
});

// vendor epics
export const vendorEpics = combineEpics(
  createRequestEpic({
    name: 'vendor',
    endpoint: ({ vendorId }) => `eholdings/jsonapi/vendors/${vendorId}`,
    deserialize: payload => (payload ? normalizeJsonApiResource(payload.data) : [])
  }),
  createRequestEpic({
    name: 'vendor-packages',
    endpoint: ({ vendorId }) => `eholdings/vendors/${vendorId}/packages`,
    deserialize: payload => (payload ? payload.packagesList : []),
    defaultParams: {
      search: '',
      count: 25,
      offset: 1,
      orderby: 'PackageName'
    }
  })
);
