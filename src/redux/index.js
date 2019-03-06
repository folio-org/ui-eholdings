import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import Resolver from './resolver';
import ProviderModel from './provider';
import PackageModel from './package';
import TitleModel from './title';
import ResourceModel from './resource';
import TagModel from './tag';

import {
  Status as StatusModel,
  Configuration as ConfigurationModel,
  ProxyType as ProxyTypeModel,
  RootProxy as RootProxyModel
} from './application';

import {
  reducer as dataReducer,
  epic as dataEpic,
} from './data';

import agreementsReducer from './reducers';

import {
  getAgreementsEpic,
  attachAgreementEpic,
} from './epics';

export const createResolver = (state) => {
  return new Resolver(state, [
    ProviderModel,
    PackageModel,
    TitleModel,
    ResourceModel,
    StatusModel,
    ConfigurationModel,
    ProxyTypeModel,
    RootProxyModel,
    TagModel,
  ]);
};

export const reducer = combineReducers({
  data: (state = {}, action) => {
    return {
      ...dataReducer(state, action),
      agreements: agreementsReducer(state.agreements, action),
    };
  }
});

export const epics = combineEpics(
  dataEpic,
  getAgreementsEpic,
  attachAgreementEpic,
);
