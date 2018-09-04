import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import Icon from '@folio/stripes-components/lib/Icon';
import capitalize from 'lodash/capitalize';

import style from './style.css';

/**
 * A component to display toast notifications. It handles error, warn,
 * and success notifications. You typically won't use this component
 * individually. Instead you should use the `Toaster` component which
 * manages `Toast` components.
 *
 */
class Toast extends Component {
  static propTypes = {
    // determine which way the toast should animate, based on where
    // `Toaster` is positioned
    animationPosition: PropTypes.string,

    // the type of toast: warn, error, or success
    type: PropTypes.oneOf(['warn', 'error', 'success']),

    // the error message is a child of the `Toast` component
    children: PropTypes.node.isRequired,

    // to pick the specific toast out when calling `onClose`
    id: PropTypes.string.isRequired,

    // called when the toast is closed
    onClose: PropTypes.func.isRequired,

    // change the amount of time the toast is displayed for
    timeout: PropTypes.number
  };

  static defaultProps = {
    type: 'warn',
    timeout: 5000
  };

  state = {
    isOpen: true
  };

  componentDidMount() {
    this.timer = window.setTimeout(() => {
      this.hideToast();
    }, this.props.timeout);
  }

  componentWillUnmount() {
    window.clearTimeout(this.timer);
  }

  hideToast = () => {
    this.setState({ isOpen: false }, () => {
      this.props.onClose(this.props.id);
    });
  }

  render() {
    let { isOpen } = this.state;
    let { type, animationPosition } = this.props;
    let toastClass = classNames({
      [style.toast]: true,
      [style[type]]: true
    });

    return (
      <CSSTransition
        in={isOpen}
        timeout={1000}
        unmountOnExit
        classNames={{
          enter: style[`slideIn${capitalize(animationPosition)}`],
          exit: style[`slideOut${capitalize(animationPosition)}`]
        }}
      >
        <div className={toastClass} aria-live="assertive" data-test-eholdings-toast={type}>
          {this.props.children}

          <button onClick={this.hideToast} type="button">
            <Icon icon="closeX" size="small" iconClassName={style.closeIcon} />
          </button>
        </div>
      </CSSTransition>
    );
  }
}

export default Toast;
