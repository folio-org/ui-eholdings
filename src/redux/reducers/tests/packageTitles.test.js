import packageTitlesReducer from '../packageTitles';
import {
  CLEAR_PACKAGE_TITLES,
  GET_PACKAGE_TITLES,
  GET_PACKAGE_TITLES_FAILURE,
  GET_PACKAGE_TITLES_SUCCESS,
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

describe('packageTitlesReducer', () => {
  it('should handle GET_PACKAGE_TITLES action', () => {
    const action = {
      type: GET_PACKAGE_TITLES,
      payload: { params: { page: 2 } },
    };

    expect(packageTitlesReducer(state, action)).toEqual({
      ...state,
      isLoading: true,
      page: 2,
    });
  });

  it('should handle GET_PACKAGE_TITLES_SUCCESS action', () => {
    const action = {
      type: GET_PACKAGE_TITLES_SUCCESS,
      payload: {
        data: ['item1', 'item2'],
        totalResults: 2,
      },
    };

    expect(packageTitlesReducer(state, action)).toEqual({
      ...state,
      hasLoaded: true,
      totalResults: 2,
      items: [...action.payload.data],
    });
  });

  it('should handle GET_PACKAGE_TITLES_FAILURE action', () => {
    const action = {
      type: GET_PACKAGE_TITLES_FAILURE,
      payload: ['error1'],
    };

    expect(packageTitlesReducer(state, action)).toEqual({
      ...state,
      hasFailed: true,
      errors: [{ title: 'error1' }],
    });
  });

  it('should handle CLEAR_PACKAGE_TITLES action', () => {
    const action = { type: CLEAR_PACKAGE_TITLES };

    expect(packageTitlesReducer(state, action)).toEqual({
      ...state,
      items: [],
      page: 1,
    });
  });

  describe('when handle other action', () => {
    const action = { type: 'OTHER_ACTION' };

    it('should return current state', () => {
      expect(packageTitlesReducer(state, action)).toEqual(state);
    });

    describe('when state is empty', () => {
      it('should return current state', () => {
        expect(packageTitlesReducer(null, action)).toEqual(state);
      });
    });
  });
});
