import React from 'react';
import PropTypes from 'prop-types';
import styles from './preview-pane.css';

export default function PreviewPane({ children, previewType }) {
  return (
    <div
      data-test-preview-pane={previewType}
      className={styles['preview-pane']}
    >
      {children}
    </div>
  );
}

PreviewPane.propTypes = {
  children: PropTypes.node,
  previewType: PropTypes.string
};
