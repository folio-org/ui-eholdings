import React from 'react';
import PropTypes from 'prop-types';
import styles from './key-value-columns.css';

export default function KeyValueColumns({ children }) {
  return (
    <div
      className={styles['key-value-columns']}
    >
      {children}
    </div>
  );
}

KeyValueColumns.propTypes = {
  children: PropTypes.node
};
