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
      type: PropTypes.string,
      // to pick the specific toast out when calling `onClose`
      id: PropTypes.string.isRequired,
      // the toast message that will be displayed in the UI
      message: PropTypes.string.isRequired,
      // the time which the toast is shown
      timeout: PropTypes.number
    })).isRequired
  };

  static defaultProps = {
    position: 'bottom'
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps.toasts ?
      { ...prevState, toasts: nextProps.toasts } :
      prevState;
  }

  constructor(props) {
    super(props);

    this.state = {
      toasts: props.toasts
    };
  }

  destroyToast = (toastId) => {
    let removedToast = this.state.toasts.filter(toast => toast.id !== toastId);

    this.setState({ toasts: removedToast });
  }

  renderToasts() {
    let { position } = this.props;
    let { toasts } = this.state;

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
    let { position } = this.props;
    let containerClass = classNames({
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
