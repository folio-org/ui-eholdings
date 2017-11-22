import React from 'react';
import PropTypes from 'prop-types';

import Link from './link';

export default function TitleListItem({ item, link, showSelected, showPublisherAndType }) {
  return (
    <li data-test-eholdings-title-list-item>
      <Link to={link}>
        <h5 data-test-eholdings-title-list-item-title-name>
          {item.titleName}
        </h5>
        {showPublisherAndType && (
          <div>
            <span data-test-eholdings-title-list-item-publisher-name>{item.publisherName}</span><br />
            <span data-test-eholdings-title-list-item-publication-type>{item.pubType}</span>
          </div>
        )}
        { /* assumes that customerResourcesList.length will always equal one if showSelected === true */ }
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
  link: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  showSelected: PropTypes.bool,
  showPublisherAndType: PropTypes.bool
};
