import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import styles from './vendor-list-item.css';

export default function VendorListItem({ item, link }) {
  return (
    <li key={item.vendorId} data-test-eholdings-vendor-list-item className={styles['list-item']}>
      <Link to={link}>
        <h5 data-test-eholdings-vendor-list-item-name>
          {item.vendorName}
        </h5>
      </Link>
    </li>
  );
}

VendorListItem.propTypes = {
  item: PropTypes.object,
  link: PropTypes.string
};
