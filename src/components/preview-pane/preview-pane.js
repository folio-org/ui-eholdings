import React from 'react';
import PropTypes from 'prop-types';
import styles from './preview-pane.css';

export default function PreviewPane({ children }) {
  return (
    <div className={styles['preview-pane']}>
      {children}
    </div>
  );
}

PreviewPane.propTypes = {
  children: PropTypes.node
};
