import { Form } from 'react-final-form';
import { fireEvent, render } from '@folio/jest-config-stripes/testing-library/react';

import PackageNameField from './package-name-field';

describe('Given PackageNameField', () => {
  const renderPackageNameField = () => render(
    <Form
      onSubmit={() => {}}
      render={() => <PackageNameField />}
    />
  );

  it('should show PackageNameField', () => {
    const { getByTestId } = renderPackageNameField();

    expect(getByTestId('packageName')).toBeDefined();
  });

  describe('when fill input with unvalid value', () => {
    it('should show validation message', () => {
      const {
        getByText,
        getByTestId,
      } = renderPackageNameField();

      fireEvent.change(getByTestId('packageName'), { target: { value: new Array(201).fill('a').join('') } });
      fireEvent.blur(getByTestId('packageName'));

      expect(getByText('ui-eholdings.validate.errors.customPackage.name.length')).toBeDefined();
    });
  });

  describe('when fill input with empty string', () => {
    it('should show validation message', () => {
      const {
        getByText,
        getByTestId,
      } = renderPackageNameField();

      fireEvent.change(getByTestId('packageName'), { target: { value: '' } });
      fireEvent.blur(getByTestId('packageName'));

      expect(getByText('ui-eholdings.validate.errors.customPackage.name')).toBeDefined();
    });
  });
});
