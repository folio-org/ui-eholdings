import { handleActions } from 'redux-actions';
import queryString from 'query-string';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/catch';
import merge from 'lodash/merge';

// action types
const EHOLDINGS_SEARCH = 'EHOLDINGS_SEARCH';
const EHOLDINGS_SEARCH_RESOLVE = 'EHOLDINGS_SEARCH_RESOLVE';
const EHOLDINGS_SEARCH_ERRORED = 'EHOLDINGS_SEARCH_ERRORED';

// action creators
export const searchHoldings = (searchType, query, options) => ({
  type: EHOLDINGS_SEARCH,
  searchType,
  query,
  options
});

// initial state for each search type
const initialSearchState = {
  query: {},
  isLoading: false,
  isErrored: false,
  records: [],
  error: null
};

// reducer
export const searchReducer = handleActions({
  [EHOLDINGS_SEARCH]: (state, action) => ({
    ...state,
    [action.searchType]: {
      ...state[action.searchType],
      query: action.query,
      isLoading: true,
      isErrored: false,
      error: null
    }
  }),
  [EHOLDINGS_SEARCH_RESOLVE]: (state, action) => ({
    ...state,
    [action.searchType]: {
      ...state[action.searchType],
      isLoading: false,
      records: action.payload
    }
  }),
  [EHOLDINGS_SEARCH_ERRORED]: (state, action) => ({
    ...state,
    [action.searchType]: {
      ...state[action.searchType],
      isLoading: false,
      isErrored: true,
      error: action.error
    }
  })
}, {
  vendors: merge({}, initialSearchState),
  packages: merge({}, initialSearchState),
  titles: merge({}, initialSearchState)
});

// search epic
export function searchEpic(action$, { getState }) {
  return action$.ofType(EHOLDINGS_SEARCH)
    .switchMap((action) => {
      const { okapi } = getState();
      const { searchType, query, options } = action;
      const { endpoint, defaults, recordsKey = searchType } = options;

      const searchQuery = { ...defaults, ...query };
      const url = `${okapi.url}/${endpoint}?${queryString.stringify(searchQuery)}`;
      const request = fetch(url, { headers: { 'X-Okapi-Tenant': okapi.tenant }});

      return Observable.from(request.then((res) => res.json())).pluck(recordsKey)
        .map((payload) => ({ type: EHOLDINGS_SEARCH_RESOLVE, searchType, payload }))
        .catch((error) => Observable.of({ type: EHOLDINGS_SEARCH_ERRORED, searchType, error }));
    });
}
