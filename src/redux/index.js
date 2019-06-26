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

import agreements from './reducers';

import {
  createGetAgreementsEpic,
  createAttachAgreementEpic,
} from './epics';

import agreementsApi from '../api/agreements';

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
  data: (state, action) => {
    const currentState = state || {};

    return {
      ...dataReducer(currentState, action),
      agreements: agreements(currentState.agreements, action),
    };
  }
});

export const epics = combineEpics(
  dataEpic,
  createGetAgreementsEpic({ agreementsApi }),
  createAttachAgreementEpic({ agreementsApi }),
);
