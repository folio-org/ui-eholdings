import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../../../test/jest/helpers/harness';

import { VisibilityEdit } from './visibility-edit';

const visibility = [
  { category: 'PF', hidden: false, reason: '' },
  { category: 'FTF', hidden: true, reason: '' },
  { category: 'MARC', hidden: false, reason: '' },
];

const mockOnSubmit = jest.fn();

const renderVisibilityEdit = (initialValues = { visibility }) => render(
  <Harness>
    <Form
      onSubmit={mockOnSubmit}
      mutators={{ ...arrayMutators }}
      initialValues={initialValues}
      render={() => (
        <form onSubmit={mockOnSubmit}>
          <VisibilityEdit />
        </form>
      )}
    />
  </Harness>
);

describe('Given VisibilityEdit', () => {
  afterEach(() => {
    cleanup();
    mockOnSubmit.mockClear();
  });

  it('should render the visibility section headline', () => {
    const { getByText } = renderVisibilityEdit();

    expect(getByText('ui-eholdings.package.visibility')).toBeDefined();
  });

  it('should render a checkbox for each visibility option', () => {
    const { getByLabelText } = renderVisibilityEdit();

    expect(getByLabelText('ui-eholdings.package.visibility.PF')).toBeDefined();
    expect(getByLabelText('ui-eholdings.package.visibility.FTF')).toBeDefined();
    expect(getByLabelText('ui-eholdings.package.visibility.MARC')).toBeDefined();
  });

  it('should reflect the initial `hidden` value for each option', () => {
    const { getByLabelText } = renderVisibilityEdit();

    expect(getByLabelText('ui-eholdings.package.visibility.PF')).not.toBeChecked();
    expect(getByLabelText('ui-eholdings.package.visibility.FTF')).toBeChecked();
    expect(getByLabelText('ui-eholdings.package.visibility.MARC')).not.toBeChecked();
  });
});
