import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import style from './style.css';

import Icon from '@folio/stripes-components/lib/Icon';

function captialize(word) {
  return word[0].toUpperCase() + word.substr(1);
}

/**
 * TODOS
 * - Close toast on timeout
 * - Add more positions
 *   - left
 *   - right
 * - Docs on everything (how do the animations work, etc)
 *
 *
 *
 *
 *
 *
 */


/**
 * A component to display toast notifications. It handles error, info,
 * and success notifications.
 *
 * TODO, there's more
 */
class Toast extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen || true
    };
  }

  static propTypes = {
    animationPosition: PropTypes.string,
    isOpen: PropTypes.bool,
    type: PropTypes.string,
    children: PropTypes.node.isRequired
  };

  static defaultProps = {
    type: 'info'
  };

  // componentDidMount() {
  //   this.timer = setTimeout(() => {
  //     this.hideToast();
  //   }, 5000);
  // }

  // willDestroyElement() {
  //   this.timer = null;
  // }

  componentWillReceiveProps() {
    // this cannot be..
    // ...
    // this exists because if you get the same exact error back to
    // back it will not redisplay the toasts
    this.setState({ isOpen: true });
  }

  hideToast = () => {
    this.setState({ isOpen: false });
  }

  render() {
    let { isOpen } = this.state;
    let { type, animationPosition } = this.props;
    let animationClasses = {
      enter: style[`slideIn${captialize(animationPosition)}`],
      exit: style[`slideOut${captialize(animationPosition)}`]
    };

    let toastClass = classNames({
      [style.toast]: true,
      [style[type]]: true,
      [style.isOpen]: isOpen
    });

    return (
      <CSSTransition
        in={isOpen}
        timeout={1000}
        classNames={{
          enter: animationClasses.enter,
          exit: animationClasses.exit
        }}>
        <div className={toastClass} aria-live="assertive">
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
