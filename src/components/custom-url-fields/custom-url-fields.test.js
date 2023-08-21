import {
  render,
  cleanup,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import { Form } from 'react-final-form';

import Harness from '../../../test/jest/helpers/harness';
import CustomUrlFields from './custom-url-fields';

describe('Given CustomUrlFields', () => {
  const mockOnSubmit = jest.fn();

  const renderCustomUrlFields = () => render(
    <Harness>
      <Form
        onSubmit={mockOnSubmit}
        initialValues={{ customUrl: 'test' }}
        render={({ handleSubmit, pristine, form: { reset } }) => (
          <form onSubmit={handleSubmit}>
            <CustomUrlFields />
            <button type="button" disabled={pristine} onClick={reset}>Cancel</button>
            <button type="submit" disabled={pristine}>Submit</button>
          </form>
        )}
      />
    </Harness>
  );

  afterEach(() => {
    cleanup();
    mockOnSubmit.mockClear();
  });

  it('should render custom url fields', () => {
    const { getByTestId } = renderCustomUrlFields();

    expect(getByTestId('custom-url-field')).toBeDefined();
  });

  describe('when entering too long url', () => {
    it('should show error message', async () => {
      const {
        getByLabelText,
        getByText,
      } = renderCustomUrlFields();

      fireEvent.change(getByLabelText('ui-eholdings.customUrl'), {
        target: {
          value: `http://${new Array(601).fill('a').join('')}`,
        },
      });
      fireEvent.blur(getByLabelText('ui-eholdings.customUrl'));

      expect(getByText('ui-eholdings.validate.errors.customUrl.length')).toBeDefined();
    });
  });

  describe('when entering invalid url', () => {
    it('should show error message', async () => {
      const {
        getByLabelText,
        getByText,
      } = renderCustomUrlFields();

      fireEvent.change(getByLabelText('ui-eholdings.customUrl'), {
        target: {
          value: 'some-url.org'
        },
      });
      fireEvent.blur(getByLabelText('ui-eholdings.customUrl'));

      expect(getByText('ui-eholdings.validate.errors.customUrl.include')).toBeDefined();
    });
  });
});
