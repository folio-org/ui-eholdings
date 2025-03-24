import {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';

import { useStripes } from '@folio/stripes/core';
import {
  Accordion,
  Headline,
  InfoPopover,
  Spinner,
  dayjs,
} from '@folio/stripes/components';

import Toaster from '../../../components/toaster';
import UsageConsolidationFilters from '../usage-consolidation-filters';
import UsageConsolidationContentPackage from '../usage-consolidation-content-package';
import UsageConsolidationContentTitle from '../usage-consolidation-content-title';
import UsageConsolidationContentResource from '../usage-consolidation-content-resource';

import {
  usageConsolidation as ucReduxStateShape,
  entityTypes,
  costPerUse,
} from '../../../constants';

import styles from './usage-consolidation-accordion.css';

const propTypes = {
  costPerUseData: costPerUse.CostPerUseReduxStateShape.isRequired,
  getUsageConsolidation: PropTypes.func.isRequired,
  headerProps: PropTypes.object,
  id: PropTypes.string.isRequired,
  isExportDisabled: PropTypes.bool,
  isOpen: PropTypes.bool,
  onFilterSubmit: PropTypes.func.isRequired,
  onLoadMoreTitles: PropTypes.func,
  onToggle: PropTypes.func.isRequired,
  onViewTitles: PropTypes.func,
  publicationType: PropTypes.string,
  recordId: PropTypes.string,
  recordName: PropTypes.string,
  recordType: PropTypes.string.isRequired,
  usageConsolidation: ucReduxStateShape.UsageConsolidationReduxStateShape.isRequired,
};

const UsageConsolidationAccordion = ({
  getUsageConsolidation,
  headerProps,
  id,
  isOpen = false,
  onToggle,
  usageConsolidation,
  onFilterSubmit,
  costPerUseData,
  recordType,
  recordId = '',
  recordName,
  publicationType = '',
  onViewTitles = noop,
  onLoadMoreTitles = noop,
  isExportDisabled = false,
}) => {
  const { isLoading: isCostPerUseDataLoading } = costPerUseData;

  const filtersInitialState = {
    year: dayjs().year(),
    platformType: usageConsolidation.data.platformType,
  };

  const stripes = useStripes();
  const [filterData, setFilterData] = useState(filtersInitialState);

  const canViewUsageConsolidation = stripes.hasPerm('ui-eholdings.costperuse.view');

  useEffect(() => {
    if (canViewUsageConsolidation) {
      getUsageConsolidation();
    }
  }, [canViewUsageConsolidation, getUsageConsolidation]);

  const getToastErrors = () => {
    const { errors } = usageConsolidation;

    return errors.map((error, index) => ({
      id: `error-${index}`,
      message: error.title,
      type: 'error',
    }));
  };

  const renderInfoPopover = () => {
    return (
      // eslint-disable-next-line jsx-a11y/interactive-supports-focus, jsx-a11y/click-events-have-key-events
      <span
        role="button"
        data-testid="usage-consolidation-header-info-popover"
        onClick={(e) => {
          // We don't need to open / close the accordion by clicking on the info icon
          e.stopPropagation();
        }}
      >
        <InfoPopover
          allowAnchorClick
          hideOnButtonClick
          iconSize="medium"
          content={<FormattedMessage id="ui-eholdings.usageConsolidation.infoPopover.content" />}
          buttonLabel={<FormattedMessage id="ui-eholdings.usageConsolidation.infoPopover.buttonLabel" />}
          buttonHref="https://wiki.folio.org/display/FOLIOtips/Usage+Consolidation"
          buttonTarget="_blank"
        />
      </span>
    );
  };

  const getUsageConsolidationAccordionHeader = () => {
    return (
      <Headline
        size="large"
        tag="h3"
        className={styles['accordion-usage-consolidation-header']}
      >
        <FormattedMessage id="ui-eholdings.usageConsolidation" />
        {renderInfoPopover()}
      </Headline>
    );
  };

  const handleFiltersSubmit = (changedFilterData) => {
    setFilterData(changedFilterData);
    onFilterSubmit(changedFilterData);
  };

  const handleViewTitles = (pageAndSortParams) => {
    onViewTitles({
      ...pageAndSortParams,
      ...filterData,
    });
  };

  const handleLoadMoreTitles = (pageAndSortParams) => {
    onLoadMoreTitles({
      ...pageAndSortParams,
      ...filterData,
    });
  };

  const renderContent = () => {
    const {
      isLoaded: isCostPerUseDataLoaded,
      isFailed: isCostPerUseDataLoadingFailed,
    } = costPerUseData;

    const {
      platformType,
      year,
    } = filterData;
    const {
      startMonth,
      metricType,
    } = usageConsolidation.data;

    if (!isCostPerUseDataLoaded && !isCostPerUseDataLoadingFailed) {
      return null;
    }

    if (isCostPerUseDataLoadingFailed) {
      return (
        <div data-test-usage-consolidation-error>
          <FormattedMessage id="ui-eholdings.usageConsolidation.summary.error" />
        </div>
      );
    }

    if (recordType === entityTypes.PACKAGE) {
      return (
        <UsageConsolidationContentPackage
          costPerUseData={costPerUseData}
          packageId={recordId}
          packageName={recordName}
          platformType={platformType}
          year={year}
          onViewTitles={handleViewTitles}
          onLoadMoreTitles={handleLoadMoreTitles}
          metricType={metricType}
          isExportDisabled={isExportDisabled}
        />
      );
    } else if (recordType === entityTypes.TITLE) {
      return (
        <UsageConsolidationContentTitle
          costPerUseData={costPerUseData}
          year={year}
          publicationType={publicationType}
          platformType={platformType}
          startMonth={startMonth}
          metricType={metricType}
        />
      );
    } else if (recordType === entityTypes.RESOURCE) {
      return (
        <UsageConsolidationContentResource
          costPerUseData={costPerUseData}
          year={year}
          platformType={platformType}
          startMonth={startMonth}
          metricType={metricType}
        />
      );
    }

    return null;
  };

  if (usageConsolidation.isFailed || !canViewUsageConsolidation) {
    return null;
  }

  const usageConsolidationContent = isCostPerUseDataLoading
    ? <Spinner />
    : renderContent();

  return (
    usageConsolidation.data?.credentialsId
      ? (
        <div data-testid="usage-consolidation-accordion">
          <Accordion
            id={id}
            label={getUsageConsolidationAccordionHeader()}
            open={isOpen}
            onToggle={onToggle}
            headerProps={headerProps}
          >
            {isOpen && (
              <UsageConsolidationFilters
                onSubmit={handleFiltersSubmit}
                initialState={filtersInitialState}
              />
            )}
            {usageConsolidationContent}
          </Accordion>
          <Toaster
            position="bottom"
            toasts={getToastErrors()}
          />
        </div>
      )
      : null
  );
};

UsageConsolidationAccordion.propTypes = propTypes;

export default UsageConsolidationAccordion;
