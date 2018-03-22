import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import Icon from '@folio/stripes-components/lib/Icon';

import style from './style.css';

function captialize(word) {
  return word[0].toUpperCase() + word.substr(1);
}

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

    // if the toast is open or not
    isOpen: PropTypes.bool,

    // the type of toast: warn, error, or success
    type: PropTypes.string,

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

  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen || true
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
          enter: style[`slideIn${captialize(animationPosition)}`],
          exit: style[`slideOut${captialize(animationPosition)}`]
        }}
      >
        <div className={toastClass} aria-live="assertive" data-test-eholdings-toast={type}>
          {this.props.children}

          <button onClick={this.hideToast}>
            <Icon icon="closeX" size="small" iconClassName={style.closeIcon} />
          </button>
        </div>
      </CSSTransition>
    );
  }
}

export default Toast;
