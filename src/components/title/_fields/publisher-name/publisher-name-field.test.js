import { Form } from 'react-final-form';
import noop from 'lodash/noop';

import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import PublicationTypeField from './publisher-name-field';

const renderPublicationTypeField = () => render(
  <Form
    onSubmit={noop}
    render={() => <PublicationTypeField />}
  />
);

describe('Given PublicationTypeField', () => {
  it('should render PublicationTypeField', () => {
    const { getByTestId } = renderPublicationTypeField();

    expect(getByTestId('publisher-name-field')).toBeDefined();
  });

  describe('when fill field with value with more then 250 characters', () => {
    it('should display a validation message', () => {
      const {
        getByTestId,
        getByText,
      } = renderPublicationTypeField();
      const value = new Array(251).fill('a').join('');

      fireEvent.change(getByTestId('publisher-name-field'), { target: { value } });
      fireEvent.blur(getByTestId('publisher-name-field'));

      expect(getByText('ui-eholdings.validate.errors.publisherName.length')).toBeDefined();
    });
  });
});
