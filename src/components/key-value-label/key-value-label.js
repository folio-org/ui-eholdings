import React from 'react';
import PropTypes from 'prop-types';
import styles from './key-value-label.css';

export default function KeyValueLabel(props) {
  return (
    <div className={styles['kv-root']}>
      <div className={styles['kv-label']}>{props.label}</div>
      <div className={styles['kv-value']}>
        {props.value || props.children}
      </div>
    </div>
  );
}

KeyValueLabel.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  children: PropTypes.node
};
