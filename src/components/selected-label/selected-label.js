import PropTypes from 'prop-types';
import {
  FormattedNumber,
  FormattedMessage,
} from 'react-intl';
import classNames from 'classnames/bind';

import { AppIcon } from '@folio/stripes/core';

import { APP_ICON_NAME } from '../../constants';

import styles from './selected-label.css';

const cx = classNames.bind(styles);

const propTypes = {
  isSelected: PropTypes.bool.isRequired,
  selectedCount: PropTypes.number,
  showSelectedCount: PropTypes.bool,
};
const defaultProps = {
  selectedCount: 0,
  showSelectedCount: false,
};

const SelectedLabel = ({
  isSelected,
  selectedCount,
  showSelectedCount,
}) => {
  const titleCount = showSelectedCount
    ? (
      <FormattedMessage
        id="ui-eholdings.selectedCount"
        values={{
          count: (
            <span data-test-eholdings-provider-list-item-num-packages-selected>
              <FormattedNumber value={selectedCount} />
            </span>
          )
        }}
      />
    )
    : <FormattedMessage id="ui-eholdings.selected" />;

  return (
    <AppIcon
      app={APP_ICON_NAME}
      iconKey='selectedPackage'
      size='small'
      className={cx({ 'not-selected': !isSelected })}
    >
      <span data-test-selected-label>
        {isSelected
          ? titleCount
          : <FormattedMessage id="ui-eholdings.notSelected" />
        }
      </span>
    </AppIcon>
  );
};

SelectedLabel.propTypes = propTypes;
SelectedLabel.defaultProps = defaultProps;

export default SelectedLabel;
