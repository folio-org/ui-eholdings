import _ from 'lodash';
import { handleActions } from 'redux-actions';
import { ActionTypes } from './action-types';

/*
 * NOTE: i'm thinking we have one reducer per resource. we
 * can add more reducers to the hash in `handleActions` for actions
 * related to customerResource.  If we need multiple resources for a page,
 * we can use `combineReducers` to create a reducer for a whole page,
 * i.e. `customerResourceShowReducer`.  It might be even nicer to
 * wrap these in some kind of class...
*/

const initialState = {
  isLoaded: false,
  isErrored: false
};

const customerResourceReducer = handleActions({
  [ActionTypes.CUSTOMER_RESOURCE_SHOW_LOADED]: (state, action) => {
    let title = action.payload;
    let customerResource = title.customerResourcesList[0];
    let data = {
      isLoaded: true,
      isErrored: false,
      titleId: title.titleId,
      titleName: title.titleName,
      url: customerResource.url,
      isSelected: customerResource.isSelected,
      id: customerResource.id,
      packageName: customerResource.packageName,
      vendorId: customerResource.vendorId,
      vendorName: customerResource.vendorName,
      packageId: customerResource.packageId,
    }

    return _.assign({}, state, data)
  },
  [ActionTypes.CUSTOMER_RESOURCE_SHOW_ERROR]: (state, action) => {
    return _.assign({}, state, {isErrored: action.error})
  }
}, initialState);

export default customerResourceReducer;
