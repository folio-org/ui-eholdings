import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  useIntl,
} from 'react-intl';
import { Link } from 'react-router-dom';

import {
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import LoadingMessage from '../loading-message';
import Toaster from '../../../components/toaster';
import { getCostPerUseFormatter } from '../summary-table/column-properties';
import { useMultiColumnListSort } from '../../../hooks';
import {
  costPerUse as costPerUseShape,
  costPerUseTypes,
  sortOrders,
} from '../../../constants';

const propTypes = {
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  fetchNextPage: PropTypes.func.isRequired,
  onSortTitles: PropTypes.func.isRequired,
};

const PAGE_SIZE = 100;
const DEFAULT_PAGE = 1;

const TitlesTable = ({
  costPerUseData,
  fetchNextPage,
  onSortTitles,
}) => {
  const intl = useIntl();
  const [page, setPage] = useState(DEFAULT_PAGE);

  const handleSortChange = (newSortedColumn, newSortOrder) => {
    setPage(DEFAULT_PAGE);
    onSortTitles(newSortedColumn, newSortOrder.name);
  };

  const [{ sortedColumn, sortOrder }, onHeaderClick] = useMultiColumnListSort(sortOrders.desc, 'usage', handleSortChange);

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
    name: resource.attributes.name,
    percent: resource.attributes.percent,
    usage: resource.attributes.usage,
    costPerUse: resource.attributes.costPerUse,
    cost: resource.attributes.cost,
  }));

  const showLoadingMessage = isPackageTitlesLoading && !data;
  const hideTable = !isPackageTitlesLoading && !isPackageTitlesFailed && !data;

  if (showLoadingMessage) {
    return <LoadingMessage label="ui-eholdings.usageConsolidation.titles.loading" />;
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
              ...getCostPerUseFormatter(currency),
              name: rowData => (
                <Link to={`/eholdings/resources/${rowData.resourceId}`}>
                  {rowData.name}
                </Link>
              ),
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
