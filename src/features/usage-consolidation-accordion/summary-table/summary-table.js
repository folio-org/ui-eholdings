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
  NoValue,
} from '@folio/stripes/components';

import { getSummaryTableColumnProperties } from './column-properties';
import { costPerUse as costPerUseShape } from '../../../constants';

const propTypes = {
  contentData: PropTypes.array,
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  customProperties: PropTypes.object,
  entityType: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  noCostPerUseAvailable: PropTypes.bool.isRequired,
  year: PropTypes.string.isRequired,
};

const SummaryTable = ({
  costPerUseData,
  customProperties,
  entityType,
  id,
  year,
  noCostPerUseAvailable,
  ...rest
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

  const formatCost = (value) => {
    return (
      <FormattedNumber value={value}>
        {(formattedNumber) => `${currencySymbol}${formattedNumber} (${currency})`}
      </FormattedNumber>
    );
  };

  const formatValue = (value, callback) => {
    const number = typeof value === 'string' ? Number(value) : value;

    if (!number && number !== 0) {
      return <NoValue />;
    }

    const valueToFixed = number.toFixed(2);

    return callback ? callback(valueToFixed) : valueToFixed;
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
    usage: rowData => formatValue(rowData.usage, (value) => <FormattedNumber value={value} />),
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

  const contentData = rest.contentData || [{ cost, costPerUse, usage }];

  return (
    <MultiColumnList
      id={id}
      contentData={contentData}
      formatter={{
        ...formatter,
        ...customProperties.formatter,
      }}
      {...getSummaryTableColumnProperties(intl, customProperties)}
      {...rest}
    />
  );
};

SummaryTable.propTypes = propTypes;

export default SummaryTable;
