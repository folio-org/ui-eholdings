import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import {
  applicationReducer,
  applicationEpics
} from './application';

import {
  searchReducer,
  searchEpic
} from './search';
import {
  vendorReducer,
  vendorEpics
} from './vendor';
import {
  packageReducer,
  packageEpics
} from './package';
import {
  titleReducer,
  titleEpic
} from './title';
import {
  customerResourceReducer,
  customerResourceEpics
} from './customer-resource';

export const reducer = combineReducers({
  application: applicationReducer,
  search: searchReducer,
  vendor: vendorReducer,
  package: packageReducer,
  title: titleReducer,
  customerResource: customerResourceReducer
});

export const epics = combineEpics(
  applicationEpics,
  searchEpic,
  vendorEpics,
  packageEpics,
  titleEpic,
  customerResourceEpics
);
