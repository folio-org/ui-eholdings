import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedNumber,
  useIntl,
} from 'react-intl';

import {
  KeyValue,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import {
  costPerUse as costPerUseShape,
  platformTypes,
} from '../../../constants';

import styles from './full-text-request-usage-table.css';

const monthsNames = {
  JAN: 'jan',
  FEB: 'feb',
  MAR: 'mar',
  APR: 'apr',
  MAY: 'may',
  JUN: 'jun',
  JUL: 'jul',
  AUG: 'aug',
  SEP: 'sep',
  OCT: 'oct',
  NOV: 'nov',
  DEC: 'dec',
};

const propTypes = {
  costPerUseData: costPerUseShape.CostPerUseReduxStateShape.isRequired,
  platformType: PropTypes.string.isRequired,
  startMonth: PropTypes.string.isRequired,
};

const FullTextRequestUsageTable = ({
  costPerUseData,
  platformType,
  startMonth,
}) => {
  const {
    data: {
      attributes: {
        usage: {
          totals,
          platforms,
        },
      },
    },
  } = costPerUseData;

  const intl = useIntl();

  const indexOfStartMonth = Object.values(monthsNames).indexOf(startMonth);
  const months = Object.values(monthsNames).slice(indexOfStartMonth);

  const monthsColumnNames = months.reduce((acc, month) => ({
    ...acc,
    [month]: month,
  }), {});

  const columnNames = {
    PLATFORM: 'platform',
    ...monthsColumnNames,
    TOTAL: 'total',
    PUBLISHER: 'publisher',
  };

  const [sortedColumn, setSortedColumn] = useState(columnNames.PLATFORM);
  const [sortOrder, setSortOrder] = useState('ascending');

  const platformData = platforms.map(({ name, isPublisherPlatform, counts, total }) => {
    const countByMonth = counts.reduce((acc, value, index) => ({
      ...acc,
      [months[index]]: value,
    }), {});

    return {
      [columnNames.PLATFORM]: name,
      ...countByMonth,
      [columnNames.TOTAL]: total,
      [columnNames.PUBLISHER]: isPublisherPlatform,
    };
  });

  const currentPlatforms = platformType === platformTypes.ALL
    ? Object.values(platformTypes)
    : [platformType];

  const totalsData = currentPlatforms.map(platform => {
    const countByMonth = totals[platform]?.counts.reduce((acc, value, index) => ({
      ...acc,
      [months[index]]: value,
    }), {});

    return {
      [columnNames.PLATFORM]: platform,
      ...countByMonth,
      [columnNames.TOTAL]: totals[platform]?.total,
    };
  });

  if (platformType === platformTypes.ALL) {
    totalsData.push(totalsData[0]);
    totalsData.shift();
  }

  const contentPlatformData = platformData
    ? platformData.sort((a, b) => {
      const valA = sortOrder === 'ascending' ? a : b;
      const valB = sortOrder === 'ascending' ? b : a;

      if (sortedColumn === columnNames.PLATFORM) {
        return valA[sortedColumn].localeCompare(valB.packageName);
      }

      return valA[sortedColumn] - valB[sortedColumn];
    })
    : [];

  const visibleColumns = Object.values(columnNames);

  const columnMapping = visibleColumns.reduce((acc, columnName) => {
    acc[columnName] = intl.formatMessage({
      id: `ui-eholdings.usageConsolidation.fullTextRequestUsageTable.header.${columnName}`,
    });

    return acc;
  }, {});

  const formatValue = (value, platform) => {
    const number = typeof value === 'string' ? Number(value) : value;

    if (!number && number !== 0) {
      return <NoValue />;
    }

    const valueToFixed = number.toFixed(2);

    return (
      <div className={styles.usageView}>
        {!Object.values(platformTypes).includes(platform)
          ? <FormattedNumber value={valueToFixed} />
          : (
            <strong>
              <FormattedNumber value={valueToFixed} />
            </strong>
          )
        }
      </div>
    );
  };

  const formatterForMonths = months.reduce((acc, month) => ({
    ...acc,
    [month]: rowData => formatValue(rowData[month], rowData.platform),
  }), {});

  const formatter = {
    [columnNames.PLATFORM]: ({ platform }) => {
      if (Object.values(platformTypes).includes(platform)) {
        return intl.formatMessage({
          id: `ui-eholdings.usageConsolidation.fullTextRequestUsageTable.${platform}`,
        });
      }

      return platform;
    },
    ...formatterForMonths,
    [columnNames.TOTAL]: ({ total, platform }) => formatValue(total, platform),
    [columnNames.PUBLISHER]: ({ publisher, platform }) => {
      if (Object.values(platformTypes).includes(platform)) {
        return null;
      }

      return intl.formatMessage({
        id: `ui-eholdings.${publisher ? 'yes' : 'no'}`,
      });
    },
  };

  const columnWidthsForMonths = months.reduce((acc, month) => ({
    ...acc,
    [month]: `${66 / months.length}%`,
  }), {});

  const columnWidths = {
    [columnNames.PLATFORM]: '18%',
    ...columnWidthsForMonths,
    [columnNames.TOTAL]: '7%',
    [columnNames.PUBLISHER]: '9%',
  };

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

  return (
    <KeyValue
      label={intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.fullTextRequestUsageTable' })}
    >
      <MultiColumnList
        id="fullTextRequestUsageTable"
        contentData={[...contentPlatformData, ...totalsData]}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        formatter={formatter}
        isEmptyData={intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.summary.title.noData' })}
        onHeaderClick={onHeaderClick}
        sortedColumn={sortedColumn}
        sortDirection={sortOrder}
        nonInteractiveHeaders={months}
      />
    </KeyValue>
  );
};

FullTextRequestUsageTable.propTypes = propTypes;

export default FullTextRequestUsageTable;
