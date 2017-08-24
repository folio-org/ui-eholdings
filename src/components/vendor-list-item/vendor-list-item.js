import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import styles from './vendor-list-item.css';

export default function VendorListItem({ item, link }) {
  return (
    <li key={item.vendorId} data-test-eholdings-vendor-list-item className={styles['list-item']}>
      <h5 data-test-eholdings-vendor-list-item-name>
        <Link to={link}>{item.vendorName}</Link>
      </h5>
    </li>
  );
}

VendorListItem.propTypes = {
  item: PropTypes.object,
  link: PropTypes.string
};
