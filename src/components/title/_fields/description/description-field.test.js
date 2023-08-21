import { Form } from 'react-final-form';
import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import DescriptionField from './description-field';

describe('Given DescriptionField', () => {
  const renderDescriptionField = () => render(
    <Form
      onSubmit={() => {}}
      render={() => <DescriptionField />}
    />
  );

  it('should render description field', () => {
    const { getByTestId } = renderDescriptionField();

    expect(getByTestId('description-field')).toBeDefined();
  });

  describe('when fill input with more that 400 characters', () => {
    it('should show validation error', () => {
      const {
        getByText,
        getByTestId,
      } = renderDescriptionField();

      fireEvent.change(getByTestId('description-field'), { target: { value: new Array(401).fill('a').join('') } });
      fireEvent.blur(getByTestId('description-field'));

      expect(getByText('ui-eholdings.validate.errors.title.description.length')).toBeDefined();
    });
  });
});
