import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import {
  REQUEST_MAKE,
  REQUEST_REJECT,
  createRequestCreator,
  createRequestReducer,
  createRequestEpic
} from './request';

// customer-resource action creators
export const getCustomerResource = createRequestCreator('customer-resource');
export const toggleIsSelected = createRequestCreator(
  'customer-resource-toggle-selected',
  { method: 'PUT' }
);

// customer-resource reducer
export const customerResourceReducer = combineReducers({
  record:  createRequestReducer({
    name: 'customer-resource',
    initialContent: {},
    handleRequests: {
      'customer-resource-toggle-selected': (state, action) => {
        if (action.type === REQUEST_MAKE || action.type === REQUEST_REJECT) {
          return {
            ...state,
            content: {
              ...state.content,
              isSelected: !state.content.isSelected
            }
          };
        } else {
          return state;
        }
      }
    }
  }),
  toggle: createRequestReducer({
    name: 'customer-resource-toggle-selected'
  })
});

// customer-resource endpoint generator
const getResourceEndpoint = ({ vendorId, packageId, titleId }) => (
  `eholdings/vendors/${vendorId}/packages/${packageId}/titles/${titleId}`
);

// customer-resource epics
export const customerResourceEpics = combineEpics(
  createRequestEpic({
    name: 'customer-resource',
    endpoint: getResourceEndpoint,
    normalize: (payload) => {
      if (payload) {
        let { customerResourcesList, ...title } = payload;

        return {
          ...title,
          ...customerResourcesList[0]
        };
      } else {
        return payload;
      }
    }
  }),
  createRequestEpic({
    name: 'customer-resource-toggle-selected',
    endpoint: getResourceEndpoint,
    serialize: ({ isSelected }) => ({ isSelected })
  })
);
