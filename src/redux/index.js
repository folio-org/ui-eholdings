import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import Resolver from './resolver';
import VendorModel from './vendor';
import PackageModel from './package';
import TitleModel from './title';
import CustomerResourceModel from './customer-resource';
import {
  Status as StatusModel,
  Configuration as ConfigurationModel
} from './application';

import {
  reducer as dataReducer,
  epic as dataEpic
} from './data';

export const createResolver = (state) => {
  return new Resolver(state, [
    VendorModel,
    PackageModel,
    TitleModel,
    CustomerResourceModel,
    StatusModel,
    ConfigurationModel
  ]);
};

export const reducer = combineReducers({
  data: dataReducer
});

export const epics = combineEpics(
  dataEpic
);
