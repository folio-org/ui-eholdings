import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './title-list-item.css';
import Link from '../link';

const cx = classNames.bind(styles);

export default function TitleListItem({
  item,
  link,
  active,
  showSelected,
  showPublisherAndType
}) {
  return !item ? (
    <div
      className={cx('skeleton', {
        'is-selected-visible': showSelected,
        'is-publisher-and-type-visible': showPublisherAndType
      })}
    />
  ) : (
    <Link
      data-test-eholdings-title-list-item-active
      to={link}
      className={cx('item', {
        'is-selected': active
      })}
    >
      <h5 data-test-eholdings-title-list-item-title-name>
        {item.name}
      </h5>

      {showPublisherAndType && (
        <div>
          <span data-test-eholdings-title-list-item-publisher-name>
            {item.publisherName}
          </span>

          <br />

          <span data-test-eholdings-title-list-item-publication-type>
            {item.publicationType}
          </span>
        </div>
      )}

      {showSelected && (
        <span data-test-eholdings-title-list-item-title-selected>
          {item.isSelected ? 'Selected' : 'Not Selected'}
          {item.visibilityData.isHidden && (
            <span>
              &nbsp;&bull;&nbsp;
              <span data-test-eholdings-title-list-item-title-hidden>
                {'Hidden'}
              </span>
            </span>
          )}
        </span>
      )}
    </Link>
  );
}

TitleListItem.propTypes = {
  item: PropTypes.object,
  link: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  active: PropTypes.bool,
  showSelected: PropTypes.bool,
  showPublisherAndType: PropTypes.bool
};
