import React from 'react';
import PropTypes from 'prop-types';

import { Callout } from '@folio/stripes/components';

import NoCostPerUseAvailable from './no-cost-per-use-available';
import SummaryTable from './summary-table';
import TitlesTable from './titles-table';
import { useFetchExportTitlesFromPackage } from '../../hooks';
import {
  costPerUse as costPerUseShape,
  entityTypes,
  costPerUseTypes,
} from '../../constants';

const propTypes = {
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  isExportDisabled: PropTypes.bool.isRequired,
  onLoadMoreTitles: PropTypes.func.isRequired,
  onViewTitles: PropTypes.func.isRequired,
  packageId: PropTypes.string.isRequired,
  packageName: PropTypes.string.isRequired,
  platformType: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
};

const UsageConsolidationContentPackage = ({
  costPerUseData,
  packageId,
  packageName,
  platformType,
  year,
  onLoadMoreTitles,
  onViewTitles,
  isExportDisabled,
}) => {
  const [{ calloutRef }, onExportTitles] = useFetchExportTitlesFromPackage({
    packageId,
    packageName,
    fiscalYear: year,
    platformType,
  });

  const data = costPerUseData.data[costPerUseTypes.PACKAGE_COST_PER_USE];
  if (!data) {
    return null;
  }

  const {
    cost,
    costPerUse,
    usage,
  } = data?.attributes?.analysis;

  const noCostPerUseAvailable = !cost && !costPerUse && !usage;

  const handleFetchNextPage = (page, pageSize, sortedColumn, sortOrder) => {
    onLoadMoreTitles({
      page,
      pageSize,
      sort: sortedColumn,
      order: sortOrder,
    });
  };

  const handleSortTitles = (sortedColumn, sortOrder) => {
    onViewTitles({
      sort: sortedColumn,
      order: sortOrder,
    });
  };

  return noCostPerUseAvailable ? (
    <NoCostPerUseAvailable
      entityType={entityTypes.PACKAGE}
      year={year}
    />
  ) : (
    <>
      <SummaryTable
        id="packageUsageConsolidationSummary"
        entityType={entityTypes.PACKAGE}
        customProperties={{
          columnMapping: { cost: 'ui-eholdings.usageConsolidation.summary.packageCost' },
        }}
        costPerUseType={costPerUseTypes.PACKAGE_COST_PER_USE}
        costPerUseData={costPerUseData}
        onExportTitles={onExportTitles}
        onViewTitles={onViewTitles}
        isExportDisabled={isExportDisabled}
      />
      <TitlesTable
        costPerUseData={costPerUseData}
        fetchNextPage={handleFetchNextPage}
        onSortTitles={handleSortTitles}
      />
      <Callout ref={calloutRef} />
    </>
  );
};

UsageConsolidationContentPackage.propTypes = propTypes;

export default UsageConsolidationContentPackage;
