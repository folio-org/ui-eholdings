import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import {
  createRequestCreator,
  createRequestReducer,
  createRequestEpic
} from './request';

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
    endpoint: ({ vendorId }) => `eholdings/vendors/${vendorId}`
  }),
  createRequestEpic({
    name: 'vendor-packages',
    endpoint: ({ vendorId }) => `eholdings/vendors/${vendorId}/packages`,
    normalize: (payload) => payload ? payload.packagesList : [],
    defaultParams: {
      search: '%00',
      count: 25,
      offset: 1,
      orderby: 'relevance'
    }
  })
);
