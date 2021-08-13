import providerPackagesReducer from '../providerPackages';
import {
  CLEAR_PROVIDER_PACKAGES,
  GET_PROVIDER_PACKAGES,
  GET_PROVIDER_PACKAGES_FAILURE,
  GET_PROVIDER_PACKAGES_SUCCESS,
} from '../../actions';

const state = {
  isLoading: false,
  hasLoaded: false,
  hasFailed: false,
  items: [],
  errors: [],
  totalResults: 0,
  page: 1,
};

describe('providerPackagesReducer', () => {
  it('should handle GET_PROVIDER_PACKAGES action', () => {
    const action = {
      type: GET_PROVIDER_PACKAGES,
      payload: { params: { page: 2 } },
    };

    expect(providerPackagesReducer(state, action)).toEqual({
      ...state,
      isLoading: true,
      page: 2,
    });
  });

  it('should handle GET_PROVIDER_PACKAGES_SUCCESS action', () => {
    const action = {
      type: GET_PROVIDER_PACKAGES_SUCCESS,
      payload: {
        data: ['item1', 'item2'],
        totalResults: 2,
      },
    };

    expect(providerPackagesReducer(state, action)).toEqual({
      ...state,
      hasLoaded: true,
      totalResults: 2,
      items: action.payload.data,
    });
  });

  it('should handle GET_PROVIDER_PACKAGES_FAILURE action', () => {
    const action = {
      type: GET_PROVIDER_PACKAGES_FAILURE,
      payload: ['error1'],
    };

    expect(providerPackagesReducer(state, action)).toEqual({
      ...state,
      hasFailed: true,
      errors: [{ title: 'error1' }],
    });
  });

  it('should handle CLEAR_PROVIDER_PACKAGES action', () => {
    const action = { type: CLEAR_PROVIDER_PACKAGES };

    expect(providerPackagesReducer(state, action)).toEqual({
      ...state,
      items: [],
      page: 1,
    });
  });

  describe('when handle other action', () => {
    const action = { type: 'OTHER_ACTION' };

    it('should return current state', () => {
      expect(providerPackagesReducer(state, action)).toEqual(state);
    });

    describe('when state is empty', () => {
      it('should return current state', () => {
        expect(providerPackagesReducer(null, action)).toEqual(state);
      });
    });
  });
});
