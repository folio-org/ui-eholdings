import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './search-pane.css';

const cx = classNames.bind(styles);

export default function SearchPane({ children, isHidden }) {
  return (
    <div className={cx('search-pane', {
      'is-hidden': isHidden
    })}
    >
      {children}
    </div>
  );
}

SearchPane.propTypes = {
  children: PropTypes.node,
  isHidden: PropTypes.bool
};
