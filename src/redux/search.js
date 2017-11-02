import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import {
  REQUEST_MAKE,
  createRequestCreator,
  createClearRequestCreator,
  createRequestReducer,
  createRequestEpic
} from './request';
import { normalizeJsonApiResource } from './utilities';

// search action creators
export const searchVendors = createRequestCreator('vendors-search');
export const searchPackages = createRequestCreator('packages-search');
export const searchTitles = createRequestCreator('titles-search');
export const clearVendors = createClearRequestCreator('vendors-search');
export const clearPackages = createClearRequestCreator('packages-search');
export const clearTitles = createClearRequestCreator('titles-search');

// search specific reducer creator
function createSearchReducer(name) {
  return createRequestReducer({
    name: `${name}-search`,
    initialContent: [],
    initialState: {
      query: {}
    },
    handleActions: {
      [REQUEST_MAKE]: (state, action) => ({
        ...state,
        query: action.data
      })
    }
  });
}

// search reducer
export const searchReducer = combineReducers({
  vendors: createSearchReducer('vendors'),
  packages: createSearchReducer('packages'),
  titles: createSearchReducer('titles')
});

// search specific epic creator
function createSearchEpic(name, {
  recordsKey = name,
  defaultParams = {}
} = {}) {
  // TODO: when switching package and title search over to JSON API,
  // only use this version of return createRequestEpic()
  if (name === 'vendors') {
    return createRequestEpic({
      name: `${name}-search`,
      endpoint: 'eholdings/jsonapi/vendors',
      deserialize: payload => (payload ? payload.data.map(pkg => normalizeJsonApiResource(pkg)) || [] : []),
      defaultParams: {
        q: '',
        count: 25,
        offset: 1,
        orderby: 'relevance',
        ...defaultParams
      }
    });
  } else {
    return createRequestEpic({
      name: `${name}-search`,
      endpoint: `eholdings/${name}`,
      deserialize: payload => (payload ? payload[recordsKey] || [] : []),
      defaultParams: {
        search: '',
        count: 25,
        offset: 1,
        orderby: 'relevance',
        ...defaultParams
      }
    });
  }
}

// search epic
export const searchEpic = combineEpics(
  createSearchEpic('vendors'),
  createSearchEpic('packages', { recordsKey: 'packagesList' }),
  createSearchEpic('titles', { defaultParams: { searchfield: 'TitleName' } })
);
