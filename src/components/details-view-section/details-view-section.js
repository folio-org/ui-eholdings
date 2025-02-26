import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Headline } from '@folio/stripes/components';
import styles from './details-view-section.css';

const cx = classNames.bind(styles);

export default function DetailsViewSection({ separator = true, label, children }) {
  return (
    <div className={cx('details-view-section', { 'hide-separator': !separator })}>
      <Headline tag="h3" size="large" faded>{label}</Headline>
      <div className={styles['details-view-section-value']}>
        {children}
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
