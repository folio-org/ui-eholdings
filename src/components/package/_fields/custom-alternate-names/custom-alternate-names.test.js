import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import { CustomAlternateNames } from './custom-alternate-names';
import Harness from '../../../../../test/jest/helpers/harness';

const MAX_ALTERNATE_NAMES = 10;

const mockOnSubmit = jest.fn();

const renderCustomAlternateNames = () => render(
  <Harness>
    <Form
      onSubmit={mockOnSubmit}
      mutators={{ ...arrayMutators }}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <CustomAlternateNames />
        </form>
      )}
    />
  </Harness>
);

describe('Given CustomAlternateNames', () => {
  it('should render an Add name button', () => {
    const { getByRole } = renderCustomAlternateNames();

    expect(getByRole('button', { name: 'ui-eholdings.label.addCustomAlternateName' })).toBeDefined();
  });

  describe('when clicking the add name button', () => {
    it('should add a new input row', () => {
      const {
        getByRole,
        queryAllByRole,
      } = renderCustomAlternateNames();

      expect(queryAllByRole('textbox', { name: 'ui-eholdings.label.customAlternateNames' })).toHaveLength(0);

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.addCustomAlternateName' }));

      expect(queryAllByRole('textbox', { name: 'ui-eholdings.label.customAlternateNames' })).toHaveLength(1);
    });
  });

  describe('when clicking the delete button', () => {
    it('should remove the corresponding input row', () => {
      const {
        getByRole,
        getAllByRole,
        queryAllByRole,
      } = renderCustomAlternateNames();

      const addButton = getByRole('button', { name: 'ui-eholdings.label.addCustomAlternateName' });

      fireEvent.click(addButton);
      fireEvent.click(addButton);

      const [firstInput, secondInput] = getAllByRole('textbox', { name: 'ui-eholdings.label.customAlternateNames' });

      fireEvent.change(firstInput, { target: { value: 'First alt name' } });
      fireEvent.change(secondInput, { target: { value: 'Second alt name' } });

      const [firstDeleteButton] = getAllByRole('button', { name: 'stripes-components.deleteThisItem' });

      fireEvent.click(firstDeleteButton);

      const remainingInputs = queryAllByRole('textbox', { name: 'ui-eholdings.label.customAlternateNames' });

      expect(remainingInputs).toHaveLength(1);
      expect(remainingInputs[0]).toHaveValue('Second alt name');
    });
  });

  describe('when a name exceeds the maximum length', () => {
    it('should display the length validation error', () => {
      const { getByRole, getByText } = renderCustomAlternateNames();

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.addCustomAlternateName' }));

      const input = getByRole('textbox', { name: 'ui-eholdings.label.customAlternateNames' });

      fireEvent.change(input, { target: { value: 'a'.repeat(301) } });
      fireEvent.blur(input);

      expect(getByText('ui-eholdings.validate.errors.customPackage.customAlternateName.length')).toBeDefined();
    });
  });

  describe('when a name length is less than maximum length', () => {
    it('should not display the length validation error', () => {
      const { getByRole, queryByText } = renderCustomAlternateNames();

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.addCustomAlternateName' }));

      const input = getByRole('textbox', { name: 'ui-eholdings.label.customAlternateNames' });

      fireEvent.change(input, { target: { value: 'a'.repeat(300) } });
      fireEvent.blur(input);

      expect(queryByText('ui-eholdings.validate.errors.customPackage.customAlternateName.length')).toBeNull();
    });
  });

  describe('when a name contains a double quote character', () => {
    it('should display the length validation error', () => {
      const { getByRole, getByText } = renderCustomAlternateNames();

      fireEvent.click(getByRole('button', { name: 'ui-eholdings.label.addCustomAlternateName' }));

      const input = getByRole('textbox', { name: 'ui-eholdings.label.customAlternateNames' });

      fireEvent.change(input, { target: { value: '"test"' } });
      fireEvent.blur(input);

      expect(getByText('ui-eholdings.validate.errors.customPackage.customAlternateName.doubleQuotes')).toBeDefined();
    });
  });

  describe('when the number of alternate names is 10', () => {
    const clickAddButton = (getByRole, times) => {
      const addButton = getByRole('button', { name: 'ui-eholdings.label.addCustomAlternateName' });

      for (let i = 0; i < times; i++) {
        fireEvent.click(addButton);
      }
    };

    it('should disable the add name button', () => {
      const { getByRole } = renderCustomAlternateNames();

      clickAddButton(getByRole, MAX_ALTERNATE_NAMES);

      expect(getByRole('button', { name: 'ui-eholdings.label.addCustomAlternateName' })).toBeDisabled();
    });
  });
});
