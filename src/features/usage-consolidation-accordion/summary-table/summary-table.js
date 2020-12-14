import React from 'react';
import PropTypes from 'prop-types';
import {
  useIntl,
  FormattedMessage,
  FormattedNumber,
} from 'react-intl';

import {
  MultiColumnList,
  Button,
  Dropdown,
  DropdownButton,
  DropdownMenu,
  Icon,
  KeyValue,
} from '@folio/stripes/components';

import { getSummaryTableColumnProperties } from './column-properties';
import {
  formatCost,
  formatValue,
} from '../utilities';
import {
  costPerUse as costPerUseShape,
  entityTypes,
} from '../../../constants';

const propTypes = {
  contentData: PropTypes.array,
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  costPerUseType: PropTypes.string.isRequired,
  customProperties: PropTypes.object,
  entityType: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onViewTitles: PropTypes.func,
  year: PropTypes.string.isRequired,
};

const SummaryTable = ({
  costPerUseData,
  customProperties,
  id,
  year,
  costPerUseType,
  onViewTitles = () => {},
  entityType,
  ...rest
}) => {
  const intl = useIntl();
  const data = costPerUseData.data[costPerUseType];
  if (!data) {
    return null;
  }

  const currency = data?.attributes?.parameters?.currency;

  const {
    cost,
    costPerUse,
    usage,
  } = data?.attributes?.analysis;

  const handleViewTitles = (onToggle) => () => {
    onViewTitles();
    onToggle();
  };

  const formatter = {
    cost: rowData => formatValue(rowData.cost, (value) => formatCost(currency, value)),
    costPerUse: rowData => formatValue(rowData.costPerUse, (value) => formatCost(currency, value)),
    usage: rowData => formatValue(rowData.usage, (value) => <FormattedNumber value={value} />),
    ucActions: () => (
      <Dropdown
        id="summary-table-actions-dropdown"
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
            {entityType === entityTypes.PACKAGE ? (
              <Button
                id="summary-table-actions-view-titles"
                buttonStyle="dropdownItem fullWidth"
                role="menuitem"
                onClick={handleViewTitles(onToggle)}
                marginBottom0
              >
                <Icon
                  icon="eye-open"
                  size="small"
                >
                  <FormattedMessage id="ui-eholdings.usageConsolidation.summary.actions.view" />
                </Icon>
              </Button>
            ) : null
            }
            <Button
              buttonStyle="dropdownItem fullWidth"
              role="menuitem"
              onClick={onToggle}
              marginBottom0
            >
              <Icon
                icon="download"
                size="small"
              >
                <FormattedMessage id="ui-eholdings.usageConsolidation.summary.actions.export" />
              </Icon>
            </Button>
          </DropdownMenu>
        )}
      />
    )
  };

  const contentData = rest.contentData || [{ cost, costPerUse, usage }];

  return (
    <KeyValue>
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
    </KeyValue>
  );
};

SummaryTable.propTypes = propTypes;

export default SummaryTable;
