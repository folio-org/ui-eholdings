import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { KeyValue } from '@folio/stripes-components';
import AccordionHeader from '@folio/stripes-components/lib/Accordion/headers/DefaultAccordionHeader';
import styles from './accordion-list-header.css';

export default function AccordionListHeader(props) {
  return (
    <div className={styles['accordion-list-header']}>
      <AccordionHeader {...props} />
      {props.open && (
        <KeyValue label="Records Found">
          <div data-test-eholdings-details-view-results-count>
            <FormattedNumber value={props.resultsLength} />
          </div>
        </KeyValue>
      )}
    </div>
  );
}

AccordionListHeader.propTypes = {
  resultsLength: PropTypes.number,
  open: PropTypes.bool
};
