import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

export default function VendorListItem({ item, link }) {
  return (
    <li data-test-eholdings-vendor-list-item>
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
