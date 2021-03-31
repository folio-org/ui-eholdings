import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
} from '@testing-library/react';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes-components';

import PackageCreate from './index';

const fakeOnSubmit = jest.fn();

const renderPackageCreate = () => render(
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
);

describe('PackageCreate', () => {
  afterEach(cleanup);

  it('should render Package create page', () => {
    const { getByTestId } = renderPackageCreate();

    expect(getByTestId('data-test-eholdings-package-create')).toBeDefined();
  });
});


