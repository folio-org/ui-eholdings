import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import {
  REQUEST_MAKE,
  REQUEST_REJECT,
  createRequestCreator,
  createRequestReducer,
  createRequestEpic
} from './request';
import formatContentType from './utilities';

// package action creators
export const getPackage = createRequestCreator('package');
export const getPackageTitles = createRequestCreator('package-titles');
export const toggleIsSelected = createRequestCreator(
  'package-toggle-selected',
  { method: 'PUT' }
);

// package reducer
export const packageReducer = combineReducers({
  record: createRequestReducer({
    name: 'package',
    initialContent: {},
    handleRequests: {
      'package-toggle-selected': (state, action) => {
        if (action.type === REQUEST_MAKE || action.type === REQUEST_REJECT) {
          return {
            ...state,
            content: {
              ...state.content,
              isSelected: !state.content.isSelected
            }
          };
        } else {
          return {
            ...state,
            content: {
              ...state.content,
              selectedCount: state.content.isSelected ? state.content.titleCount : 0
            }
          };
        }
      }
    }
  }),
  titles: createRequestReducer({
    name: 'package-titles',
    initialContent: []
  }),
  toggle: createRequestReducer({
    name: 'package-toggle-selected'
  })
});

// package endpoint generator
const getPackageEndpoint = ({ vendorId, packageId }) => (
  `eholdings/vendors/${vendorId}/packages/${packageId}`
);

// package epics
export const packageEpics = combineEpics(
  createRequestEpic({
    name: 'package',
    endpoint: getPackageEndpoint,
    deserialize: (payload) => {
      if (payload.contentType) {
        payload.contentType = formatContentType(payload.contentType);
      }
      return payload;
    }
  }),
  createRequestEpic({
    name: 'package-titles',
    endpoint: ({ vendorId, packageId }) => (
      `eholdings/vendors/${vendorId}/packages/${packageId}/titles`
    ),
    deserialize: payload => payload && payload.titles,
    defaultParams: {
      search: '',
      searchfield: 'titlename',
      count: 25,
      offset: 1,
      orderby: 'TitleName'
    }
  }),
  createRequestEpic({
    name: 'package-toggle-selected',
    endpoint: getPackageEndpoint,
    serialize: ({ isSelected }) => ({ isSelected })
  })
);
