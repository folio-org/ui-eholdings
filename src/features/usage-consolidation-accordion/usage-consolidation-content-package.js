import React from 'react';
import PropTypes from 'prop-types';

import NoCostPerUseAvailable from './no-cost-per-use-available';
import SummaryTable from './summary-table';
import TitlesTable from './titles-table';
import {
  costPerUse as costPerUseShape,
  entityTypes,
  costPerUseTypes,
} from '../../constants';

const propTypes = {
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  metricType: PropTypes.string,
  onLoadMoreTitles: PropTypes.func.isRequired,
  onViewTitles: PropTypes.func.isRequired,
  year: PropTypes.number.isRequired,
};

const UsageConsolidationContentPackage = props => {
  const data = props.costPerUseData.data[costPerUseTypes.PACKAGE_COST_PER_USE];
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
    props.onLoadMoreTitles({
      page,
      pageSize,
      sort: sortedColumn,
      order: sortOrder,
    });
  };

  const handleSortTitles = (sortedColumn, sortOrder) => {
    props.onViewTitles({
      sort: sortedColumn,
      order: sortOrder,
    });
  };

  return noCostPerUseAvailable ? (
    <NoCostPerUseAvailable
      entityType={entityTypes.PACKAGE}
      year={props.year}
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
        {...props}
      />
      <TitlesTable
        costPerUseData={props.costPerUseData}
        fetchNextPage={handleFetchNextPage}
        onSortTitles={handleSortTitles}
      />
    </>
  );
};

UsageConsolidationContentPackage.propTypes = propTypes;

export default UsageConsolidationContentPackage;
