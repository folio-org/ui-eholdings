import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  MultiColumnList,
  KeyValue,
} from '@folio/stripes/components';

import { getSummaryTableColumnProperties } from './column-properties';
import { costPerUse as costPerUseShape } from '../../../constants';

const propTypes = {
  contentData: PropTypes.array,
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  costPerUseType: PropTypes.string.isRequired,
  customProperties: PropTypes.object,
  entityType: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isExportDisabled: PropTypes.bool,
  metricType: PropTypes.string,
  noCostPerUseAvailable: PropTypes.bool.isRequired,
  onExportTitles: PropTypes.func,
  onViewTitles: PropTypes.func,
  year: PropTypes.number.isRequired,
};

const SummaryTable = ({
  costPerUseData,
  customProperties,
  id,
  costPerUseType,
  onViewTitles,
  entityType,
  metricType,
  onExportTitles,
  isExportDisabled,
  noCostPerUseAvailable,
  year,
  ...rest
}) => {
  const intl = useIntl();
  const data = costPerUseData.data[costPerUseType];

  if (!data) {
    return null;
  }

  const currency = data?.attributes?.parameters?.currency;

  const contentData = !noCostPerUseAvailable
    ? rest.contentData || [data?.attributes?.analysis]
    : [];

  const emptyMessage = (
    <div data-test-usage-consolidation-error>
      <FormattedMessage
        id={`ui-eholdings.usageConsolidation.summary.${entityType}.noData`}
        values={{ year }}
      />
    </div>
  );

  return (
    <KeyValue>
      <MultiColumnList
        id={id}
        contentData={contentData}
        isEmptyMessage={emptyMessage}
        {...getSummaryTableColumnProperties(intl, {
          currency,
          metricType,
          entityType,
        }, customProperties)}
        {...rest}
      />
    </KeyValue>
  );
};

SummaryTable.defaultProps = {
  isExportDisabled: false,
  onExportTitles: () => {},
  onViewTitles: () => {},
};

SummaryTable.propTypes = propTypes;

export default SummaryTable;
