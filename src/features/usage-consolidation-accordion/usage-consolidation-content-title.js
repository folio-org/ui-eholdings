import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  useIntl,
  FormattedMessage,
  FormattedNumber,
} from 'react-intl';
import { Link } from 'react-router-dom';
import getSymbolFromCurrency from 'currency-symbol-map';

import {
  MultiColumnList,
  NoValue,
  List,
} from '@folio/stripes/components';

import {
  formatCoverageYear,
  formatCoverageFullDate,
  compareCoveragesToBeSortedInDescOrder,
  isBookPublicationType,
} from '../../components/utilities';
import {
  formatCost,
  formatValue,
} from './utilities';
import { costPerUse as costPerUseShape } from '../../constants';
import styles from './usage-consolidation-content.css';

const propTypes = {
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  publicationType: PropTypes.string,
  year: PropTypes.string.isRequired,
};

const UsageConsolidationContentTitle = ({
  costPerUseData,
  year,
  publicationType,
}) => {
  const intl = useIntl();
  const [sortedColumn, setSortedColumn] = useState('packageName');
  const [sortOrder, setSortOrder] = useState('ascending');

  const { data } = costPerUseData;

  const currency = data?.attributes?.parameters?.currency;
  const currencySymbol = getSymbolFromCurrency(currency) || '';

  const holdingsSummary = data?.attributes?.analysis?.holdingsSummary;
  const noCostPerUseAvailable = !holdingsSummary;

  const formatter = {
    packageName: (rowData) => {
      return (
        <Link to={`/eholdings/resources/${rowData.resourceId}`}>
          {rowData.packageName}
        </Link>
      );
    },
    coverage: (rowData) => {
      if (!rowData.coverages?.length) {
        return <NoValue />;
      }

      const { embargoPeriod } = rowData;
      const hasEmbargo = embargoPeriod?.embargoValue && embargoPeriod?.embargoUnit;
      const embargo = hasEmbargo ? (
        <>
          {' ('}
          <FormattedMessage id="ui-eholdings.usageConsolidation.summary.embargo" />
          {' '}
          <FormattedMessage
            id={`ui-eholdings.resource.embargoUnit.${embargoPeriod.embargoUnit}`}
            values={{ value: embargoPeriod.embargoValue }}
          />
          {')'}
        </>
      ) : null;

      const isYearOnly = isBookPublicationType(publicationType);
      const dateRanges = [...rowData.coverages].sort(compareCoveragesToBeSortedInDescOrder);
      const coverageDates = dateRanges.map((coverageArrayObj, i) => (
        <>
          {
            isYearOnly
              ? formatCoverageYear(coverageArrayObj)
              : formatCoverageFullDate(coverageArrayObj)
          }
          {i !== dateRanges.length - 1 ? ', ' : embargo}
        </>
      ));

      return (
        <List
          items={coverageDates}
          listClass={styles.coverageDatesList}
        />
      );
    },
    cost: (rowData) => formatValue(rowData.cost, (value) => formatCost(value, currencySymbol, currency)),
    costPerUse: (rowData) => formatValue(rowData.costPerUse, (value) => formatCost(value, currencySymbol, currency)),
    usage: (rowData) => formatValue(rowData.usage, (usage) => <FormattedNumber value={usage} />),
  };

  if (noCostPerUseAvailable) {
    return (
      <div data-test-usage-consolidation-error>
        <FormattedMessage
          id="ui-eholdings.usageConsolidation.summary.noData"
          values={{
            record: 'title',
            year,
          }}
        />
      </div>
    );
  }

  const sortedHoldingsSummary = holdingsSummary.sort((a, b) => {
    const valA = sortOrder === 'ascending' ? a : b;
    const valB = sortOrder === 'ascending' ? b : a;

    if (sortedColumn === 'packageName') {
      return valA.packageName.localeCompare(valB.packageName);
    }
    if (sortedColumn === 'coverage') {
      const coverageA = [...valA.coverages].sort(compareCoveragesToBeSortedInDescOrder)[0];
      const coverageB = [...valB.coverages].sort(compareCoveragesToBeSortedInDescOrder)[0];

      // Move empty coverages to be first when ascending order, and last when descending order
      if (!coverageA) {
        return -1;
      }
      if (!coverageB) {
        return 1;
      }

      return compareCoveragesToBeSortedInDescOrder(coverageB, coverageA);
    }

    return valA[sortedColumn] - valB[sortedColumn];
  });

  return (
    <MultiColumnList
      id="titleUsageConsolidationSummary"
      contentData={sortedHoldingsSummary}
      visibleColumns={['packageName', 'coverage', 'cost', 'usage', 'costPerUse']}
      formatter={formatter}
      columnMapping={{
        packageName: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.summary.packageName' }),
        coverage: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.summary.coverage' }),
        cost: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.summary.packageCost' }),
        usage: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.summary.title.usage' }),
        costPerUse: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.summary.costPerUse' }),
      }}
      columnWidths={{
        packageName: '33%',
        coverage: '33%',
        cost: '12%',
        usage: '10%',
        costPerUse: '12%',
      }}
      onHeaderClick={(e, metadata) => {
        const { name } = metadata;

        if (name !== sortedColumn) {
          setSortedColumn(name);
          setSortOrder('ascending');
        } else {
          const order = sortOrder === 'ascending' ? 'descending' : 'ascending';
          setSortOrder(order);
        }
      }}
      sortedColumn={sortedColumn}
      sortDirection={sortOrder}
    />
  );
};

UsageConsolidationContentTitle.propTypes = propTypes;

export default UsageConsolidationContentTitle;
