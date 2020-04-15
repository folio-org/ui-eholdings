import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import {
  agreementsApi,
  customLabelsApi,
  accessTypesApi,
  knowledgeBaseApi,
  kbCredentialsUsersApi,
  rootProxyApi,
  proxyTypesApi,
} from '../api';

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
  RootProxy as RootProxyModel,
  AccessType as AccessTypeModel,
} from './application';

import {
  reducer as dataReducer,
  epic as dataEpic,
} from './data';

import {
  agreements,
  customLabels,
  accessTypes,
  kbCredentials,
  rootProxy,
  proxyTypes,
  kbCredentialsUsers,
} from './reducers';

import {
  updateEntityTags,
  createGetAgreementsEpic,
  createAttachAgreementEpic,
  createGetCustomLabelsEpic,
  createUpdateCustomLabelsEpic,
  createGetAccessTypesEpic,
  createAttachAccessTypeEpic,
  createDeleteAccessTypeEpic,
  createUpdateAccessTypeEpic,
  createGetKbCredentialsEpic,
  createPostKbCredentialsEpic,
  createPutKbCredentialsEpic,
  createDeleteKbCredentialsEpic,
  createGetKbCredentialsUsersEpic,
  createDeleteKbCredentialsUsersEpic,
  createPostKbCredentialsUserEpic,
  createGetRootProxyEpic,
  createUpdateRootProxyEpic,
  createGetProxyTypesEpic,
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
    AccessTypeModel,
  ]);
};

export const reducer = combineReducers({
  data: (state, action) => {
    const currentState = state || {};

    return {
      ...dataReducer(currentState, action),
      agreements: agreements(currentState.agreements, action),
      customLabels: customLabels(currentState.customLabels, action),
      accessStatusTypes: accessTypes(currentState.accessStatusTypes, action),
      kbCredentials: kbCredentials(currentState.kbCredentials, action),
      kbCredentialsUsers: kbCredentialsUsers(currentState.kbCredentialsUsers, action),
      settingsRootProxy: rootProxy(currentState.settingsRootProxy, action),
      settingsProxyTypes: proxyTypes(currentState.settingsProxyTypes, action),
    };
  }
});

export const epics = combineEpics(
  dataEpic,
  updateEntityTags,
  createGetAgreementsEpic({ agreementsApi }),
  createAttachAgreementEpic({ agreementsApi }),
  createGetCustomLabelsEpic({ customLabelsApi }),
  createUpdateCustomLabelsEpic({ customLabelsApi }),
  createGetAccessTypesEpic({ accessTypesApi }),
  createAttachAccessTypeEpic({ accessTypesApi }),
  createDeleteAccessTypeEpic({ accessTypesApi }),
  createUpdateAccessTypeEpic({ accessTypesApi }),
  createGetKbCredentialsEpic({ knowledgeBaseApi }),
  createPostKbCredentialsEpic({ knowledgeBaseApi }),
  createPutKbCredentialsEpic({ knowledgeBaseApi }),
  createDeleteKbCredentialsEpic({ knowledgeBaseApi }),
  createGetKbCredentialsUsersEpic({ kbCredentialsUsersApi }),
  createDeleteKbCredentialsUsersEpic({ kbCredentialsUsersApi }),
  createPostKbCredentialsUserEpic({ kbCredentialsUsersApi }),
  createGetRootProxyEpic({ rootProxyApi }),
  createUpdateRootProxyEpic({ rootProxyApi }),
  createGetProxyTypesEpic({ proxyTypesApi }),
);
