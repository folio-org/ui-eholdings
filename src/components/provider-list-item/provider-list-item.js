import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './provider-list-item.css';
import Link from '../link';

const cx = classNames.bind(styles);

export default function ProviderListItem({ item, link, active, onClick, headingLevel }, { intl }) {
  let Heading = headingLevel || 'h3';

  return !item ? (
    <div className={styles.skeleton} />
  ) : (
    <Link
      data-test-eholdings-provider-list-item
      to={link}
      className={cx('item', {
        'is-selected': active
      })}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Heading data-test-eholdings-provider-list-item-name>
        {item.name}
      </Heading>

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
  onClick: PropTypes.func,
  headingLevel: PropTypes.string
};

ProviderListItem.contextTypes = {
  intl: PropTypes.object,
};
