import {
  render,
  cleanup,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import Harness from '../../../../../test/jest/helpers/harness';

import CoverageFields from './package-coverage-fields';

describe('Given CoverageFields', () => {
  const mockOnToggle = jest.fn();
  const mockOnSubmit = jest.fn();
  const defaultInitialValues = {
    customCoverages: [{
      beginCoverage: '2021-01-01',
      endCoverage: '2021-01-31',
    }],
  };

  const renderCoverageFields = ({
    initialValues = defaultInitialValues,
    ...props
  } = {}) => render(
    <Harness>
      <Form
        onSubmit={mockOnSubmit}
        initialValuesEqual={() => true}
        mutators={{ ...arrayMutators }}
        initialValues={initialValues}
        render={({ pristine, form: { reset } }) => (
          <form onSubmit={mockOnSubmit}>
            <CoverageFields
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
    mockOnToggle.mockClear();
    mockOnSubmit.mockClear();
  });

  it('should render coverage fields', () => {
    const { getByTestId } = renderCoverageFields();

    expect(getByTestId('coverage-field')).toBeDefined();
  });

  describe('when setting end coverage date before begin coverage', () => {
    it('should show validation error', () => {
      const {
        getByLabelText,
        getByText,
      } = renderCoverageFields();

      const endDateInput = getByLabelText('ui-eholdings.date.endDate');
      fireEvent.change(endDateInput, { target: { value: '01/01/2020' } });
      endDateInput.blur();

      expect(getByText('ui-eholdings.validate.errors.dateRange.startDateBeforeEndDate')).toBeDefined();
    });
  });

  describe('when clicking add range button', () => {
    it('should add a field', () => {
      const {
        getByText,
        getByTestId,
      } = renderCoverageFields({
        initialValues: {
          customCoverages: [],
        },
      });

      fireEvent.click(getByText('ui-eholdings.package.coverage.addDateRange'));

      expect(getByTestId('coverage-field')).toBeDefined();
    });
  });
});
