import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import { PackageUrl } from './package-url';
import Harness from '../../../../../test/jest/helpers/harness';

const mockOnSubmit = jest.fn();

const renderPackageUrl = () => render(
  <Harness>
    <Form
      onSubmit={mockOnSubmit}
      mutators={{ ...arrayMutators }}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <PackageUrl />
        </form>
      )}
    />
  </Harness>
);

describe('Given PackageUrls', () => {
  describe('when a URL exceeds the maximum length', () => {
    it('should display the length validation error', () => {
      const { getByRole, getByText } = renderPackageUrl();

      const input = getByRole('textbox', { name: 'ui-eholdings.label.packageUrl' });

      fireEvent.change(input, { target: { value: 'a'.repeat(501) } });
      fireEvent.blur(input);

      expect(getByText('ui-eholdings.validate.errors.customPackage.packageUrl.length')).toBeDefined();
    });
  });

  describe('when a URL length is less than maximum length', () => {
    it('should not display the length validation error', () => {
      const { getByRole, queryByText } = renderPackageUrl();

      const input = getByRole('textbox', { name: 'ui-eholdings.label.packageUrl' });

      fireEvent.change(input, { target: { value: 'a'.repeat(300) } });
      fireEvent.blur(input);

      expect(queryByText('ui-eholdings.validate.errors.customPackage.packageUrl.length')).toBeNull();
    });
  });
});
