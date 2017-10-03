import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './search-pane-vignette.css';

const cx = classNames.bind(styles);

export default function SearchPaneVignette({ isHidden, onClick }) {
  return (
    <div // eslint-disable-line jsx-a11y/no-static-element-interactions
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
