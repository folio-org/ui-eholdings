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
  NoValue,
} from '@folio/stripes/components';

import { getSummaryTableColumnProperties } from './column-properties';
import { costPerUse as costPerUseShape } from '../../../constants';

const propTypes = {
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  customProperties: PropTypes.object,
  entityType: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
};

const SummaryTable = ({
  costPerUseData,
  customProperties,
  entityType,
  id,
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
  const currencySymbol = getSymbolFromCurrency(currency) || '';

  const {
    cost,
    costPerUse,
    usage,
  } = data?.attributes?.analysis;
  const noCostPerUseAvailable = !cost && !costPerUse && !usage;

  const formatCost = (value) => `${currencySymbol}${value} (${currency})`;
  const formatValue = (value, callback) => {
    if (!value && value !== 0) {
      return <NoValue />;
    }

    return callback ? callback(value) : value;
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
    cost: rowData => formatValue(rowData.cost, formatCost),
    costPerUse: rowData => formatValue(rowData.costPerUse, formatCost),
    usage: rowData => formatValue(rowData.usage),
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
      {...getSummaryTableColumnProperties(intl, customProperties)}
    />
  );
};

SummaryTable.propTypes = propTypes;

export default SummaryTable;
