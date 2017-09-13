import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import {
  REQUEST_MAKE,
  createRequestCreator,
  createRequestReducer,
  createRequestEpic
} from './request';

// search action creators
export const searchVendors = createRequestCreator('vendors-search');
export const searchPackages = createRequestCreator('packages-search');
export const searchTitles = createRequestCreator('titles-search');

// search specific reducer creator
function createSearchReducer(name) {
  name = `${name}-search`;

  return createRequestReducer({
    name,
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
  return createRequestEpic({
    name: `${name}-search`,
    endpoint: `eholdings/${name}`,
    normalize: (payload) => payload ? payload[recordsKey] || [] : [],
    defaultParams: {
      search: '',
      count: 25,
      offset: 1,
      orderby: 'relevance',
      ...defaultParams
    }
  });
}

// search epic
export const searchEpic = combineEpics(
  createSearchEpic('vendors'),
  createSearchEpic('packages', { recordsKey: 'packagesList' }),
  createSearchEpic('titles', { defaultParams: { searchfield: 'titlename' }})
);
