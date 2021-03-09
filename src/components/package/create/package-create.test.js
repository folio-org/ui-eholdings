import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
  fireEvent,
  act,
} from '@testing-library/react';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes-components';

import { saveShortcut } from '../../../../test/jest/utilities';

import PackageCreate from './index';

const fakeOnSubmit = jest.fn();

const renderPackageCreate = () => act(() => render(
  <MemoryRouter>
    <CommandList commands={defaultKeyboardShortcuts}>
      <PackageCreate
        request={{ errors: [] }}
        onSubmit={fakeOnSubmit}
        onCancel={jest.fn()}
        removeCreateRequests={jest.fn()}
        accessStatusTypes={{}}
      />
    </CommandList>
  </MemoryRouter>
));

describe('PackageCreate', () => {
  afterEach(cleanup);

  it('should render Package create page', () => {
    const { getByTestId } = renderPackageCreate();

    expect(getByTestId('data-test-eholdings-package-create')).toBeDefined();
  });

  it('should render Package create page', () => {
    const {
      getByTestId,
      getByLabelText,
    } = renderPackageCreate();

    const nameInput = getByLabelText('ui-eholdings.label.name');
    const packageCreateDiv = getByTestId('data-test-eholdings-package-create');
    const form = getByTestId('data-test-eholdings-form');

    // form.onSubmit = fakeOnSubmit;

    act(() => {
      fireEvent.change(nameInput, {
        target: {
          value: 'Test'
        }
      });
      saveShortcut(form);
    });

    expect(form.onSubmit).toHaveBeenCalled();
    expect(fakeOnSubmit).toHaveBeenCalled();
  });
});


