import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './toggle-switch.css';

const cx = classNames.bind(styles);

export default class ToggleSwitch extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    isPending: PropTypes.bool,
    id: PropTypes.string
  };

  state = {
    checked: this.props.checked
  };

  componentWillReceiveProps(nextProps) {
    let wasPending = this.props.isPending && !nextProps.isPending;
    let needsUpdate = this.props.checked !== nextProps.checked;

    if (wasPending || needsUpdate) {
      this.setState({ checked: nextProps.checked });
    }
  }

  toggle = () => {
    this.setState({ checked: !this.state.checked });
    this.props.onChange();
  };

  render() {
    let { isPending, disabled, id } = this.props;
    let { checked } = this.state;

    return (
      <div
        data-test-toggle-switch
        className={cx(styles['toggle-switch'], {
          'is-pending': isPending
        })}
      >
        <input
          type="checkbox"
          onChange={this.toggle}
          disabled={disabled || isPending}
          checked={checked}
          id={id}
        />
        <div className={styles['toggle-switch-slider']} />
      </div>
    );
  }
}
