import {
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Callout,
  Button,
  Dropdown,
  DropdownButton,
  DropdownMenu,
  Icon,
} from '@folio/stripes/components';

import NoCostPerUseAvailable from './no-cost-per-use-available';
import SummaryTable from './summary-table';
import { DEFAULT_SUMMARY_TABLE_COLUMNS } from './summary-table/column-properties';
import TitlesTable from './titles-table';
import { useFetchExportTitlesFromPackage } from '../../hooks';
import {
  costPerUse as costPerUseShape,
  entityTypes,
  costPerUseTypes,
} from '../../constants';

import style from './usage-consolidation-content.css';

const propTypes = {
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  isExportDisabled: PropTypes.bool.isRequired,
  metricType: PropTypes.string,
  onLoadMoreTitles: PropTypes.func.isRequired,
  onViewTitles: PropTypes.func.isRequired,
  packageId: PropTypes.string.isRequired,
  packageName: PropTypes.string.isRequired,
  platformType: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
};

const UsageConsolidationContentPackage = ({
  costPerUseData,
  packageId,
  packageName,
  platformType,
  year,
  onLoadMoreTitles,
  onViewTitles,
  isExportDisabled,
  metricType,
}) => {
  const calloutRef = useRef();
  const { setIsLoading: onExportTitles } = useFetchExportTitlesFromPackage({
    packageId,
    packageName,
    fiscalYear: year,
    platformType,
    callout: calloutRef.current,
  });

  const data = costPerUseData.data[costPerUseTypes.PACKAGE_COST_PER_USE];
  if (!data) {
    return null;
  }

  const {
    cost,
    costPerUse,
    usage,
  } = data?.attributes?.analysis;

  const noCostPerUseAvailable = !cost && !costPerUse && !usage;

  const handleFetchPage = (page, pageSize, sortedColumn, sortOrder) => {
    onLoadMoreTitles({
      page,
      pageSize,
      sort: sortedColumn,
      order: sortOrder,
    });
  };

  const handleSortTitles = (sortedColumn, sortOrder) => {
    onViewTitles({
      sort: sortedColumn,
      order: sortOrder,
    });
  };

  const handleViewTitles = onToggle => () => {
    onViewTitles();
    onToggle();
  };

  const customProperties = {
    visibleColumns: [...Object.values(DEFAULT_SUMMARY_TABLE_COLUMNS), 'actions'],
    columnMapping: {
      [DEFAULT_SUMMARY_TABLE_COLUMNS.COST]: 'ui-eholdings.usageConsolidation.summary.packageCost',
      actions: null,
    },
    columnWidths: {
      [DEFAULT_SUMMARY_TABLE_COLUMNS.COST]: '25%',
      [DEFAULT_SUMMARY_TABLE_COLUMNS.USAGE]: '20%',
      [DEFAULT_SUMMARY_TABLE_COLUMNS.COST_PER_USE]: '40%',
      actions: '15%',
    },
    formatter: {
      actions: () => (
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
            <DropdownMenu role="menu">
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
    },
  };

  return noCostPerUseAvailable ? (
    <NoCostPerUseAvailable
      entityType={entityTypes.PACKAGE}
      year={year}
    />
  ) : (
    <>
      <SummaryTable
        id="packageUsageConsolidationSummary"
        entityType={entityTypes.PACKAGE}
        customProperties={customProperties}
        costPerUseType={costPerUseTypes.PACKAGE_COST_PER_USE}
        costPerUseData={costPerUseData}
        onExportTitles={onExportTitles}
        onViewTitles={onViewTitles}
        isExportDisabled={isExportDisabled}
        metricType={metricType}
        noCostPerUseAvailable={noCostPerUseAvailable}
      />
      <TitlesTable
        costPerUseData={costPerUseData}
        fetchPage={handleFetchPage}
        onSortTitles={handleSortTitles}
      />
      <Callout ref={calloutRef} />
    </>
  );
};

UsageConsolidationContentPackage.propTypes = propTypes;

export default UsageConsolidationContentPackage;
