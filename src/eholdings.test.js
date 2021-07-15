import {
  cleanup,
  render,
} from '@testing-library/react';

import { createMemoryHistory } from 'history';
import Harness from '../test/jest/helpers/harness';

import EHoldings from './eholdings';

jest.mock('impagination/src/state', () => () => (<div>State component</div>));
jest.mock('./routes/provider-show', () => () => (<div>ProviderShow component</div>));

const location = {
  hash: '',
  key: '',
  pathname: '',
  search: '',
  state: {},
};

const match = {
  isExact: true,
  params: {},
  path: '',
  url: '',
};

const root = {
  addEpic: jest.fn(),
  addReducer: jest.fn(),
};

const testProps = {
  root,
  location,
  match,
  showSettings: false,
};

describe('Given EHoldings', () => {
  const renderEHoldings = ({ history, pathLocation, pathMatch, ...props }) => render(
    <Harness history={history}>
      <EHoldings
        root={root}
        history={history}
        location={pathLocation}
        match={pathMatch}
        {...props}
      />
    </Harness>
  );

  afterEach(cleanup);
  let history = null;

  beforeEach(() => {
    history = createMemoryHistory();
  });

  it('should render navigation panel', () => {
    // const { getByText } = renderEHoldings({
    //   ...testProps,
    //   history,
    // });

    // expect(getByText('ui-eholdings.navigation.app')).toBeDefined();
    // expect(getByText('ui-eholdings.navigation.keyboardShortcuts')).toBeDefined();
    // expect(getByText('ui-eholdings.navigation.content')).toBeDefined();
    // expect(getByText('ui-eholdings.navigation.systemStatus')).toBeDefined();
  });

  it('should render ProviderShow component', () => {
  //   history.push('/eholdings/providers/1');

  //   const { getByText } = renderEHoldings({
  //     ...testProps,
  //     history,
  //     location: {
  //       ...location,
  //       pathname: '/eholdings/providers/1',
  //       search: '?searchType=providers&q=ebsco',
  //       state: { eholdings: true },
  //     },
  //     match: {
  //       isExact: true,
  //       params: { providerId: '1' },
  //       path: '/eholdings/providers/:providerId',
  //       url: '/eholdings/providers/1',
  //     },
  //   });

  //   expect(getByText('ProviderShow component')).toBeDefined();
  });
});
