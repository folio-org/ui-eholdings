import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Headline } from '@folio/stripes/components';
import styles from './details-view-section.css';

const cx = classNames.bind(styles);

export default function DetailsViewSection(props) {
  return (
    <div className={cx('details-view-section', { 'hide-separator': !props.separator })}>
      <Headline tag="h3" size="large" faded>{props.label}</Headline>
      <div className={styles['details-view-section-value']}>
        {props.children}
      </div>
    </div>
  );
}

DetailsViewSection.propTypes = {
  children: PropTypes.node,
  label: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ]).isRequired,
  separator: PropTypes.bool
};

DetailsViewSection.defaultProps = {
  separator: true
};
