import { Form } from 'react-final-form';
import {
  render,
  fireEvent,
} from '@testing-library/react';

import CustomLabelsEditSection from './custom-labels-edit-section';

const renderCustomLabelsEditSection = (props) => render(
  <Form
    onSubmit={() => {}}
    render={() => (
      <CustomLabelsEditSection
        customLabels={[{
          attributes: {
            displayLabel: 'label',
            id: 1,
          },
        }]}
        userDefinedFields={{
          userDefinedField1: 'value',
        }}
        {...props}
      />
    )}
  />
);

describe('Given CustomLabelsEditSection', () => {
  describe('when input string has more then 500 characters', () => {
    it('should show validation message', () => {
      const {
        getByText,
        getByTestId,
      } = renderCustomLabelsEditSection();

      fireEvent.change(getByTestId('custom-label-field'), { target: { value: new Array(501).fill('a').join() } });
      fireEvent.blur(getByTestId('custom-label-field'));

      expect(getByText('ui-eholdings.validate.errors.customLabels.length')).toBeDefined();
    });
  });
});
