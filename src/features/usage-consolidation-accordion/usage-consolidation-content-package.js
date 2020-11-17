import React from 'react';
import PropTypes from 'prop-types';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';
import getSymbolFromCurrency from 'currency-symbol-map';

import {
  MultiColumnList,
  Button,
  Dropdown,
  DropdownButton,
  DropdownMenu,
} from '@folio/stripes/components';

import { costPerUse as costPerUseShape } from '../../constants';

const propTypes = {
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  year: PropTypes.string.isRequired,
};

const UsageConsolidationContentPackage = ({
  costPerUseData,
  year,
}) => {
  const intl = useIntl();
  const {
    isLoaded,
    isFailed,
    data,
  } = costPerUseData;

  if (!isLoaded && !isFailed) {
    return null;
  }

  if (isFailed) {
    return (
      <div data-test-usage-consolidation-error>
        <FormattedMessage id="ui-eholdings.usageConsolidation.summary.error" />
      </div>
    );
  }

  const currency = data?.attributes?.parameters?.currency;
  const currencySymbol = getSymbolFromCurrency(currency);

  const {
    cost,
    costPerUse,
    usage,
  } = data?.attributes?.analysis;
  const noCostPerUseAvailable = !cost && !costPerUse && !usage;

  const formatCost = (value) => `${currencySymbol || ''}${value} (${currency})`;
  const formatValue = (value, formatter) => {
    if (!noCostPerUseAvailable && !value) {
      return '-';
    }

    return formatter ? formatter(value) : value;
  };

  if (noCostPerUseAvailable) {
    return (
      <div data-test-usage-consolidation-error>
        <FormattedMessage
          id="ui-eholdings.usageConsolidation.summary.noData"
          values={{
            record: 'package',
            year,
          }}
        />
      </div>
    );
  }

  return (
    <>
      <MultiColumnList
        id="packageUsageConsolidationSummary"
        onRowClick={() => {}}
        contentData={[{ cost, costPerUse, usage }]}
        visibleColumns={['cost', 'usage', 'costPerUse', 'ucActions']}
        formatter={{
          cost: (rowData) => formatValue(rowData.cost, formatCost),
          costPerUse: (rowData) => formatValue(rowData.costPerUse, formatCost),
          usage: (rowData) => formatValue(rowData.usage),
          ucActions: () => (
            <Dropdown
              renderTrigger={({ onToggle, triggerRef, ariaProps, keyHandler, getTriggerProps }) => (
                <DropdownButton
                  id="usage-consolidation-actions-dropdown-button"
                  ref={triggerRef}
                  onKeyDown={keyHandler}
                  marginBottom0
                  onClick={onToggle}
                  {...ariaProps}
                  {...getTriggerProps()}
                >
                  <FormattedMessage id="ui-eholdings.usageConsolidation.summary.actions" />
                </DropdownButton>
              )}
              renderMenu={({ onToggle }) => (
                <DropdownMenu
                  role="menu"
                >
                  <Button
                    buttonStyle="dropdownItem fullWidth"
                    role="menuitem"
                    onClick={onToggle}
                    marginBottom0
                  >
                    <FormattedMessage id="ui-eholdings.usageConsolidation.summary.actions.export" />
                  </Button>
                </DropdownMenu>
              )}
            />
          )
        }}
        columnMapping={{
          cost: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.summary.packageCost' }),
          usage: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.summary.totalUsage' }),
          costPerUse: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.summary.costPerUse' }),
          ucActions: null,
        }}
        columnWidths={{
          cost: '25%',
          usage: '20%',
          costPerUse: '40%',
          ucActions: '15%',
        }}
      />
    </>
  );
};

UsageConsolidationContentPackage.propTypes = propTypes;

export default UsageConsolidationContentPackage;
