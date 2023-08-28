import { Form } from 'react-final-form';
import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import TitleNameField from './title-name-field';

describe('Given TitleNameField', () => {
  const renderTitleNameField = () => render(
    <Form
      onSubmit={() => {}}
      render={() => <TitleNameField />}
    />
  );

  it('should render title name field', () => {
    const { getByTestId } = renderTitleNameField();

    expect(getByTestId('title-name-field')).toBeDefined();
  });

  describe('when fill input with more that 400 characters', () => {
    it('should show validation error', () => {
      const {
        getByText,
        getByTestId,
      } = renderTitleNameField();

      fireEvent.change(getByTestId('title-name-field'), { target: { value: new Array(401).fill('a').join('') } });
      fireEvent.blur(getByTestId('title-name-field'));

      expect(getByText('ui-eholdings.validate.errors.customTitle.name.length')).toBeDefined();
    });
  });

  describe('when input value is empty', () => {
    it('should show validation error', () => {
      const {
        getByText,
        getByTestId,
      } = renderTitleNameField();

      fireEvent.change(getByTestId('title-name-field'), { target: { value: '' } });
      fireEvent.blur(getByTestId('title-name-field'));

      expect(getByText('ui-eholdings.validate.errors.customTitle.name')).toBeDefined();
    });
  });
});
