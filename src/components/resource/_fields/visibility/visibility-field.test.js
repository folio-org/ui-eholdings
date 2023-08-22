import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import { Form } from 'react-final-form';

import VisibilityField from './visibility-field';

describe('Given VisibilityField', () => {
  const renderVisibilityField = (props = {}) => render(
    <Form
      onSubmit={() => {}}
      render={() => (
        <VisibilityField
          disabled={false}
          {...props}
        />
      )}
    />
  );

  it('should render the VisibilityField component', () => {
    const { getByTestId } = renderVisibilityField();

    expect(getByTestId('resource-visibility-field')).toBeDefined();
  });

  it('should display a legend headline', () => {
    const { getByText } = renderVisibilityField();

    expect(getByText('ui-eholdings.label.showToPatrons')).toBeDefined();
  });

  it('should display a `yes` radio button', () => {
    const { getByRole } = renderVisibilityField();

    expect(getByRole('radio', { name: 'ui-eholdings.yes' })).toBeDefined();
  });

  it('should display a `no` radio button', () => {
    const { getByRole } = renderVisibilityField();

    expect(getByRole('radio', { name: 'ui-eholdings.label.no.reason' })).toBeDefined();
  });

  describe('when `true` passed to a `disabled` prop', () => {
    it('should display disabled radio buttons', () => {
      const { getByRole } = renderVisibilityField({
        disabled: true,
      });

      expect(getByRole('radio', { name: 'ui-eholdings.yes' })).toBeDisabled();
      expect(getByRole('radio', { name: 'ui-eholdings.label.no.reason' })).toBeDisabled();
    });
  });

  describe('when a node passed to a `disabled` prop', () => {
    it('should display disabled radio buttons', () => {
      const { getByRole } = renderVisibilityField({
        disabled: <div>Some node</div>,
      });

      expect(getByRole('radio', { name: 'ui-eholdings.yes' })).toBeDisabled();
      expect(getByRole('radio', { name: 'ui-eholdings.label.no.reason' })).toBeDisabled();
    });
  });

  describe('when check radio buttons', () => {
    it('should store `true` in the form in case of a selected `yes` option', () => {
      const {
        getByTestId,
        getByRole,
      } = renderVisibilityField();

      const fieldset = getByTestId('resource-visibility-field');
      const yesRadioButton = getByRole('radio', { name: 'ui-eholdings.yes' });

      fireEvent.click(yesRadioButton);

      expect(yesRadioButton).toBeChecked();
      expect(fieldset).toHaveFormValues({
        isVisible: 'true',
      });
    });

    it('should store `false` in the form in case of a selected `no` option', () => {
      const {
        getByTestId,
        getByRole,
      } = renderVisibilityField();

      const fieldset = getByTestId('resource-visibility-field');
      const noRadioButton = getByRole('radio', { name: 'ui-eholdings.label.no.reason' });

      fireEvent.click(noRadioButton);

      expect(noRadioButton).toBeChecked();
      expect(fieldset).toHaveFormValues({
        isVisible: 'false',
      });
    });
  });
});
