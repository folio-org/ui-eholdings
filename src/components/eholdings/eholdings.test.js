import { render } from '@testing-library/react';
import { noop } from 'lodash';

import EHoldings from './eholdings';
import Harness from '../../../test/jest/helpers/harness';

jest.mock('../../routes/application', () => () => <span>ApplicationRoute</span>);
jest.mock('../../routes/settings-route', () => () => <span>SettingsRoute</span>);
jest.mock('../../routes/search-route', () => () => <span>SearchRoute</span>);
jest.mock('../../routes/provider-show-route', () => () => <span>ProviderShow</span>);
jest.mock('../../routes/provider-edit', () => () => <span>ProviderEdit</span>);
jest.mock('../../routes/package-show', () => () => <span>PackageShow</span>);
jest.mock('../../routes/package-edit', () => () => <span>PackageEdit</span>);
jest.mock('../../routes/package-create', () => () => <span>PackageCreate</span>);
jest.mock('../../routes/title-show', () => () => <span>TitleShow</span>);
jest.mock('../../routes/title-edit', () => () => <span>TitleEdit</span>);
jest.mock('../../routes/title-create', () => () => <span>TitleCreate</span>);
jest.mock('../../routes/resource-show', () => () => <span>ResourceShow</span>);
jest.mock('../../routes/resource-edit', () => () => <span>ResourceEdit</span>);
jest.mock('../../routes/note-create', () => () => <span>NoteCreate</span>);
jest.mock('../../routes/note-view', () => () => <span>NoteView</span>);
jest.mock('../../routes/note-edit', () => () => <span>NoteEdit</span>);
jest.mock('../../routes/custom-labels-route', () => () => <span>SettingsCustomLabelsRoute</span>);
jest.mock('../../routes/settings-knowledge-base-route', () => () => <span>SettingsKnowledgeBaseRoute</span>);
jest.mock('../../routes/settings-root-proxy-route', () => () => <span>SettingsRootProxyRoute</span>);
jest.mock('../../routes/settings-access-status-types-route', () => () => <span>SettingsAccessStatusTypesRoute</span>);
jest.mock('../../routes/settings-assigned-users-route', () => () => <span>SettingsAssignedUsersRoute</span>);
jest.mock('../../routes/settings-usage-consolidation-route', () => () => <span>SettingsUsageConsolidationRoute</span>);
jest.mock('../eholdings-app-context', () => () => <span>EHoldingsAppContext</span>);

const mockHistory = {
  replace: jest.fn(),
  push: jest.fn(),
};

describe('Given EHoldings', () => {
  const renderEHoldings = (props = {}) => render(
    <Harness>
      <EHoldings
        history={mockHistory}
        location={{
          pathname: 'pathname',
          search: '',
        }}
        match={{
          path: 'path',
        }}
        root={{
          addEpic: noop,
          addReducer: noop,
        }}
        showSettings={false}
        {...props}
      />
    </Harness>
  );

  it('should show EholdingsAppContext', () => {
    const { getByText } = renderEHoldings();

    expect(getByText('EHoldingsAppContext')).toBeDefined();
  });
});
