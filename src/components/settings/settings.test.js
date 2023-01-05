import {
  cleanup,
  render,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes-components';

import Settings from './settings';
import Harness from '../../../test/jest/helpers/harness';
import { openNewShortcut } from '../../../test/jest/utilities/shortcuts';

const history = createMemoryHistory();
const historyPushSpy = jest.spyOn(history, 'push');

const renderSettings = (props = {}) => render(
  <Harness
    history={history}
  >
    <CommandList commands={defaultKeyboardShortcuts}>
      <Settings
        kbCredentials={[{
          attributes: {
            apiKey: 'apiKey',
            customerId: 'customerId',
            name: 'kb name',
            url: 'url.com',
          },
          id: '1',
          type: '',
          metadata: {},
        }]}
        {...props}
      >
        <div>Child element</div>
      </Settings>
    </CommandList>
  </Harness>
);

describe('Given Settings Display', () => {
  beforeEach(() => {
    historyPushSpy.mockClear();
  });

  afterEach(cleanup);

  it('should render children', () => {
    const { getByText } = renderSettings();

    expect(getByText('Child element')).toBeDefined();
  });

  describe('when clicking on KB credentials header', () => {
    it('should redirect to kb credentials page', () => {
      const { getByTestId } = renderSettings();

      getByTestId('kb-credentials-heading-1').click();

      expect(historyPushSpy.mock.calls[0][0]).toEqual({
        pathname: '/settings/eholdings/knowledge-base/1',
        state: { eholdings: true },
      });
    });
  });

  describe('when pressing create new shortcut', () => {
    it('should redirect to create kb credentials page', () => {
      const { getByText } = renderSettings();

      const childElement = getByText('Child element');
      childElement.focus();
      openNewShortcut(childElement);

      expect(historyPushSpy.mock.calls[0][0].pathname).toEqual('/settings/eholdings/knowledge-base/new');
    });
  });
});
