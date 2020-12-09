import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  useIntl,
  FormattedNumber,
  FormattedMessage,
} from 'react-intl';
import { Link } from 'react-router-dom';

import {
  MultiColumnList,
  Icon,
  NoValue,
} from '@folio/stripes/components';

import Toaster from '../../../components/toaster';
import {
  formatCost,
  formatValue,
} from '../utilities';
import { useMultiColumnListSort } from '../../../hooks';
import {
  costPerUse as costPerUseShape,
  costPerUseTypes,
  sortOrders,
} from '../../../constants';

import styles from './titles-table.css';

const propTypes = {
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  fetchNextPage: PropTypes.func.isRequired,
  onSortTitles: PropTypes.func.isRequired,
};

const PAGE_SIZE = 100;

const TitlesTable = ({
  costPerUseData,
  fetchNextPage,
  onSortTitles,
}) => {
  const intl = useIntl();
  const [page, setPage] = useState(1);

  const handleSortChange = (sortedColumn, sortOrder) => {
    setPage(1);
    onSortTitles(sortedColumn, sortOrder.name);
  };

  const [sortParameters, onHeaderClick] = useMultiColumnListSort(sortOrders.desc, 'usage', handleSortChange);

  const {
    sortedColumn,
    sortOrder,
  } = sortParameters;

  const data = costPerUseData.data[costPerUseTypes.PACKAGE_TITLE_COST_PER_USE];
  const {
    isPackageTitlesLoading,
    isPackageTitlesFailed,
    errors: packageTitlesLoadErrors,
  } = costPerUseData;

  const currency = data?.attributes?.parameters?.currency;
  const totalResults = data?.attributes?.meta?.totalResults;

  const resources = data?.attributes?.resources || [];

  const titlesContentData = resources.map(resource => ({
    resourceId: resource.resourceId,
    type: resource.attributes.publicationType,
    ...resource.attributes,
  }));

  const showLoadingMessage = isPackageTitlesLoading && !data;
  const hideTable = !isPackageTitlesLoading && !isPackageTitlesFailed && !data;

  if (showLoadingMessage) {
    return (
      <div
        data-test-titles-table-loading-message
        className={styles.titlesLoadingMessage}
      >
        <div className={styles.titlesLoadingMessageLabelWrap}>
          <Icon iconRootClass={styles.titlesLoadingMessageIcon} icon="spinner-ellipsis" />
          <span className={styles.titlesLoadingMessageLabel}>
            <FormattedMessage id="ui-eholdings.usageConsolidation.titles.loading" />
          </span>
        </div>
      </div>
    );
  }

  if (hideTable) {
    return null;
  }

  const onNeedMoreData = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNextPage(nextPage, PAGE_SIZE, sortedColumn, sortOrder.name);
  };

  const getToastErrors = () => {
    return packageTitlesLoadErrors.map(() => ({
      message: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.titles.loadingFailed' }),
      type: 'error',
    }));
  };

  return (
    <>
      {!isPackageTitlesFailed
        ? (
          <MultiColumnList
            id="packageUsageConsolidationTitles"
            contentData={titlesContentData}
            formatter={{
              name: rowData => (
                <Link to={`/eholdings/resources/${rowData.resourceId}`}>
                  {rowData.name}
                </Link>
              ),
              cost: rowData => formatValue(rowData.cost, (value) => formatCost(currency, value)),
              costPerUse: rowData => formatValue(rowData.costPerUse, (value) => formatCost(currency, value)),
              usage: rowData => formatValue(rowData.usage, (value) => <FormattedNumber value={value} />),
              percent: ({ percent }) => {
                if (percent === 0) {
                  return <NoValue />;
                } else if (percent < 1) {
                  return '< 1 %';
                }

                return `${Math.round(percent)} %`;
              },
            }}
            visibleColumns={['name', 'type', 'cost', 'usage', 'costPerUse', 'percent']}
            columnMapping={{
              name: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.titles.title' }),
              type: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.titles.type' }),
              percent: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.titles.percentOfUsage' }),
              cost: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.titles.cost' }),
              usage: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.summary.title.usage' }),
              costPerUse: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.summary.costPerUse' }),
            }}
            columnWidths={{
              name: '41%',
              type: '12%',
              cost: '14%',
              usage: '10%',
              costPerUse: '13%',
              percent: '10%',
            }}
            totalCount={totalResults}
            onNeedMoreData={onNeedMoreData}
            pageAmount={PAGE_SIZE}
            pagingType="click"
            onHeaderClick={onHeaderClick}
            sortedColumn={sortedColumn}
            sortDirection={sortOrder.fullName}
          />
        ) : null
      }
      <Toaster
        toasts={getToastErrors()}
        position="bottom"
      />
    </>
  );
};

TitlesTable.propTypes = propTypes;

export default TitlesTable;
