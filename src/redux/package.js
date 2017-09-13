import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import {
  createRequestCreator,
  createRequestReducer,
  createRequestEpic
} from './request';

// package action creators
export const getPackage = createRequestCreator('package');
export const getPackageTitles = createRequestCreator('package-titles');

// package reducer
export const packageReducer = combineReducers({
  record: createRequestReducer({
    name: 'package',
    initialContent: {}
  }),
  titles: createRequestReducer({
    name: 'package-titles',
    initialContent: []
  })
});

// package epics
export const packageEpics = combineEpics(
  createRequestEpic({
    name: 'package',
    endpoint: ({ vendorId, packageId }) => (
      `eholdings/vendors/${vendorId}/packages/${packageId}`
    )
  }),
  createRequestEpic({
    name: 'package-titles',
    endpoint: ({ vendorId, packageId }) => (
      `eholdings/vendors/${vendorId}/packages/${packageId}/titles`
    ),
    deserialize: (payload) => payload && payload.titles,
    defaultParams: {
      search: '%00',
      searchfield: 'titlename',
      count: 25,
      offset: 1,
      orderby: 'relevance'
    }
  })
);
