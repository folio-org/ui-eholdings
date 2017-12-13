import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './title-list-item.css';
import Link from '../link';

const cx = classNames.bind(styles);

export default function TitleListItem({
  item,
  link,
  showSelected,
  showPublisherAndType
}) {
  let itemClassName = cx('list-item', {
    'is-selected-visible': showSelected,
    'is-publisher-visible': showPublisherAndType
  });

  return (
    <li className={itemClassName} data-test-eholdings-title-list-item>
      {item && (
        <Link to={link}>
          <h5 className={styles.name} data-test-eholdings-title-list-item-title-name>
            {item.name}
          </h5>

          {showPublisherAndType && (
            <div>
              <span data-test-eholdings-title-list-item-publisher-name>{item.publisherName}</span><br />
              <span data-test-eholdings-title-list-item-publication-type>{item.publicationType}</span>
            </div>
          )}

          {showSelected && (
            <span data-test-eholdings-title-list-item-title-selected>
              {item.isSelected ? 'Selected' : 'Not Selected'}
            </span>
          )}
        </Link>
      )}
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
