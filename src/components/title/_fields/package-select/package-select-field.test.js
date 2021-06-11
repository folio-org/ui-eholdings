import { Form } from 'react-final-form';
import { render } from '@testing-library/react';

import PackageSelectField from './package-select-field';

describe('Given PackageSelectField', () => {
  const renderPackageSelectField = (options) => render(
    <Form
      onSubmit={() => {}}
      render={() => <PackageSelectField options={options} />}
    />
  );

  it('should render package select field', () => {
    const { getByText } = renderPackageSelectField([{
      label: 'label1',
      key: 'key1',
    }]);

    expect(getByText('ui-eholdings.label.package')).toBeDefined();
  });

  it('should render package select field options', () => {
    const { getByText } = renderPackageSelectField([{
      label: 'label1',
      key: 'key1',
    }]);

    expect(getByText('label1')).toBeDefined();
  });

  it('should not render disabled options', () => {
    const { queryByText } = renderPackageSelectField([{
      disabled: true,
      label: 'label2',
      key: 'key2',
    }]);

    expect(queryByText('label2')).toBeNull();
  });
});
