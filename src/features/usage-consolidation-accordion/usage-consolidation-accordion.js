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
} from '@folio/stripes/components';

import Toaster from '../../components/toaster';
import UsageConsolidationFilters from './usage-consolidation-filters';
import UsageConsolidationContentPackage from './usage-consolidation-content-package';
import UsageConsolidationContentTitle from './usage-consolidation-content-title';
import { getUsageConsolidation as getUsageConsolidationAction } from '../../redux/actions';
import { selectPropFromData } from '../../redux/selectors';
import {
  usageConsolidation as ucReduxStateShape,
  entityTypes,
  costPerUse,
} from '../../constants';

const propTypes = {
  costPerUseData: costPerUse.CostPerUseReduxStateShape.isRequired,
  getUsageConsolidation: PropTypes.func.isRequired,
  headerProps: PropTypes.object,
  id: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onFilterSubmit: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  publicationType: PropTypes.string,
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
  publicationType,
}) => {
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

  const getUsageConsolidationAccordionHeader = () => {
    return (
      <Headline
        size="large"
        tag="h3"
      >
        <FormattedMessage id="ui-eholdings.usageConsolidation" />
      </Headline>
    );
  };

  const handleFiltersSubmit = (changedFilterData) => {
    setFilterData(changedFilterData);
    onFilterSubmit(changedFilterData);
  };

  const renderContent = () => {
    const { isLoaded, isFailed } = costPerUseData;

    if (!isLoaded && !isFailed) {
      return null;
    }

    if (isFailed) {
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
          year={filterData.year}
        />
      );
    } else if (recordType === entityTypes.TITLE) {
      return (
        <UsageConsolidationContentTitle
          costPerUseData={costPerUseData}
          year={filterData.year}
          publicationType={publicationType}
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
          {renderContent()}
        </Accordion>
        <Toaster
          position="bottom"
          toasts={getToastErrors()}
        />
      </>
    ) : null
  );
};

UsageConsolidationAccordion.propTypes = propTypes;

export default connect(
  (store) => ({
    usageConsolidation: selectPropFromData(store, 'usageConsolidation'),
  }), {
    getUsageConsolidation: getUsageConsolidationAction,
  }
)(UsageConsolidationAccordion);
