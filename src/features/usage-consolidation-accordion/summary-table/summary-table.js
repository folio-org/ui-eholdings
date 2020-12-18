import React from 'react';
import PropTypes from 'prop-types';
import {
  useIntl,
  FormattedMessage,
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
  costPerUse as costPerUseShape,
  entityTypes,
} from '../../../constants';

import style from './summary-table.css';

const propTypes = {
  contentData: PropTypes.array,
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  costPerUseType: PropTypes.string.isRequired,
  customProperties: PropTypes.object,
  entityType: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isExportDisabled: PropTypes.bool,
  onExportTitles: PropTypes.func,
  onViewTitles: PropTypes.func,
};

const SummaryTable = ({
  costPerUseData,
  customProperties,
  id,
  costPerUseType,
  onViewTitles,
  entityType,
  onExportTitles,
  isExportDisabled,
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
            <div>
            <Button
              buttonStyle="dropdownItem fullWidth"
              role="menuitem"
              onClick={() => {
                onExportTitles(true);
                onToggle();
              }}
              disabled={isExportDisabled}
              marginBottom0
            >
              <Icon
                icon="download"
                size="small"
              >
                <FormattedMessage id="ui-eholdings.usageConsolidation.summary.actions.export" />
              </Icon>
            </Button>
            {isExportDisabled && (
              <span className={style['limit-error']}>
                <FormattedMessage id="ui-eholdings.usageConsolidation.summary.exportTitles.limit" />
              </span>
            )}
            </div>
          </DropdownMenu>
        )}
      />
    )
  };

  const customPropertiesWithFormatter = {
    ...customProperties,
    formatter: {
      ...(customProperties.formatter || {}),
      ...formatter,
    },
  };

  const contentData = rest.contentData || [{ cost, costPerUse, usage }];

  return (
    <KeyValue>
      <MultiColumnList
        id={id}
        contentData={contentData}
        {...getSummaryTableColumnProperties(intl, customPropertiesWithFormatter, currency)}
        {...rest}
      />
    </KeyValue>
  );
};

SummaryTable.defaultProps = {
  onViewTitles: () => {},
  isExportDisabled: false,
};

SummaryTable.propTypes = propTypes;

export default SummaryTable;
