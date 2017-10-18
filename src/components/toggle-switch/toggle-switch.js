import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './toggle-switch.css';

const cx = classNames.bind(styles);

export default function ToggleSwitch(props) {
  return (
    <div className={cx(styles['toggle-switch'], {
      'is-pending': props.isPending
    })}
    >
      <input
        type="checkbox"
        onChange={props.onChange}
        disabled={props.disabled}
        checked={props.checked}
      />
      <div className={styles['toggle-switch-slider']} />
    </div>
  );
}

ToggleSwitch.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  isPending: PropTypes.bool,
};

