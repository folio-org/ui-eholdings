import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

import { PAGE_SIZE } from '../../constants';

import styles from './prev-next-buttons.css';

const PrevNextButtons = ({
  page,
  fetch,
  totalResults,
  isLoading,
  setFocus,
}) => {
  const intl = useIntl();

  const maxItemsLength = page * PAGE_SIZE;
  const disabledNext = maxItemsLength >= totalResults;
  const dataStartIndex = (page - 1) * PAGE_SIZE + 1;
  const dataEndIndex = disabledNext
    ? totalResults
    : maxItemsLength;

  return (
    <div className={styles['button-wrapper']}>
      <div className={styles['button-container']}>
        <Button
          disabled={page === 1 || isLoading}
          buttonStyle="none"
          data-testid="previous-button"
          onClick={() => {
            fetch(page - 1);
            setFocus();
          }}
        >
          <Icon size="small" icon="caret-left">
            {intl.formatMessage({ id: 'ui-eholdings.previous' })}
          </Icon>
        </Button>
        <div className={styles['prev-next-page-info']}>
          <div>{dataStartIndex}</div>&nbsp;-&nbsp;<div>{dataEndIndex}</div>
        </div>
        <Button
          disabled={disabledNext || isLoading}
          buttonStyle="none"
          data-testid="next-button"
          onClick={() => {
            fetch(page + 1);
            setFocus();
          }}
        >
          <Icon size="small" icon="caret-right" iconPosition="end">
            {intl.formatMessage({ id: 'ui-eholdings.next' })}
          </Icon>
        </Button>
      </div>
    </div>
  );
};

PrevNextButtons.propTypes = {
  fetch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  setFocus: PropTypes.func.isRequired,
  totalResults: PropTypes.number.isRequired,
};

export default PrevNextButtons;
