import {
  render,
  cleanup,
} from '@testing-library/react';
import { Form } from 'react-final-form';

import Harness from '../../../test/jest/helpers/harness';
import CustomUrlFields from './custom-url-fields';

describe('Given CustomUrlFields', () => {
  const mockOnSubmit = jest.fn();

  const renderCustomUrlFields = () => render(
    <Harness>
      <Form
        onSubmit={mockOnSubmit}
        render={() => (
          <form onSubmit={mockOnSubmit}>
            <CustomUrlFields />
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
});
