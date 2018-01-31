import React from 'react';
import PropTypes from 'prop-types';

import styles from './provider-list-item.css';
import Link from '../link';

export default function ProviderListItem({ item, link }, { intl }) {
  return !item ? (
    <div className={styles.skeleton} />
  ) : (
    <Link to={link} className={styles.item}>
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
  ])
};

ProviderListItem.contextTypes = {
  intl: PropTypes.object
};
