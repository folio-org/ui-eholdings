import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

import { useStripes } from '@folio/stripes/core';
import {
  Accordion,
  Headline,
  InfoPopover,
  Spinner,
} from '@folio/stripes/components';

import Toaster from '../../components/toaster';
import UsageConsolidationFilters from './usage-consolidation-filters';
import UsageConsolidationContentPackage from './usage-consolidation-content-package';
import UsageConsolidationContentTitle from './usage-consolidation-content-title';
import UsageConsolidationContentResource from './usage-consolidation-content-resource';
import { getUsageConsolidation as getUsageConsolidationAction } from '../../redux/actions';
import { selectPropFromData } from '../../redux/selectors';
import {
  usageConsolidation as ucReduxStateShape,
  entityTypes,
  costPerUse,
} from '../../constants';

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
  isOpen,
  onToggle,
  usageConsolidation,
  onFilterSubmit,
  costPerUseData,
  recordType,
  recordId,
  recordName,
  publicationType,
  onViewTitles,
  onLoadMoreTitles,
  isExportDisabled,
}) => {
  const { isLoading: isCostPerUseDataLoading } = costPerUseData;
  const filtersInitialState = {
    year: moment().year(),
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

    return errors.map((error) => ({
      message: error.title,
      type: 'error',
    }));
  };

  const renderInfoPopover = () => {
    return (
      // eslint-disable-next-line jsx-a11y/interactive-supports-focus, jsx-a11y/click-events-have-key-events
      <span
        role="button"
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

  return (
    usageConsolidation.data?.credentialsId ? (
      <>
        <Accordion
          id={id}
          label={getUsageConsolidationAccordionHeader()}
          open={isOpen}
          onToggle={onToggle}
          headerProps={headerProps}
        >
          <UsageConsolidationFilters
            onSubmit={handleFiltersSubmit}
            initialState={filtersInitialState}
          />
          {isCostPerUseDataLoading
            ? <Spinner />
            : renderContent()
          }
        </Accordion>
        <Toaster
          position="bottom"
          toasts={getToastErrors()}
        />
      </>
    ) : null
  );
};

UsageConsolidationAccordion.defaultProps = {
  onViewTitles: () => {},
  onLoadMoreTitles: () => {},
  isExportDisabled: false,
  isOpen: false,
  publicationType: '',
  recordId: '',
};

UsageConsolidationAccordion.propTypes = propTypes;

export default connect(
  (store) => ({
    usageConsolidation: selectPropFromData(store, 'usageConsolidation'),
  }), {
    getUsageConsolidation: getUsageConsolidationAction,
  }
)(UsageConsolidationAccordion);
