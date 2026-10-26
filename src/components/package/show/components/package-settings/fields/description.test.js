import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import Harness from '../../../../../../../test/jest/helpers/harness';

import { Description } from './description';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Editor: ({ value, readOnly, modules, editorClassName }) => (
    <div
      role="textbox"
      aria-label="Description"
      aria-readonly={String(readOnly)}
      data-toolbar={String(modules?.toolbar)}
      className={editorClassName}
    >
      {value}
    </div>
  ),
}));

const renderDescription = (props = {}) => render(
  <Harness>
    <Description {...props} />
  </Harness>
);

describe('Given Description', () => {
  afterEach(cleanup);

  it('should render a managed description in a read-only editor', () => {
    const { getByRole, getByText } = renderDescription({ description: '<p>Managed description</p>' });
    const editor = getByRole('textbox', { name: 'Description' });

    expect(getByText('ui-eholdings.package.managedDescription')).toBeDefined();
    expect(editor).toHaveTextContent('<p>Managed description</p>');
    expect(editor).toHaveAttribute('aria-readonly', 'true');
    expect(editor).toHaveAttribute('data-toolbar', 'false');
    expect(editor).toHaveClass('editor');
  });

  it('should render the custom description label for custom packages', () => {
    const { getByRole, getByText } = renderDescription({
      description: '<p>Custom description</p>',
      isCustomField: true,
    });

    expect(getByText('ui-eholdings.label.customDescription')).toBeDefined();
    expect(getByRole('textbox', { name: 'Description' })).toHaveTextContent('<p>Custom description</p>');
  });

  it('should display NoValue when description is missing', () => {
    const { getByText, queryByRole } = renderDescription();

    expect(getByText('-')).toBeDefined();
    expect(queryByRole('textbox', { name: 'Description' })).toBeNull();
  });
});
