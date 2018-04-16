import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './details-view-section.css';

const cx = classNames.bind(styles);

export default function DetailsViewSection(props) {
  return (
    <div className={cx('details-view-section', { 'hide-separator': !props.separator })}>
      <h3 className={styles['details-view-section-label']}>{props.label}</h3>
      <div className={styles['details-view-section-value']}>
        {props.children}
      </div>
    </div>
  );
}

DetailsViewSection.propTypes = {
  label: PropTypes.string,
  separator: PropTypes.bool,
  children: PropTypes.node
};

DetailsViewSection.defaultProps = {
  separator: true
};
