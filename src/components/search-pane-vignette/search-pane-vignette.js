import React from 'react';
import PropTypes from 'prop-types';
import styles from './search-pane-vignette.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default class SearchPaneVignette extends React.Component {
  static propTypes = {
    isHidden: PropTypes.bool,
    onClick: PropTypes.func
  }

  render() {
    return (
      <div onClick={this.props.onClick} className={cx('search-pane-vignette', {
        'is-hidden': this.props.isHidden
      })}>
      </div>
    );
  }
}
