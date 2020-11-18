import React, {
  useEffect,
  useState,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import saveAs from 'file-saver';

import { useStripes } from '@folio/stripes/core';
import {
  Accordion,
  Headline,
  Button,
  Callout,
} from '@folio/stripes/components';

import Toaster from '../../components/toaster';
import { getUsageConsolidation as getUsageConsolidationAction } from '../../redux/actions';
import { selectPropFromData } from '../../redux/selectors';
import { usageConsolidation as ucReduxStateShape } from '../../constants';

const propTypes = {
  getUsageConsolidation: PropTypes.func.isRequired,
  headerProps: PropTypes.object,
  id: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  section: PropTypes.node.isRequired,
  usageConsolidation: ucReduxStateShape.UsageConsolidationReduxStateShape.isRequired,
};

const UsageConsolidationAccordion = ({
  getUsageConsolidation,
  headerProps,
  id,
  isOpen = true,
  onToggle,
  usageConsolidation,
  okapi,
  packageId,
  packageName,
}) => {
  const stripes = useStripes();
  const calloutRef = useRef();
  const [accordionContentRef, setAccordionContentRef] = useState(null);

  const canViewUsageConsolidation = true || stripes.hasPerm('ui-eholdings.costperuse.view');

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

  if (usageConsolidation.isFailed || !canViewUsageConsolidation) {
    return null;
  }

  if (accordionContentRef) {
    accordionContentRef.style.margin = '0';
  }
  
  const clickDownloadButton = () => {
    console.log('click export button', packageId, okapi);
    console.log(calloutRef);
    const calloutID = calloutRef.current.sendCallout({
      type: 'success',
      message: 'success',
      timeout: 0,
    });
  
    const httpHeaders = Object.assign(
      {},
      {
        'X-Okapi-Tenant': okapi.tenant,
        'X-Okapi-Token': okapi.token,
        'Content-Type': 'application/json',
      }
    );

    const saveReport = (packageName, reportData, fileType) => {
      const blob = new Blob([reportData], { type: fileType });
      const fileName = `${packageName}.${fileType}`;
      saveAs(blob, fileName);
    };

    const format = 'csv';

    fetch(   
      `${okapi.url}/eholdings/packages/${packageId}/resources/costperuse/export`,
      { headers: httpHeaders }
    )
    .then((response) => {
      calloutRef.current.removeCallout(calloutID);
      if (response.status >= 400) {
        throw new SubmissionError({
          identifier: `Error ${response.status} retrieving report for multiple months`,
          _error: 'Fetch counter report failed',
        });
      } else {
        if (format === 'csv') {
          return response.text();
        }
        return response.blob();
      }
    })
    .then((text) => {
      saveReport(
        packageName,
        text,
        format
      );
    })
    .catch((err) => {
      calloutRef.current.sendCallout({
        type: 'error',
        message: 'error',
        timeout: 0,
      });
      throw new SubmissionError({
        identifier: `Error ${err} retrieving counter report for multiple months`,
        _error: 'Fetch counter report failed',
      });
    });
  }

  return usageConsolidation.data?.credentialsId ? (
    <>
      <Accordion
        id={id}
        label={getUsageConsolidationAccordionHeader()}
        open={isOpen}
        onToggle={onToggle}
        headerProps={headerProps}
        contentRef={(n) => setAccordionContentRef(n)}
      >
        <Button onClick={clickDownloadButton}>
          Export titles
        </Button>
      </Accordion>
      <Toaster
        position="bottom"
        toasts={getToastErrors()}
      />
      <Callout ref={calloutRef} />
    </>
  ) : null;
};

UsageConsolidationAccordion.propTypes = propTypes;

export default connect(
  (store) => ({
    usageConsolidation: selectPropFromData(store, 'usageConsolidation'),
    okapi: store.okapi,
  }), {
    getUsageConsolidation: getUsageConsolidationAction,
  }
)(UsageConsolidationAccordion);
