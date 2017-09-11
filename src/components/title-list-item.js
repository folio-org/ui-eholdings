import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

export default function TitleListItem({ item, link, showSelected }) {
  return (
    <li data-test-eholdings-title-list-item>
      <Link to={link}>
        <h5 data-test-eholdings-title-list-item-title-name>
          {item.titleName}
        </h5>
        { /* assumes that customerResourcesList.length will always equal one if showSelected === true */  }
        {showSelected && (
          <span data-test-eholdings-title-list-item-title-selected>
              {item.customerResourcesList[0].isSelected ? 'Selected' : 'Not Selected'}
          </span>
        )}
      </Link>
    </li>
  );
}

TitleListItem.propTypes = {
  item: PropTypes.object,
  link: PropTypes.string,
  showSelected: PropTypes.bool
};
