import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';
import classNames from 'classnames';
import style from './style.css';
import Toast from './toast';

/**
 * A component to display & manage toast notifications.
 *
 * Usage:
 *
 * ```
 * <Toaster toasts={[{message: 'an error!', id: 'my-toast-id', type: 'error'}]} />
 * ```
 *
 */
class Toaster extends Component {
  static propTypes = {
    // the position in which toasts are displayed
    position: PropTypes.string,
    // array of toast messages to display
    toasts: PropTypes.arrayOf(PropTypes.shape({
      // the type of toast: warn, error, or success
      id: PropTypes.string.isRequired,
      // to pick the specific toast out when calling `onClose`
      message: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.node
      ]).isRequired,
      // the toast message that will be displayed in the UI
      timeout: PropTypes.number,
      // the time which the toast is shown
      type: PropTypes.string
    })).isRequired
  };

  static defaultProps = {
    position: 'bottom',
  };

  constructor(props) {
    super(props);

    this.state = {
      toasts: props.toasts
    };
  }

  static getDerivedStateFromProps(nextProps) {
    return nextProps.toasts ?
      { toasts: nextProps.toasts } :
      null;
  }

  destroyToast = (toastId) => {
    this.setState(({ toasts }) => ({
      toasts: toasts.filter(toast => toast.id !== toastId)
    }));
  }

  renderToasts() {
    const { position } = this.props;
    const { toasts } = this.state;

    if (!toasts.length) { return null; }

    return toasts.map((toast) => {
      return (
        <Toast
          type={toast.type}
          onClose={this.destroyToast}
          id={toast.id}
          animationPosition={position}
          key={toast.id}
          timeout={toast.timeout}
        >
          {toast.message}
        </Toast>
      );
    });
  }

  render() {
    const { position } = this.props;
    const containerClass = classNames({
      [style.container]: true,
      [style[position]]: true
    });

    return (
      <div className={containerClass} data-test-eholdings-toaster-container>
        <TransitionGroup className={style.transitionWrapper}>
          {this.renderToasts()}
        </TransitionGroup>
      </div>
    );
  }
}

export default Toaster;
