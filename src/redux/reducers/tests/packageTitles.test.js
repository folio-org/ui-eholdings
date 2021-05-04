import packageTitlesReducer from '../packageTitles';
import {
  CLEAR_PACKAGE_TITLES,
  GET_PACKAGE_TITLES,
  GET_PACKAGE_TITLES_FAILURE,
  GET_PACKAGE_TITLES_SUCCESS,
} from '../../actions';

const initialState = {
  isLoading: false,
  hasLoaded: false,
  hasFailed: false,
  items: [],
  errors: [],
  totalResults: 0,
};

describe('packageTitlesReducer', () => {
  it('should handle GET_PACKAGE_TITLES action', () => {
    const action = { type: GET_PACKAGE_TITLES };

    expect(packageTitlesReducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: true,
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

    expect(packageTitlesReducer(initialState, action)).toEqual({
      ...initialState,
      hasLoaded: true,
      totalResults: 2,
      items: [...initialState.items, ...action.payload.data],
    });
  });

  it('should handle GET_PACKAGE_TITLES_FAILURE action', () => {
    const action = {
      type: GET_PACKAGE_TITLES_FAILURE,
      payload: ['error1'],
    };

    expect(packageTitlesReducer(initialState, action)).toEqual({
      ...initialState,
      hasFailed: true,
      errors: [{ title: 'error1' }],
    });
  });

  it('should handle CLEAR_PACKAGE_TITLES action', () => {
    const action = { type: CLEAR_PACKAGE_TITLES };

    expect(packageTitlesReducer(initialState, action)).toEqual({
      ...initialState,
      items: [],
    });
  });
});
