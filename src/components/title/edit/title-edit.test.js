import noop from 'lodash/noop';
import {
  render,
  cleanup,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import TitleEdit from './title-edit';
import Harness from '../../../../test/jest/helpers/harness';

const model = {
  contributors: [{
    type: 'author',
    contributor: 'Lorna Barrett',
  }],
  data: {
    id: '11067594',
    isLoading: true,
    isLoaded: true,
    isSaving: false,
    attributes: {},
  },
  description: '',
  edition: '',
  hasSelectedResources: true,
  id: '11067594',
  identifiers: {
    id: '978-0-425-28270-0',
    subtype: 'Print',
    type: 'ISBN',
  },
  isLoaded: true,
  isLoading: false,
  isPeerReviewed: false,
  isSelected: false,
  isTitleCustom: false,
  name: 'Title',
  publicationType: 'Book',
  publisherName: 'Name',
  update: {
    isPending: false,
  },
  request: {
    isRejected: false,
  },
};

const initialValues = {
  contributors: {
    contributor: 'Lorna Barrett',
    type: 'author',
  },
  description: '',
  edition: '',
  identifiers: [{
    id: '978-0-425-28270-0',
    flattenedType: 3,
  }, {
    id: '978-0-698-40632-2',
    flattenedType: 2,
  }],
  isPeerReviewed: false,
  name: 'Title Wave',
  publicationType: 'Book',
  publisherName: 'Berkley Books',
};

const updateRequest = {
  errors: [],
  isRejected: false,
  timestamp: 0,
};

jest.mock('../../navigation-modal', () => ({ when }) => (when ? <span>NavigationModal</span> : null));

const renderTitleEdit = (props = {}) => render(
  <Harness>
    <TitleEdit
      initialValues={initialValues}
      model={model}
      onCancel={noop}
      onSubmit={noop}
      updateRequest={updateRequest}
      {...props}
    />
  </Harness>
);

describe('Given TitleEdit', () => {
  afterEach(cleanup);

  it('should show cancel button', () => {
    const { getByText } = renderTitleEdit();

    expect(getByText('stripes-components.cancel')).toBeDefined();
  });

  it('should show save button', () => {
    const { getByText } = renderTitleEdit();

    expect(getByText('stripes-components.saveAndClose')).toBeDefined();
  });

  describe('when request has an error', () => {
    it('should show toast message', () => {
      const { getByText } = renderTitleEdit({
        updateRequest: {
          ...updateRequest,
          errors: [{ title: 'toast message' }],
        },
      });

      expect(getByText('toast message')).toBeDefined();
    });
  });

  describe('when click on close icon and form is not pristine', () => {
    it('should show navigation modal', () => {
      const {
        getByText,
        getByTestId,
        getAllByTestId,
      } = renderTitleEdit({
        updateRequest: {
          ...updateRequest,
          isResolved: false,
        },
      });

      fireEvent.change(getByTestId('publisher-name-field'), { target: { value: '123' } });
      fireEvent.click(getAllByTestId('close-details-view-button')[0]);

      expect(getByText('NavigationModal')).toBeDefined();
    });
  });
});
