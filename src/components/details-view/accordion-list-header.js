import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber, injectIntl, intlShape } from 'react-intl';
import { KeyValue } from '@folio/stripes-components';
import AccordionHeader from '@folio/stripes-components/lib/Accordion/headers/DefaultAccordionHeader';
import styles from './accordion-list-header.css';

function AccordionListHeader(props) {
  let { intl } = props;
  let showOver = props.resultsLength === 10000;

  return (
    <div className={styles['accordion-list-header']}>
      <AccordionHeader {...props} />
      {props.open && (
        <KeyValue label={intl.formatMessage({ id: 'ui-eholdings.label.accordionList' })}>
          <div data-test-eholdings-details-view-results-count>
            {showOver && (
              <span>
                <FormattedMessage id="ui-eholdings.over" />
                &nbsp;
              </span>
            )}
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
