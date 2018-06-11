import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import Resolver from './resolver';
import ProviderModel from './provider';
import PackageModel from './package';
import TitleModel from './title';
import ResourceModel from './resource';
import {
  Status as StatusModel,
  Configuration as ConfigurationModel,
  ProxyType as ProxyTypeModel,
  RootProxy as RootProxyModel
} from './application';

import {
  reducer as dataReducer,
  epic as dataEpic
} from './data';

export const createResolver = (state) => {
  return new Resolver(state, [
    ProviderModel,
    PackageModel,
    TitleModel,
    ResourceModel,
    StatusModel,
    ConfigurationModel,
    ProxyTypeModel,
    RootProxyModel
  ]);
};

export const reducer = combineReducers({
  data: dataReducer
});

export const epics = combineEpics(
  dataEpic
);
