import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import styles from './package-list-item.css';

export default function PackageListItem({ item, link }) {
  return (
    <li key={item.packageId} data-test-eholdings-package-list-item className={styles['list-item']}>
      <Link to={link}>
        <h5 data-test-eholdings-package-list-item-name>
          {item.packageName}
        </h5>
        <div data-test-eholdings-package-list-item-selected>
          <span>{item.isSelected ? 'Selected' : 'Not Selected'}</span>
       </div>
     </Link>
    </li>
  );
}

PackageListItem.propTypes = {
  item: PropTypes.object,
  link: PropTypes.string
};
