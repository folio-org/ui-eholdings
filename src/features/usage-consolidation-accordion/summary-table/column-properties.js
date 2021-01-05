import React from 'react';
import { FormattedNumber } from 'react-intl';

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
  UC_ACTIONS: 'ucActions',
};

const DEFAULT_SUMMARY_TABLE_COLUMN_WIDTH = {
  [DEFAULT_SUMMARY_TABLE_COLUMNS.COST]: '25%',
  [DEFAULT_SUMMARY_TABLE_COLUMNS.USAGE]: '20%',
  [DEFAULT_SUMMARY_TABLE_COLUMNS.COST_PER_USE]: '40%',
  [DEFAULT_SUMMARY_TABLE_COLUMNS.UC_ACTIONS]: '15%',
};

const DEFAULT_SUMMARY_TABLE_COLUMN_MAPPING = {
  [DEFAULT_SUMMARY_TABLE_COLUMNS.USAGE]: UsageColumnHeader,
  [DEFAULT_SUMMARY_TABLE_COLUMNS.COST_PER_USE]: 'ui-eholdings.usageConsolidation.summary.costPerUse',
  [DEFAULT_SUMMARY_TABLE_COLUMNS.UC_ACTIONS]: null,
};

const DEFAULT_FORMATTER = (currency) => ({
  cost: rowData => formatValue(rowData.cost, (value) => formatCost(currency, value)),
  costPerUse: rowData => formatValue(rowData.costPerUse, (value) => formatCost(currency, value)),
  usage: rowData => formatValue(rowData.usage, (value) => <FormattedNumber value={value} />),
});

export const getCostPerUseFormatter = DEFAULT_FORMATTER;

export const getSummaryTableColumnProperties = (intl, customProps = {}, args) => {
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
