import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import {
  searchReducer,
  searchEpic
} from './search';
import {
  customerResourceReducer,
  customerResourceEpics
} from './customer-resource';

export const reducer = combineReducers({
  search: searchReducer,
  customerResource: customerResourceReducer
});

export const epics = combineEpics(
  searchEpic,
  customerResourceEpics
);
