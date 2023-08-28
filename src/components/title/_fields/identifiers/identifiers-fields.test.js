import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import IdentifiersFields from './identifiers-fields';

import { identifiersTypes } from '../../../../constants';

describe('Given IdentifiersFields', () => {
  const renderIdentifiersFields = (props = {}) => render(
    <Form
      onSubmit={() => {}}
      mutators={{ ...arrayMutators }}
      render={() => (
        <IdentifiersFields
          {...props}
        />
      )}
    />
  );

  it('should render the IdentifiersFields component', () => {
    const { getByTestId } = renderIdentifiersFields();

    expect(getByTestId('identifiers-fields')).toBeDefined();
  });

  it('should display the legend title', () => {
    const { getByText } = renderIdentifiersFields();

    expect(getByText('ui-eholdings.label.identifiers')).toBeDefined();
  });

  it('should display the `add identifier` button', () => {
    const { getByRole } = renderIdentifiersFields();

    expect(getByRole('button', { name: 'ui-eholdings.title.identifier.addIdentifier' })).toBeDefined();
  });

  describe('when click on the `add identifier` button', () => {
    it('should display the identifier type selection dropdown', () => {
      const { getByRole } = renderIdentifiersFields();

      const addIdentifierButton = getByRole('button', { name: 'ui-eholdings.title.identifier.addIdentifier' });

      fireEvent.click(addIdentifierButton);

      expect(getByRole('combobox', { name: 'ui-eholdings.type' })).toBeDefined();
    });

    it('should display correct dropdown options', () => {
      const {
        getByRole,
        getByText,
      } = renderIdentifiersFields();

      const addIdentifierButton = getByRole('button', { name: 'ui-eholdings.title.identifier.addIdentifier' });

      fireEvent.click(addIdentifierButton);

      Object.keys(identifiersTypes).forEach(identifiersType => {
        expect(getByText(`ui-eholdings.label.identifier.${identifiersType.toLowerCase()}`)).toBeDefined();
      });
    });

    it('should display the identifier ID input', () => {
      const { getByRole } = renderIdentifiersFields();

      const addIdentifierButton = getByRole('button', { name: 'ui-eholdings.title.identifier.addIdentifier' });

      fireEvent.click(addIdentifierButton);

      expect(getByRole('textbox', { name: 'ui-eholdings.id' })).toBeDefined();
    });
  });

  describe('when identifier ID input string has more than 20 characters', () => {
    it('should show corresponding validation message', () => {
      const {
        getByText,
        getByRole,
      } = renderIdentifiersFields();

      const addIdentifierButton = getByRole('button', { name: 'ui-eholdings.title.identifier.addIdentifier' });

      fireEvent.click(addIdentifierButton);

      const identifierIdInput = getByRole('textbox', { name: 'ui-eholdings.id' });

      fireEvent.change(identifierIdInput, {
        target: {
          value: new Array(21).fill('a').join(),
        },
      });

      fireEvent.blur(identifierIdInput);

      expect(getByText('ui-eholdings.validate.errors.identifiers.exceedsLength')).toBeDefined();
    });
  });

  describe('when selected identifier ID input but no value provided', () => {
    it('should show corresponding validation message', () => {
      const {
        getByText,
        getByRole,
      } = renderIdentifiersFields();

      const addIdentifierButton = getByRole('button', { name: 'ui-eholdings.title.identifier.addIdentifier' });

      fireEvent.click(addIdentifierButton);

      const identifierIdInput = getByRole('textbox', { name: 'ui-eholdings.id' });

      fireEvent.focus(identifierIdInput);
      fireEvent.blur(identifierIdInput);

      expect(getByText('ui-eholdings.validate.errors.identifiers.noBlank')).toBeDefined();
    });
  });

  describe('when click on the trash icon of the identifiers repeatable field', () => {
    it('should delete repeatable field', () => {
      const {
        getByRole,
        queryByRole,
        getByLabelText,
      } = renderIdentifiersFields();

      const addIdentifierButton = getByRole('button', { name: 'ui-eholdings.title.identifier.addIdentifier' });

      fireEvent.click(addIdentifierButton);

      const trashIcon = getByLabelText('stripes-components.deleteThisItem');

      fireEvent.click(trashIcon);

      expect(queryByRole('combobox', { name: 'ui-eholdings.type' })).toBeNull();
      expect(queryByRole('textbox', { name: 'ui-eholdings.id' })).toBeNull();
    });
  });
});
