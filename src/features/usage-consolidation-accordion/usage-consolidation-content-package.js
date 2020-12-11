import React from 'react';
import PropTypes from 'prop-types';

import FullTextRequestUsageTable from './full-text-request-usage-table';
import NoCostPerUseAvailable from './no-cost-per-use-available';
import SummaryTable from './summary-table';
import {
  costPerUse as costPerUseShape,
  entityTypes,
} from '../../constants';

const propTypes = {
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  platformType: PropTypes.string.isRequired,
  startMonth: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
};

const UsageConsolidationContentPackage = ({
  costPerUseData,
  platformType,
  startMonth,
  year,
}) => {
  const { isFailed } = costPerUseData;

  if (isFailed) {
    return (
      <div data-test-cost-per-use-request-is-failed>
        <FormattedMessage
          id="ui-eholdings.usageConsolidation.fullTextRequestUsageTable.noResponse"
        />
      </div>
    );
  }

  const {
    cost,
    costPerUse,
    usage,
  } = costPerUseData.data?.attributes?.analysis;

  const noCostPerUseAvailable = !cost && !costPerUse && !usage;

  const customProperties = {
    columnMapping: { cost: 'ui-eholdings.usageConsolidation.summary.packageCost' },
  };

  return noCostPerUseAvailable
    ? (
      <NoCostPerUseAvailable
        entityType={entityTypes.PACKAGE}
        year={year}
      />
    )
    : (
      <>
        <SummaryTable
          id="packageUsageConsolidationSummary"
          costPerUseData={costPerUseData}
          customProperties={customProperties}
        />
        <FullTextRequestUsageTable
          costPerUseData={costPerUseData}
          platformType={platformType}
          startMonth={startMonth}
        />
      </>
    );
};

UsageConsolidationContentPackage.propTypes = propTypes;

export default UsageConsolidationContentPackage;
