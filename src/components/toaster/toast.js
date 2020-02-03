import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { Icon } from '@folio/stripes/components';
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
    children: PropTypes.node.isRequired,

    // the error message is a child of the `Toast` component
    id: PropTypes.string.isRequired,

    // to pick the specific toast out when calling `onClose`
    onClose: PropTypes.func.isRequired,

    // called when the toast is closed
    timeout: PropTypes.number,

    // change the amount of time the toast is displayed for
    type: PropTypes.oneOf(['warn', 'error', 'success'])
  };

  static defaultProps = {
    type: 'warn',
    timeout: 5000
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    };
  }

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
    const { isOpen } = this.state;
    const { type, animationPosition } = this.props;
    const toastClass = classNames({
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
            <Icon icon="times" size="small" iconClassName={style.closeIcon} />
          </button>
        </div>
      </CSSTransition>
    );
  }
}

export default Toast;
