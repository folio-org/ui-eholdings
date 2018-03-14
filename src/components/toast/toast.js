import React, { Component } from 'react';
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
 * - PropTypes
 * - Handle multiple toasts at the same time
 * - a11y
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
class Toast extends Component {
  state = {
    isOpen: true,
    type: 'error',
    position: 'bottom'
  };

  // componentDidMount() {
  //   this.timer = setTimeout(() => {
  //     this.hideToast();
  //   }, 5000);
  // }

  // willDestroyElement() {
  //   this.timer = null;
  // }

  hideToast = () => {
    this.setState({ isOpen: false });
  }

  render() {
    let { isOpen, type, position } = this.state;
    let containerClass = classNames({
      [style.container]: true,
      [style[position]]: true,
      [style.isOpen]: isOpen
    });

    let transitionClass = classNames({
      [style[`slideOut${captialize(position)}`]]: true
    });


    let toastClass = classNames({
      [style.toast]: true,
      [style[type]]: true
    });

    return (
      <CSSTransition
        in={isOpen}
        timeout={2000}
        classNames={{
          exit: transitionClass
        }}>
        <div className={containerClass}>
          <div className={toastClass}>
            {this.props.children}

            <button onClick={this.hideToast}>
              <Icon icon="closeX" size="small" iconClassName={style.closeIcon} />
            </button>
          </div>
        </div>
      </CSSTransition>
    );
  }
}

export default Toast;
