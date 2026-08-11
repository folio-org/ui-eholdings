import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import { DisplayName } from './display-name';
import Harness from '../../../../../test/jest/helpers/harness';

const mockOnSubmit = jest.fn();

const renderDisplayName = () => render(
  <Harness>
    <Form
      onSubmit={mockOnSubmit}
      mutators={{ ...arrayMutators }}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <DisplayName />
        </form>
      )}
    />
  </Harness>
);

describe('Given CustomAlternateNames', () => {
  describe('when a name exceeds the maximum length', () => {
    it('should display the length validation error', () => {
      const { getByRole, getByText } = renderDisplayName();

      const input = getByRole('textbox', { name: 'ui-eholdings.label.displayName' });

      fireEvent.change(input, { target: { value: 'a'.repeat(301) } });
      fireEvent.blur(input);

      expect(getByText('ui-eholdings.validate.errors.package.displayName.length')).toBeDefined();
    });
  });

  describe('when a name length is less than maximum length', () => {
    it('should not display the length validation error', () => {
      const { getByRole, queryByText } = renderDisplayName();

      const input = getByRole('textbox', { name: 'ui-eholdings.label.displayName' });

      fireEvent.change(input, { target: { value: 'a'.repeat(300) } });
      fireEvent.blur(input);

      expect(queryByText('ui-eholdings.validate.errors.package.displayName.length')).toBeNull();
    });
  });
});
