import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import getSymbolFromCurrency from 'currency-symbol-map';

import {
  MultiColumnList,
  Button,
  Dropdown,
  DropdownButton,
  DropdownMenu,
  NoValue,
} from '@folio/stripes/components';

import { useSummaryTableProperties } from './column-properties';
import { costPerUse as costPerUseShape } from '../../../constants';

const propTypes = {
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  customProperties: PropTypes.object,
  entityType: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
};

const SummaryTable = ({
  id,
  customProperties,
  costPerUseData,
  year,
  entityType,
}) => {
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
  const currencySymbol = getSymbolFromCurrency(currency) || '';

  const {
    cost,
    costPerUse,
    usage,
  } = data?.attributes?.analysis;
  const noCostPerUseAvailable = !cost && !costPerUse && !usage;

  const formatCost = (value) => `${currencySymbol}${value} (${currency})`;
  const formatValue = (value, formatter) => {
    if (!value && value !== 0) {
      return <NoValue />;
    }

    return formatter ? formatter(value) : value;
  };

  if (noCostPerUseAvailable) {
    return (
      <div data-test-usage-consolidation-error>
        <FormattedMessage
          id={`ui-eholdings.usageConsolidation.summary.${entityType}.noData`}
          values={{ year }}
        />
      </div>
    );
  }

  const formatter = {
    cost: ({ cost }) => formatValue(cost, formatCost),
    costPerUse: ({ costPerUse }) => formatValue(costPerUse, formatCost),
    usage: ({ usage }) => formatValue(usage),
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
  };

  return (
    <MultiColumnList
      id={id}
      contentData={[{ cost, costPerUse, usage }]}
      formatter={formatter}
      {...useSummaryTableProperties(customProperties)}
    />
  );
};

SummaryTable.propTypes = propTypes;

export default SummaryTable;
