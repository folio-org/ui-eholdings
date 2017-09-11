import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

export default function PackageListItem({ item, link, showTitleCount }) {
  return (
    <li data-test-eholdings-package-list-item>
      <Link to={link}>
        <h5 data-test-eholdings-package-list-item-name>
          {item.packageName}
        </h5>
        <div data-test-eholdings-package-list-item-selected>
          <span>{item.isSelected ? 'Selected' : 'Not Selected'}</span>

          {showTitleCount && (
            <span>
              {" • "}
              <span data-test-eholdings-package-num-titles>{item.selectedCount}</span>
              {" / "}
              <span data-test-eholdings-package-num-titles-selected>{item.titleCount}</span>
              {" "}
              <span>{item.titleCount === 1 ? 'Title' : 'Titles'}</span>
            </span>
          )}
        </div>
      </Link>
    </li>
  );
}

PackageListItem.propTypes = {
  item: PropTypes.object,
  link: PropTypes.string,
  showTitleCount: PropTypes.bool
};
