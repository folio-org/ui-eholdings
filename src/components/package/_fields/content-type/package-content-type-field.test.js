import { Form } from 'react-final-form';
import { render } from '@testing-library/react';

import PackageContentTypeField from './package-content-type-field';

describe('Given PackageContentTypeField', () => {
  const renderPackageContentTypeField = () => render(
    <Form
      onSubmit={() => {}}
      render={() => <PackageContentTypeField />}
    />
  );

  it('should show PackageContentTypeField', () => {
    const { getByTestId } = renderPackageContentTypeField();

    expect(getByTestId('contentType')).toBeDefined();
  });
});
