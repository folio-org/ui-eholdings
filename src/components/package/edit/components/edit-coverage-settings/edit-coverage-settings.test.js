import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import Harness from '../../../../../../test/jest/helpers/harness';

import EditCoverageSettings from './edit-coverage-settings';

describe('Given EditCoverageSettings', () => {
  const mockOnToggle = jest.fn();
  const mockOnSubmit = jest.fn();

  const renderCoverageSettings = (props = {}) => render(
    <Harness>
      <Form
        onSubmit={mockOnSubmit}
        initialValuesEqual={() => true}
        mutators={{ ...arrayMutators }}
        initialValues={{
          customCoverages: [{
            beginCoverage: '2021-01-01',
            endCoverage: '2021-01-31',
          }],
        }}
        render={({ pristine, form: { reset } }) => (
          <form onSubmit={mockOnSubmit}>
            <EditCoverageSettings
              isOpen
              onToggle={mockOnToggle}
              getSectionHeader={() => 'Coverage settings'}
              packageSelected
              initialValues={{
                customCoverages: [{
                  beginCoverage: '2021-01-01',
                  endCoverage: '2021-01-31',
                }],
              }}
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

  it('should render an accordion', () => {
    const { getByText } = renderCoverageSettings();

    expect(getByText('Coverage settings')).toBeDefined();
  });

  describe('when package is not selected', () => {
    it('should render message', () => {
      const { getByText } = renderCoverageSettings({
        packageSelected: false,
        packageIsCustom: true,
      });

      expect(getByText('ui-eholdings.package.customCoverage.notSelected')).toBeDefined();
    });
  });
});
