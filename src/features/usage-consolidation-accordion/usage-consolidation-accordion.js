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
import { getUsageConsolidation as getUsageConsolidationAction } from '../../redux/actions';
import { selectPropFromData } from '../../redux/selectors';
import { usageConsolidation as ucReduxStateShape } from '../../constants';

const propTypes = {
  getUsageConsolidation: PropTypes.func.isRequired,
  headerProps: PropTypes.object,
  id: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onFilterSubmit: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  usageConsolidation: ucReduxStateShape.UsageConsolidationReduxStateShape.isRequired,
};

const UsageConsolidationAccordion = ({
  getUsageConsolidation,
  headerProps,
  id,
  isOpen = true,
  onToggle,
  usageConsolidation,
  onFilterSubmit,
}) => {
  const stripes = useStripes();
  const [accordionContentRef, setAccordionContentRef] = useState(null);

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

  if (accordionContentRef) {
    accordionContentRef.style.margin = '0';
  }

  const filtersInitialState = {
    year: moment().year(),
    platformType: usageConsolidation.data.platformType,
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
          contentRef={(n) => setAccordionContentRef(n)}
        >
          <UsageConsolidationFilters
            onSubmit={(filterData) => onFilterSubmit(filterData)}
            initialState={filtersInitialState}
          />
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
