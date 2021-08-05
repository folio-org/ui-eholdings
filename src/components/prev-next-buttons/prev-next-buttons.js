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
  setPage,
  totalResults,
  isLoading,
}) => {
  const intl = useIntl();

  const maxItemsLength = page * PAGE_SIZE;
  const disabledNext = maxItemsLength > totalResults;
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
          data-testid='previous-button'
          onClick={() => {
            setPage(page - 1);
          }}
        >
          <Icon size="small" icon="caret-left">
            <span>{intl.formatMessage({ id: 'ui-eholdings.previous' })}</span>
          </Icon>
        </Button>
        <div className={styles['prev-next-page-info']}>
          <div>{dataStartIndex}</div>&nbsp;-&nbsp;<div>{dataEndIndex}</div>
        </div>
        <Button
          disabled={disabledNext || isLoading}
          buttonStyle="none"
          data-testid='next-button'
          onClick={() => {
            setPage(page + 1);
          }}
        >
          <Icon size="small" icon="caret-right" iconPosition="end">
            <span>{intl.formatMessage({ id: 'ui-eholdings.next' })}</span>
          </Icon>
        </Button>
      </div>
    </div>
  );
};

PrevNextButtons.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  totalResults: PropTypes.number.isRequired,
};

export default PrevNextButtons;
