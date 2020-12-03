
import { combineMCLProps } from '../../../components/utilities';

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
  [DEFAULT_SUMMARY_TABLE_COLUMNS.USAGE]: 'ui-eholdings.usageConsolidation.summary.totalUsage',
  [DEFAULT_SUMMARY_TABLE_COLUMNS.COST_PER_USE]: 'ui-eholdings.usageConsolidation.summary.costPerUse',
  [DEFAULT_SUMMARY_TABLE_COLUMNS.UC_ACTIONS]: null,
};

export const getSummaryTableColumnProperties = (intl, customProps = {}) => {
  const defaultProps = {
    visibleColumns: [...Object.values(DEFAULT_SUMMARY_TABLE_COLUMNS)],
    columnMapping: { ...DEFAULT_SUMMARY_TABLE_COLUMN_MAPPING },
    columnWidths: { ...DEFAULT_SUMMARY_TABLE_COLUMN_WIDTH },
  };

  const combinedProps = combineMCLProps(defaultProps)(customProps);

  const formattedColumnMappingMessages = Object.keys(combinedProps.columnMapping).reduce((memo, currentKey) => {
    memo[currentKey] = combinedProps.columnMapping[currentKey]
      ? intl.formatMessage({ id: combinedProps.columnMapping[currentKey] })
      : null;

    return memo;
  }, {});

  combinedProps.columnMapping = formattedColumnMappingMessages;

  return combinedProps;
};
