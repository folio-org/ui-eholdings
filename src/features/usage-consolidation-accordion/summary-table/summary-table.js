import {
  useEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import noop from 'lodash/noop';

import {
  MultiColumnList,
  KeyValue,
} from '@folio/stripes/components';

import { getSummaryTableColumnProperties } from './column-properties';
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
  isExportDisabled: PropTypes.bool,
  metricType: PropTypes.string,
  noCostPerUseAvailable: PropTypes.bool.isRequired,
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
  metricType,
  onExportTitles,
  isExportDisabled,
  noCostPerUseAvailable,
  ...rest
}) => {
  const intl = useIntl();
  const summaryMCLRef = useRef(null);

  const data = costPerUseData.data[costPerUseType];
  const { isLoaded } = costPerUseData;

  const currency = data?.attributes?.parameters?.currency;

  const contentData = !noCostPerUseAvailable
    ? rest.contentData || [data?.attributes?.analysis]
    : [];

  useEffect(() => {
    if (summaryMCLRef.current && isLoaded) {
      summaryMCLRef.current.focus();
    }
  }, [summaryMCLRef, isLoaded]);

  if (!contentData.length) {
    return null;
  }

  const label = entityType === entityTypes.TITLE
    ? intl.formatMessage({ id: 'ui-eholdings.usageConsolidation.holdingsSummary' })
    : null;

  const columnProperties = getSummaryTableColumnProperties(intl, {
    currency,
    metricType,
    entityType,
  }, customProperties);

  return (
    <KeyValue label={label}>
      <MultiColumnList
        id={id}
        containerRef={summaryMCLRef}
        contentData={contentData}
        {...columnProperties}
        {...rest}
      />
    </KeyValue>
  );
};

SummaryTable.defaultProps = {
  isExportDisabled: false,
  onExportTitles: noop,
  onViewTitles: noop,
};

SummaryTable.propTypes = propTypes;

export default SummaryTable;
