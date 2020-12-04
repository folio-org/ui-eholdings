import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';
import { Link } from 'react-router-dom';

import {
  NoValue,
  List,
} from '@folio/stripes/components';

import SummaryTable from './summary-table';
import {
  formatCoverageYear,
  formatCoverageFullDate,
  compareCoveragesToBeSortedInDescOrder,
  isBookPublicationType,
} from '../../components/utilities';
import {
  costPerUse as costPerUseShape,
  entityTypes,
} from '../../constants';
import styles from './usage-consolidation-content.css';

const propTypes = {
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  publicationType: PropTypes.string,
  year: PropTypes.string.isRequired,
};

const UsageConsolidationContentTitle = (props) => {
  const intl = useIntl();
  const { costPerUseData, publicationType } = props;
  const [sortedColumn, setSortedColumn] = useState('packageName');
  const [sortOrder, setSortOrder] = useState('ascending');

  const { data } = costPerUseData;

  const holdingsSummary = data?.attributes?.analysis?.holdingsSummary;
  const noCostPerUseAvailable = !holdingsSummary;

  const onHeaderClick = (_, metadata) => {
    const { name } = metadata;

    if (name !== sortedColumn) {
      setSortedColumn(name);
      setSortOrder('ascending');
    } else {
      const order = sortOrder === 'ascending' ? 'descending' : 'ascending';
      setSortOrder(order);
    }
  };

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
          (
          <FormattedMessage id="ui-eholdings.usageConsolidation.summary.embargo" />
          {' '}
          <FormattedMessage
            id={`ui-eholdings.resource.embargoUnit.${embargoPeriod.embargoUnit}`}
            values={{ value: embargoPeriod.embargoValue }}
          />
          )
        </>
      ) : null;

      const isYearOnly = isBookPublicationType(publicationType);
      const dateRanges = [...rowData.coverages].sort(compareCoveragesToBeSortedInDescOrder);
      const coverageDates = dateRanges.map((coverageArrayObj, coverateDateIndex) => (
        <>
          {
            isYearOnly
              ? formatCoverageYear(coverageArrayObj)
              : formatCoverageFullDate(coverageArrayObj)
          }
          {coverateDateIndex !== dateRanges.length - 1 ? ', ' : <> {embargo}</>}
        </>
      ));

      return (
        <List
          items={coverageDates}
          listClass={styles.coverageDatesList}
        />
      );
    },
  };

  const contentData = holdingsSummary ?
    holdingsSummary.sort((a, b) => {
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
    }) : [];

  const customProperties = {
    visibleColumns: ['packageName', 'coverage', 'cost', 'usage', 'costPerUse'],
    columnMapping: {
      packageName: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.summary.packageName' }),
      coverage: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.summary.coverage' }),
      usage: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.summary.title.usage' }),
    },
    columnWidths: {
      packageName: '33%',
      coverage: '33%',
      cost: '12%',
      usage: '10%',
      costPerUse: '12%',
    },
    formatter,
  };

  return (
    <SummaryTable
      id="titleUsageConsolidationSummary"
      contentData={contentData}
      entityType={entityTypes.TITLE}
      customProperties={customProperties}
      noCostPerUseAvailable={noCostPerUseAvailable}
      onHeaderClick={onHeaderClick}
      sortedColumn={sortedColumn}
      sortDirection={sortOrder}
      {...props}
    />
  );
};

UsageConsolidationContentTitle.propTypes = propTypes;

export default UsageConsolidationContentTitle;
