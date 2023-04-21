import PropTypes from 'prop-types';
import {
  FormattedMessage,
  FormattedNumber,
} from 'react-intl';
import {
  DefaultAccordionHeader,
  KeyValue,
} from '@folio/stripes/components';

import {
  listTypes,
  OVER_COUNT,
  OVER_COUNT_FOR_TITLES,
} from '../../constants';

import styles from './accordion-list-header.css';

const AccordionListHeader = (props) => {
  const {
    open,
    isLoading,
  } = props;
  // RM API does not return exact number of results when count is over 10K
  // For title lists, resultsLength of 10000 indicates this.
  // For other lists (package and provider) resultsLength of 10001 indicates this.
  const overCount = props.listType === listTypes.TITLES
    ? OVER_COUNT_FOR_TITLES
    : OVER_COUNT;
  const showOver = props.resultsLength === overCount;
  const displayOverCount = OVER_COUNT;

  const getOverCount = () => (showOver
    ? (
      <span>
        <FormattedMessage id="ui-eholdings.over" />
        &nbsp;
        <FormattedNumber value={displayOverCount} />
      </span>
    )
    : <FormattedNumber value={props.resultsLength} />
  );

  return (
    <div className={styles['accordion-list-header']}>
      <DefaultAccordionHeader {...props} />
      {open && !isLoading && (
        <div className={styles['accordion-list-count']} data-testid="accordion-list-count">
          <KeyValue label={<FormattedMessage id="ui-eholdings.label.accordionList" />}>
            <div data-test-eholdings-details-view-results-count>
              {getOverCount()}
            </div>
          </KeyValue>
        </div>
      )}
    </div>
  );
};

AccordionListHeader.propTypes = {
  isLoading: PropTypes.bool,
  listType: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  resultsLength: PropTypes.number.isRequired,
};

export default AccordionListHeader;
