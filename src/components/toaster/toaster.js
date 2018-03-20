import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';
import style from './style.css';
import Toast from './toast';
import classNames from 'classNames';

/**
 * A component to display toast notifications. It handles error, info,
 * and success notifications.
 *
 * TODO, there's more
 */
class Toaster extends Component {
  static propTypes = {
    position: PropTypes.string,
    toasts: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string,
      message: PropTypes.string.isRequired
    })).isRequired
  };

  static defaultProps = {
    position: 'bottom'
  };

  renderToasts() {
    let { toasts, position } = this.props;

    if(!toasts.length) { return null; }

    return toasts.map((toast, index) => {
      return (
        <Toast type={toast.type} animationPosition={position} key={`toast-${index}`}>
          {toast.message}
        </Toast>
      );
    });
  }

  render() {
    let { position } = this.props;
    let containerClass = classNames({
      [style.container]: true,
      [style[position]]: true
    });

    return (
      <div className={containerClass}>
        <TransitionGroup className={style.transitionWrapper}>
          {this.renderToasts()}
        </TransitionGroup>
      </div>
    );
  }
}

export default Toaster;
