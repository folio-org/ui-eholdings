import React from 'react';
import PropTypes from 'prop-types';

import styles from './vendor-list-item.css';
import Link from '../link';

export default function VendorListItem({ item, link }) {
  return (
    <li className={styles['list-item']} data-test-eholdings-vendor-list-item>
      {item && (
        <Link to={link}>
          <h5 className={styles.name} data-test-eholdings-vendor-list-item-name>
            {item.name}
          </h5>
          <div data-test-eholdings-vendor-list-item-selections>
            <span data-test-eholdings-vendor-list-item-num-packages-selected>{item.packagesSelected}</span>
            &nbsp;/&nbsp;
            <span data-test-eholdings-vendor-list-item-num-packages-total>{item.packagesTotal}</span>
            &nbsp;
            <span>{item.packagesTotal === 1 ? 'Package' : 'Packages'}</span>
          </div>
        </Link>
      )}
    </li>
  );
}

VendorListItem.propTypes = {
  item: PropTypes.object,
  link: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
};
