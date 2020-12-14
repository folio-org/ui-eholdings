import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import FullTextRequestUsageTable from './full-text-request-usage-table';
import SummaryTable from './summary-table';
import NoCostPerUseAvailable from './no-cost-per-use-available';
import {
  costPerUse as costPerUseShape,
  entityTypes,
  costPerUseTypes,
} from '../../constants';

const propTypes = {
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  platformType: PropTypes.string.isRequired,
  startMonth: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
};

const UsageConsolidationContentResource = ({
  costPerUseData,
  platformType,
  startMonth,
  year,
  ...rest
}) => {
  const data = costPerUseData.data[costPerUseTypes.RESOURCE_COST_PER_USE];
  if (!data) {
    return null;
  }

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
  } = data.attributes?.analysis;

  const noCostPerUseAvailable = !cost && !costPerUse && !usage;

  const customProperties = {
    columnMapping: { cost: 'ui-eholdings.usageConsolidation.summary.resourceCost' },
  };

  return noCostPerUseAvailable
    ? (
      <NoCostPerUseAvailable
        entityType={entityTypes.RESOURCE}
        year={year}
      />
    ) : (
      <>
        <SummaryTable
          id="resourceUsageConsolidationSummary"
          entityType={entityTypes.RESOURCE}
          customProperties={customProperties}
          noCostPerUseAvailable={noCostPerUseAvailable}
          costPerUseType={costPerUseTypes.RESOURCE_COST_PER_USE}
          costPerUseData={costPerUseData}
          {...rest}
        />
        <FullTextRequestUsageTable
          usageData={data.attributes.usage}
          platformType={platformType}
          startMonth={startMonth}
        />
      </>
    );
};

UsageConsolidationContentResource.propTypes = propTypes;

export default UsageConsolidationContentResource;
