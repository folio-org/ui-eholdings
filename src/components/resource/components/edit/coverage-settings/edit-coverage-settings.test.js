import {
  render,
  cleanup,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createFocusDecorator from 'final-form-focus';

import Harness from '../../../../../../test/jest/helpers/harness';
import getAxe from '../../../../../../test/jest/helpers/get-axe';
import { coverageStatementDecorator } from '../../../_fields/coverage-statement';
import EditCoverageSettings from './edit-coverage-settings';

jest.mock('../../../../coverage-date-list', () => () => <div>Coverage date list</div>);

const focusOnErrors = createFocusDecorator();
const axe = getAxe();

describe('Given EditCoverageSettings', () => {
  const handleSectionToggleMock = jest.fn();
  const onSubmitMock = jest.fn();
  const defaultModel = {
    package: {
      customCoverage: {
        beginCoverage: '2021-01-01',
        endCoverage: '2021-01-31',
      },
    },
    managedCoverages: [{
      beginCoverage: '2021-01-01',
      endCoverage: '2021-01-31',
    }],
    customCoverages: [{
      beginCoverage: '2021-02-01',
      endCoverage: '2021-02-25',
    }],
    managedEmbargoPeriod: {
      embargoUnit: 'day',
      embargoValue: '1',
    },
    isTitleCustom: false,
    coverageStatement: 'coverage statement',
    publicationType: 'book',
  };

  const renderCoverageSettings = (props = {}) => render(
    <Harness>
      <Form
        onSubmit={onSubmitMock}
        mutators={{
          ...arrayMutators,
          removeAll: ([name], state, { changeValue }) => {
            changeValue(state, name, () => ([]));
          },
        }}
        initialValuesEqual={() => true}
        decorators={[coverageStatementDecorator, focusOnErrors]}
        initialValues={{
          customEmbargoPeriod: [{
            embargoUnit: 'month',
            embargoValue: '1',
          }],
          customCoverages: (props.model || defaultModel).customCoverages,
        }}
        render={({ pristine, form: { reset } }) => (
          <form onSubmit={onSubmitMock}>
            <EditCoverageSettings
              isOpen
              model={defaultModel}
              resourceSelected
              getSectionHeader={() => 'Section label'}
              handleSectionToggle={handleSectionToggleMock}
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
    handleSectionToggleMock.mockClear();
  });

  it('should have no a11y issues', async () => {
    const { container } = renderCoverageSettings();
    const a11yResults = await axe.run(container);

    expect(a11yResults.violations.length).toEqual(0);
  });

  it('should render an accordion', () => {
    const { getByText } = renderCoverageSettings();

    expect(getByText('Section label')).toBeDefined();
  });

  it('should render CoverageDateList', () => {
    const { getAllByText } = renderCoverageSettings();

    expect(getAllByText('Coverage date list')).toBeDefined();
  });

  describe('when resource is not selected', () => {
    it('should render message', () => {
      const { getByText } = renderCoverageSettings({
        resourceSelected: false,
      });

      expect(getByText('ui-eholdings.resource.coverage.notSelected')).toBeDefined();
    });
  });

  describe('when there are no coverage dates', () => {
    it('should not render coverage date list', () => {
      const { queryByText } = renderCoverageSettings({
        model: {
          ...defaultModel,
          customCoverages: [],
          managedCoverages: [],
        },
      });

      expect(queryByText('Coverage date list')).toBeNull();
    });
  });

  describe('when editing and saving coverage dates', () => {
    it('should call onSubmit', () => {
      const {
        getByLabelText,
        getByText,
      } = renderCoverageSettings();

      const startDateInput = getByLabelText('ui-eholdings.date.startDate');
      const endDateInput = getByLabelText('ui-eholdings.date.endDate');

      fireEvent.change(startDateInput, { target: { value: '01/01/2021' } });
      fireEvent.change(endDateInput, { target: { value: '01/21/2021' } });
      fireEvent.blur(endDateInput);
      fireEvent.click(getByText('Submit'));

      expect(onSubmitMock).toBeCalled();
    });
  });

  describe('when setting incorrect coverage dates', () => {
    it('should show error message', () => {
      const {
        getByLabelText,
        getByText,
      } = renderCoverageSettings();

      const startDateInput = getByLabelText('ui-eholdings.date.startDate');
      const endDateInput = getByLabelText('ui-eholdings.date.endDate');

      fireEvent.change(startDateInput, { target: { value: '01/21/2021' } });
      fireEvent.change(endDateInput, { target: { value: '01/01/2021' } });
      fireEvent.blur(endDateInput);

      expect(getByText('ui-eholdings.validate.errors.dateRange.startDateBeforeEndDate')).toBeDefined();
    });
  });
});
