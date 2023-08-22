import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import Harness from '../../../../../../test/jest/helpers/harness';

import EditPackageSettings from './edit-package-settings';

jest.mock('../../../../proxy-select', () => () => <div>Proxy select</div>);

describe('Given EditPackageSettings', () => {
  const mockOnToggle = jest.fn();
  const mockOnSubmit = jest.fn();
  const initialValues = {
    isVisible: true,
  };

  const renderEditPackageSettings = (props = {}) => render(
    <Harness>
      <Form
        onSubmit={mockOnSubmit}
        initialValuesEqual={() => true}
        mutators={{ ...arrayMutators }}
        initialValues={initialValues}
        render={({ pristine, form: { reset } }) => (
          <form onSubmit={mockOnSubmit}>
            <EditPackageSettings
              isOpen
              onToggle={mockOnToggle}
              getSectionHeader={() => 'Package settings'}
              packageSelected
              initialValues={initialValues}
              model={{
                visibilityData: {
                  isHidden: false,
                },
              }}
              proxyTypes={{
                request: {
                  isResolved: true,
                },
              }}
              provider={{
                data: {
                  isLoaded: true,
                },
                proxy: {},
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
    const { getByText } = renderEditPackageSettings();

    expect(getByText('Package settings')).toBeDefined();
  });

  describe('when package is not selected', () => {
    it('should render message', () => {
      const { getByText } = renderEditPackageSettings({
        packageSelected: false,
        packageIsCustom: true,
      });

      expect(getByText('ui-eholdings.package.packageSettings.notSelected')).toBeDefined();
    });
  });
});
