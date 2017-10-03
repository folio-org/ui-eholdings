import React from 'react';
import PropTypes from 'prop-types';
import styles from './results-pane.css';

export default function ResultsPane({ children }) {
  return (
    <div className={styles['results-pane']}>
      {children}
    </div>
  );
}

ResultsPane.propTypes = {
  children: PropTypes.node
};
