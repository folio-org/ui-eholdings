import { render } from '@testing-library/react';

import { Form } from 'react-final-form';

import AddTitleToPackage from './add-title-to-package';

jest.mock('../_fields/package-select/package-select-field', () => () => (<div>PackageSelectField component</div>));
jest.mock('../../custom-url-fields/custom-url-fields', () => () => (<div>CustomUrlFields component</div>));

const testPackageOptions = [
  {
    disabled: false,
    key: 'test-key',
    label: 'test-label',
  },
  {
    disabled: true,
    key: 'key-for-test',
    label: 'label-for-test',
  },
];

describe('Given AddTitleToPackage', () => {
  const handleSubmit = jest.fn();

  const renderAddTitleToPackage = packageOptions => render(
    <Form
      onSubmit={handleSubmit}
      render={() => (
        <form>
          <AddTitleToPackage
            packageOptions={packageOptions}
            onPackageFilter={jest.fn()}
            loadingOptions={false}
          />
        </form>
      )}
    />
  );

  it('should render PackageSelectField component', () => {
    const { getByText } = renderAddTitleToPackage(testPackageOptions);

    expect(getByText('PackageSelectField component')).toBeDefined();
  });

  it('should render CustomUrlFields component', () => {
    const { getByText } = renderAddTitleToPackage(testPackageOptions);

    expect(getByText('CustomUrlFields component')).toBeDefined();
  });
});
