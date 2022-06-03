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

import FullTextRequestUsageTable from '../full-text-request-usage-table';
import SummaryTable from '../summary-table';
import NoCostPerUseAvailable from '../no-cost-per-use-available';
import {
  formatCoverageYear,
  formatCoverageFullDate,
  compareCoveragesToBeSortedInDescOrder,
  isBookPublicationType,
} from '../../../components/utilities';
import { useMultiColumnListSort } from '../../../hooks';
import {
  costPerUse as costPerUseShape,
  entityTypes,
  costPerUseTypes,
  sortOrders,
} from '../../../constants';
import styles from '../usage-consolidation-content.css';

const propTypes = {
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  metricType: PropTypes.string,
  platformType: PropTypes.string.isRequired,
  publicationType: PropTypes.string,
  startMonth: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
};

const UsageConsolidationContentTitle = ({
  costPerUseData,
  platformType,
  startMonth,
  publicationType,
  year,
  metricType,
}) => {
  const intl = useIntl();
  const [{ sortOrder, sortedColumn }, onHeaderClick] = useMultiColumnListSort(sortOrders.asc, 'packageName');

  const data = costPerUseData.data[costPerUseTypes.TITLE_COST_PER_USE];
  if (!data) {
    return null;
  }

  const { isFailed } = costPerUseData;

  if (isFailed) {
    return (
      <div data-test-cost-per-use-request-is-failed>
        <FormattedMessage
          id="ui-eholdings.usageConsolidation.fullTextRequestUsageTable.noResponse"
        />
      </div>
    );
  }

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
          marginBottom0
          items={coverageDates}
          listClass={styles.coverageDatesList}
        />
      );
    },
  };

  const contentData = holdingsSummary ?
    holdingsSummary.sort((a, b) => {
      const isAscendingSort = sortOrder.name === sortOrders.asc.name;
      const valA = isAscendingSort ? a : b;
      const valB = isAscendingSort ? b : a;

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
    visibleColumns: ['packageName', 'coverage', 'cost'],
    columnMapping: {
      packageName: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.summary.packageName' }),
      coverage: intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.summary.coverage' }),
      usage: null,
      costPerUse: null,
      cost: 'ui-eholdings.usageConsolidation.summary.titleCost',
    },
    columnWidths: {
      packageName: '43%',
      coverage: '39%',
      cost: '18%',
    },
    formatter,
  };

  const isPlatformsDataEmpty = !data.attributes?.usage?.platforms.length;

  return noCostPerUseAvailable && isPlatformsDataEmpty ? (
    <NoCostPerUseAvailable
      entityType={entityTypes.TITLE}
      year={year}
    />
  ) : (
    <>
      <SummaryTable
        id="titleUsageConsolidationSummary"
        contentData={contentData}
        entityType={entityTypes.TITLE}
        customProperties={customProperties}
        costPerUseType={costPerUseTypes.TITLE_COST_PER_USE}
        onHeaderClick={onHeaderClick}
        sortedColumn={sortedColumn}
        sortDirection={sortOrder.fullName}
        costPerUseData={costPerUseData}
        year={year}
        metricType={metricType}
        noCostPerUseAvailable={noCostPerUseAvailable}
      />
      <FullTextRequestUsageTable
        entityType={entityTypes.TITLE}
        usageData={data.attributes.usage}
        platformType={platformType}
        startMonth={startMonth}
      />
    </>
  );
};

UsageConsolidationContentTitle.propTypes = propTypes;

export default UsageConsolidationContentTitle;
