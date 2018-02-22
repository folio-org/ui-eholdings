import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './search-pane-vignette.css';

const cx = classNames.bind(styles);

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
export default function SearchPaneVignette({ isHidden, onClick }) {
  return (
    <div
      data-test-search-vignette
      onClick={onClick}
      className={cx('search-pane-vignette', {
        'is-hidden': isHidden
      })}
    />
  );
}

SearchPaneVignette.propTypes = {
  isHidden: PropTypes.bool,
  onClick: PropTypes.func
};
