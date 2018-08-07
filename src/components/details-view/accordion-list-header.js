import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber, injectIntl, intlShape } from 'react-intl';
import { KeyValue } from '@folio/stripes-components';
import AccordionHeader from '@folio/stripes-components/lib/Accordion/headers/DefaultAccordionHeader';
import styles from './accordion-list-header.css';

function AccordionListHeader(props) {
  let { intl } = props;
  return (
    <div className={styles['accordion-list-header']}>
      <AccordionHeader {...props} />
      {props.open && (
        <KeyValue label={intl.formatMessage({ id: 'ui-eholdings.label.accordionList' })}>
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
  open: PropTypes.bool,
  intl: intlShape.isRequired
};

export default injectIntl(AccordionListHeader);
