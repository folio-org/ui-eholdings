import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import Harness from '../../../../../../test/jest/helpers/harness';

import EditPackageInformation from './edit-package-information';

jest.mock('../../../../access-type-edit-section', () => () => <div>Access status types</div>);

describe('Given EditPackageInformation', () => {
  const mockOnToggle = jest.fn();
  const mockOnSubmit = jest.fn();

  const model = {
    name: 'Package name',
    contentType: 'book',
  };

  const renderEditPackageInformation = (props = {}) => render(
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
            <EditPackageInformation
              isOpen
              onToggle={mockOnToggle}
              getSectionHeader={() => 'Package information'}
              packageSelected
              initialValues={{
                customCoverages: [{
                  beginCoverage: '2021-01-01',
                  endCoverage: '2021-01-31',
                }],
              }}
              model={model}
              accessStatusTypes={{
                isDeleted: false,
                isLoading: false,
                items: {
                  data: [],
                },
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
    const { getByText } = renderEditPackageInformation();

    expect(getByText('Package information')).toBeDefined();
  });

  describe('when package is not selected', () => {
    it('should render name and content type as text', () => {
      const { getByText } = renderEditPackageInformation({
        packageSelected: false,
      });

      expect(getByText('Package name')).toBeDefined();
      expect(getByText('book')).toBeDefined();
    });
  });
});
