import { Form } from 'react-final-form';
import {
  fireEvent,
  render,
} from '@testing-library/react';

import wait from '../../../../../test/jest/helpers/wait';
import PackageSelectField from './package-select-field';

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
      }],
    });

    expect(getByText('ui-eholdings.label.package')).toBeDefined();
  });

  it('should render package select field options', () => {
    const { getByText } = renderPackageSelectField({
      options: [{
        label: 'label1',
        key: 'key1',
      }],
    });

    expect(getByText('label1')).toBeDefined();
  });

  it('should not render disabled options', () => {
    const { queryByText } = renderPackageSelectField({
      options: [{
        disabled: true,
        label: 'label2',
        key: 'key2',
      }],
    });

    expect(queryByText('label2')).toBeNull();
  });

  it('should debounce onFilter function', async () => {
    const { getAllByLabelText } = renderPackageSelectField({
      options: [{
        label: 'label1',
        key: 'key1',
      }],
    });

    const input = getAllByLabelText('stripes-components.selection.filterOptionsLabel')[0];

    fireEvent.change(input, { target: { value: 'packageName' } });
    expect(mockOnFilter).not.toHaveBeenCalled();
    await wait(1100);
    expect(mockOnFilter).toHaveBeenCalled();
  });
});
