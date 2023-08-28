import {
  render,
  cleanup,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import Harness from '../../../../../test/jest/helpers/harness';

import ResourceCoverageFields from './resource-coverage-fields';

describe('Given ResourceCoverageFields', () => {
  const onSubmitMock = jest.fn();

  const defaultModel = {
    package: {
      customCoverage: {
        beginCoverage: '2021-01-01',
      },
    },
    managedCoverages: [{
      beginCoverage: '2021-01-01',
      endCoverage: '2021-01-31',
    }],
    customCoverages: [{
      beginCoverage: '2021-02-01',
      endCoverage: '2021-02-21',
    }],
    publicationType: 'book',
    isTitleCustom: false,
  };

  const renderResourceCoverageFields = (props = {}) => render(
    <Harness>
      <Form
        onSubmit={onSubmitMock}
        mutators={{ ...arrayMutators }}
        initialValuesEqual={() => true}
        initialValues={{
          customCoverages: defaultModel.customCoverages,
        }}
        render={({ pristine, form: { reset } }) => (
          <form onSubmit={onSubmitMock}>
            <span id="label-text">Fields label</span>
            <ResourceCoverageFields
              model={defaultModel}
              {...props}
            />
            <button type="button" disabled={pristine} onClick={reset}>Cancel</button>
            <button type="submit" disabled={pristine}>Submit</button>
          </form>
        )}
      />
    </Harness>
  );

  afterEach(() => {
    cleanup();
    onSubmitMock.mockClear();
  });

  it('should render coverage fields', () => {
    const { getByTestId } = renderResourceCoverageFields();

    expect(getByTestId('resource-coverage-fields')).toBeDefined();
  });

  describe('when resource has custom coverages', () => {
    it('should render custom coverages select as checked', () => {
      const { getByLabelText } = renderResourceCoverageFields();

      expect(getByLabelText('ui-eholdings.label.edit.custom.coverageDates')).toBeChecked();
    });

    it('should render correct coverage field data', () => {
      const { getByLabelText } = renderResourceCoverageFields();

      expect(getByLabelText('ui-eholdings.date.startDate')).toHaveValue('02/01/2021');
      expect(getByLabelText('ui-eholdings.date.endDate')).toHaveValue('02/21/2021');
    });
  });

  describe('when clicking add a custom coverage', () => {
    it('should add a new custom coverage field', () => {
      const {
        getByText,
        getAllByTestId,
      } = renderResourceCoverageFields();

      fireEvent.click(getByText('ui-eholdings.package.coverage.addDateRange'));

      expect(getAllByTestId('coverage-field')).toHaveLength(2);
    });
  });

  describe('when resource title is custom', () => {
    it('should render custom coverage fields', () => {
      const { getByTestId } = renderResourceCoverageFields({
        model: {
          ...defaultModel,
          isTitleCustom: true,
        },
      });

      expect(getByTestId('coverage-field')).toBeDefined();
    });
  });
});
