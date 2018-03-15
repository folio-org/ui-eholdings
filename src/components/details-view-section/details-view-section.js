import React from 'react';
import PropTypes from 'prop-types';
import styles from './details-view-section.css';

export default function DetailsViewSection(props) {
  return (
    <div className={styles['details-view-section']}>
      <h3 className={styles['details-view-section-label']}>{props.label}</h3>
      <div className={styles['details-view-section-value']}>
        {props.children}
      </div>
    </div>
  );
}

DetailsViewSection.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node
};
