import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber, injectIntl, intlShape } from 'react-intl';
import { KeyValue } from '@folio/stripes-components';
import AccordionHeader from '@folio/stripes-components/lib/Accordion/headers/DefaultAccordionHeader';
import styles from './accordion-list-header.css';

function AccordionListHeader(props) {
  let { intl } = props;
  // RM API does not return exact number of results when count is over 10K
  // For title lists, resultsLength of 10000 indicates this.
  // For other lists (package and provider) resultsLength of 10001 indicates this.
  let overCount = props.listType === 'titles' ? 10000 : 10001;
  let showOver = props.resultsLength === overCount;
  let displayOverCount = 10000;
  return (
    <div className={styles['accordion-list-header']}>
      <AccordionHeader {...props} />
      {props.open && (
        <div className={styles['accordion-list-count']}>
          <KeyValue label={intl.formatMessage({ id: 'ui-eholdings.label.accordionList' })}>
            <div data-test-eholdings-details-view-results-count>
              {showOver ? (
                <span>
                  <FormattedMessage id="ui-eholdings.over" />
                  &nbsp;
                  <FormattedNumber value={displayOverCount} />
                </span>
              )
                :
                (<FormattedNumber value={props.resultsLength} />)
              }
            </div>
          </KeyValue>
        </div>
      )}
    </div>
  );
}

AccordionListHeader.propTypes = {
  intl: intlShape.isRequired,
  listType: PropTypes.node,
  open: PropTypes.bool,
  resultsLength: PropTypes.number
};

export default injectIntl(AccordionListHeader);
