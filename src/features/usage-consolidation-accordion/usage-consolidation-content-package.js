import React from 'react';
import PropTypes from 'prop-types';
import {
  useIntl,
  FormattedMessage,
  FormattedNumber,
} from 'react-intl';
import getSymbolFromCurrency from 'currency-symbol-map';

import {
  MultiColumnList,
  Button,
  Dropdown,
  DropdownButton,
  DropdownMenu,
} from '@folio/stripes/components';

import {
  formatCost,
  formatValue,
} from './utilities';
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
  const { data } = costPerUseData;

  const currency = data?.attributes?.parameters?.currency;
  const currencySymbol = getSymbolFromCurrency(currency) || '';

  const {
    cost,
    costPerUse,
    usage,
  } = data?.attributes?.analysis;
  const noCostPerUseAvailable = !cost && !costPerUse && !usage;

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
    <MultiColumnList
      id="packageUsageConsolidationSummary"
      onRowClick={() => {}}
      contentData={[{ cost, costPerUse, usage }]}
      visibleColumns={['cost', 'usage', 'costPerUse', 'ucActions']}
      formatter={{
        cost: (rowData) => formatValue(rowData.cost, (value) => formatCost(value, currencySymbol, currency)),
        costPerUse: (rowData) => formatValue(rowData.costPerUse, (value) => formatCost(value, currencySymbol, currency)),
        usage: (rowData) => formatValue(rowData.usage, (value) => <FormattedNumber value={value} />),
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
        usage: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.summary.package.usage' }),
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
  );
};

UsageConsolidationContentPackage.propTypes = propTypes;

export default UsageConsolidationContentPackage;
