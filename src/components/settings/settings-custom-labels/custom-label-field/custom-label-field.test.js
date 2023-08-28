import {
  render,
  cleanup,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import { Form } from 'react-final-form';

import CustomLabelField from './custom-label-field';

const renderCustomLabelField = () => render(
  <Form
    onSubmit={() => {}}
    initialValues={{
      customLabel1: {
        displayLabel: 'Custom label 1',
        displayOnFullTextFinder: true,
        displayOnPublicationFinder: true,
      },
    }}
    render={() => (
      <CustomLabelField
        name="customLabel1"
      />
    )}
  />
);

describe('Given CustomLabelField', () => {
  afterEach(cleanup);

  it('should render fields', () => {
    const { getByLabelText } = renderCustomLabelField();

    expect(getByLabelText('ui-eholdings.settings.customLabels.displayLabel')).toBeDefined();
    expect(getByLabelText('ui-eholdings.settings.customLabels.publicationFinder')).toBeDefined();
    expect(getByLabelText('ui-eholdings.settings.customLabels.textFinder')).toBeDefined();
  });

  describe('when entering valid displayLabel field value', () => {
    it('should not show any errors', () => {
      const {
        getByLabelText,
        queryByText,
      } = renderCustomLabelField();

      fireEvent.change(getByLabelText('ui-eholdings.settings.customLabels.displayLabel'), {
        target: {
          value: 'valid value',
        },
      });
      fireEvent.blur(getByLabelText('ui-eholdings.settings.customLabels.displayLabel'));

      expect(queryByText('ui-eholdings.validate.errors.settings.customLabels')).toBeNull();
    });
  });

  describe('when entering empty displayLabel field value', () => {
    it('should show error message', () => {
      const {
        getByLabelText,
        getByText,
      } = renderCustomLabelField();

      fireEvent.change(getByLabelText('ui-eholdings.settings.customLabels.displayLabel'), {
        target: {
          value: '',
        },
      });
      fireEvent.blur(getByLabelText('ui-eholdings.settings.customLabels.displayLabel'));

      expect(getByText('ui-eholdings.validate.errors.settings.customLabels.empty')).toBeDefined();
    });
  });

  describe('when entering non-utf characters in displayLabel field', () => {
    it('should show error message', () => {
      const {
        getByLabelText,
        getByText,
      } = renderCustomLabelField();

      fireEvent.change(getByLabelText('ui-eholdings.settings.customLabels.displayLabel'), {
        target: {
          value: 'i am non ✨utf✨',
        },
      });
      fireEvent.blur(getByLabelText('ui-eholdings.settings.customLabels.displayLabel'));

      expect(getByText('ui-eholdings.validate.errors.settings.customLabels.utf')).toBeDefined();
    });
  });

  describe('when entering a displayLabel field value that is too long', () => {
    it('should show error message', () => {
      const {
        getByLabelText,
        getByText,
      } = renderCustomLabelField();

      fireEvent.change(getByLabelText('ui-eholdings.settings.customLabels.displayLabel'), {
        target: {
          value: new Array(201).fill('a').join(),
        },
      });
      fireEvent.blur(getByLabelText('ui-eholdings.settings.customLabels.displayLabel'));

      expect(getByText('ui-eholdings.validate.errors.settings.customLabels.length')).toBeDefined();
    });
  });
});
