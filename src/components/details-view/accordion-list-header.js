import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { DefaultAccordionHeader, KeyValue } from '@folio/stripes/components';
import styles from './accordion-list-header.css';
import { listTypes } from '../../constants';

function AccordionListHeader(props) {
  // RM API does not return exact number of results when count is over 10K
  // For title lists, resultsLength of 10000 indicates this.
  // For other lists (package and provider) resultsLength of 10001 indicates this.
  const overCount = props.listType === listTypes.TITLES
    ? 10000
    : 10001;
  const showOver = props.resultsLength === overCount;
  const displayOverCount = 10000;
  return (
    <div className={styles['accordion-list-header']}>
      <DefaultAccordionHeader {...props} />
      {props.open && (
        <div className={styles['accordion-list-count']}>
          <KeyValue label={<FormattedMessage id="ui-eholdings.label.accordionList" />}>
            <div data-test-eholdings-details-view-results-count>
              {showOver ? (
                <span>
                  <FormattedMessage id="ui-eholdings.over" />
                  &nbsp;
                  <FormattedNumber value={displayOverCount} />
                </span>
              )
                :
                (<FormattedNumber value={props.resultsLength} />)}
            </div>
          </KeyValue>
        </div>
      )}
    </div>
  );
}

AccordionListHeader.propTypes = {
  listType: PropTypes.node,
  open: PropTypes.bool,
  resultsLength: PropTypes.number
};

export default AccordionListHeader;
