import { render } from '@testing-library/react';

import {
  entityTypes,
  platformTypes,
} from '../../../constants';

import Harness from '../../../../test/jest/helpers/harness';

import FullTextRequestUsageTable from './full-text-request-usage-table';

const usageData = {
  totals: {
    publisher: {
      counts: [5, 4, 3, 2],
      total: 14,
    },
  },
  platforms: [{
    name: 'platform-name',
    isPublisherPlatform: true,
    counts: [1, 2, 3, 4],
    total: 10,
  }],
};

const renderFullTextRequestUsageTable = (props = {}) => render(
  <Harness>
    <FullTextRequestUsageTable
      entityType={entityTypes.RESOURCE}
      platformType={platformTypes.ALL}
      startMonth="sep"
      usageData={usageData}
      {...props}
    />
  </Harness>
);

describe('Given FullTextRequestUsageTable', () => {
  it('should display FullTextRequestUsageTable label', () => {
    const { getByText } = renderFullTextRequestUsageTable();

    expect(getByText('ui-eholdings.usageConsolidation.fullTextRequestUsageTable')).toBeDefined();
  });

  it('should display Platform header', () => {
    const { getByText } = renderFullTextRequestUsageTable();

    expect(getByText('ui-eholdings.usageConsolidation.fullTextRequestUsageTable.header.platform')).toBeDefined();
  });

  describe('when platform type is publisher', () => {
    it('should display Yes in the Publisher column', () => {
      const { getByText } = renderFullTextRequestUsageTable({
        platformType: platformTypes.PUBLISHER_ONLY,
        usageData: {
          ...usageData,
          platforms: [{
            ...usageData.platforms[0],
            isPublisherPlatform: true,
          }],
        },
      });

      expect(getByText('ui-eholdings.yes')).toBeDefined();
    });
  });

  describe('when platform type is nonPublisher', () => {
    it('should display No in the Publisher column', () => {
      const { getByText } = renderFullTextRequestUsageTable({
        platformType: platformTypes.NON_PUBLISHER_ONLY,
        usageData: {
          ...usageData,
          platforms: [{
            ...usageData.platforms[0],
            isPublisherPlatform: false,
          }],
        },
      });

      expect(getByText('ui-eholdings.no')).toBeDefined();
    });
  });

  describe('when total value is of type string', () => {
    it('should anyway display right number in the Total column', () => {
      const { getByText } = renderFullTextRequestUsageTable({
        usageData: {
          ...usageData,
          platforms: [{
            ...usageData.platforms[0],
            total: '10',
          }],
        },
      });

      expect(getByText('10')).toBeDefined();
    });
  });
});
