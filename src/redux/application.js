import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import {
  REQUEST_RESOLVE,
  REQUEST_REJECT,
  createRequestReducer,
  createRequestEpic,
  createRequestCreator
} from './request';

export const getBackendStatus = createRequestCreator('backend-status');
export const getBackendConfig = createRequestCreator('backend-configuration');
export const updateBackendConfig = createRequestCreator(
  'update-backend-configuration',
  { method: 'PUT' }
);

export const applicationReducer = combineReducers({
  status: createRequestReducer({
    name: 'backend-status',
    initialContent: {}
  }),
  config: createRequestReducer({
    name: 'backend-configuration',
    initialContent: {},
    handleRequests: {
      'update-backend-configuration': (state, action) => {
        if (action.type === REQUEST_RESOLVE) {
          return {
            ...state,
            content: {
              ...state.content,
              ...action.payload
            }
          };
        } else {
          return state;
        }
      }
    }
  }),
  update: createRequestReducer({
    name: 'update-backend-configuration',
    handleRequests: {
      'update-backend-configuration': (state, action) => {
        if (action.type === REQUEST_REJECT) {
          let errors = action.error.errors;
          let message = errors != null ? errors[0].detail : 'there was a server error while attempting to update the config';
          return {
            ...state,
            message
          };
        } else {
          return state;
        }
      }
    }
  })
});

export const applicationEpics = combineEpics(
  createRequestEpic({
    name: 'backend-status',
    endpoint: 'eholdings/status',
    // TODO: generic JSON deserialization
    deserialize: ({ data: { attributes } }) => ({ ...attributes })
  }),
  createRequestEpic({
    name: 'backend-configuration',
    endpoint: 'eholdings/configuration',
    // TODO: generic JSON deserialization
    deserialize: ({ data: { attributes } }) => ({ ...attributes })
  }),
  createRequestEpic({
    name: 'update-backend-configuration',
    endpoint: 'eholdings/configuration',
    // TODO: generic JSON serialization & deserialization
    deserialize: ({ data: { attributes } }) => ({ ...attributes }),
    serialize: ({ customerId, apiKey }) => ({
      data: {
        type: 'configurations',
        attributes: {
          customerId,
          apiKey
        }
      }
    })
  })
);
