import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './provider-list-item.css';
import Link from '../link';

const cx = classNames.bind(styles);

export default function ProviderListItem({ item, link, active }, { intl }) {
  return !item ? (
    <div className={styles.skeleton} />
  ) : (
    <Link
      data-test-eholdings-provider-list-item-active
      to={link}
      className={cx('item', {
        'is-selected': active
      })}
    >
      <h5 data-test-eholdings-provider-list-item-name>
        {item.name}
      </h5>

      <div data-test-eholdings-provider-list-item-selections>
        <span data-test-eholdings-provider-list-item-num-packages-selected>
          {intl.formatNumber(item.packagesSelected)}
        </span>

        &nbsp;/&nbsp;

        <span data-test-eholdings-provider-list-item-num-packages-total>
          {intl.formatNumber(item.packagesTotal)}
        </span>

        &nbsp;

        <span>{item.packagesTotal === 1 ? 'Package' : 'Packages'}</span>
      </div>
    </Link>
  );
}

ProviderListItem.propTypes = {
  item: PropTypes.object,
  link: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  active: PropTypes.bool,
};

ProviderListItem.contextTypes = {
  intl: PropTypes.object,
};
