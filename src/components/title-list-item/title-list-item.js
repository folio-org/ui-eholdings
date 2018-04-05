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
  showPublisherAndType,
  onClick,
  headingLevel
}) {
  let Heading = headingLevel || 'h3';

  return !item ? (
    <div
      className={cx('skeleton', {
        'is-selected-visible': showSelected,
        'is-publisher-and-type-visible': showPublisherAndType
      })}
    />
  ) : (
    <Link
      data-test-eholdings-title-list-item
      to={link}
      className={cx('item', {
        'is-selected': active
      })}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Heading data-test-eholdings-title-list-item-title-name>
        {item.name}
      </Heading>

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
        <span>
          <span data-test-eholdings-title-list-item-title-selected>
            {item.isSelected ? 'Selected' : 'Not selected'}
          </span>

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
  showPublisherAndType: PropTypes.bool,
  onClick: PropTypes.func,
  headingLevel: PropTypes.string
};
