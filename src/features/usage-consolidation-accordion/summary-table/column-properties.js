import React from 'react';
import {
  FormattedNumber,
  FormattedMessage,
} from 'react-intl';

import UsageColumnHeader from './usage-column-header';
import { combineMCLProps } from '../../../components/utilities';
import {
  formatValue,
  formatCost,
} from '../utilities';

export const DEFAULT_SUMMARY_TABLE_COLUMNS = {
  COST: 'cost',
  USAGE: 'usage',
  COST_PER_USE: 'costPerUse',
};

const DEFAULT_SUMMARY_TABLE_COLUMN_WIDTH = {
  [DEFAULT_SUMMARY_TABLE_COLUMNS.COST]: '30%',
  [DEFAULT_SUMMARY_TABLE_COLUMNS.USAGE]: '25%',
  [DEFAULT_SUMMARY_TABLE_COLUMNS.COST_PER_USE]: '45%',
};

const DEFAULT_SUMMARY_TABLE_COLUMN_MAPPING = {
  [DEFAULT_SUMMARY_TABLE_COLUMNS.USAGE]: (props) => (
    <UsageColumnHeader
      {...props}
      label={<FormattedMessage id="ui-eholdings.usageConsolidation.summary.totalUsage" />}
    />
  ),
  [DEFAULT_SUMMARY_TABLE_COLUMNS.COST_PER_USE]: 'ui-eholdings.usageConsolidation.summary.costPerUse',
};

const DEFAULT_FORMATTER = (currency) => ({
  cost: rowData => formatValue(rowData.cost, (value) => formatCost(currency, value)),
  costPerUse: rowData => formatValue(rowData.costPerUse, (value) => formatCost(currency, value)),
  usage: rowData => formatValue(rowData.usage, (value) => <FormattedNumber value={value} />),
});

export const getCostPerUseFormatter = DEFAULT_FORMATTER;

export const getSummaryTableColumnProperties = (intl, args, customProps = {}) => {
  const defaultProps = {
    visibleColumns: [...Object.values(DEFAULT_SUMMARY_TABLE_COLUMNS)],
    columnMapping: { ...DEFAULT_SUMMARY_TABLE_COLUMN_MAPPING },
    columnWidths: { ...DEFAULT_SUMMARY_TABLE_COLUMN_WIDTH },
    formatter: DEFAULT_FORMATTER(args.currency),
  };

  const combinedProps = combineMCLProps(defaultProps)(customProps);

  const formattedColumnMappingMessages = Object.keys(combinedProps.columnMapping).reduce((memo, currentKey) => {
    const columnMappingValue = combinedProps.columnMapping[currentKey];

    if (!columnMappingValue) {
      memo[currentKey] = null;
    } else if (typeof columnMappingValue === 'string') {
      memo[currentKey] = intl.formatMessage({ id: columnMappingValue });
    } else if (typeof columnMappingValue === 'function') {
      memo[currentKey] = columnMappingValue(args);
    } else {
      memo[currentKey] = columnMappingValue;
    }

    return memo;
  }, {});

  combinedProps.columnMapping = formattedColumnMappingMessages;

  return combinedProps;
};
