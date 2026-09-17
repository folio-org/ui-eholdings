import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import { Form } from 'react-final-form';

import { PackageAccess } from './package-access';

describe('Given PackageAccess', () => {
  const renderPackageAccess = (props = {}) => render(
    <Form
      onSubmit={() => {}}
      initialValues={{ isFreeAccess: true }}
      render={() => (
        <PackageAccess
          {...props}
        />
      )}
    />
  );

  it('should display a legend headline', () => {
    const { getByText } = renderPackageAccess();

    expect(getByText('ui-eholdings.package.packageAccess')).toBeDefined();
  });

  it('should display a `public` radio button', () => {
    const { getByRole } = renderPackageAccess();

    expect(getByRole('radio', { name: 'ui-eholdings.package.public' })).toBeDefined();
  });

  it('should display a `controlled` radio button', () => {
    const { getByRole } = renderPackageAccess();

    expect(getByRole('radio', { name: 'ui-eholdings.package.controlled' })).toBeDefined();
  });

  describe('when selecting a radio button', () => {
    it('should store `true` in the form in case of a selected `public` option', () => {
      const {
        getByTestId,
        getByRole,
      } = renderPackageAccess();

      const fieldset = getByTestId('package-access-fieldset');
      const publicRadioButton = getByRole('radio', { name: 'ui-eholdings.package.public' });

      fireEvent.click(publicRadioButton);

      expect(publicRadioButton).toBeChecked();
      expect(fieldset).toHaveFormValues({
        isFreeAccess: 'true',
      });
    });

    it('should store `false` in the form in case of a selected `controlled` option', () => {
      const {
        getByTestId,
        getByRole,
      } = renderPackageAccess();

      const fieldset = getByTestId('package-access-fieldset');
      const controlledRadioButton = getByRole('radio', { name: 'ui-eholdings.package.controlled' });

      fireEvent.click(controlledRadioButton);

      expect(controlledRadioButton).toBeChecked();
      expect(fieldset).toHaveFormValues({
        isFreeAccess: 'false',
      });
    });
  });
});
