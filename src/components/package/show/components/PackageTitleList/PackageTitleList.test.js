import { render } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { createMemoryHistory } from 'history';
import { PackageTitleList } from './PackageTitleList';
import getAxe from '../../../../../../test/jest/helpers/get-axe';
import Harness from '../../../../../../test/jest/helpers/harness';

const records = [
  {
    id: '1',
    attributes: {
      isSelected: true,
      name: 'Title name1',
      managedCoverages: [{
        beginCoverage: '2005-01-01',
        endCoverage: '2005-12-31'
      }],
      customCoverages: [
        {
          beginCoverage: '2025-01-09',
          endCoverage: '2026-01-01'
        },
        {
          beginCoverage: '2025-01-07',
          endCoverage: '2025-01-08'
        },
      ],
      managedEmbargoPeriod: {
        embargoUnit: 'Days',
        embargoValue: 11,
      },
      publicationType: 'book',
      tags: {
        tagList: ['testtag'],
      },
    },
  },
  {
    id: '2',
    attributes: {
      isSelected: false,
      name: 'Title name2',
      managedCoverages: [{
        beginCoverage: '2017-08-01',
        endCoverage: '2017-08-01',
      }],
      customCoverages: [],
      managedEmbargoPeriod: {
        embargoValue: 0,
      },
      publicationType: 'book',
      tags: {
        tagList: [],
      },
    },
  },
];

const mockOnFetchPackageTitles = jest.fn();
const mockHistoryPush = jest.fn();

const history = createMemoryHistory();
history.push = mockHistoryPush;

const renderPackageTitleList = (props = {}) => render(
  <Harness
    history={history}
  >
    <PackageTitleList
      records={records}
      isLoading={false}
      totalResults={3}
      page={1}
      count={2}
      onFetchPackageTitles={mockOnFetchPackageTitles}
      {...props}
    />
  </Harness>
);

const axe = getAxe();

describe('Given PackageTitleList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have no a11y issues', async () => {
    const { container } = renderPackageTitleList();

    const a11yResults = await axe.run(container);

    expect(a11yResults.violations.length).toEqual(0);
  });

  it('should display the correct columns', () => {
    const { getByText } = renderPackageTitleList();

    expect(getByText('ui-eholdings.titlesList.status')).toBeDefined();
    expect(getByText('ui-eholdings.titlesList.title')).toBeDefined();
    expect(getByText('ui-eholdings.titlesList.managedCoverage')).toBeDefined();
    expect(getByText('ui-eholdings.titlesList.customCoverage')).toBeDefined();
    expect(getByText('ui-eholdings.titlesList.managedEmbargo')).toBeDefined();
    expect(getByText('ui-eholdings.titlesList.tags')).toBeDefined();
  });

  it('should call onFetchPackageTitles when fetching more data', async () => {
    const { getByRole } = renderPackageTitleList();

    await userEvent.click(getByRole('button', { name: 'stripes-components.next' }));

    expect(mockOnFetchPackageTitles).toHaveBeenCalledWith(2);
  });

  describe('when clicking on the title link', () => {
    it('should set location.state.eholdings to true', async () => {
      const { getByText } = renderPackageTitleList();

      await userEvent.click(getByText('Title name1'));

      expect(mockHistoryPush).toHaveBeenCalledWith({
        pathname: '/eholdings/resources/1',
        state: {
          eholdings: true,
        },
      });
    });
  });

  it('should display records correctly', () => {
    const { getByText } = renderPackageTitleList();

    expect(getByText('ui-eholdings.selected')).toBeDefined();
    expect(getByText('Title name1')).toBeDefined();
    expect(getByText('1/1/2005 - 12/31/2005')).toBeDefined();
    expect(getByText('1/9/2025 - 1/1/2026, 1/7/2025 - 1/8/2025')).toBeDefined();
    expect(getByText('ui-eholdings.resource.embargoUnit.Days')).toBeDefined();
    expect(getByText('testtag')).toBeDefined();

    expect(getByText('ui-eholdings.notSelected')).toBeDefined();
    expect(getByText('Title name2')).toBeDefined();
    expect(getByText('8/1/2017 - 8/1/2017')).toBeDefined();
  });
});
