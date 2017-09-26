import React from 'react';
import PropTypes from 'prop-types';
import styles from './search-pane.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default class SearchPane extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    isHidden: PropTypes.bool
  }

  render() {
    return (
      <div className={cx('search-pane', {
        'is-hidden': this.props.isHidden
      })}>
        {this.props.children}
      </div>
    );
  }
}
