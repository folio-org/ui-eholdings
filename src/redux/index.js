import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import {
  reducer as dataReducer,
  epic as dataEpic
} from './data';

export const reducer = combineReducers({
  data: dataReducer
});

export const epics = combineEpics(
  dataEpic
);
