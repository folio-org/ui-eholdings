import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import { CustomDescription } from './custom-description';
import Harness from '../../../../../test/jest/helpers/harness';

const mockOnSubmit = jest.fn();

const renderCustomDescription = (initialValue) => render(
  <Harness>
    <Form
      onSubmit={mockOnSubmit}
      initialValues={{
        customDescription: initialValue,
      }}
      mutators={{ ...arrayMutators }}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <CustomDescription />
        </form>
      )}
    />
  </Harness>
);

describe('Given CustomDescription', () => {
  describe('when a description exceeds the maximum length', () => {
    it('should display the length validation error', async () => {
      const initialValue = `<p>${new Array(2000).fill('a').join('')}</p>`;
      const { container, getByText } = renderCustomDescription(initialValue);

      const input = container.querySelector('[contenteditable="true"]');
      fireEvent.blur(input);

      expect(getByText('ui-eholdings.validate.errors.customPackage.customDescription.length')).toBeDefined();
    });
  });

  describe('when a description length is less than maximum length', () => {
    it('should not display the length validation error', () => {
      // 1993 because <p> and </p> take up 7 characters
      const initialValue = `<p>${new Array(1993).fill('a').join('')}</p>`;

      const { container, queryByText } = renderCustomDescription(initialValue);

      const input = container.querySelector('[contenteditable="true"]');
      fireEvent.blur(input);

      expect(queryByText('ui-eholdings.validate.errors.customPackage.customDescription.length')).toBeNull();
    });
  });

  describe('when rendered', () => {
    it('infotip is shown when icon clicked', () => {
      const { getByRole, getByText } = renderCustomDescription();

      const infotipButton = getByRole('button', { name: 'info' });
      expect(infotipButton).toBeInTheDocument();

      fireEvent.click(infotipButton);

      expect(getByText('ui-eholdings.label.customDescription.infoPopover')).toBeInTheDocument();
    });
  });
});
