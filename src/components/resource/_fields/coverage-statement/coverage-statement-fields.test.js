import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import { Form } from 'react-final-form';

import CoverageStatementFields from './coverage-statement-fields';

describe('Given CoverageStatementFields', () => {
  const renderCoverageStatementFields = (props = {}) => render(
    <Form
      onSubmit={() => {}}
      render={() => (
        <CoverageStatementFields
          ariaLabelledBy="test-label"
          coverageDates={<div>Coverage dates</div>}
          {...props}
        />
      )}
    />
  );

  it('should render the CoverageStatementFields component', () => {
    const { getByTestId } = renderCoverageStatementFields();

    expect(getByTestId('coverage-statement')).toBeDefined();
  });

  it('should display the dates radio button', () => {
    const { getByRole } = renderCoverageStatementFields();

    expect(getByRole('radio', { name: 'ui-eholdings.label.dates' })).toBeDefined();
  });

  it('should display the coverage statement radio button', () => {
    const { getByRole } = renderCoverageStatementFields();

    expect(getByRole('radio', { name: 'ui-eholdings.label.coverageStatement' })).toBeDefined();
  });

  it('should display passed coverage dates', () => {
    const { getByText } = renderCoverageStatementFields();

    expect(getByText('Coverage dates')).toBeDefined();
  });

  it('should display the coverage statement textarea', () => {
    const { getByTestId } = renderCoverageStatementFields();

    expect(getByTestId('coverage-statement-textarea')).toBeDefined();
  });

  describe('when textarea input string has more then 350 characters', () => {
    it('should show corresponding validation message', () => {
      const {
        getByText,
        getByTestId,
      } = renderCoverageStatementFields();

      fireEvent.change(getByTestId('coverage-statement-textarea'), {
        target: {
          value: new Array(351).fill('a').join(),
        },
      });

      fireEvent.blur(getByTestId('coverage-statement-textarea'));

      expect(getByText('ui-eholdings.validate.errors.coverageStatement.length')).toBeDefined();
    });
  });

  describe('when selected coverage statement but no input string provided', () => {
    it('should show corresponding validation message', () => {
      const {
        getByText,
        getByTestId,
        getByRole,
      } = renderCoverageStatementFields();

      const coverageStatementRadioButton = getByRole('radio', { name: 'ui-eholdings.label.coverageStatement' });

      fireEvent.click(coverageStatementRadioButton);
      fireEvent.focus(getByTestId('coverage-statement-textarea'));
      fireEvent.blur(getByTestId('coverage-statement-textarea'));

      expect(getByText('ui-eholdings.validate.errors.coverageStatement.blank')).toBeDefined();
    });
  });
});
