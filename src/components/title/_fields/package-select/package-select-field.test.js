import { Form } from 'react-final-form';
import debounce from 'lodash/debounce';

import {
  fireEvent,
  render,
} from '@folio/jest-config-stripes/testing-library/react';

import PackageSelectField from './package-select-field';

jest.mock('lodash/debounce', () => jest.fn((fn) => fn));

const mockOnFilter = jest.fn();

describe('Given PackageSelectField', () => {
  const renderPackageSelectField = (props) => render(
    <Form
      onSubmit={() => {}}
      render={() => (
        <PackageSelectField
          onFilter={mockOnFilter}
          {...props}
        />
      )}
    />
  );

  it('should render package select field', () => {
    const { getByText } = renderPackageSelectField({
      options: [{
        label: 'label1',
        key: 'key1',
        value: 'value1',
      }],
    });

    expect(getByText('ui-eholdings.label.package')).toBeDefined();
  });

  it('should render package select field options', () => {
    const { getByText } = renderPackageSelectField({
      options: [{
        label: 'label1',
        key: 'key1',
        value: 'value1',
      }],
    });

    fireEvent.click(getByText('ui-eholdings.title.chooseAPackage'));
    expect(getByText('label1')).toBeDefined();
  });

  it('should not render disabled options', () => {
    const { queryByText } = renderPackageSelectField({
      options: [{
        disabled: true,
        label: 'label2',
        key: 'key2',
        value: 'value2',
      }],
    });

    expect(queryByText('label2')).toBeNull();
  });

  it('should debounce onFilter function', async () => {
    const { getAllByLabelText } = renderPackageSelectField({
      options: [{
        label: 'label1',
        key: 'key1',
        value: 'value1',
      }],
    });

    const input = getAllByLabelText('stripes-components.selection.filterOptionsLabel')[0];

    fireEvent.change(input, { target: { value: 'packageName' } });
    expect(debounce).toHaveBeenCalledWith(mockOnFilter, 1000);
    expect(mockOnFilter).toHaveBeenCalled();
  });
});
