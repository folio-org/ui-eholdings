import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import {
  searchReducer,
  searchEpic
} from './search';

export const reducer = combineReducers({
  search: searchReducer
});

export const epics = combineEpics(
  searchEpic
);
