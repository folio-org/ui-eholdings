import React from 'react';
import PropTypes from 'prop-types';

import styles from './package-list-item.css';
import Link from '../link';

export default function PackageListItem({
  item,
  link,
  showTitleCount,
  showVendorName,
  packageName
}) {
  return item && (
    <Link to={link}>
      <h5 className={styles.name} data-test-eholdings-package-list-item-name>
        {packageName || item.name}
      </h5>

      {showVendorName && (
        <div data-test-eholdings-package-list-item-vendor-name>
          {item.vendorName}
        </div>
      )}

      <div>
        <span data-test-eholdings-package-list-item-selected>
          {item.isSelected ? 'Selected' : 'Not Selected'}
        </span>

        {showTitleCount && (
          <span>
            &nbsp;&bull;&nbsp;
            <span data-test-eholdings-package-list-item-num-titles-selected>{item.selectedCount}</span>
            &nbsp;/&nbsp;
            <span data-test-eholdings-package-list-item-num-titles>{item.titleCount}</span>
            &nbsp;
            <span>{item.titleCount === 1 ? 'Title' : 'Titles'}</span>
          </span>
        )}
      </div>
    </Link>
  );
}

PackageListItem.propTypes = {
  item: PropTypes.object,
  link: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  showTitleCount: PropTypes.bool,
  showVendorName: PropTypes.bool,
  packageName: PropTypes.string
};
