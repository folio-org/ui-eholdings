import { Form } from 'react-final-form';
import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import EditionField from './edition-field';

describe('Given EditionField', () => {
  const renderEditionField = () => render(
    <Form
      onSubmit={() => {}}
      render={() => <EditionField />}
    />
  );

  it('should render edition field', () => {
    const { getByTestId } = renderEditionField();

    expect(getByTestId('edition-field')).toBeDefined();
  });

  describe('when fill input with more that 250 characters', () => {
    it('should show validation error', () => {
      const {
        getByText,
        getByTestId,
      } = renderEditionField();

      fireEvent.change(getByTestId('edition-field'), { target: { value: new Array(251).fill('a').join('') } });
      fireEvent.blur(getByTestId('edition-field'));

      expect(getByText('ui-eholdings.validate.errors.edition.length')).toBeDefined();
    });
  });

  describe('when input value is empty', () => {
    it('should show validation error', () => {
      const {
        getByText,
        getByTestId,
      } = renderEditionField();

      fireEvent.change(getByTestId('edition-field'), { target: { value: '  ' } });
      fireEvent.blur(getByTestId('edition-field'));

      expect(getByText('ui-eholdings.validate.errors.edition.value')).toBeDefined();
    });
  });
});
